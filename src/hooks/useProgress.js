const KEY = 'mathcrack_progress'

export function getProgress() {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}') } catch { return {} }
}

function saveProgress(data) {
  localStorage.setItem(KEY, JSON.stringify(data))
}

export function markRoomComplete(dungeonId, idx) {
  const p = getProgress()
  if (!p[dungeonId]) p[dungeonId] = { rooms: [], bossComplete: false }
  if (!p[dungeonId].rooms.includes(idx)) p[dungeonId].rooms.push(idx)
  saveProgress(p)
}

export function markBossComplete(dungeonId) {
  const p = getProgress()
  if (!p[dungeonId]) p[dungeonId] = { rooms: [], bossComplete: false }
  p[dungeonId].bossComplete = true
  saveProgress(p)
}

export function isDungeonComplete(dungeonId) {
  const d = getProgress()[dungeonId]
  return !!d && d.rooms.length >= 5 && d.bossComplete === true
}

export function isDungeonUnlocked(ids, index) {
  return index === 0 || isDungeonComplete(ids[index - 1])
}

export function isKingdomComplete(ids) {
  return ids.every((id) => isDungeonComplete(id))
}
