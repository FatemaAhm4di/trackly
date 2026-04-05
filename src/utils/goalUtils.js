export const getTypeLabel = (type, t) => {
  switch (type) {
    case 'daily': return t('common.days') || 'days'
    case 'count': return t('common.sessions') || 'sessions'
    case 'time': return t('common.minutes') || 'minutes'
    default: return ''
  }
}

export const getCategoryLabel = (category, t) => {
  return t(`categories.${category}`) || category || 'Other'
}

export const getStatusColor = (status) => {
  switch (status) {
    case 'completed': return 'success'
    case 'paused': return 'warning'
    default: return 'primary'
  }
}

export const calculateProgressPercent = (progress, target) => {
  if (!target || target === 0) return 0
  return (progress / target) * 100
}