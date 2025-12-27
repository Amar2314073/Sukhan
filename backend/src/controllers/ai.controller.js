const { GoogleGenAI } = require("@google/genai");
const Poem = require("../models/poem");

/**
 * POST /api/ai/poemChat
 */
exports.poemAIChat = async (req, res) => {
  try {
    const { poemId, messages } = req.body;

    if (!poemId || !Array.isArray(messages)) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const poem = await Poem.findById(poemId)
      .populate("poet", "name")
      .populate("category", "name");

    if (!poem) {
      return res.status(404).json({ message: "Poem not found" });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_KEY
    });

    /* ================= HARD SYSTEM PROMPT (SUKHAN MODE) ================= */

    const SYSTEM_PROMPT = `
You are “Sukhan AI”, a strict and refined literary expert for an Urdu–Hindi poetry platform.

STRICT BOUNDARIES (NON-NEGOTIABLE):
- You must respond ONLY about the poem provided below.
- You must NOT answer:
  - programming or technical questions
  - general knowledge or current affairs
  - personal advice or life coaching
  - politics or religion outside poetic interpretation
  - jokes or casual conversation

If the user asks anything unrelated, reply EXACTLY:
"I can only help with understanding this poem."

POEM CONTEXT (THIS IS YOUR ENTIRE WORLD):

Title: ${poem.title}
Poet: ${poem.poet?.name || "Unknown"}
Category: ${poem.category?.name || "—"}

Urdu Text:
${poem.content?.urdu || "—"}

Hindi Text:
${poem.content?.hindi || "—"}

Roman Text:
${poem.content?.roman || "—"}

HOW YOU SHOULD ANSWER:
- Tone must be calm, serious, and literary.
- No emojis, slang, or modern internet language.
- First explain the **literal meaning** (if applicable).
- Then explain **metaphor, imagery, symbolism, and emotion**.
- Explain difficult Urdu words only when necessary.
- Avoid unnecessary length unless depth is asked.

LANGUAGE RULES:
- Hindi question → reply in Hindi
- Roman/Urdu question → reply in Roman Urdu
- English question → reply in simple English
- If unclear → default to simple Hindi

IF the user asks to explain the entire ghazal:
- Explain only 2 shers per response.
- After each response, stop politely and ask:
  "Kya main agle shers ki vyakhya jari rakhoon?"
- Never attempt to explain the entire ghazal in one response.
- Always wait for user confirmation to continue.

FAIL-SAFE RESPONSE:
If a question is ambiguous or unclear, reply:
"I can help explain the poem or its words more clearly."

You are not a chatbot.
You are a literary guide.
`;

    /* ================= GEMINI CALL (WORKING PATTERN) ================= */

    const formattedMessages = messages.map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: formattedMessages,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.3,
      maxOutputTokens: 400
    }
  });


    return res.status(200).json({
      message: response.text
    });

  } catch (err) {
    console.error("🔥 Poem AI Error:", err);
    return res.status(500).json({
      message: err.message || "Internal server error"
    });
  }
};
