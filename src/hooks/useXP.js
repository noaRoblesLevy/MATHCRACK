const TIERS = [
  { title: 'Apprentice', min: 0, max: 499 },
  { title: 'Adept', min: 500, max: 1499 },
  { title: 'Scholar', min: 1500, max: 3499 },
  { title: 'Sage', min: 3500, max: 6499 },
  { title: 'Archmage', min: 6500, max: 9999 },
  { title: 'Math Lich \u{1F480}', min: 10000, max: Infinity },
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
