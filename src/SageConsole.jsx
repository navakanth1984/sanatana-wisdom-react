import { useState, useEffect } from 'react'
import SageImage from './SageImage.jsx'
import Taalapatra from './Taalapatra.jsx'
import { askSage } from './api.js'
import { useSpeech } from './useSpeech.js'

// The four ask-modes shown as buttons (match the reference image's sage panel)
const MODES = [
  { id: 'general', en: 'Ask', dev: 'प्रश्न: पृच्छ' },
  { id: 'shastra', en: 'Scriptures', dev: 'शास्त्रं पृच्छ' },
  { id: 'niti', en: 'Ethics', dev: 'नीतिं पृच्छ' },
  { id: 'jeevan', en: 'Life', dev: 'जीवनं पृच्छ' },
]

export default function SageConsole({ pendingAsk }) {
  const [mode, setMode] = useState('general')
  const [input, setInput] = useState('')
  const [userText, setUserText] = useState('')
  const [reply, setReply] = useState(null)
  const [status, setStatus] = useState('')
  const [speaking, setSpeaking] = useState(false)

  const { listening, transcript, supported, start, stop } = useSpeech('en-IN')

  // Voice: as the user speaks, mirror the transcript into the input box
  useEffect(() => {
    if (transcript) setInput(transcript)
  }, [transcript])

  // External ask: the bottom-nav (Vedas/Upanishads/…) sets pendingAsk → fire it.
  // We key on `pendingAsk?.nonce` so the SAME question can be re-asked.
  useEffect(() => {
    if (pendingAsk?.text) {
      setMode(pendingAsk.mode || 'general')
      submit(pendingAsk.text, pendingAsk.mode)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingAsk?.nonce])

  async function submit(text, modeOverride) {
    const q = (text ?? input).trim()
    if (!q) return
    const useMode = modeOverride || mode
    setUserText(q)          // the question lands on the taalapatra
    setReply(null)
    setInput('')
    setStatus('🧙 The sage reads your words…')
    setSpeaking(true)
    try {
      const res = await askSage(q, useMode)
      setStatus('')
      setReply(res)         // triggers the handwriting reveal in Taalapatra
      speak(res)            // sage reads the answer aloud
    } catch (e) {
      setStatus('⚠️ Sage is unreachable — start agent_os/server.py on :8765')
    } finally {
      setSpeaking(false)
    }
  }

  // Text-to-speech: the sage "responds back" audibly in Sanskrit/Devanagari.
  // SpeechSynthesis has no dedicated Sanskrit voice, but hi-IN (or sa) renders
  // Devanagari correctly since they share the script. We pick the best voice,
  // speak the Sanskrit, then follow with the English translation.
  function pickVoice() {
    const voices = window.speechSynthesis?.getVoices() || []
    return (
      voices.find((v) => /^sa\b/i.test(v.lang)) ||           // Sanskrit, if present
      voices.find((v) => /^hi[-_]?IN/i.test(v.lang)) ||      // Hindi (India)
      voices.find((v) => /^hi\b/i.test(v.lang)) ||           // any Hindi
      voices.find((v) => /^en[-_]?IN/i.test(v.lang)) ||      // Indian English
      null
    )
  }

  function speak(res) {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const voice = pickVoice()

    // 1) Sanskrit line in a Devanagari-capable voice
    if (res.sanskrit) {
      const us = new SpeechSynthesisUtterance(res.sanskrit)
      us.lang = voice?.lang || 'hi-IN'
      if (voice) us.voice = voice
      us.rate = 0.85; us.pitch = 0.9
      window.speechSynthesis.speak(us)
    }
    // 2) English translation after, in English
    if (res.english) {
      const ue = new SpeechSynthesisUtterance(res.english)
      ue.lang = 'en-IN'; ue.rate = 0.95; ue.pitch = 0.9
      window.speechSynthesis.speak(ue)
    }
  }

  // Voices load asynchronously in some browsers; warm them up once.
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices()
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices()
    }
  }, [])

  function onMic() {
    if (listening) { stop(); submit() } // stop & send what was heard
    else start()
  }

  return (
    <div className="sage-console">
      {/* Left: ask-mode buttons (Sanskrit Sage panel) */}
      <div className="sage-modes">
        <h2 className="section-title gold">संस्कृतसंवादी</h2>
        <p className="section-subtitle">Sanskrit Sage</p>
        <p className="sage-intro devanagari">
          अहं संस्कृतेन उत्तरं दास्यामि ।
          <span className="sage-intro-en">I will answer in Sanskrit.</span>
        </p>
        {MODES.map((m) => (
          <button
            key={m.id}
            className={`mode-btn ${mode === m.id ? 'active' : ''}`}
            onClick={() => setMode(m.id)}
          >
            <span className="devanagari">{m.dev}</span>
            <span className="mode-en">{m.en}</span>
          </button>
        ))}
      </div>

      {/* Center: the sage portrait */}
      <div className="sage-stage">
        <SageImage speaking={speaking} />
      </div>

      {/* Right: the taalapatra manuscript */}
      <div className="sage-leaf-area">
        <Taalapatra userText={userText} reply={reply} status={status} />
      </div>

      {/* Bottom: input bar (type or speak) */}
      <form
        className="sage-input-bar"
        onSubmit={(e) => { e.preventDefault(); submit() }}
      >
        <input
          className="sage-input"
          placeholder="Ask the sage… (type or use the mic)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        {supported && (
          <button
            type="button"
            className={`mic-btn ${listening ? 'listening' : ''}`}
            onClick={onMic}
            title={listening ? 'Stop & send' : 'Speak'}
          >
            🎤
          </button>
        )}
        <button type="submit" className="ask-btn">Ask 🪶</button>
      </form>
    </div>
  )
}
