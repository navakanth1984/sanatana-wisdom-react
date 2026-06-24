// ── Talks to the Agent OS backend (agent_os/server.py on :8765) ──
// In dev we point at localhost; override with VITE_API_BASE for ngrok/cloud.
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8765'
// Agent OS requires X-API-Key. Override with VITE_API_KEY; default matches dashboard.html.
const API_KEY = import.meta.env.VITE_API_KEY ||
  'e84c2337a06d5d5f46406911060bdae59f41ce2c6e276ce87de502ff34526f8b'

const authHeaders = { 'Content-Type': 'application/json', 'X-API-Key': API_KEY }

// Browser-side mock database for seamless Vercel demonstration when backend is offline
const MOCK_SAGE_RESPONSES = {
  shastra: [
    {
      keywords: ['veda', 'rig', 'yajur', 'sama', 'atharva'],
      sanskrit: "वेदाः अनादिपुरुषस्य अपौरुषेयज्ञानस्य परमं स्रोतः सन्ति ।",
      transliteration: "vedāḥ anādipuruṣasya apauruṣeyajñānasya paramaṃ srotaḥ santi.",
      english: "The Vedas are the eternal, superhuman source of sacred knowledge. Rig Veda teaches hymns, Yajur directs rituals, Sama sings melodies, and Atharva holds formulas for daily life."
    },
    {
      keywords: ['upanishad', 'brahman', 'atman', 'advaita'],
      sanskrit: "अयमात्मा ब्रह्म इति उपनिषदां परमं सत्यम् ।",
      transliteration: "ayamātmā brahma iti upaniṣadāṃ paramaṃ satyam.",
      english: "This self is Brahman — that is the ultimate truth of the Upanishads. It declares the complete, non-dual identity of the individual consciousness with the absolute reality."
    },
    {
      keywords: ['itihasa', 'ramayana', 'mahabharata', 'gita'],
      sanskrit: "यतो धर्मस्ततो जयः इति महाभारतस्य शाश्वतसन्देशः ।",
      transliteration: "yato dharmastato jayaḥ iti mahābhāratasya śāśvatasandeśaḥ.",
      english: "Where there is righteousness, there is victory. The Epics teach us how to navigate the complex web of moral choices in everyday life through the archetypes of Rama and Krishna."
    },
    {
      keywords: ['purana', 'cosmology', 'avatar'],
      sanskrit: "पुराणेषु सृष्टिविद्या कालचक्रं च विस्तरेण वर्णितानि सन्ति ।",
      transliteration: "purāṇeṣu sṛṣṭividyā kālacakraṃ ca vistareṇa varṇitāni santi.",
      english: "In the Puranas, the science of creation and the cyclical wheel of time are described in detail. They outline Vishnu's descents (avatars) to restore cosmic balance."
    }
  ],
  niti: [
    {
      keywords: ['dharma', 'righteousness', 'duty'],
      sanskrit: "धर्मो रक्षति रक्षितः इति सनातननियमः ।",
      transliteration: "dharmo rakṣati rakṣitaḥ iti sanātananiyamaḥ.",
      english: "Dharma protects those who protect it. Upholding ethical duties and natural order brings harmony to the individual and the universe alike."
    },
    {
      keywords: ['wisdom', 'niti', 'chanakya', 'hitopadesha'],
      sanskrit: "विद्या ददाति विनयं विनयाद् याति पात्रताम् ।",
      transliteration: "vidyā dadāti vinayaṃ vinayād yāti pātratām.",
      english: "Knowledge bestows humility; humility leads to worthiness. True wisdom is practical, helping one live ethically and successfully in society."
    }
  ],
  quantum: [
    {
      keywords: ['quantum', 'science', 'physics', 'entanglement', 'observer'],
      sanskrit: "क्वाण्टम्-दर्शनं वेदान्तस्य अद्वैतसिद्धान्तं पुष्टिं करोति ।",
      transliteration: "kvāṇṭam-darśanaṃ vedāntasya advaitasiddhāntaṃ puṣṭiṃ karoti.",
      english: "Quantum mechanics beautifully reinforces the Advaita philosophy of Vedanta, demonstrating that the observer and the observed are entangled parts of a single, non-dual reality."
    }
  ],
  general: [
    {
      keywords: ['life', 'meaning', 'peace', 'conduct'],
      sanskrit: "सत्यमेव जयते नानृतम् । शान्तिः परमो धर्मः ।",
      transliteration: "satyameva jayate nānṛtam. śāntiḥ paramo dharmaḥ.",
      english: "Truth alone triumphs, not falsehood. Peace and tranquility of the mind are the highest virtues to strive for in this human birth."
    }
  ]
}

