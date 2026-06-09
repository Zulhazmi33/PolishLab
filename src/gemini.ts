const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function rewriteText(input:string, tone = "professional") {
  const prompt = `
You are a professional writing assistant.

Your job is to rewrite user text to sound more:
- clear
- professional
- natural
- grammatically correct

Tone: ${tone}

Rules:
- Keep original meaning
- Do NOT add fake experience
- Do NOT exaggerate facts
- Only improve wording
- Make it sound like a job application or professional communication

User text:
"${input}"
`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    }
  );

  const data = await response.json();

  return data?.candidates?.[0]?.content?.parts?.[0]?.text;
}