import { useRef, useEffect, useState } from 'react'

// ── Interactive 3D Canvas knowledge graph ──
// Renders a high-performance 3D galaxy where nodes are represented as glowing 
// traditional Indian enlightenment diyas (clay lamps) and orbiting solar system paths.
// Features: 3D rotation, zooming, hover detection, and click to trigger Sage queries.
const MAP_NODES = [
  { id: 'vedas', label: 'Vedas', dev: 'वेदाः', x: -3.5, y: 1.5, z: 2.0, color: '#e0a836', ask: 'Teach me about the four Vedas and their essence.', mode: 'shastra' },
  { id: 'upanishads', label: 'Upanishads', dev: 'उपनिषदः', x: 3.5, y: 2.0, z: -2.0, color: '#f5c451', ask: 'Explain the core teaching of the Upanishads about Atman and Brahman.', mode: 'shastra' },
  { id: 'itihasas', label: 'Itihasas', dev: 'इतिहासः', x: -4.0, y: -1.5, z: -2.0, color: '#ff8a8a', ask: 'What do the Itihasas — Ramayana and Mahabharata — teach about dharma?', mode: 'shastra' },
  { id: 'puranas', label: 'Puranas', dev: 'पुराणानि', x: 4.0, y: -2.0, z: 2.0, color: '#ffbd59', ask: 'Describe the Puranas and the cosmology they reveal.', mode: 'shastra' },
  { id: 'dharma', label: 'Dharma', dev: 'धर्मः', x: 0.0, y: 3.0, z: 0.0, color: '#c9943a', ask: 'What is dharma and how should one live by it?', mode: 'niti' },
  { id: 'ayurveda', label: 'Ayurveda', dev: 'आयुर्वेदः', x: -2.0, y: -3.0, z: 3.0, color: '#88ff88', ask: 'Share the core principles of Ayurveda for healthy living.', mode: 'jeevan' },
  { id: 'yoga', label: 'Yoga & Meditation', dev: 'योगः', x: 2.0, y: -3.0, z: -3.0, color: '#8a7aff', ask: 'Explain Patanjali\'s eight limbs of Yoga.', mode: 'jeevan' },
]

