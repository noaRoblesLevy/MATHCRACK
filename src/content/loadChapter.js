const chapterFiles = import.meta.glob('./reading/ch-*.json', { eager: true })

export function loadChapter(chapterId) {
  const key = Object.keys(chapterFiles).find(k => {
    const filename = k.split('/').pop()
    return filename.startsWith(chapterId + '-') || filename === chapterId + '.json'
  })
  return key ? (chapterFiles[key].default ?? chapterFiles[key]) : null
}
