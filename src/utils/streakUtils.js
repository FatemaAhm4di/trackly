export const getToday = () => {
  return new Date().toISOString().split('T')[0]
}

export const getYesterday = () => {
  return new Date(Date.now() - 86400000).toISOString().split('T')[0]
}

export const calculateNewStreak = (lastActivityDate, currentStreak) => {
  const today = getToday()
  const yesterday = getYesterday()

  if (!lastActivityDate) {
    return 1
  }

  if (lastActivityDate === yesterday) {
    return (currentStreak || 0) + 1
  }

  if (lastActivityDate === today) {
    return currentStreak || 1
  }

  return 1
}