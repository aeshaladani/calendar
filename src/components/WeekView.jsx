import React, { useState } from 'react'
import { DAYS_OF_WEEK, HOLIDAYS } from '../utils/constants'
import { getWeekDays, formatDate, getHoliday } from '../utils/dateUtils'
import s from './WeekView.module.css'

function TaskItem({ task, dateKey, onToggle, onDelete, onDragStart }) {
  return (
    <div className={`${s.task} ${task.done ? s.done : ''} ${s[task.priority]}`}
      draggable onDragStart={(e) => onDragStart(e, dateKey, task.id)}
      data-id={task.id}>
      <input type="checkbox" checked={task.done} onChange={() => onToggle(dateKey, task.id)}
        className={s.check} />
      <span className={s.taskText}>{task.text}</span>
      <button className={s.del} onClick={() => onDelete(dateKey, task.id)}>×</button>
    </div>
  )
}

export default function WeekView({ year, month, day, tasks, meals, notes, onAddTask, onToggleTask, onDeleteTask, onMoveTask, onMoveMeal, onNoteChange }) {
  const weekDays = getWeekDays(year, month, day || new Date().getDate())
  const today = new Date()
  const [dragInfo, setDragInfo] = useState(null)  // { type:'task'|'meal', key, id, slot }
  const [over, setOver] = useState(null)

  const dateKey = (wd) => `d-${wd.year}-${wd.month}-${wd.dayNum}`

  const handleDragStart = (e, key, id) => {
    setDragInfo({ type: 'task', key, id })
    e.dataTransfer.effectAllowed = 'move'
  }
  const handleMealDragStart = (e, key, slot) => {
    setDragInfo({ type: 'meal', key, slot })
    e.dataTransfer.effectAllowed = 'move'
  }
  const handleDrop = (e, toKey) => {
    e.preventDefault()
    if (!dragInfo) return
    if (dragInfo.type === 'task' && dragInfo.key !== toKey)
      onMoveTask(dragInfo.key, toKey, dragInfo.id)
    if (dragInfo.type === 'meal' && dragInfo.key !== toKey)
      onMoveMeal(dragInfo.key, toKey, dragInfo.slot)
    setDragInfo(null); setOver(null)
  }

  return (
    <div className={s.week}>
      {weekDays.map((wd, i) => {
        const dk = dateKey(wd)
        const isToday = wd.year===today.getFullYear() && wd.month===today.getMonth() && wd.dayNum===today.getDate()
        const holiday = getHoliday(HOLIDAYS, wd.month, wd.dayNum)
        const dayTasks = tasks[dk] || []
        const dayMeals = meals[dk] || {}
        const note = notes[dk] || ''
        const isOver = over === dk

        return (
          <div key={dk}
            className={`${s.col} ${isToday?s.todayCol:''} ${isOver?s.dragOver:''} anim-fade-up stagger-${Math.min(i+1,5)}`}
            onDragOver={e=>{e.preventDefault();setOver(dk)}}
            onDragLeave={()=>setOver(null)}
            onDrop={e=>handleDrop(e,dk)}>

            {/* Header */}
            <div className={s.colHead}>
              <span className={s.dow}>{DAYS_OF_WEEK[i]}</span>
              <span className={`${s.dayNum} ${isToday?s.todayNum:''}`}>{wd.dayNum}</span>
              {holiday && <span className={s.holBadge} title={holiday}>●</span>}
            </div>

            {/* Tasks */}
            <div className={s.section}>
              <p className={s.secLabel}>Tasks</p>
              <div className={s.taskList}>
                {dayTasks.map(t => (
                  <TaskItem key={t.id} task={t} dateKey={dk}
                    onToggle={onToggleTask} onDelete={onDeleteTask}
                    onDragStart={handleDragStart} />
                ))}
              </div>
              <AddTaskInline dateKey={dk} onAdd={onAddTask} />
            </div>

            {/* Meals */}
            <div className={s.section}>
              <p className={s.secLabel}>Meals</p>
              {['Breakfast','Lunch','Dinner'].map(slot => (
                <div key={slot}
                  className={`${s.mealSlot} ${dayMeals[slot]?s.mealFilled:''}`}
                  draggable={!!dayMeals[slot]}
                  onDragStart={e=>handleMealDragStart(e,dk,slot)}>
                  <span className={s.slotLabel}>{slot[0]}</span>
                  <input className={s.mealInput} value={dayMeals[slot]||''}
                    onChange={e=>onMoveMeal && null}
                    placeholder={slot}
                    readOnly />
                </div>
              ))}
            </div>

            {/* Note */}
            <textarea className={s.note} value={note}
              onChange={e=>onNoteChange(dk, e.target.value)}
              placeholder="Note…" rows={2} />
          </div>
        )
      })}
    </div>
  )
}

function AddTaskInline({ dateKey, onAdd }) {
  const [val, setVal] = useState('')
  const submit = () => { onAdd(dateKey, val); setVal('') }
  return (
    <div className={s.addRow}>
      <input className={s.addInput} value={val} onChange={e=>setVal(e.target.value)}
        onKeyDown={e=>e.key==='Enter'&&submit()} placeholder="+ task" />
    </div>
  )
}
