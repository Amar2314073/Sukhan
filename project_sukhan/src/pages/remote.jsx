import { useState } from "react";
import Sanscript from "sanscript";

export default function Remote() {
  const [script, setScript] = useState("hi");
  function cleanRoman(text) {
  return text
    .replace(/\.N/g, "n")
    .replace(/\.M/g, "m")
    .replace(/M\b/g, "m")
    .replace(/A/g, "aa")
    .replace(/I/g, "i")
    .replace(/U/g, "u")
    .replace(/\.h/g, "h")
    .replace(/़/g, "")
    .replace(/\.N/g, "n");
}


  // ✅ DUMMY GHAZAL DATA (6 sher style)
  const text = `उसकी कत्थई आँखों में हैं जंतर मंतर सब
ख़ामोशी भी जैसे बोल उठी हो अब

दिन कुछ ऐसे गुज़ारता है कोई
जैसे एहसाँ उतारता है कोई

दिल में कुछ यूँ सँभालता हूँ ग़म
जैसे ज़ेवर सँभालता है कोई

देर से गूँजते हैं सन्नाटे
जैसे हम को पुकारता है कोई`;
const romanRaw = Sanscript.t(text, "devanagari", "itrans");
  const output =
    script === "hi"
      ? text
      : cleanRoman(romanRaw);

  return (
    <div style={{ maxWidth: 700, margin: "40px auto" }}>
      <pre style={{ fontSize: 20, lineHeight: 1.8 }}>
        {output}
      </pre>

      <button
        onClick={() =>
          setScript(script === "hi" ? "roman" : "hi")
        }
        style={{ marginTop: 20 }}
      >
        Script Change
      </button>
    </div>
  );
}
