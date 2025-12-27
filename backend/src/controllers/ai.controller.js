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
You are Sukhan AI for explaining word meanings in poems.

TASK:
The user will ask the meaning of a single word taken from the poem.
You must explain ONLY the meaning of that word
STRICTLY in the context of this poem.

RULES:
- Answer in Hindi (unless user asks otherwise).
- Keep the answer within 1–2 short lines.
- No ghazal or sher explanation.
- No extra commentary, examples, or analysis.
- If the word is Urdu/Persian/Arabic, give its poetic sense, not dictionary definition.

POEM CONTEXT:
Title: ${poem.title}
Poet: ${poem.poet?.name || "Unknown"}

Urdu:
${poem.content?.urdu || ""}

Hindi:
${poem.content?.hindi || ""}

Roman:
${poem.content?.roman || ""}

FAIL-SAFE:
If unclear, reply:
"I can help explain the poem or its words more clearly."

If the question is not about a word, reply exactly:
"I can only explain word meanings from this poem."
`;


    /* ================= GEMINI CALL (WORKING PATTERN) ================= */

    const lastUserMessage = messages[messages.length - 1]?.content;
    const formattedMessages = [{
        role: "user",
        parts: [{ text: lastUserMessage }]
    }];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: formattedMessages,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.3,
      maxOutputTokens: 900
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
