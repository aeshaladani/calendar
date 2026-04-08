import { useState, useCallback } from 'react'
import { load, save } from '../utils/storage'

// meals: { [dateKey]: { Breakfast: string, Lunch: string, Dinner: string, Snack: string } }
export function useMeals() {
  const [meals, setMeals] = useState(() => load('meals', {}))

  const setMeal = useCallback((dateKey, slot, text) => {
    setMeals(prev => {
      const day = { ...(prev[dateKey] || {}), [slot]: text }
      const next = { ...prev, [dateKey]: day }
      save('meals', next)
      return next
    })
  }, [])

  const moveMeal = useCallback((fromKey, toKey, slot) => {
    setMeals(prev => {
      const text = prev[fromKey]?.[slot] || ''
      if (!text) return prev
      const fromDay = { ...(prev[fromKey] || {}), [slot]: '' }
      const toDay   = { ...(prev[toKey]   || {}), [slot]: text }
      const next = { ...prev, [fromKey]: fromDay, [toKey]: toDay }
      save('meals', next)
      return next
    })
  }, [])

  return { meals, setMeal, moveMeal }
}
