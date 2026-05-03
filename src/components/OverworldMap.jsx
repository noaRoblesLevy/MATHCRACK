import { useEffect, useRef } from 'react'
import { isKingdomComplete } from '../hooks/useProgress'

// Seeded RNG — same map every render
function seededRng(seed) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6D2B79F5) >>> 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 0x100000000
  }
}

const SRC  = 16           // source tile size in the spritesheet (px)
const SCALE = 3           // pixel art upscale
const DT   = SRC * SCALE  // displayed tile size = 48px

const GROUND_COLS = Math.floor(720 / SRC)  // 45
const OBJ_COLS    = Math.floor(784 / SRC)  // 49
const OBJ_ROWS    = Math.floor(704 / SRC)  // 44

// Kingdom positions as fractions of viewport, matching SVG path
const NODES = [
  { x: 0.14, y: 0.65, bg: '#1e0a3f', accent: '#7c3aed', icon: '🏰', label: 'LINEAR ALGEBRA' },
  { x: 0.38, y: 0.40, bg: '#0a1e3f', accent: '#2563eb', icon: '🏯', label: 'CALCULUS'        },
  { x: 0.63, y: 0.55, bg: '#0a2a14', accent: '#16a34a', icon: '🏛',  label: 'STATISTICS'      },
  { x: 0.82, y: 0.35, bg: '#3a0a0a', accent: '#dc2626', icon: '⛩',  label: 'DISCRETE MATH'   },
]

function MapCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = false

    const W = canvas.width
    const H = canvas.height
    const rand = seededRng(7391)

    const ground = new Image()
    const objs   = new Image()
    let gDone = false, oDone = false

    function draw() {
      if (!gDone || !oDone) return

      // --- Ground layer ---
      // Pick from the first few tile columns/rows (safe ground variants)
      const cols = Math.ceil(W / DT) + 1
      const rows = Math.ceil(H / DT) + 1
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const v = rand()
          const tx = v < 0.55 ? 0 : v < 0.72 ? 1 : v < 0.84 ? 2 : v < 0.93 ? 3 : 4
          const ty = rand() < 0.75 ? 0 : 1
          ctx.drawImage(ground, tx * SRC, ty * SRC, SRC, SRC, c * DT, r * DT, DT, DT)
        }
      }

      // --- Object scatter layer ---
      // Objects.png is RGBA — transparent tiles are invisible, objects appear naturally
      for (let i = 0; i < 140; i++) {
        const ox = Math.floor(rand() * OBJ_COLS) * SRC
        const oy = Math.floor(rand() * OBJ_ROWS) * SRC
        const dx = rand() * (W - DT * 2) + DT
        const dy = rand() * (H - DT * 2) + DT

        // Don't scatter objects directly on top of kingdom nodes
        const blocked = NODES.some(n => {
          const nx = n.x * W
          const ny = n.y * H
          return Math.abs(dx - nx) < 90 && Math.abs(dy - ny) < 90
        })
        if (blocked) continue

        ctx.drawImage(objs, ox, oy, SRC, SRC, dx, dy, DT, DT)
      }

      // Also scatter a denser pass of the detail/spots sheets
      const det = new Image()
      det.onload = () => {
        const detCols = Math.floor(176 / SRC)
        const detRows = Math.floor(144 / SRC)
        for (let i = 0; i < 200; i++) {
          const ox = Math.floor(rand() * detCols) * SRC
          const oy = Math.floor(rand() * detRows) * SRC
          const dx = rand() * W
          const dy = rand() * H
          ctx.drawImage(det, ox, oy, SRC, SRC, dx, dy, DT, DT)
        }
      }
      det.src = '/assets/tilesets/cursed-land/details.png'

      // --- Vignette on canvas ---
      const grad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.75)
      grad.addColorStop(0,   'rgba(0,0,0,0)')
      grad.addColorStop(0.5, 'rgba(0,0,0,0.08)')
      grad.addColorStop(1,   'rgba(0,0,0,0.7)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, W, H)
    }

    ground.onload = () => { gDone = true; draw() }
    objs.onload   = () => { oDone = true; draw() }
    ground.src = '/assets/tilesets/cursed-land/Ground.png'
    objs.src   = '/assets/tilesets/cursed-land/Objects.png'
  }, [])

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
      style={{ position: 'absolute', inset: 0, imageRendering: 'pixelated' }}
    />
  )
}

export default function OverworldMap({ kingdoms, onSelectKingdom }) {
  function isUnlocked(index) {
    if (index === 0) return true
    return isKingdomComplete(kingdoms[index - 1].dungeons.map(d => d.id))
  }

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#1a0e0a' }}>
      <MapCanvas />

      {/* Gold dotted path between kingdoms */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          d="M 14 65 C 24 55, 30 44, 38 40 S 56 48, 63 55 S 76 38, 82 35"
          stroke="#ffd700" strokeWidth="0.5" strokeDasharray="1.8 1.2"
          fill="none" opacity="0.65"
        />
      </svg>

      {/* Title */}
      <div style={{
        position: 'absolute', top: 28, left: '50%', transform: 'translateX(-50%)',
        color: '#ffd700', fontFamily: "'Courier New', monospace",
        fontSize: '1.5rem', letterSpacing: '6px', whiteSpace: 'nowrap',
        textShadow: '0 0 20px #ffd700, 0 0 50px #ffd70044',
        pointerEvents: 'none',
      }}>⚔ MATHCRACK</div>

      <div style={{
        position: 'absolute', top: 66, left: '50%', transform: 'translateX(-50%)',
        color: '#9d6aaa', fontFamily: "'Courier New', monospace",
        fontSize: '0.55rem', letterSpacing: '4px', whiteSpace: 'nowrap',
        pointerEvents: 'none',
      }}>CHOOSE YOUR KINGDOM</div>

      {/* Kingdom nodes */}
      {kingdoms.map((k, i) => {
        const unlocked = isUnlocked(i)
        const node = NODES[i]
        return (
          <div
            key={k.id}
            onClick={() => unlocked && onSelectKingdom(k.id)}
            style={{
              position: 'absolute',
              left: `${node.x * 100}%`, top: `${node.y * 100}%`,
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              cursor: unlocked ? 'pointer' : 'default',
              transition: 'transform 0.15s',
              opacity: unlocked ? 1 : 0.28,
            }}
            onMouseEnter={e => { if (unlocked) e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translate(-50%, -50%)' }}
          >
            <div style={{
              width: 68, height: 68,
              background: unlocked ? node.bg : '#0e0b18',
              border: `2px solid ${unlocked ? node.accent : '#2a1f40'}`,
              borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2.2rem',
              boxShadow: unlocked
                ? `0 0 28px ${node.accent}66, 0 0 8px ${node.accent}44, inset 0 0 20px rgba(0,0,0,0.6)`
                : 'none',
            }}>
              {unlocked ? node.icon : '🔒'}
            </div>
            <div style={{
              color: unlocked ? '#ffd700' : '#2a2040',
              fontSize: '0.48rem', marginTop: 7,
              fontFamily: "'Courier New', monospace", letterSpacing: '2px',
              textShadow: unlocked ? '0 0 10px #ffd70077' : 'none',
            }}>
              {node.label}
            </div>
          </div>
        )
      })}
    </div>
  )
}
