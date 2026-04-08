import { useState, useCallback } from 'react'
import { load, save } from '../utils/storage'
import { WATER_GOAL } from '../utils/constants'

// water: { [dateKey]: number }
export function useWater() {
  const [water, setWater] = useState(() => load('water', {}))

  const addGlass = useCallback((dateKey) => {
    setWater(prev => {
      const next = { ...prev, [dateKey]: Math.min((prev[dateKey] || 0) + 1, WATER_GOAL) }
      save('water', next)
      return next
    })
  }, [])

  const removeGlass = useCallback((dateKey) => {
    setWater(prev => {
      const next = { ...prev, [dateKey]: Math.max((prev[dateKey] || 0) - 1, 0) }
      save('water', next)
      return next
    })
  }, [])

  const getCount = useCallback((dateKey) => water[dateKey] || 0, [water])

  return { water, addGlass, removeGlass, getCount }
}
