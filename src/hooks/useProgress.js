const KEY = 'mathcrack_progress'
const READ_KEY = 'mathcrack_chapters_read'

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

// All lessons and subjects are freely accessible
export function isDungeonUnlocked() {
  return true
}

export function isKingdomComplete(ids) {
  return ids.every((id) => isDungeonComplete(id))
}

// Chapter read tracking
export function getReadChapters() {
  try { return JSON.parse(localStorage.getItem(READ_KEY) || '{}') } catch { return {} }
}

export function markChapterRead(chapterId) {
  const r = getReadChapters()
  r[chapterId] = true
  localStorage.setItem(READ_KEY, JSON.stringify(r))
}

export function isChapterRead(chapterId) {
  return !!getReadChapters()[chapterId]
}
