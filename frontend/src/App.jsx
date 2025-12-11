import { useState } from "react";
import { matchBacteria } from "./api";
import { bacteriaDB } from "./bacteria-db";
export default function App() {
  const [form, setForm] = useState({ tsi: "", citrato: "", indol: "", fenilalanina: "" });
  const [result, setResult] = useState([]);
  async function handleSubmit() {
    const apiResponse = await matchBacteria(form);
    if (apiResponse) return setResult(apiResponse);
    const matches = bacteriaDB.map((b) => {
      let score = 0;
      Object.keys(form).forEach((key) => {
        if (form[key] && b[key] && b[key].toLowerCase().includes(form[key].toLowerCase())) { score++; }
      });
      return { bacteria: b.name, score };
    });
    setResult(matches.sort((a, b) => b.score - a.score));
  }
  return (
    <div className="container">
      <h1>🔬 MicrobioLab – Identificação Bacteriológica</h1>
      <div className="card">
        <h2>Insira os resultados bioquímicos:</h2>
        {Object.keys(form).map((key) => (
          <div key={key}>
            <label>{key.toUpperCase()}:</label>
            <input value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
          </div>
        ))}
        <button onClick={handleSubmit}>Buscar</button>
      </div>
      {result.length > 0 && (
        <div className="card">
          <h2>Resultados:</h2>
          {result.map((r) => (<p key={r.bacteria}><strong>{r.bacteria}</strong> — Score {r.score}</p>))}
        </div>
      )}
    </div>
  );
}
