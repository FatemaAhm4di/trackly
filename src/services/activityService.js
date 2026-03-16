import { calculateNewStreak, getToday } from "./streakUtils"

export const registerUserActivity = (userStats, setUserStats) => {
  const today = getToday()

  const newStreak = calculateNewStreak(
    userStats.lastActivityDate,
    userStats.streak
  )

  setUserStats(prev => ({
    ...prev,
    streak: newStreak,
    lastActivityDate: today
  }))
}