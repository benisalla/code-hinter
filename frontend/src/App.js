import React, { useState } from "react";
import "./App.css";
import { DEFAULT_CONCEPTS, DEFAULT_ST_CODE, DEFAULT_PR_CODE } from "./app/contant/defaults";
import ConceptInput from "./app/component/ConceptInput";
import CodeInput from "./app/component/CodeInput"
import CheckerModal from "./app/component/modals/CheckModal";
import RankerModal from "./app/component/modals/RankerModal";
import { evaluate_code, compare_code } from "./app/component/api/api";

const App = () => {
  const [concepts, setConcepts] = useState(DEFAULT_CONCEPTS);
  const [st_code, setStudentCode] = useState(DEFAULT_ST_CODE);
  const [pr_code, setPrcode] = useState(DEFAULT_PR_CODE);
  const [check_results, setCheckResults] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isCheckerModalOpen, setCheckerModalOpen] = useState(false);
  const [isRankerModalOpen, setRankerModalOpen] = useState(false);
  const [score, setScore] = useState(null);
  const [model_type, setModelType] = useState("default");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setCheckResults("");

    try {
      const response = await evaluate_code(concepts, st_code, model_type);
      setCheckResults(response.response);
      setCheckerModalOpen(() => true)
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRanking = async () => {
    setCheckerModalOpen(false);  // Close any open modals
    setLoading(true);
    setError("");
    try {
      const response = await compare_code(pr_code, st_code, model_type);
      setScore(response.response);
      setRankerModalOpen(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };




  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">Code Hinter</h1>
      </header>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="prof-code">Professor Code:</label>
          <textarea
            id="prof-code"
            value={pr_code}
            onChange={(e) => setPrcode(e.target.value)}
            placeholder="Enter professor's code here..."
            rows="4"
            required
          />
        </div>
        <div>
          <label htmlFor="prof-hints">Course Concepts:</label>
          <ConceptInput value={concepts} onChange={(e) => setConcepts(e.target.value)} />
        </div>
        <div>
          <label htmlFor="stud-code">Student Code:</label>
          <CodeInput value={st_code} onChange={setStudentCode} />
        </div>
        <div className="form-action-row">
          <button type="button" onClick={handleRanking} disabled={loading}>Submit</button>
          <button type="submit" onClick={handleSubmit} disabled={loading}>Run</button>
        </div>
      </form>

      {error && <p className="error-message">Error: {error}</p>}

      <CheckerModal
        isOpen={isCheckerModalOpen}
        onRequestClose={() => setCheckerModalOpen(false)}
        response={check_results} />

      <RankerModal
        isOpen={isRankerModalOpen}
        onRequestClose={() => setRankerModalOpen(false)}
        pr_code={pr_code}
        st_code={st_code}
        score={score} />
    </div>
  );
};

export default App;
