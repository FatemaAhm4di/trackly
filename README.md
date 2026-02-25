# Trackly - Tracker Dashboard

A modern, responsive goal tracking application built with React, Vite, and Material UI.

## 🚀 Features

### Core Features
- ✅ Create, Read, Update, Delete (CRUD) goals
- ✅ Track progress with daily logs
- ✅ Multiple goal types (Daily, Count-based, Time-based)
- ✅ Category management (8 categories)
- ✅ Progress bars and visual indicators
- ✅ Streak system for consecutive days
- ✅ XP/Gamification system
- ✅ Archive completed goals

### UI/UX
- ✅ Fully responsive (Mobile, Tablet, Desktop)
- ✅ RTL/LTR support (English, Persian, Pashto)
- ✅ Light/Dark theme toggle
- ✅ Professional animations and hover effects
- ✅ Custom color scheme (#368ac7, #0e5488)
- ✅ Icon-based navigation (no emojis)
- ✅ Professional notifications (Snackbar)

### Pages
- / or /dashboard - Main dashboard with stats
- /goals - All goals list with filters
- /goals/new - Create new goal
- /goals/:id - Goal details and progress history
- /categories - Category overview
- /settings - Language and theme settings
- * - 404 Not Found page

## 🛠 Tech Stack

- React 19 - UI Library
- Vite 6 - Build Tool
- Material UI 7 - UI Components
- React Router 7 - Routing
- LocalStorage - Data Persistence

## 📁 Project Structure

trackly/

├── public/

├── src/

│ ├── components/

│ │ ├── goals/

│ │ │ ├── GoalCard.jsx

│ │ │ ├── GoalFilters.jsx

│ │ │ └── GoalList.jsx

│ │ ├── layout/

│ │ │ ├── Navbar.jsx

│ │ │ └── Layout.jsx

│ │ └── ui/

│ │ ├── Button.jsx

│ │ ├── Card.jsx

│ │ ├── Chip.jsx

│ │ ├── Dialog.jsx

│ │ ├── Icon.jsx

│ │ ├── Input.jsx

│ │ ├── ProgressBar.jsx

│ │ ├── Snackbar.jsx

│ │ └── Typography.jsx

│ ├── contexts/

│ │ ├── LanguageContext.jsx

│ │ └── LanguageContext.js

│ │ └── ThemeContext.jsx

│ │ └── ThemeContext.js

│ ├── hooks/

│ │ ├── useLocalStorage.js

│ │ └── useNotification.js

│ │ └── useLanguage.js

│ │ └── useThemeContext.js

│ ├── i18n/

│ │ ├── en.json

│ │ ├── fa.json

│ │ └── ps.json

│ ├── pages/

│ │ ├── Categories.jsx

│ │ ├── CreateGoal.jsx

│ │ ├── Dashboard.jsx

│ │ ├── GoalDetail.jsx

│ │ ├── Goals.jsx

│ │ ├── NotFound.jsx

│ │ └── Settings.jsx

│ ├── services/

│ │ └── goalService.js

│ ├── theme/

│ │ └── theme.js

│ ├── App.jsx

│ └── main.jsx

├── index.html

├── package.json

├── vite.config.js

└── README.md
## 🏃 How to Run

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd trackly

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
# Preview production build
npm run preview
http://localhost:3000
```
🌐 Language & RTL/LTR

Supported Languages

English (EN) - LTR

Persian (FA) - RTL

Pashto (PS) - RTL

How RTL/LTR Works

Language selection automatically changes layout direction
English → LTR (Left to Right)

Persian/Pashto → RTL (Right to Left)

All components adapt to direction change
Navbar, cards, forms all respond to direction
Changing Language
Go to Settings page

Select language from dropdown

Or use language toggle button in Navbar

📊 Streak System Rules

How Streak Works

Streak counts consecutive days of progress

Daily goals: Log progress each day to maintain streak

If you miss a day, streak resets to 0

Streak is calculated per goal and averaged on dashboard

Example:

Day 1: Log progress → Streak: 1

Day 2: Log progress → Streak: 2

Day 3: No log → Streak: 0 (reset)

Day 4: Log progress → Streak: 1 (restart)


🎮 XP/Gamification Rules

XP Earning

Log Progress: +20 XP per entry

Complete Goal: +50 XP bonus

XP Display: Shown on dashboard and goal details

Example:

Goal Target: 30 days

Daily Log: 20 XP × 30 = 600 XP

Completion Bonus: 50 XP

Total: 650 XP

🎨 Color Scheme

Primary Colors

Primary Light: #5aa5d9

Primary Main: #368ac7

Primary Dark: #0e5488

Semantic Colors

Success: #4caf50 (Green)

Warning: #ff9800 (Orange)

Error: #f44336 (Red)

Background Colors

Light Mode: #f5f7fa

Dark Mode: #121212

📱 Responsive Breakpoints

Device Width Navbar Mobile

< 768px Icons only (drawer)

Tablet 768px - 1024px

Icons + Text Desktop > 1024px Icons + Text

✅ Features Checklist

Routing (20 pts)

Dashboard page

Goals list page

Create goal page

Goal detail page

Categories page

Settings page

404 page

CRUD + Persistence (20 pts)

Create goal

Read/list goals

Update goal

Delete goal

LocalStorage persistence

Progress Tracking (15 pts)

Add progress entry

Auto-calculate progress %

Mark as completed

Progress history log

RTL/LTR (20 pts)

3+ languages

Direction changes with language

UI adapts to direction

No broken layouts

UI/UX + Responsive (15 pts)

Clean modern design

Responsive all devices

Progress bars

Cards with hover effects

Empty states

Professional notifications

Code Quality (10 pts)

Component structure
Folder organization

Code reusability

No console errors

📸 Screenshots

