import { useState } from "react";
import { parseResume } from "../gemini";

const Resume: React.FC = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleParse = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setOutput("");

    try {
      const result = await parseResume(input);
      setOutput(result);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "50px auto", fontFamily: "Arial" }}>
      <h1>AI Resume Reader</h1>

      <textarea
        rows={10}
        style={{ width: "100%", padding: 10 }}
        placeholder="Paste full resume here..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <br />

      <button onClick={handleParse} disabled={loading}>
        {loading ? "Analyzing..." : "Parse Resume"}
      </button>

      <hr />

      <h2>Structured Output</h2>

      <pre style={{ whiteSpace: "pre-wrap" }}>{output}</pre>
    </div>
  );
};

export default Resume;