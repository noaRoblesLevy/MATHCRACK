const TIERS = [
  { title: 'Apprentice', min: 0, max: 99 },
  { title: 'Adept', min: 100, max: 299 },
  { title: 'Scholar', min: 300, max: 699 },
  { title: 'Sage', min: 700, max: 1499 },
  { title: 'Archmage', min: 1500, max: 2999 },
  { title: 'Math Lich \u{1F480}', min: 3000, max: Infinity },
]

function currentTier(xp) {
  return TIERS.find((t) => xp >= t.min && xp <= t.max) ?? TIERS[TIERS.length - 1]
}

export function getTitle(xp) {
  return currentTier(xp).title
}

export function getXPToNextLevel(xp) {
  const t = currentTier(xp)
  return t.max === Infinity ? 0 : t.max + 1 - xp
}

export function getTierProgress(xp) {
  const t = currentTier(xp)
  if (t.max === Infinity) return 1
  const range = t.max - t.min + 1
  return (xp - t.min) / range
}
