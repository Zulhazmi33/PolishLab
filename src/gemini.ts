const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL = "gemini-2.5-flash";



// 1) for 'Paragraph' page
type Tone = "professional" | "formal" | "friendly" | "job_application";
export async function rewriteText(input: string, tone: Tone = "professional") {
  const prompt = `
    You are an expert professional writing assistant.

    Your job is to improve and rewrite user text to make it more effective in professional communication.

    # GOAL
    Rewrite the text while preserving the original meaning, but improving:
    - clarity
    - grammar
    - tone
    - professionalism
    - structure

    # TONE
    Tone: ${tone}

    Adjust the writing style accordingly:
    - professional → standard business communication
    - formal → strict corporate / academic tone
    - friendly → polite and conversational
    - job_application → strong resume / cover letter style

    # RULES (VERY IMPORTANT)
    - Do NOT invent new facts
    - Do NOT add experience or skills not mentioned
    - Do NOT change meaning
    - Keep all key information
    - Improve ONLY expression and structure

    # OUTPUT FORMAT
    Return ONLY the improved text.
    Do NOT explain.
    Do NOT add headings.
    Do NOT add bullet points unless original text uses them.

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