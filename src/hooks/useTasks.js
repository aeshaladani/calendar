import { useState, useCallback } from 'react'
import { load, save } from '../utils/storage'

let _id = Date.now()
const uid = () => String(++_id)

export function useTasks() {
  // tasks: { [dateKey]: [{id, text, done, priority}] }
  const [tasks, setTasks] = useState(() => load('tasks', {}))

  const persist = (next) => { setTasks(next); save('tasks', next) }

  const addTask = useCallback((dateKey, text) => {
    if (!text.trim()) return
    setTasks(prev => {
      const list = [...(prev[dateKey] || [])]
      list.push({ id: uid(), text: text.trim(), done: false, priority: 'normal' })
      const next = { ...prev, [dateKey]: list }
      save('tasks', next)
      return next
    })
  }, [])

  const toggleTask = useCallback((dateKey, id) => {
    setTasks(prev => {
      const list = (prev[dateKey] || []).map(t => t.id === id ? { ...t, done: !t.done } : t)
      const next = { ...prev, [dateKey]: list }
      save('tasks', next)
      return next
    })
  }, [])

  const deleteTask = useCallback((dateKey, id) => {
    setTasks(prev => {
      const list = (prev[dateKey] || []).filter(t => t.id !== id)
      const next = { ...prev, [dateKey]: list }
      save('tasks', next)
      return next
    })
  }, [])

  const setPriority = useCallback((dateKey, id, priority) => {
    setTasks(prev => {
      const list = (prev[dateKey] || []).map(t => t.id === id ? { ...t, priority } : t)
      const next = { ...prev, [dateKey]: list }
      save('tasks', next)
      return next
    })
  }, [])

  // Reorder via drag: swap dragIndex → dropIndex
  const reorderTasks = useCallback((dateKey, fromIdx, toIdx) => {
    setTasks(prev => {
      const list = [...(prev[dateKey] || [])]
      const [moved] = list.splice(fromIdx, 1)
      list.splice(toIdx, 0, moved)
      const next = { ...prev, [dateKey]: list }
      save('tasks', next)
      return next
    })
  }, [])

  // Move a task from one date key to another (weekly drag)
  const moveTask = useCallback((fromKey, toKey, id) => {
    setTasks(prev => {
      const fromList = [...(prev[fromKey] || [])]
      const idx = fromList.findIndex(t => t.id === id)
      if (idx === -1) return prev
      const [task] = fromList.splice(idx, 1)
      const toList = [...(prev[toKey] || []), task]
      const next = { ...prev, [fromKey]: fromList, [toKey]: toList }
      save('tasks', next)
      return next
    })
  }, [])

  return { tasks, addTask, toggleTask, deleteTask, setPriority, reorderTasks, moveTask }
}
