import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { addItem, getCount } from '../hooks/useInventory'

const CONSUMABLES = [
  { type: 'hint-scroll',   emoji: '📜', label: 'Hint Scroll',    desc: 'Reveal one hint step on a Room question',  price: 15 },
  { type: 'focus-crystal', emoji: '🔷', label: 'Focus Crystal',  desc: 'Hide hints for a distraction-free session', price: 25 },
  { type: 'scholars-tome', emoji: '📖', label: "Scholar's Tome", desc: 'Auto-show explanation after every answer',  price: 40 },
  { type: 'solution-orb',  emoji: '🔮', label: 'Solution Orb',   desc: 'Reveal the correct answer before answering', price: 60 },
]

const FLAIRS = [
  { id: 'The Procrastinator', emoji: '😴', price: 75 },
  { id: 'Chaos Mage',         emoji: '🌀', price: 75 },
  { id: 'Number Goblin',      emoji: '👺', price: 75 },
  { id: 'Eternal Student',    emoji: '📚', price: 75 },
  { id: 'Sleep Deprived',     emoji: '☕', price: 75 },
  { id: 'Certified Nerd',     emoji: '🤓', price: 75 },
  { id: 'Math Villain',       emoji: '💀', price: 100 },
  { id: 'Formula Witch',      emoji: '🧙', price: 100 },
]

const ICONS = [
  { id: '🦇', price: 50 }, { id: '🐉', price: 50 }, { id: '💎', price: 50 },
  { id: '⚔️', price: 50 }, { id: '🌙', price: 50 }, { id: '🔥', price: 50 },
  { id: '⭐', price: 50 }, { id: '🦊', price: 50 },
]

const ACCENT_COLORS = [
  { id: '#a78bfa', label: 'Violet',  price: 60 },
  { id: '#34d399', label: 'Emerald', price: 60 },
  { id: '#ef4444', label: 'Crimson', price: 60 },
  { id: '#fbbf24', label: 'Gold',    price: 60 },
  { id: '#22d3ee', label: 'Teal',    price: 60 },
  { id: '#f472b6', label: 'Rose',    price: 60 },
]

function SectionLabel({ children }) {
  return (
    <div style={{
      fontFamily: 'var(--font-mono)',
      color: 'var(--text-muted)',
      fontSize: '0.56rem',
      letterSpacing: '2.5px',
      marginBottom: '0.75rem',
      marginTop: '1.5rem',
    }}>
      {children}
    </div>
  )
}

function BuyButton({ price, owned, active, onBuy, onEquip, onUnequip, disabled }) {
  if (owned && active) return (
    <button onClick={onUnequip} style={btnStyle('var(--correct)', true)}>EQUIPPED</button>
  )
  if (owned) return (
    <button onClick={onEquip} style={btnStyle('var(--blue)', false)}>EQUIP</button>
  )
  return (
    <button onClick={onBuy} disabled={disabled} style={btnStyle('var(--gold)', false, disabled)}>
      🪙{price}
    </button>
  )
}

function btnStyle(color, active, disabled) {
  return {
    padding: '0.3rem 0.75rem', minHeight: 32,
    background: active ? `${color}20` : 'var(--bg-elevated)',
    border: `1px solid ${disabled ? 'var(--border)' : color}`,
    borderRadius: 6, color: disabled ? 'var(--text-muted)' : color,
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: '0.72rem', fontFamily: 'var(--font-mono)',
    whiteSpace: 'nowrap', flexShrink: 0,
    opacity: disabled ? 0.5 : 1,
  }
}

