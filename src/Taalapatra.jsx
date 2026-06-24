import { useState, useEffect } from 'react'
import rishiAvatar from './assets/rishi-avatar.png'

// ── The palm-leaf (ताडपत्र) manuscript ──
// Flow:  user message lands on the leaf  ->  sage "reads" (status)  ->
//        Sanskrit reply is revealed character-by-character (the handwriting effect).
export default function Taalapatra({ userText, reply, status }) {
  const [shown, setShown] = useState('')
  const full = reply?.sanskrit || ''

  // Re-run the reveal whenever a new reply arrives
  useEffect(() => {
    if (!full) { setShown(''); return }
    setShown('')
    let i = 0
    const id = setInterval(() => {
      i += 1
      setShown(full.slice(0, i))
      if (i >= full.length) clearInterval(id)
    }, 70) // ms per character — the "writing speed"
    return () => clearInterval(id)
  }, [full])

  return (
    <div className="taalapatra">
      <div className="leaf-binding leaf-binding-top" />
      <div className="leaf-surface">
        {/* What the user asked, inked at the top of the leaf */}
        {userText && (
          <p className="leaf-question">
            <span className="leaf-label">प्रश्न:</span> {userText}
          </p>
        )}

        {/* Sage status line with minimized actual Sage Avatar instead of wizard emoji */}
        {status && (
          <div className="leaf-status-container">
            <img src={rishiAvatar} className="leaf-status-avatar" alt="Sage" />
            <p className="leaf-status">{status.replace('🧙 ', '').replace('⚠️ ', '')}</p>
          </div>
        )}

        {/* The sage's reply, written stroke by stroke */}
        {full && (
          <div className="leaf-answer">
            <p className="devanagari leaf-sanskrit">
              {shown}
              {shown.length < full.length && <span className="quill-cursor">|</span>}
            </p>
            {/* Translations appear only once the writing finishes */}
            {shown.length >= full.length && (
              <>
                {reply.transliteration && (
                  <p className="leaf-translit">{reply.transliteration}</p>
                )}
                <p className="leaf-english">{reply.english}</p>
              </>
            )}
          </div>
        )}

        {!userText && !full && (
          <p className="leaf-hint">
            Ask the sage below — your words appear here on the ताडपत्र,
            and the sage writes the answer in Sanskrit.
          </p>
        )}
      </div>
      <div className="leaf-binding leaf-binding-bottom" />
    </div>
  )
}
