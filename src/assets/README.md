# Sage media assets (wired & in use)

| File | Use |
|------|-----|
| `sage-video.mp4` | Living sage stage — loops muted, glows while the sage "speaks" |
| `sage-desktop.jpeg` | Video poster (instant paint) + desktop fallback if video fails |
| `sage-mobile.jpeg` | Mobile fallback image (≤768px) |

To swap any of them, replace the file with the same name — Vite hot-reloads.
The video plays silently; the sage's *voice* comes from Web Speech TTS
(Hindi/`hi-IN` voice renders the Devanagari Sanskrit), set in `SageConsole.jsx`.