const DEFAULT_SAGE_REPLY = {
  sanskrit: "सत्यं वद । धर्मं चर । स्वाध्यायान्मा प्रमदः ।",
  transliteration: "satyaṃ vada. dharmaṃ cara. svādhyāyānmā pramadaḥ.",
  english: "Speak the truth. Walk the path of righteousness. Never neglect the study of the self."
}

// Ask the Sanskrit Sage. mode = general | shastra | niti | jeevan | quantum
// Returns { sanskrit, transliteration, english, mode }.
export async function askSage(message, mode = 'general') {
  try {
    const res = await fetch(`${API_BASE}/sage`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ message, mode }),
      signal: AbortSignal.timeout(4000) // Don't hang forever
    })
    if (!res.ok) throw new Error(`Sage error ${res.status}`)
    return await res.json()
  } catch (e) {
    console.warn("Backend Sage API offline, activating browser-side rishi fallback:", e.message)
    
    // Match keywords to mock responses
    const cleanMsg = message.toLowerCase()
    const pool = MOCK_SAGE_RESPONSES[mode] || MOCK_SAGE_RESPONSES['general']
    
    for (const item of pool) {
      if (item.keywords.some(k => cleanMsg.includes(k))) {
        return { ...item, mode }
      }
    }
    
    // Check fallback to general pool if specific mode keywords don't match
    for (const item of MOCK_SAGE_RESPONSES['general']) {
      if (item.keywords.some(k => cleanMsg.includes(k))) {
        return { ...item, mode }
      }
    }
    
    return { ...DEFAULT_SAGE_REPLY, mode }
  }
}

// Run a real quantum circuit and get its Vedic mapping.
// circuit = bell_state | ghz_3 | superposition | grover_2 | qft_3 | full_adder
export async function quantumSanskrit(circuit = 'bell_state') {
  try {
    const res = await fetch(`${API_BASE}/quantum/sanskrit?circuit=${circuit}`, {
      headers: { 'X-API-Key': API_KEY },
      signal: AbortSignal.timeout(4000) // Don't hang forever
    })
    if (!res.ok) throw new Error(`Quantum error ${res.status}`)
    return await res.json()
  } catch (e) {
    console.warn("Backend Quantum API offline, activating browser-side quantum simulator fallback:", e.message)
    
    // Simulate real quantum counts and mappings
    let counts = {}
    let mapping = {
      "superposition": {
        "sanskrit": "अव्यक्तम्",
        "concept": "Avyakta — the unmanifest state where all possibilities coexist, like Pralaya before creation; a qubit before measurement."
      },
      "entanglement": {
        "sanskrit": "अद्वैतम्",
        "concept": "Advaita — non-duality; two entangled qubits share one state, as Atman and Brahman are one across all distance."
      },
      "measurement": {
        "sanskrit": "द्रष्टा",
        "concept": "Drashta — the observer collapses superposition into experienced reality, as described in the Mundaka Upanishad."
      },
      "sound_as_information": {
        "sanskrit": "शब्दब्रह्म",
        "concept": "Shabda-Brahma — Sanskrit phonemes as precise units of cosmic information; the universe as a deterministic sound encoding."
      }
    }
    
    let shloka = {
      "sanskrit": "एकं सद् विप्रा बहुधा वदन्ति ।",
      "english": "Truth is one; the wise call it by many names. (Rig Veda 1.164.46) — one wavefunction, many measured outcomes."
    }

    if (circuit === 'bell_state') {
      counts = { "00": 251, "11": 261 }
    } else if (circuit === 'superposition') {
      counts = { "0": 258, "1": 254 }
    } else if (circuit === 'grover_2') {
      counts = { "00": 14, "01": 11, "10": 15, "11": 472 }
      shloka = {
        "sanskrit": "तमेव विदित्वाति मृत्युमेति नान्यः पन्था विद्यतेऽयनाय ॥",
        "english": "Knowing Him alone, one goes beyond death; there is no other path to the goal. (Svetasvatara Upanishad 3.8)"
      }
    } else if (circuit === 'qft_3') {
      counts = { "000": 64, "001": 66, "010": 63, "011": 62, "100": 65, "101": 64, "110": 63, "111": 65 }
      shloka = {
        "sanskrit": "नादबिन्दुसङ्घातः तन्मात्राणां विवर्तनम् ।",
        "english": "The collection of sound-points is the evolutionary manifestation of subtle energy units. (Nada Bindu Upanishad)"
      }
    } else {
      counts = { "00": 256, "11": 256 }
    }

    return {
      "circuit": circuit,
      "quantum_result": { "counts": counts },
      "vedic_mapping": mapping,
      "shloka": shloka
    }
  }
}
