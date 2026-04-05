export const formatDate = (dateString) => {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`
  } catch {
    return '-'
  }
}

export const subDays = (date, days) => {
  const result = new Date(date)
  result.setDate(result.getDate() - days)
  return result
}