export const API_URL = "https://microbio-backend.onrender.com";
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
