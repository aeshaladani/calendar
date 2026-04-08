import { useState, useEffect } from 'react'
import { THEMES } from '../utils/constants'
import { load, save } from '../utils/storage'

export function useTheme() {
  const [idx, setIdx] = useState(() => load('theme', 0))
  const theme = THEMES[idx]

  useEffect(() => {
    const r = document.documentElement
    r.style.setProperty('--accent',       theme.accent)
    r.style.setProperty('--accent-light', theme.accentLight)
    r.style.setProperty('--accent-mid',   theme.accentMid)
    r.style.setProperty('--accent-dark',  theme.accentDark)
    r.style.setProperty('--grad-a',       theme.gradA)
    r.style.setProperty('--grad-b',       theme.gradB)
    save('theme', idx)
  }, [theme, idx])

  return { themeIdx: idx, setThemeIdx: setIdx, theme, themes: THEMES }
}
