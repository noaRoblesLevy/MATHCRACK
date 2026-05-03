import { isKingdomComplete } from '../hooks/useProgress'

const NODES = [
  { left: '12%', top: '62%', bg: '#2d0a5a', icon: '🏰' },
  { left: '38%', top: '40%', bg: '#0a1e3f', icon: '🏯' },
  { left: '63%', top: '52%', bg: '#0a2a14', icon: '🏛' },
  { left: '82%', top: '32%', bg: '#3a0a0a', icon: '⛩' },
]

export default function OverworldMap({ kingdoms, onSelectKingdom }) {
  function isUnlocked(index) {
    if (index === 0) return true
    return isKingdomComplete(kingdoms[index - 1].dungeons.map((d) => d.id))
  }

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden' }}>

      {/* Tiled cursed-land ground */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: "url('/assets/tilesets/cursed-land/Ground.png')",
        backgroundSize: '160px 160px',
        imageRendering: 'pixelated',
      }} />

      {/* Atmospheric gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg,rgba(5,2,15,0.6) 0%,rgba(5,2,15,0.05) 45%,rgba(5,2,15,0.7) 100%)',
      }} />

      {/* SVG path — viewBox 0-100 maps to % of container */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          d="M 12 62 C 22 54, 30 44, 38 40 S 56 46, 63 52 S 76 36, 82 32"
          stroke="#ffd700"
          strokeWidth="0.6"
          strokeDasharray="2 1.4"
          fill="none"
          opacity="0.75"
        />
      </svg>

      {/* Animated decorations from asset packs */}
      <img
        src="/assets/knowledge-temple/Structures & Details/Brain Sphere 1 Gif.gif"
        alt=""
        style={{ position: 'absolute', bottom: 24, right: 32, width: 80, height: 80, imageRendering: 'pixelated', opacity: 0.8 }}
      />
      <img
        src="/assets/crawling-depths/creatures/Eye 1 Gif.gif"
        alt=""
        style={{ position: 'absolute', bottom: 12, left: 24, width: 48, height: 48, imageRendering: 'pixelated', opacity: 0.55 }}
      />
      <img
        src="/assets/crawling-depths/creatures/Amalgam 1 Gif.gif"
        alt=""
        style={{ position: 'absolute', top: 60, right: 60, width: 52, height: 52, imageRendering: 'pixelated', opacity: 0.35 }}
      />

      {/* Title */}
      <div style={{
        position: 'absolute', top: 24, left: '50%', transform: 'translateX(-50%)',
        color: '#ffd700', fontFamily: "'Courier New', monospace",
        fontSize: '1.5rem', letterSpacing: '6px', whiteSpace: 'nowrap',
        textShadow: '0 0 20px #ffd700, 0 0 50px #ffd70044',
      }}>
        ⚔ MATHCRACK
      </div>

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
              left: node.left, top: node.top,
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              cursor: unlocked ? 'pointer' : 'default',
              opacity: unlocked ? 1 : 0.3,
              transition: 'filter 0.2s, transform 0.15s',
              filter: unlocked ? 'none' : 'grayscale(1)',
            }}
            onMouseEnter={e => { if (unlocked) e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.12)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)' }}
          >
            <div style={{
              width: 64, height: 64,
              background: unlocked ? node.bg : '#111',
              border: `2px solid ${unlocked ? '#ffd700' : '#333'}`,
              borderRadius: 6,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem',
              boxShadow: unlocked ? '0 0 22px #ffd70066, inset 0 0 16px rgba(0,0,0,0.6)' : 'none',
              imageRendering: 'pixelated',
            }}>
              {unlocked ? node.icon : '🔒'}
            </div>
            <div style={{
              color: unlocked ? '#ffd700' : '#444',
              fontSize: '0.5rem', marginTop: 6,
              fontFamily: "'Courier New', monospace",
              letterSpacing: '2px',
              textShadow: unlocked ? '0 0 10px #ffd70099' : 'none',
            }}>
              {k.subtitle.toUpperCase()}
            </div>
          </div>
        )
      })}
    </div>
  )
}
