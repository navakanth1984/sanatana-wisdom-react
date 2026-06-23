import { useState, useRef, useEffect } from 'react'

// ── Custom hook: wraps the browser's built-in SpeechRecognition (voice input) ──
// No backend, no API key, no library. Works in Chrome/Edge.
// Returns { listening, transcript, supported, start, stop }.
//
// A "custom hook" is just a function starting with `use` that calls other hooks.
// It lets us reuse stateful logic across components — the React way to share behavior.
export function useSpeech(lang = 'en-IN') {
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const recognitionRef = useRef(null)   // useRef holds a mutable value across renders

  // The vendor-prefixed API differs by browser
  const SpeechRecognition =
    typeof window !== 'undefined' &&
    (window.SpeechRecognition || window.webkitSpeechRecognition)
  const supported = !!SpeechRecognition

  useEffect(() => {
    if (!supported) return
    const rec = new SpeechRecognition()
    rec.lang = lang
    rec.interimResults = true       // stream partial words as the user speaks
    rec.continuous = false

    rec.onresult = (e) => {
      const text = Array.from(e.results)
        .map((r) => r[0].transcript)
        .join('')
      setTranscript(text)
    }
    rec.onend = () => setListening(false)
    rec.onerror = () => setListening(false)

    recognitionRef.current = rec
    // Cleanup when the component using this hook unmounts
    return () => rec.abort()
  }, [lang, supported]) // eslint-disable-line react-hooks/exhaustive-deps

  const start = () => {
    if (!supported) return
    setTranscript('')
    setListening(true)
    recognitionRef.current?.start()
  }
  const stop = () => recognitionRef.current?.stop()

  return { listening, transcript, supported, start, stop }
}
