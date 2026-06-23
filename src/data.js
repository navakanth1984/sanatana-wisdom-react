// ── All content lives here, separate from the UI components. ──
// Change content without touching layout code. Components .map() over these.

export const categories = [
  { id: 'architecture', icon: '🏛️', label: 'Architecture',
    heading: 'Architecture of the Sacred',
    desc: 'Ancient Indian architecture reflects cosmic geometry — temples as models of the universe, with the sanctum representing Mount Meru, the cosmic axis.',
    tags: ['Vastu Shastra', 'Temple Design', 'Sacred Geometry'] },
  { id: 'art', icon: '💃', label: 'Art & Dance',
    heading: 'Art & Classical Dance',
    desc: 'The 64 kalas (arts) and classical forms — Bharatanatyam, Kathak, Odissi — encode mythology, devotion, and rhythm into living movement.',
    tags: ['Natya Shastra', 'Bharatanatyam', 'Rasa Theory'] },
  { id: 'music', icon: '🎸', label: 'Music',
    heading: 'The Science of Sound',
    desc: 'Indian classical music maps emotion to raga and time of day, descending from the Sama Veda — the world’s oldest notated musical tradition.',
    tags: ['Raga', 'Tala', 'Sama Veda'] },
  { id: 'ayurveda', icon: '🌿', label: 'Ayurveda',
    heading: 'Ayurveda — The Science of Life',
    desc: 'A 5,000-year-old system of medicine balancing the three doshas — Vata, Pitta, Kapha — through diet, herbs, and lifestyle.',
    tags: ['Doshas', 'Charaka Samhita', 'Holistic Healing'] },
  { id: 'yoga', icon: '🧘', label: 'Yoga & Meditation',
    heading: 'Yoga & Meditation',
    desc: 'Patanjali’s eight limbs (Ashtanga) guide the practitioner from ethical living to samadhi — union of the individual self with the universal.',
    tags: ['Ashtanga', 'Pranayama', 'Dhyana'] },
  { id: 'astronomy', icon: '⚙️', label: 'Astronomy',
    heading: 'Jyotisha — Cosmic Science',
    desc: 'Ancient astronomers like Aryabhata calculated planetary motion, eclipses, and the value of pi centuries ahead of their time.',
    tags: ['Aryabhata', 'Nakshatras', 'Surya Siddhanta'] },
  { id: 'philosophy', icon: 'ॐ', label: 'Philosophy',
    heading: 'Darshana — Ways of Seeing',
    desc: 'Six classical schools (Nyaya, Vaisheshika, Samkhya, Yoga, Mimamsa, Vedanta) form a complete map of metaphysics, logic, and liberation.',
    tags: ['Vedanta', 'Advaita', 'Six Darshanas'] },
]

export const saptaRishi = [
  { name: 'Marichi', dev: 'मरीचि:' },
  { name: 'Atri', dev: 'अत्रि:' },
  { name: 'Angiras', dev: 'अंगिरा:' },
  { name: 'Pulastya', dev: 'पुलस्त्य:' },
  { name: 'Pulaha', dev: 'पुलह:' },
  { name: 'Kratu', dev: 'क्रतु:' },
  { name: 'Vashishta', dev: 'वशिष्ठ:' },
]

export const sanskritTopics = [
  { icon: 'ॐ', en: 'Script', dev: 'लिपि' },
  { icon: '📖', en: 'Grammar', dev: 'व्याकरण' },
  { icon: '📚', en: 'Literature', dev: 'साहित्य' },
  { icon: '🌿', en: 'Vocabulary', dev: 'शब्दकोश' },
  { icon: '📿', en: 'Shlokas', dev: 'श्लोक' },
  { icon: '🎵', en: 'Chants', dev: 'मन्त्र' },
]

// Each text also carries a `mode` + `ask` so tapping it asks the Sage directly.
export const texts = [
  { id: 'vedas', icon: '📖', label: 'Vedas', mode: 'shastra',
    ask: 'Teach me about the four Vedas and their essence.',
    detail: 'The four Vedas — Rig, Yajur, Sama, Atharva — are the oldest layer of Sanatana knowledge: hymns, rituals, melodies, and formulas (Apara Vidya).' },
  { id: 'upanishads', icon: '🌳', label: 'Upanishads', mode: 'shastra',
    ask: 'Explain the core teaching of the Upanishads about Atman and Brahman.',
    detail: 'The philosophical culmination of the Vedas (Vedanta), teaching the identity of Atman and Brahman — the higher knowledge, Para Vidya.' },
  { id: 'itihasas', icon: '🏹', label: 'Itihasas', mode: 'shastra',
    ask: 'What do the Itihasas — Ramayana and Mahabharata — teach about dharma?',
    detail: 'The great epics — Ramayana and Mahabharata (which contains the Bhagavad Gita) — embedding dharma in narrative.' },
  { id: 'puranas', icon: '📜', label: 'Puranas', mode: 'shastra',
    ask: 'Describe the Puranas and the cosmology they reveal.',
    detail: 'Eighteen primary Puranas encode cosmogony, genealogy, and the avatars of Vishnu — a vast database of higher-dimensional truths.' },
  { id: 'dharma', icon: '⚖️', label: 'Dharma', mode: 'niti',
    ask: 'What is dharma and how should one live by it?',
    detail: 'The Dharmashastras codify righteous living — the Varnashrama framework of duty across life-stages and roles.' },
  { id: 'science', icon: '⚛️', label: 'Science', mode: 'quantum',
    ask: 'How does ancient Indian science relate to modern quantum physics?',
    detail: 'Mathematics (zero, decimal system), metallurgy, surgery (Sushruta), and astronomy — empirical disciplines woven into the tradition.' },
  { id: 'wisdom', icon: '💡', label: 'Wisdom', mode: 'niti',
    ask: 'Share a piece of timeless wisdom for living well.',
    detail: 'Niti literature — Hitopadesha, Panchatantra, Chanakya Niti — distilling practical and ethical wisdom into memorable verse.' },
]

export const bottomNav = [
  { icon: '🌐', label: 'Explore' },
  { icon: '📖', label: 'Learn' },
  { icon: '🎵', label: 'Chant' },
  { icon: '🧘', label: 'Meditate' },
  { icon: '🤝', label: 'Connect' },
]
