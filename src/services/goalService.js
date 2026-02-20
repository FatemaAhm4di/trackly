// src/services/goalService.js

const GOALS_KEY = 'trackly_goals';
const XP_KEY = 'trackly_xp';
const STREAK_KEY = 'trackly_streak';

// دریافت اهداف از localStorage
export const getGoals = () => {
  try {
    const data = localStorage.getItem(GOALS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to parse goals:', error);
    return [];
  }
};

// ذخیره اهداف در localStorage
export const saveGoals = (goals) => {
  try {
    localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
  } catch (error) {
    console.error('Failed to save goals:', error);
  }
};

// دریافت XP
export const getXP = () => {
  return parseInt(localStorage.getItem(XP_KEY) || '0', 10);
};

// ذخیره XP
export const saveXP = (xp) => {
  localStorage.setItem(XP_KEY, xp.toString());
};

// دریافت Streak
export const getStreak = () => {
  const streakData = localStorage.getItem(STREAK_KEY);
  if (!streakData) return { count: 0, lastDate: null };
  try {
    return JSON.parse(streakData);
  } catch {
    return { count: 0, lastDate: null };
  }
};

// ذخیره Streak
export const saveStreak = (streak) => {
  localStorage.setItem(STREAK_KEY, JSON.stringify(streak));
};

// محاسبه پیشرفت هدف
export const calculateProgress = (goal) => {
  if (goal.target === 0) return 0;
  const progress = Math.min(100, Math.round((goal.completed / goal.target) * 100));
  return progress;
};

// به‌روزرسانی وضعیت هدف
export const updateGoalStatus = (goal) => {
  const progress = calculateProgress(goal);
  if (progress >= 100) {
    return 'completed';
  }
  return goal.status === 'completed' ? 'active' : goal.status;
};

// ایجاد هدف جدید
export const createGoal = (title, category, target, type = 'daily') => {
  const goals = getGoals();
  const newGoal = {
    id: Date.now(),
    title,
    category,
    target: parseInt(target, 10),
    completed: 0,
    type,
    status: 'active',
    createdAt: new Date().toISOString(),
    lastLogDate: null
  };
  newGoal.progress = calculateProgress(newGoal);
  goals.unshift(newGoal);
  saveGoals(goals);
  return newGoal;
};

// ویرایش هدف
export const updateGoal = (id, updates) => {
  const goals = getGoals();
  const index = goals.findIndex(g => g.id === id);
  if (index === -1) return null;

  goals[index] = { ...goals[index], ...updates };
  goals[index].progress = calculateProgress(goals[index]);
  goals[index].status = updateGoalStatus(goals[index]);
  saveGoals(goals);
  return goals[index];
};

// حذف هدف
export const deleteGoal = (id) => {
  const goals = getGoals().filter(g => g.id !== id);
  saveGoals(goals);
};

// لاگ پیشرفت (برای Streak و XP)
export const logProgress = (id, amount = 1) => {
  const goal = updateGoal(id, { 
    completed: (prev) => (prev.completed || 0) + amount,
    lastLogDate: new Date().toISOString()
  });

  if (goal) {
    // افزایش XP
    const xp = getXP() + 10;
    saveXP(xp);

    // به‌روزرسانی Streak
    const today = new Date().toDateString();
    const streak = getStreak();
    const lastDate = streak.lastDate ? new Date(streak.lastDate).toDateString() : null;

    let newStreak = streak.count;
    if (lastDate === today) {
      // امروز قبلاً لاگ شده
    } else if (lastDate === new Date(Date.now() - 86400000).toDateString()) {
      // دیروز بود → Streak ادامه پیدا می‌کنه
      newStreak = streak.count + 1;
    } else if (streak.count === 0) {
      // اولین روز
      newStreak = 1;
    } else {
      // Streak قطع شده
      newStreak = 1;
    }

    saveStreak({ count: newStreak, lastDate: new Date().toISOString() });
  }

  return goal;
};

// دریافت آمار کلی
export const getStats = () => {
  const goals = getGoals();
  const completedCount = goals.filter(g => g.status === 'completed').length;
  const overallProgress = goals.length 
    ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length)
    : 0;

  return {
    overallProgress,
    completedCount,
    streak: getStreak().count,
    xp: getXP()
  };
};