const dungeonFiles = import.meta.glob('./**/*.json', { eager: true })

export function loadDungeon(filePath) {
  const mod = dungeonFiles[`./${filePath}`]
  if (!mod) return null
  const data = mod.default ?? mod
  return {
    ...data,
    rooms: [...data.rooms].sort((a, b) => (a.difficulty ?? 1) - (b.difficulty ?? 1)),
    boss: data.boss
      ? {
          ...data.boss,
          questions: [...data.boss.questions].sort((a, b) => (a.difficulty ?? 1) - (b.difficulty ?? 1)),
        }
      : data.boss,
  }
}