export default function NeuralCanvas({ onNodeSelect }) {
  const canvasRef = useRef(null)
  const [activeNode, setActiveNode] = useState(null)
  
  // 3D rotation angles & zoom
  const anglesRef = useRef({ theta: 0.4, phi: 0.5 })
  const zoomRef = useRef(25)
  const dragRef = useRef({ isDragging: false, lastX: 0, lastY: 0 })
  const nodesRef = useRef(MAP_NODES.map(n => ({ ...n })))

  // Particle background stars
  const starsRef = useRef(
    Array.from({ length: 250 }, () => {
      const radius = 5 + Math.random() * 25
      const speed = 0.02 + Math.random() * 0.04
      const angle = Math.random() * Math.PI * 2
      const y = (Math.random() - 0.5) * 8
      return { radius, speed, angle, y, color: `rgba(245, 196, 81, ${0.15 + Math.random() * 0.45})` }
    })
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId

    // Handle resizing
    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
    }
    resize()
    window.addEventListener('resize', resize)

    // Render loop
    function render() {
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const width = canvas.width
      const height = canvas.height
      const cx = width / 2
      const cy = height / 2
      
      const theta = anglesRef.current.theta
      const phi = anglesRef.current.phi
      const scale = zoomRef.current * (width / 700) // dynamic scale based on width

      // 3D Rotation matrices coefficients
      const cosT = Math.cos(theta), sinT = Math.sin(theta)
      const cosP = Math.cos(phi), sinP = Math.sin(phi)

      // Project 3D to 2D function
      function project(x, y, z) {
        // Rotate around Y-axis (theta)
        let x1 = x * cosT - z * sinT
        let z1 = x * sinT + z * cosT

        // Rotate around X-axis (phi)
        let y2 = y * cosP - z1 * sinP
        let z2 = y * sinP + z1 * cosP

        // Perspective factor
        const perspective = 30 / (30 + z2)
        return {
          x: cx + x1 * scale * perspective,
          y: cy - y2 * scale * perspective,
          zDepth: z2,
          factor: perspective
        }
      }

      // 1. Draw Starfield Background
      starsRef.current.forEach(star => {
        star.angle += star.speed * 0.1 // rotate stars slowly
        const sx = Math.cos(star.angle) * star.radius
        const sz = Math.sin(star.angle) * star.radius
        const proj = project(sx, star.y, sz)

        ctx.fillStyle = star.color
        ctx.beginPath()
        ctx.arc(proj.x, proj.y, 1.2 * proj.factor, 0, Math.PI * 2)
        ctx.fill()
      })

      // Orbit paths (Solar System rings around central source)
      ctx.strokeStyle = 'rgba(224, 168, 54, 0.08)'
      ctx.lineWidth = 1
      for (let r = 3; r <= 8; r += 1.5) {
        ctx.beginPath()
        for (let a = 0; a <= Math.PI * 2 + 0.1; a += 0.1) {
          const ox = Math.cos(a) * r
          const oz = Math.sin(a) * r
          const proj = project(ox, 0, oz)
          if (a === 0) ctx.moveTo(proj.x, proj.y)
          else ctx.lineTo(proj.x, proj.y)
        }
        ctx.stroke()
      }

      // Calculate projected nodes and sort by zDepth for correct painters-algorithm rendering
      const projectedNodes = nodesRef.current.map((node) => {
        const proj = project(node.x, node.y, node.z)
        return { ...node, proj }
      }).sort((a, b) => b.proj.zDepth - a.proj.zDepth)

      // 2. Draw Connections / Bonds between nodes
      ctx.strokeStyle = 'rgba(245, 196, 81, 0.12)'
      ctx.lineWidth = 1.5
      for (let i = 0; i < projectedNodes.length; i++) {
        for (let j = i + 1; j < projectedNodes.length; j++) {
          const n1 = projectedNodes[i].proj
          const n2 = projectedNodes[j].proj
          ctx.beginPath()
          ctx.moveTo(n1.x, n1.y)
          ctx.lineTo(n2.x, n2.y)
          ctx.stroke()
        }
      }

      // 3. Draw Nodes (Traditional Clay Diya + Flame)
      projectedNodes.forEach(node => {
        const { x, y, factor } = node.proj
        const baseRadius = 14 * factor
        const isHovered = activeNode && activeNode.id === node.id

        // Pulse effect for flame
        const pulse = 1 + Math.sin(Date.now() * 0.008 + node.x) * 0.12
        const glowRad = baseRadius * (isHovered ? 2.5 : 1.8) * pulse

        ctx.shadowBlur = glowRad
        ctx.shadowColor = node.color

        // Diya Base (Traditional terracotta shape)
        ctx.fillStyle = '#b85a38' // Terracotta clay color
        ctx.beginPath()
        ctx.moveTo(x - baseRadius * 1.3, y - baseRadius * 0.2)
        ctx.bezierCurveTo(
          x - baseRadius * 0.8, y + baseRadius * 1.1,
          x + baseRadius * 0.8, y + baseRadius * 1.1,
          x + baseRadius * 1.3, y - baseRadius * 0.2
        )
        ctx.bezierCurveTo(
          x + baseRadius * 0.6, y + baseRadius * 0.3,
          x - baseRadius * 0.6, y + baseRadius * 0.3,
          x - baseRadius * 1.3, y - baseRadius * 0.2
        )
        ctx.fill()

        // Gold border highlight on Diya
        ctx.strokeStyle = '#f5c451'
        ctx.lineWidth = 1
        ctx.stroke()

        // The Flame (teardrop gradient shape pointing upwards)
        const flameGradient = ctx.createRadialGradient(x, y - baseRadius * 0.7, 1, x, y - baseRadius * 0.7, baseRadius * 1.2)
        flameGradient.addColorStop(0, '#ffffff')
        flameGradient.addColorStop(0.2, '#ffd000')
        flameGradient.addColorStop(0.6, '#ff6600')
        flameGradient.addColorStop(1, 'transparent')

        ctx.fillStyle = flameGradient
        ctx.beginPath()
        ctx.moveTo(x, y - baseRadius * 1.8 * pulse)
        ctx.quadraticCurveTo(x + baseRadius * 0.6 * pulse, y - baseRadius * 0.6, x, y - baseRadius * 0.2)
        ctx.quadraticCurveTo(x - baseRadius * 0.6 * pulse, y - baseRadius * 0.6, x, y - baseRadius * 1.8 * pulse)
        ctx.fill()

        // Reset shadow for text drawing
        ctx.shadowBlur = 0

        // Draw Labels
        ctx.fillStyle = isHovered ? '#ffffff' : 'rgba(243, 228, 196, 0.8)'
        ctx.font = `600 ${Math.max(10, 11 * factor)}px 'Noto Sans Devanagari', sans-serif`
        ctx.textAlign = 'center'
        ctx.fillText(node.dev, x, y + baseRadius * 1.9)
        
        ctx.font = `500 ${Math.max(8, 9 * factor)}px 'Cinzel', serif`
        ctx.fillStyle = isHovered ? '#f5c451' : 'rgba(184, 150, 104, 0.7)'
        ctx.fillText(node.label, x, y + baseRadius * 2.8)
      })

      animationId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [activeNode])

  // Mouse / Touch handlers for 3D rotation
  function handleMouseDown(e) {
    dragRef.current = {
      isDragging: true,
      lastX: e.clientX,
      lastY: e.clientY
    }
  }

  function handleMouseMove(e) {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    // Rotation dragging logic
    if (dragRef.current.isDragging) {
      const deltaX = e.clientX - dragRef.current.lastX
      const deltaY = e.clientY - dragRef.current.lastY
      anglesRef.current.theta += deltaX * 0.008
      anglesRef.current.phi = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, anglesRef.current.phi + deltaY * 0.008))
      dragRef.current.lastX = e.clientX
      dragRef.current.lastY = e.clientY
      return
    }

    // Hover detection logic
    const cx = canvas.width / 2
    const cy = canvas.height / 2
    const theta = anglesRef.current.theta
    const phi = anglesRef.current.phi
    const scale = zoomRef.current * (canvas.width / 700)
    const cosT = Math.cos(theta), sinT = Math.sin(theta)
    const cosP = Math.cos(phi), sinP = Math.sin(phi)

    let found = null
    nodesRef.current.forEach(node => {
      let x1 = node.x * cosT - node.z * sinT
      let z1 = node.x * sinT + node.z * cosT
      let y2 = node.y * cosP - z1 * sinP
      let z2 = node.y * sinP + z1 * cosP
      const factor = 30 / (30 + z2)
      
      const px = cx + x1 * scale * factor
      const py = cy - y2 * scale * factor
      
      const dist = Math.hypot(mouseX - px, mouseY - py)
      if (dist < 28 * factor) {
        found = node
      }
    })

    if (found !== activeNode) {
      setActiveNode(found)
      canvas.style.cursor = found ? 'pointer' : 'grab'
    }
  }

  function handleMouseUp() {
    dragRef.current.isDragging = false
  }

  function handleWheel(e) {
    e.preventDefault()
    zoomRef.current = Math.max(10, Math.min(60, zoomRef.current - e.deltaY * 0.02))
  }

  function handleClick() {
    if (activeNode && onNodeSelect) {
      onNodeSelect(activeNode)
    }
  }

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="block w-full h-full active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onClick={handleClick}
      />
      {activeNode && (
        <div className="absolute top-4 right-4 bg-black/75 border border-gold/40 rounded-xl px-4 py-2 pointer-events-none text-xs backdrop-blur-md animate-fadeIn">
          <span className="text-gold-bright devanagari block font-semibold">{activeNode.dev} — {activeNode.label}</span>
          <span className="text-muted italic block mt-0.5">Click to ask Sage about this pathway</span>
        </div>
      )}
    </div>
  )
}
