const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
// const MODEL = "gemini-2.5-flash";
const MODELS = {
  cheap: "gemini-2.5-flash-lite",
  best: "gemini-2.5-flash",
};

const MODEL = MODELS.cheap;


// 1) 'Paragraph' enhancer page
type Tone = "professional" | "friendly";
export async function rewriteText(input: string, tone: Tone = "professional") {
  const prompt = `
    You are an expert professional writing assistant.

    Your job is to improve and rewrite user text to make it more effective in communication.

    # 1) GOAL
    Rewrite the text while preserving the original meaning, while improving:
    - clarity
    - grammar
    - tone
    - readability
    - structure

    # 2a) TONE
    Tone: ${tone}

    # 2b) TONE TYPE
    Adjust the writing style accordingly:
    - professional → polished, concise, business-appropriate communication
    - friendly → warm, polite, and conversational while remaining professional

    # RULES (VERY IMPORTANT)
    - Do NOT invent new facts
    - Do NOT add information that is not mentioned
    - Do NOT change the meaning
    - Keep all key information
    - Improve ONLY wording and structure
    - Match the requested tone

    # OUTPUT FORMAT
    Return ONLY the rewritten text.
    Do NOT explain your changes.
    Do NOT add headings.
    Do NOT add bullet points unless the original text uses them.

    # USER TEXT
    ${input}
  `;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          topP: 0.9,
          maxOutputTokens: 800,
        },
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(JSON.stringify(data));
  }

  return data?.candidates?.[0]?.content?.parts?.[0]?.text;
}

// 2) 'Resume' scanning page
export async function parseResume(input: string) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [
            {
              text: `
                You are a resume parser.

                Extract information exactly as written in the resume.

                Rules:
                - Do not infer, summarize, rewrite, normalize, or generate information.
                - Only extract information explicitly present in the resume.
                - Preserve original wording where possible.
                - If a section is missing, return an empty array.
                - Return valid JSON only.
                - No markdown.
                - No explanations.

                Expected JSON structure:

                {
                  "workExperience": [],
                  "education": [],
                  "skills": [],
                  "projects": [],
                  "certifications": [],
                  "other": []
                }
              `,
            },
          ],
        },

        contents: [
          {
            role: "user",
            parts: [
              {
                text: input,
              },
            ],
          },
        ],

        generationConfig: {
          temperature: 0,
          responseMimeType: "application/json",
        },
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message ?? "Gemini failed");
  }

  return JSON.parse(
    data.candidates[0].content.parts[0].text
  );
}

