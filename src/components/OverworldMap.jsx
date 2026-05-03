import { isKingdomComplete } from '../hooks/useProgress'

const NODES = [
  { left: '14%', top: '65%', bg: '#1e0a3f', accent: '#7c3aed', icon: '🏰', label: 'LINEAR ALGEBRA' },
  { left: '38%', top: '42%', bg: '#0a1e3f', accent: '#2563eb', icon: '🏯', label: 'CALCULUS' },
  { left: '62%', top: '55%', bg: '#0a2a14', accent: '#16a34a', icon: '🏛',  label: 'STATISTICS' },
  { left: '82%', top: '35%', bg: '#3a0a0a', accent: '#dc2626', icon: '⛩',  label: 'DISCRETE MATH' },
]

export default function OverworldMap({ kingdoms, onSelectKingdom }) {
  function isUnlocked(index) {
    if (index === 0) return true
    return isKingdomComplete(kingdoms[index - 1].dungeons.map((d) => d.id))
  }

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#07040f' }}>

      {/* Very subtle ground texture — low opacity so it doesn't dominate */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: "url('/assets/tilesets/cursed-land/Ground.png')",
        backgroundSize: '192px 192px',
        imageRendering: 'pixelated',
        opacity: 0.08,
      }} />

      {/* Radial vignette to focus the eye on the map */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 80% 70% at 48% 50%, transparent 30%, #07040f 100%)',
      }} />

      {/* Faint path connecting nodes */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          d="M 14 65 C 24 55, 30 46, 38 42 S 54 48, 62 55 S 76 38, 82 35"
          stroke="#ffd700"
          strokeWidth="0.5"
          strokeDasharray="1.8 1.2"
          fill="none"
          opacity="0.5"
        />
      </svg>

      {/* Title */}
      <div style={{
        position: 'absolute', top: 32, left: '50%', transform: 'translateX(-50%)',
        color: '#ffd700', fontFamily: "'Courier New', monospace",
        fontSize: '1.6rem', letterSpacing: '8px', whiteSpace: 'nowrap',
        textShadow: '0 0 24px #ffd70088',
      }}>
        ⚔ MATHCRACK
      </div>
      <div style={{
        position: 'absolute', top: 70, left: '50%', transform: 'translateX(-50%)',
        color: '#6d4aaa', fontFamily: "'Courier New', monospace",
        fontSize: '0.6rem', letterSpacing: '4px', whiteSpace: 'nowrap',
      }}>
        CHOOSE YOUR KINGDOM
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
              transition: 'transform 0.15s',
            }}
            onMouseEnter={e => { if (unlocked) e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.08)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translate(-50%, -50%)' }}
          >
            {/* Node icon box */}
            <div style={{
              width: 72, height: 72,
              background: unlocked ? node.bg : '#0e0b18',
              border: `2px solid ${unlocked ? node.accent : '#2a1f40'}`,
              borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2.2rem',
              boxShadow: unlocked
                ? `0 0 28px ${node.accent}55, 0 0 8px ${node.accent}33, inset 0 0 20px rgba(0,0,0,0.5)`
                : 'none',
              opacity: unlocked ? 1 : 0.25,
            }}>
              {unlocked ? node.icon : '🔒'}
            </div>

            {/* Label */}
            <div style={{
              color: unlocked ? '#ffd700' : '#3a2f50',
              fontSize: '0.48rem', marginTop: 8,
              fontFamily: "'Courier New', monospace",
              letterSpacing: '2px',
              textShadow: unlocked ? '0 0 12px #ffd70077' : 'none',
            }}>
              {node.label}
            </div>

            {/* Subtitle */}
            <div style={{
              color: unlocked ? node.accent : '#2a2040',
              fontSize: '0.4rem', marginTop: 3,
              fontFamily: "'Courier New', monospace",
              letterSpacing: '1px',
              opacity: unlocked ? 0.8 : 0.4,
            }}>
              {k.dungeons.filter(d => !d.stub).length} DUNGEON{k.dungeons.filter(d => !d.stub).length !== 1 ? 'S' : ''} AVAILABLE
            </div>
          </div>
        )
      })}

      {/* Single unobtrusive decoration — brain sphere bottom-right */}
      <img
        src="/assets/knowledge-temple/Structures & Details/Brain Sphere 1 Gif.gif"
        alt=""
        style={{
          position: 'absolute', bottom: 20, right: 28,
          width: 56, height: 56,
          imageRendering: 'pixelated', opacity: 0.45,
        }}
      />
    </div>
  )
}
