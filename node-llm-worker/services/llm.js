import axios from "axios";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "openai/gpt-oss-120b";

/**
 * Safely trim text to avoid Groq 400 errors
 */
const trim = (text, max = 2000) => {
  if (!text) return "";
  return text.length > max ? text.slice(0, max) : text;
};

export const rewriteArticle = async (original, ref1, ref2) => {
  const prompt = `
You are a professional content editor.

Rewrite the following article to improve:
- Structure
- Readability
- Headings
- Professional tone

Do NOT copy text from references.
Use them only for style inspiration.

ORIGINAL ARTICLE:
${trim(original, 2000)}

REFERENCE STYLE 1:
${trim(ref1, 800)}

REFERENCE STYLE 2:
${trim(ref2, 800)}
`;

  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: MODEL,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.4,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 20000,
      }
    );

    return response.data.choices[0].message.content;
  } catch (err) {
    console.error("❌ Groq API error");

    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Data:", err.response.data);
    } else {
      console.error(err.message);
    }

    throw err;
  }
};
