import { useState, useEffect } from 'react'

export function useTheme() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('mathcrack-theme') ?? 'dark'
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('mathcrack-theme', theme)
  }, [theme])

  // Apply on first render too (avoids flash)
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme)
  }

  return {
    theme,
    isDark: theme === 'dark',
    toggle: () => setTheme(t => t === 'dark' ? 'light' : 'dark'),
  }
}
