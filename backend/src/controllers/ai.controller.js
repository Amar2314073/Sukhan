const { GoogleGenAI } = require("@google/genai");
const Poem = require("../models/poem");
const { text } = require("express");

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


exports.wordMeaning = async (req, res) => {
  try {
    const { poemText, word } = req.body;

    if (!poemText || !word || typeof word !== "string") {
      return res.status(400).json({
        meaning: "अर्थ स्पष्ट नहीं"
      });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_KEY
    });

    const prompt = `
You are a literary assistant.

Task:
Explain the meaning of the given word.
ONLY in the context of the poem below.

Rules:
- In the language of the poem (Hindi/Urdu/English).
- 2 to 8 words maximum
- Maximum one sentence
- No explanation
- Poetic sense, not dictionary meaning

Poem:
${poemText}

Word:
${word}

If meaning is unclear, reply exactly:
अर्थ स्पष्ट नहीं
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: prompt }] }
      ],
      config: {
        temperature: 0.1,
        maxOutputTokens: 40
      }
    });

    const meaning =
      response?.candidates?.[0]?.content?.parts?.[0]?.text
        ?.replace(/[\n"]/g, "")
        ?.trim() || "अर्थ स्पष्ट नहीं";

    return res.status(200).json({ meaning });

  } catch (err) {
    console.error("🔥 Word Meaning AI Error:", err);
    return res.status(500).json({
      meaning: "अर्थ स्पष्ट नहीं"
    });
  }
};