export default function ShopScreen() {
  const coins = useGameStore(s => s.coins)
  const streakFreezes = useGameStore(s => s.streakFreezes)
  const equippedFlair = useGameStore(s => s.equippedFlair)
  const equippedIcon = useGameStore(s => s.equippedIcon)
  const equippedAccentColor = useGameStore(s => s.equippedAccentColor)
  const premiumCardsUnlocked = useGameStore(s => s.premiumCardsUnlocked)
  const ownedFlairs = useGameStore(s => s.ownedFlairs)
  const ownedIcons = useGameStore(s => s.ownedIcons)
  const ownedAccentColors = useGameStore(s => s.ownedAccentColors)

  const buyShopItem = useGameStore(s => s.buyShopItem)
  const equipFlair = useGameStore(s => s.equipFlair)
  const unequipFlair = useGameStore(s => s.unequipFlair)
  const equipIcon = useGameStore(s => s.equipIcon)
  const equipAccentColor = useGameStore(s => s.equipAccentColor)

  const [flash, setFlash] = useState(null)
  const [invCounts, setInvCounts] = useState(() =>
    Object.fromEntries(CONSUMABLES.map(c => [c.type, getCount(c.type)]))
  )

  function toast(msg) { setFlash(msg); setTimeout(() => setFlash(null), 1800) }

  function buyConsumable(item) {
    const ok = buyShopItem(item.price, () => ({}))
    if (!ok) { toast('Not enough coins'); return }
    addItem(item.type)
    setInvCounts(prev => ({ ...prev, [item.type]: prev[item.type] + 1 }))
    toast(`${item.emoji} Added to inventory`)
  }

  function buyStreakFreeze() {
    const ok = buyShopItem(80, (s) => ({ streakFreezes: s.streakFreezes + 1 }))
    if (!ok) toast('Not enough coins')
    else toast('❄️ Streak Freeze ready')
  }

  function buyFlair(flair) {
    const ok = buyShopItem(flair.price, (s) => ({ ownedFlairs: [...s.ownedFlairs, flair.id] }))
    if (!ok) toast('Not enough coins')
    else toast(`${flair.emoji} Flair unlocked`)
  }

  function buyIcon(icon) {
    const ok = buyShopItem(icon.price, (s) => ({ ownedIcons: [...s.ownedIcons, icon.id] }))
    if (!ok) toast('Not enough coins')
    else toast(`${icon.id} Icon unlocked`)
  }

  function buyAccentColor(c) {
    const ok = buyShopItem(c.price, (s) => ({ ownedAccentColors: [...s.ownedAccentColors, c.id] }))
    if (!ok) toast('Not enough coins')
    else toast(`${c.label} accent unlocked`)
  }

  function buyPremiumCards() {
    const ok = buyShopItem(120, () => ({ premiumCardsUnlocked: true }))
    if (!ok) toast('Not enough coins')
    else toast('✨ Premium Cards unlocked')
  }

  return (
    <div className="page-with-nav" style={{ minHeight: '100vh', background: 'var(--bg-deep)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.75rem 0.875rem 1rem' }}>
      <div style={{ width: '100%', maxWidth: 520 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '0.58rem', letterSpacing: '3px' }}>SHOP</span>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            background: 'var(--bg-elevated)', border: '1px solid var(--border)',
            borderRadius: 8, padding: '0.35rem 0.75rem',
          }}>
            <span style={{ fontSize: '0.9rem' }}>🪙</span>
            <span style={{ fontFamily: 'var(--font-mono)', color: '#f59e0b', fontWeight: 'bold', fontSize: '1rem' }}>{coins}</span>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '0.55rem', letterSpacing: '1px' }}>COINS</span>
          </div>
        </div>

        {flash && (
          <div style={{
            padding: '0.6rem 1rem', marginBottom: '0.75rem',
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 8, fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem', color: 'var(--correct)', textAlign: 'center',
          }}>
            {flash}
          </div>
        )}

        {/* Consumables */}
        <SectionLabel>CONSUMABLES</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {CONSUMABLES.map(item => (
            <div key={item.type} style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.75rem 0.875rem',
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 9,
            }}>
              <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{item.emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text)', fontWeight: 500 }}>{item.label}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', color: 'var(--text-muted)', background: 'var(--bg-elevated)', padding: '1px 5px', borderRadius: 3 }}>
                    ×{invCounts[item.type]}
                  </span>
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{item.desc}</div>
              </div>
              <button onClick={() => buyConsumable(item)} disabled={coins < item.price} style={btnStyle('var(--gold)', false, coins < item.price)}>
                🪙{item.price}
              </button>
            </div>
          ))}
        </div>

        {/* Power-ups */}
        <SectionLabel>POWER-UPS</SectionLabel>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          padding: '0.75rem 0.875rem',
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 9,
        }}>
          <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>❄️</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text)', fontWeight: 500 }}>Streak Freeze</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', color: streakFreezes > 0 ? 'var(--blue)' : 'var(--text-muted)', background: 'var(--bg-elevated)', padding: '1px 5px', borderRadius: 3 }}>
                ×{streakFreezes}
              </span>
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Protects your streak if you miss a day. Activates automatically.</div>
          </div>
          <button onClick={buyStreakFreeze} disabled={coins < 80} style={btnStyle('#60a5fa', false, coins < 80)}>🪙80</button>
        </div>

        {/* Flair */}
        <SectionLabel>FLAIR</SectionLabel>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
          Shown alongside your earned Title on the Profile screen.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {FLAIRS.map(flair => {
            const owned = ownedFlairs.includes(flair.id)
            const active = equippedFlair === flair.id
            return (
              <div key={flair.id} style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.65rem 0.875rem',
                background: active ? 'rgba(139,92,246,0.08)' : 'var(--bg-card)',
                border: `1px solid ${active ? 'var(--violet)' : 'var(--border)'}`,
                borderRadius: 9,
              }}>
                <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{flair.emoji}</span>
                <span style={{ flex: 1, fontSize: '0.82rem', color: active ? 'var(--violet-light)' : 'var(--text)' }}>
                  {flair.id}
                </span>
                <BuyButton
                  price={flair.price} owned={owned} active={active}
                  onBuy={() => buyFlair(flair)}
                  onEquip={() => equipFlair(flair.id)}
                  onUnequip={unequipFlair}
                  disabled={!owned && coins < flair.price}
                />
              </div>
            )
          })}
        </div>

        {/* Cosmetics — Profile Icon */}
        <SectionLabel>COSMETICS — PROFILE ICON</SectionLabel>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
          {ICONS.map(icon => {
            const owned = ownedIcons.includes(icon.id)
            const active = equippedIcon === icon.id
            return (
              <div key={icon.id} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem',
                padding: '0.6rem 0.5rem', minWidth: 60,
                background: active ? 'rgba(139,92,246,0.1)' : 'var(--bg-card)',
                border: `1px solid ${active ? 'var(--violet)' : 'var(--border)'}`,
                borderRadius: 9,
              }}>
                <span style={{ fontSize: '1.6rem' }}>{icon.id}</span>
                {owned ? (
                  <button
                    onClick={() => active ? equipIcon(null) : equipIcon(icon.id)}
                    style={btnStyle('var(--blue)', active)}
                  >
                    {active ? 'ON' : 'USE'}
                  </button>
                ) : (
                  <button
                    onClick={() => buyIcon(icon)} disabled={coins < icon.price}
                    style={btnStyle('var(--gold)', false, coins < icon.price)}
                  >
                    🪙{icon.price}
                  </button>
                )}
              </div>
            )
          })}
        </div>

        {/* Cosmetics — HUD Accent Color */}
        <SectionLabel>COSMETICS — HUD ACCENT COLOR</SectionLabel>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
          {ACCENT_COLORS.map(c => {
            const owned = ownedAccentColors.includes(c.id)
            const active = equippedAccentColor === c.id
            return (
              <div key={c.id} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem',
                padding: '0.6rem 0.5rem', minWidth: 72,
                background: active ? `${c.id}15` : 'var(--bg-card)',
                border: `1px solid ${active ? c.id : 'var(--border)'}`,
                borderRadius: 9,
              }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: c.id, boxShadow: `0 0 8px ${c.id}80` }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', color: 'var(--text-muted)' }}>{c.label}</span>
                {owned ? (
                  <button
                    onClick={() => active ? equipAccentColor(null) : equipAccentColor(c.id)}
                    style={btnStyle(c.id, active)}
                  >
                    {active ? 'ON' : 'USE'}
                  </button>
                ) : (
                  <button
                    onClick={() => buyAccentColor(c)} disabled={coins < c.price}
                    style={btnStyle('var(--gold)', false, coins < c.price)}
                  >
                    🪙{c.price}
                  </button>
                )}
              </div>
            )
          })}
        </div>

        {/* Cosmetics — Premium Cards */}
        <SectionLabel>COSMETICS — SUBJECT CARDS</SectionLabel>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          padding: '0.875rem 0.875rem',
          background: premiumCardsUnlocked ? 'linear-gradient(135deg, rgba(251,191,36,0.08), var(--bg-card))' : 'var(--bg-card)',
          border: `1px solid ${premiumCardsUnlocked ? 'rgba(251,191,36,0.4)' : 'var(--border)'}`,
          borderRadius: 9,
        }}>
          <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>✨</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text)', fontWeight: 500, marginBottom: '0.2rem' }}>Premium Subject Cards</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Completed subjects glow with enhanced borders and shimmer effects on the map.</div>
          </div>
          {premiumCardsUnlocked ? (
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--correct)', fontSize: '0.62rem', letterSpacing: '1px', flexShrink: 0 }}>✓ OWNED</span>
          ) : (
            <button onClick={buyPremiumCards} disabled={coins < 120} style={btnStyle('var(--gold)', false, coins < 120)}>🪙120</button>
          )}
        </div>

      </div>
    </div>
  )
}
