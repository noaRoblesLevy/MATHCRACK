import { useState } from 'react'

const INVENTORY_KEY = 'mathcrack_inventory'
const FOCUS_KEY = 'mathcrack_focus_mode'
const TOME_KEY = 'mathcrack_tome_active'

const DEFAULT_INVENTORY = [
  { type: 'hint-scroll', count: 0 },
  { type: 'focus-crystal', count: 0 },
  { type: 'scholars-tome', count: 0 },
  { type: 'solution-orb', count: 0 },
]

const DEFAULT_LOOT = [
  { type: 'hint-scroll', weight: 60 },
  { type: 'focus-crystal', weight: 25 },
  { type: 'scholars-tome', weight: 10 },
  { type: 'solution-orb', weight: 5 },
]

export function getInventory() {
  try {
    return JSON.parse(localStorage.getItem(INVENTORY_KEY)) ?? [...DEFAULT_INVENTORY.map(i => ({ ...i }))]
  } catch {
    return [...DEFAULT_INVENTORY.map(i => ({ ...i }))]
  }
}

function saveInventory(inv) {
  localStorage.setItem(INVENTORY_KEY, JSON.stringify(inv))
}

export function addItem(type) {
  const inv = getInventory()
  const item = inv.find(i => i.type === type)
  if (item) item.count += 1
  saveInventory(inv)
}

export function useItem(type) {
  const inv = getInventory()
  const item = inv.find(i => i.type === type)
  if (!item || item.count === 0) return false
  item.count -= 1
  saveInventory(inv)
  return true
}

export function getCount(type) {
  return getInventory().find(i => i.type === type)?.count ?? 0
}

export function rollLoot(lootTable) {
  if (!lootTable || lootTable.length === 0) return null
  const total = lootTable.reduce((s, e) => s + e.weight, 0)
  let roll = Math.random() * total
  for (const entry of lootTable) {
    roll -= entry.weight
    if (roll <= 0) return entry.type
  }
  return lootTable[lootTable.length - 1].type
}

export function isFocusMode() {
  return localStorage.getItem(FOCUS_KEY) === 'true'
}

export function setFocusMode(val) {
  localStorage.setItem(FOCUS_KEY, val ? 'true' : 'false')
}

export function isScholarTomeActive() {
  return localStorage.getItem(TOME_KEY) === 'true'
}

export function setScholarTomeActive(val) {
  localStorage.setItem(TOME_KEY, val ? 'true' : 'false')
}

// Call once in App.jsx — pass results as props to avoid stale closures
export function useInventory() {
  const [inventory, setInventory] = useState(getInventory)
  const [focusMode, setFocusModeState] = useState(isFocusMode)
  const [scholarActive, setScholarActiveState] = useState(isScholarTomeActive)

  function refresh() { setInventory(getInventory()) }

  function addItemAndRefresh(type) { addItem(type); refresh() }

  function useItemAndRefresh(type) {
    const ok = useItem(type)
    if (ok) refresh()
    return ok
  }

  function toggleFocus() {
    if (focusMode) {
      addItem('focus-crystal'); refresh()
      setFocusMode(false); setFocusModeState(false)
    } else {
      const ok = useItem('focus-crystal')
      if (!ok) return false
      refresh(); setFocusMode(true); setFocusModeState(true)
      return true
    }
  }

  function toggleScholar() {
    if (scholarActive) {
      setScholarTomeActive(false); setScholarActiveState(false)
    } else {
      const ok = useItem('scholars-tome')
      if (!ok) return false
      refresh(); setScholarTomeActive(true); setScholarActiveState(true)
      return true
    }
  }

  return {
    inventory, focusMode, scholarActive,
    addItem: addItemAndRefresh, useItem: useItemAndRefresh,
    toggleFocus, toggleScholar,
  }
}