// 3) 'Budget' analyzer page
export async function analyzeBudget(
  budget: any[],
  state: string,
  district: string,
  allowance: number,
  budget_expected: number,
  budget_reality: number,
  tone: "professional" | "simple"
) {
  const total = budget.reduce(
    (sum, b) => sum + Number(b.expense),
    0
  );

  const categories = budget.reduce((acc: Record<string, number>, item) => {
    const key = item.reason?.toLowerCase()?.trim() || "other";

    acc[key] = (acc[key] || 0) + Number(item.expense);

    return acc;
  }, {});

  const toneInstruction =
    tone === "simple"
      ? `
        RESPONSE STYLE: SIMPLE

        - Keep response under 180 words
        - Use short sentences
        - Be compact but useful
        - Avoid financial jargon
        - Use concise bullets
        - Focus only on major findings
        `
      : `
        RESPONSE STYLE: PROFESSIONAL

        - Give detailed analysis
        - Explain reasoning briefly
        - Keep response under 450 words
        - Sound like a financial advisor
        - Still remain easy to read
      `;

  const prompt = `
    You are an experienced Malaysian personal financial advisor.

    Your goal is to analyze spending behaviour and provide practical budgeting advice.

    ${toneInstruction}

    # LOCATION

    Country: Malaysia
    State: ${state}
    District: ${district}

    Use location ONLY as broad cost-of-living context.

    Do NOT:
    - pretend to know exact prices
    - assume financial status

    # USER DATA

    Monthly Income / Allowance:
    RM ${allowance}

    Expected Monthly Budget:
    RM ${budget_expected}

    Actual Monthly Spending:
    RM ${budget_reality}

    Calculated Total:
    RM ${total}

    Transaction Count:
    ${budget.length}

    # SPENDING BREAKDOWN

    ${JSON.stringify(categories, null, 2)}

    # REQUIRED ANALYSIS

    1. Compare:
    - Income vs actual spending
    - Expected budget vs actual spending

    2. Determine:
    - Surplus or deficit
    - Budget variance
    - Spending ratio:
    (Actual Spending ÷ Income) × 100

    3. Identify:
    - Largest spending categories
    - Stable habits
    - Potential concerns

    4. Evaluate spending level relative to:
    ${district}, ${state}, Malaysia

    Classify:
    LOW
    MEDIUM
    HIGH

    Use broad judgement only.

    # ADVICE RULES

    - Be factual
    - Be supportive
    - No investment advice
    - No debt recommendations
    - No guilt or shame
    - Focus on budgeting habits

    # PRESENTATION RULES

    Make output visually pleasant.

    Formatting:
    - NO markdown headings (##)
    - NO bold (**)
    - NO tables
    - Use section titles only
    - Short paragraphs
    - Leave empty lines between sections
    - Maximum 1 emoji per section
    - Avoid repeating numbers excessively

    # OUTPUT FORMAT

    📊 Financial Snapshot

    Income: RM X
    Expected Budget: RM X
    Actual Spending: RM X
    Difference: RM X surplus/deficit

    One short summary.

    ────────────────

    💸 Spending Insights

    Explain:
    - biggest expense areas
    - alignment with budget
    - spending behaviour

    Max 2 short paragraphs.

    ────────────────

    📍 Cost of Living Context

    Result:
    LOW / MEDIUM / HIGH

    Short explanation.

    ────────────────

    ✅ Recommendations

    Exactly 3 actions.

    Format:

    • Action
    → Reason

    ────────────────

    ⚠️ Financial Risk

    Return ONE:
    LOW
    MEDIUM
    HIGH

    Short explanation.

    Risk Guide:

    LOW:
    Spending comfortably below income.

    MEDIUM:
    Spending close to income or inconsistent.

    HIGH:
    Spending exceeds income or exceeds expected budget significantly.
  `;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: tone === "simple" ? 0.2 : 0.3,
          topP: 0.9,
          maxOutputTokens:
            tone === "simple"
              ? 500
              : 1000,
        },
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error?.message ||
        JSON.stringify(data)
    );
  }

  return (
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    "Unable to generate analysis."
  );
}

// 4) 'Chatbot' page
interface Question_type {
    question: string,
    answer: string
}

export async function matchFAQWithGemini(userQuery: string, faqList: Question_type[]) {
  const simplifiedList = faqList.map((item, index) => ({
    id: index,
    question: item.question,
  }));

  const prompt = `
    You are a FAQ matching system.

    Pick ONLY the best matching question.

    Return ONLY JSON:
    { "id": number }

    User question:
    ${userQuery}

    FAQ LIST:
    ${JSON.stringify(simplifiedList)}
  `;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [
              {
                text: `
                  You are a strict JSON API.
                  Return only valid JSON.
                  No markdown.
                  No explanation.
                `,
              },
            ],
          },
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0,
            topP: 1,
            maxOutputTokens: 256,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    const data = await response.json();

    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!raw) {
      console.error("Empty Gemini response:", data);
      return -1;
    }

    let parsed: { id: number };

    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      console.error("Failed to parse Gemini JSON:", raw);
      console.log('err = ',err)
      return -1;
    }

    if (typeof parsed.id !== "number") {
      return -1;
    }

    return parsed.id;
  
  } catch (error) {
    console.error("Gemini request failed:", error);
    return -1;
  }
}