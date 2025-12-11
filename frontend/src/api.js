export const API_URL = "https://SEU-BACKEND.onrender.com"; // replace after deploy
export async function matchBacteria(tests) {
  try {
    const res = await fetch(`${API_URL}/api/match`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tests)
    });
    return await res.json();
  } catch {
    return null;
  }
}
