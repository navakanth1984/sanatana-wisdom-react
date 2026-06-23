// ── Talks to the Agent OS backend (agent_os/server.py on :8765) ──
// In dev we point at localhost; override with VITE_API_BASE for ngrok/cloud.
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8765'
// Agent OS requires X-API-Key. Override with VITE_API_KEY; default matches dashboard.html.
const API_KEY = import.meta.env.VITE_API_KEY ||
  'e84c2337a06d5d5f46406911060bdae59f41ce2c6e276ce87de502ff34526f8b'

const authHeaders = { 'Content-Type': 'application/json', 'X-API-Key': API_KEY }

// Ask the Sanskrit Sage. mode = general | shastra | niti | jeevan | quantum
// Returns { sanskrit, transliteration, english, mode }.
export async function askSage(message, mode = 'general') {
  const res = await fetch(`${API_BASE}/sage`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ message, mode }),
  })
  if (!res.ok) throw new Error(`Sage error ${res.status}`)
  return res.json()
}

// Run a real quantum circuit and get its Vedic mapping.
// circuit = bell_state | ghz_3 | superposition | grover_2 | qft_3 | full_adder
export async function quantumSanskrit(circuit = 'bell_state') {
  const res = await fetch(`${API_BASE}/quantum/sanskrit?circuit=${circuit}`, {
    headers: { 'X-API-Key': API_KEY },
  })
  if (!res.ok) throw new Error(`Quantum error ${res.status}`)
  return res.json()
}
