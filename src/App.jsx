import { useState } from 'react'
import { categories, saptaRishi, sanskritTopics, texts } from './data.js'
const rishiAvatarSrc = new URL('./assets/rishi-avatar.png', import.meta.url).href
import SageConsole from './SageConsole.jsx'
import QuantumVeda from './QuantumVeda.jsx'
import ThumbStrip from './ThumbStrip.jsx'

// ─────────────────────────────────────────────────────────────
// App composes the page from feature components. State that two
// components must agree on (the active mobile section, the open modal)
// lives HERE and is passed down as props — "lifting state up".
// ─────────────────────────────────────────────────────────────
export default function App() {
  const [activeCat, setActiveCat] = useState('architecture')
  const [activeText, setActiveText] = useState(null)   // highlight in bottom nav
  const [section, setSection] = useState('sage')        // drives the mobile thumb strip
  const [pendingAsk, setPendingAsk] = useState(null)    // bottom-nav → sage question

  const selected = categories.find((c) => c.id === activeCat)

  // Tapping a text (Vedas/Upanishads/…) asks the Sage in that text's mode
  function askAboutText(t) {
    setActiveText(t.id)
    setPendingAsk({ text: t.ask, mode: t.mode, nonce: Date.now() })
    setSection('sage')                                  // jump to sage on mobile
    window.scrollTo({ top: 0, behavior: 'smooth' })     // and to top on desktop
  }

  return (
    <>
      {/* ── SAGE CONSOLE (image + taalapatra + voice/text) ── */}
      <div className={`block ${section === 'sage' ? 'is-active' : ''}`} data-section="sage">
        <SageConsole pendingAsk={pendingAsk} />
      </div>

      {/* ── ANCIENT INDIAN CULTURE ── */}
      <div className={`block ${section === 'culture' ? 'is-active' : ''}`} data-section="culture">
        <section className="culture-panel">
          <h2 className="section-title gold devanagari">प्राचीन भारतीय संस्कृति</h2>
          <p className="section-subtitle">Ancient Indian Culture</p>
          <div className="culture-grid">
            {categories.map((c) => (
              <div
                key={c.id}
                className={`culture-item ${activeCat === c.id ? 'active' : ''}`}
                onClick={() => setActiveCat(c.id)}
              >
                <span className="culture-icon">{c.icon}</span>
                <span className="culture-label">{c.label}</span>
              </div>
            ))}
          </div>
          <div className="culture-detail" key={selected.id}>
            <h3 className="feature-heading">{selected.heading}</h3>
            <p className="feature-desc">{selected.desc}</p>
            <div className="feature-tags">
              {selected.tags.map((t) => <span className="tag" key={t}>{t}</span>)}
            </div>
          </div>
        </section>
      </div>

      {/* ── SANSKRIT LANGUAGE ── */}
      <div className={`block ${section === 'sanskrit' ? 'is-active' : ''}`} data-section="sanskrit">
        <section className="sanskrit-panel">
          <h2 className="section-title gold devanagari">संस्कृत भाषा</h2>
          <p className="section-subtitle">Sanskrit Language</p>
          <div className="sanskrit-layout">
            <div className="sanskrit-topics-col">
              {sanskritTopics.map((t) => (
                <div className="topic-item" key={t.en}>
                  <span className="topic-icon">{t.icon}</span>
                  <span className="devanagari">{t.dev}</span>
                  <span className="topic-en">({t.en})</span>
                </div>
              ))}
            </div>
            <div className="purnama-box">
              <p className="devanagari purnama">
                ॐ पूर्णमद: पूर्णमिदं<br />पूर्णात् पूर्णमुदच्यते ।<br />
                पूर्णस्य पूर्णमादाय<br />पूर्णमेवावशिष्यते ॥
              </p>
              <p className="purnama-footer">ॐ शान्ति: शान्ति: शान्ति: ॥</p>
            </div>
          </div>
        </section>
      </div>

      {/* ── SAPTA RISHI ── */}
      <div className={`block ${section === 'rishi' ? 'is-active' : ''}`} data-section="rishi">
        <section className="rishi-panel-full">
          <h2 className="section-title gold devanagari">सप्तर्षयः</h2>
          <p className="section-subtitle">Sapta Rishi</p>
          <div className="rishi-row">
            {saptaRishi.map((r) => (
              <div className="rishi-card" key={r.name}>
                <div className="rishi-figure">
                  <img src={rishiAvatarSrc} alt={r.name} className="rishi-avatar" />
                </div>
                <p className="rishi-name devanagari small">{r.dev}</p>
                <p className="rishi-name">{r.name}</p>
              </div>
            ))}
          </div>
          <div className="rishi-quote-box">
            <p className="devanagari quote-text">सा विद्या या विमुक्तये</p>
            <p className="quote-translation">That is true knowledge which liberates.</p>
          </div>
        </section>
      </div>

      {/* ── QUANTUM VEDA ── */}
      <div className={`block ${section === 'quantum' ? 'is-active' : ''}`} data-section="quantum">
        <QuantumVeda />
      </div>

      {/* ── Bottom texts nav — tap to ASK THE SAGE about that text ── */}
      <nav className="bottom-texts-nav desktop-only">
        {texts.map((t) => (
          <div
            key={t.id}
            className={`text-nav-item ${activeText === t.id ? 'active' : ''}`}
            onClick={() => askAboutText(t)}
            title={`Ask the sage: ${t.ask}`}
          >
            <span className="text-icon">{t.icon}</span>
            <span className="text-label">{t.label}</span>
          </div>
        ))}
      </nav>

      {/* ── MOBILE thumb strip (hidden on desktop) ── */}
      <ThumbStrip active={section} onSelect={setSection} />
    </>
  )
}
