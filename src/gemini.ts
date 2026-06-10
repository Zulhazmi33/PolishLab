const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
// const MODEL = "gemini-2.5-flash";
const MODELS = {
  cheap: "gemini-2.5-flash-lite",
  best: "gemini-2.5-flash",
};

const MODEL = MODELS.cheap;



// 1) for 'Paragraph' page
type Tone = "professional" | "friendly";
export async function rewriteText(input: string, tone: Tone = "professional") {
  const prompt = `
    You are an expert professional writing assistant.

    Your job is to improve and rewrite user text to make it more effective in communication.

    # GOAL
    Rewrite the text while preserving the original meaning, while improving:
    - clarity
    - grammar
    - tone
    - readability
    - structure

    # TONE
    Tone: ${tone}

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

// 2) for 'Resume' page
export async function parseResume(input: string) {
  const prompt = `
    You are a resume parser AI.

    Your job is to extract structured information from a resume and organize it into sections.

    # RULES
    - Do NOT invent information
    - Only use what exists in the text
    - If section is missing, write "Not provided"

    # OUTPUT FORMAT (VERY IMPORTANT)

    Return in this exact format:

    Work Experience:
    - ...

    Education:
    - ...

    Skills:
    - ...

    Projects:
    - ...

    Certifications:
    - ...

    Other:
    - ...

    # USER RESUME
${input}
`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
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
          temperature: 0.2,
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

// 3) budget financer
export async function analyzeBudget(budget: any[], location = "Malaysia") {
  const total = budget.reduce((sum, b) => sum + Number(b.expense), 0);

  const categories = budget.reduce((acc: any, item) => {
    const key = item.reason?.toLowerCase() || "other";
    acc[key] = (acc[key] || 0) + Number(item.expense);
    return acc;
  }, {});

  const prompt = `
    You are a financial advisor AI.

    Analyze the user's spending behavior and give practical advice.

    # CONTEXT
    Location: ${location}

    # SUMMARY DATA
    Total spending: RM ${total}
    Number of transactions: ${budget.length}

    # CATEGORY BREAKDOWN
    ${JSON.stringify(categories, null, 2)}

    # RULES
    - Be honest but not judgmental
    - Do NOT assume income
    - Do NOT give investment advice
    - Focus on spending behavior
    - Consider cost of living in ${location}

    # OUTPUT FORMAT
    Return:
    1. Spending summary (1-2 lines)
    2. Spending habits analysis
    3. 3 practical suggestions
    4. Risk level (Low / Medium / High)
`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.3,
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
