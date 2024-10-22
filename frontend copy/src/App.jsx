import React, { useState } from "react";
import axios from "axios";

function App() {
  const [files, setFiles] = useState([]);
  const [aiResponse, setAiResponse] = useState("");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async () => {
    if (files.length === 0) {
      alert("Please upload at least one file.");
      return;
    }
    if (!question.trim()) {
      alert("Please enter a question.");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    formData.append("question", question);

    setLoading(true); 

    try {
      const response = await axios.post("http://localhost:3001/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setAiResponse(response.data.aiResponse);
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Failed to upload files or process your request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>AI File Processing and Q&A</h1>
      <input
        type="file"
        multiple
        accept=".pdf" 
        onChange={(e) => setFiles(Array.from(e.target.files))}
        style={{ marginBottom: "10px" }}
      />
      <br />
      <input
        type="text"
        placeholder="Enter your question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        style={{ marginBottom: "10px", width: "300px" }}
      />
      <br />
      <button onClick={handleFileUpload} style={{ marginBottom: "20px" }} disabled={loading}>
        {loading ? "Processing..." : "Upload Files and Ask Question"} {}
      </button>

      {aiResponse && (
        <div>
          <h2>AI Response:</h2>
          <p>{aiResponse}</p>
        </div>
      )}
    </div>
  );
}

export default App;
