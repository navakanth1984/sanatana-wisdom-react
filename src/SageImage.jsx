import { useRef, useEffect, useState } from 'react'

import videoDesktop from './assets/sage-video.mp4'
import posterDesktop from './assets/sage-desktop.jpeg'
import videoMobile from './assets/sage-video-mobile.mp4'
import posterMobile from './assets/sage-mobile-portrait.jpeg'
import fallbackMobile from './assets/sage-mobile-portrait2.jpeg'


// Detect mobile once (avoids per-render matchMedia calls)
function isMobile() {
  return window.matchMedia('(max-width: 768px)').matches
}

export default function SageImage({ speaking }) {
  const videoRef = useRef(null)
  const [videoFailed, setVideoFailed] = useState(false)
  const mobile = isMobile()

  useEffect(() => {
    const v = videoRef.current
    if (!v || videoFailed) return

    if (speaking) {
      v.muted = false
      v.volume = 0.6
      v.currentTime = 0
      v.play().catch(() => {
        v.muted = true
        v.play().catch(() => {})
      })
    } else {
      v.muted = true
    }
  }, [speaking, videoFailed])

  if (videoFailed) {
    return (
      <picture className={`sage-portrait ${mobile ? 'mobile' : ''} ${speaking ? 'speaking' : ''}`}>
        <source media="(max-width: 768px)" srcSet={fallbackMobile} />
        <img src={posterDesktop} alt="Sanskrit Sage" />
      </picture>
    )
  }

  return (
    <div className={`sage-portrait ${mobile ? 'mobile' : ''} ${speaking ? 'speaking' : ''}`}>
      {/*
        Two <source> elements let the browser pick the right clip:
        mobile gets the 9:16 portrait video; desktop gets the 16:9 landscape.
        The poster is set per orientation so there's no black-flash on load.
      */}
      <video
        ref={videoRef}
        className="sage-video"
        poster={mobile ? posterMobile : posterDesktop}
        muted
        loop
        autoPlay
        playsInline
        onError={() => setVideoFailed(true)}
      >
        <source media="(max-width: 768px)" src={videoMobile} type="video/mp4" />
        <source src={videoDesktop} type="video/mp4" />
      </video>
      <div className="sage-aura" />
    </div>
  )
}
