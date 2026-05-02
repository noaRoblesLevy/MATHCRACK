const dungeonFiles = import.meta.glob('./**/*.json', { eager: true })

export function loadDungeon(filePath) {
  const mod = dungeonFiles[`./${filePath}`]
  return mod ? (mod.default ?? mod) : null
}
