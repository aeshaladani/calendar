# Wall Calendar v2 - Plan Artfully

A physical wall-calendar-inspired productivity app with **Month**, **Week**, and **Day** views, drag-and-drop tasks, meal planning, water tracking, theme switching, and page-flip animations.

## Features

### Month View
- Wall calendar aesthetic - spiral binding, hero photo per month, animated diagonal shapes
- Day range selector - click start day, click end day; distinct visual states for start / end / in-range
- Holiday markers with tooltips (14 common holidays)
- Per-month notes panel + per-day note attached to selected range start
- Dot indicators: blue = task exists, amber = note exists, red = holiday
- Page-flip animation on month navigation (slide left / right)
- 5 live colour themes (Ocean, Sunset, Forest, Twilight, Rose)

### Week View
- 7-column weekly planner (scrolls horizontally on small screens)
- Quick inline task entry per day - press Enter to add
- Task completion checkboxes
- **Drag tasks between days** (HTML5 drag-and-drop)
- Meal slots per day (Breakfast / Lunch / Dinner) - **drag meals between days**
- Per-day inline notes
- Today column highlighted with accent ring

### Day View - Master Your Day
- Animated circular progress ring showing % tasks complete
- **Drag-and-drop task reordering** within the day
- **Priority levels** (High / Normal / Low) per task - colour-coded border; sorts by priority
- Task completion with animated strikethrough
- Delete tasks with hover-reveal ✕ button
- **Water intake tracker** - 8-glass goal, animated fill bar, motivational message
- Animated glass icons - click to add / remove
- **Full meal planner** (Breakfast / Lunch / Dinner / Snack) with text input
- Daily free-text note

### Cross-View
- All data persisted to `localStorage` - zero data loss on refresh
- Responsive: side-by-side on desktop, stacked on mobile (≤ 640 px)
- Keyboard accessible (tab + Enter on all interactive elements)

---

## Project Structure

```
wall-calendar-v2/
├── index.html                        # Vite entry + Google Fonts
├── vite.config.js
├── package.json
├── .gitignore
├── README.md
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── styles/
    │   └── global.css                # CSS variables, resets, all keyframe animations
    ├── utils/
    │   ├── constants.js              # MONTHS, THEMES, HOLIDAYS, HERO_IMAGES, MEAL_SLOTS
    │   ├── dateUtils.js              # Pure date helpers
    │   └── storage.js                # localStorage load/save helpers
    ├── hooks/
    │   ├── useCalendar.js            # Month nav, range selection, notes state
    │   ├── useTheme.js               # Theme index + CSS variable sync
    │   ├── useTasks.js               # CRUD + reorder + move across days
    │   ├── useMeals.js               # Meal CRUD + move across days
    │   └── useWater.js               # Water intake per day
    └── components/
        ├── WallCalendar.jsx/css      # Root: wires all hooks + views
        ├── HeroSection.jsx/css       # Hero photo + month title + nav arrows
        ├── Spiral.jsx/css            # Decorative binding coils
        ├── ViewTabs.jsx/css          # Month / Week / Day tab switcher
        ├── Toolbar.jsx/css           # Theme switcher + clear selection
        ├── CalendarGrid.jsx/css      # Monthly day grid with all range states
        ├── NotesPanel.jsx/css        # Month notepad + range badge + day note
        ├── WeekView.jsx/css          # 7-column week planner with drag
        └── DayView.jsx/css           # Day detail: tasks, water, meals, note
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Run Locally

```bash
cd wall-calendar-v2
npm install
npm run dev
# Open http://localhost:5173
```

### Build for Production

```bash
npm run build
npm run preview
```

---

## Animations

| Animation | Trigger |
|-----------|---------|
| `flipIn` (rotateX) | Month card on prev/next navigation |
| `slideInLeft/Right` | Month grid direction-aware slide |
| `fadeUp` (staggered) | Week view columns on render |
| `popIn` (spring bounce) | Water glass icons |
| `strikeThrough` | Task completion |
| Circular progress ring | SVG stroke-dasharray transition |
| Water bar fill | CSS width transition with spring easing |

---

## Customisation

### Swap hero images
Edit `HERO_IMAGES` in `src/utils/constants.js` (one URL per month, index 0–11).

### Add holidays
Edit `HOLIDAYS` in `src/utils/constants.js` — keys are `"month-day"` (no leading zeros):
```js
'8-15': 'Independence Day',
```

### Change water goal
Edit `WATER_GOAL` in `src/utils/constants.js` (default: 8).

### Add a theme
Append to `THEMES` array in `src/utils/constants.js`:
```js
{ name:'Desert', accent:'#c08030', accentLight:'#fdf3e3', accentMid:'#e8a855',
  accentDark:'#7a4a10', gradA:'#e8a855', gradB:'#b06020', dot:'#e8a855' }
```

---

## Deploy

```bash
# Vercel
npm i -g vercel && vercel --prod

# Netlify — drag /dist folder to app.netlify.com/drop after:
npm run build
```
