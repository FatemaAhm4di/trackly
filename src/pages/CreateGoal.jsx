import { useState } from 'react'
import { Box, Grid } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage' // اصلاح مسیر: فقط یک سطح بالا
import { useGoalService } from '../services/goalService'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Typography from '../components/ui/Typography'
import Icon from '../components/ui/Icon'

const COLORS = [
  '#368ac7', '#0e5488', '#4caf50', '#ff9800', '#f44336', '#9c27b0', '#e91e63', '#00bcd4'
]

export default function CreateGoal() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { t } = useLanguage()
  const { createGoal, updateGoal, getGoalById } = useGoalService()
  
  const isEdit = Boolean(id)
  const existingGoal = isEdit ? getGoalById(id) : null

  const [formData, setFormData] = useState({
    title: existingGoal?.title || '',
    category: existingGoal?.category || '',
    type: existingGoal?.type || 'daily',
    target: existingGoal?.target || '',
    startDate: existingGoal?.startDate || new Date().toISOString().split('T')[0],
    endDate: existingGoal?.endDate || '',
    color: existingGoal?.color || '#368ac7',
    notes: existingGoal?.notes || ''
  })

  const [errors, setErrors] = useState({})

  const CATEGORIES = ['health', 'study', 'work', 'personal', 'fitness', 'finance', 'creative', 'social']
  const GOAL_TYPES = ['daily', 'count', 'time']

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = t('validation.required')
    }
    
    if (!formData.category) {
      newErrors.category = t('validation.required')
    }
    
    if (!formData.type) {
      newErrors.type = t('validation.required')
    }
    
    if (!formData.target || formData.target <= 0) {
      newErrors.target = t('validation.positiveNumber')
    }
    
    if (!formData.startDate) {
      newErrors.startDate = t('validation.invalidDate')
    }
    
    if (formData.endDate && formData.endDate < formData.startDate) {
      newErrors.endDate = t('validation.endDateAfterStart')
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validate()) return

    if (isEdit && existingGoal) {
      updateGoal(id, {
        title: formData.title,
        category: formData.category,
        type: formData.type,
        target: Number(formData.target),
        startDate: formData.startDate,
        endDate: formData.endDate || null,
        color: formData.color,
        notes: formData.notes
      })
    } else {
      createGoal(formData)
    }

    navigate('/goals')
  }

  const getTypeLabel = (type) => {
    switch (type) {
      case 'daily': return t('common.days')
      case 'count': return t('common.sessions')
      case 'time': return t('common.minutes')
      default: return ''
    }
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Button
          variant="text"
          startIcon="ArrowBack"
          onClick={() => navigate('/goals')}
          sx={{ mb: 2 }}
        >
          {t('goalDetail.back')}
        </Button>
        <Typography variant="h4" fontWeight="700">
          {isEdit ? t('createGoal.editTitle') : t('createGoal.title')}
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Input
              label={t('createGoal.goalTitle')}
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder={t('createGoal.titlePlaceholder')}
              required
              error={Boolean(errors.title)}
              helperText={errors.title}
              fullWidth
              sx={{ mb: 3 }}
            />

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Input
                  label={t('createGoal.category')}
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  select
                  SelectProps={{ native: true }}
                  required
                  error={Boolean(errors.category)}
                  helperText={errors.category}
                  fullWidth
                  sx={{ mb: 3 }}
                >
                  <option value="">{t('createGoal.selectCategory')}</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {t(`categories_list.${cat}`)}
                    </option>
                  ))}
                </Input>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Input
                  label={t('createGoal.goalType')}
                  value={formData.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  select
                  SelectProps={{ native: true }}
                  required
                  error={Boolean(errors.type)}
                  helperText={errors.type}
                  fullWidth
                  sx={{ mb: 3 }}
                >
                  <option value="">{t('createGoal.selectType')}</option>
                  <option value="daily">{t('createGoal.daily')}</option>
                  <option value="count">{t('createGoal.count')}</option>
                  <option value="time">{t('createGoal.time')}</option>
                </Input>
              </Grid>
            </Grid>

            <Input
              label={`${t('createGoal.target')} (${getTypeLabel(formData.type)})`}
              value={formData.target}
              onChange={(e) => handleChange('target', e.target.value)}
              type="number"
              placeholder={t('createGoal.targetPlaceholder')}
              required
              error={Boolean(errors.target)}
              helperText={errors.target}
              fullWidth
              sx={{ mb: 3 }}
              inputProps={{ min: 1 }}
            />

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Input
                  label={t('createGoal.startDate')}
                  value={formData.startDate}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                  type="date"
                  required
                  error={Boolean(errors.startDate)}
                  helperText={errors.startDate}
                  fullWidth
                  sx={{ mb: 3 }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Input
                  label={t('createGoal.endDate')}
                  value={formData.endDate}
                  onChange={(e) => handleChange('endDate', e.target.value)}
                  type="date"
                  error={Boolean(errors.endDate)}
                  helperText={errors.endDate}
                  fullWidth
                  sx={{ mb: 3 }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                {t('createGoal.color')}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {COLORS.map((color) => (
                  <Box
                    key={color}
                    onClick={() => handleChange('color', color)}
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      backgroundColor: color,
                      cursor: 'pointer',
                      border: formData.color === color ? '3px solid text.primary' : '2px solid transparent',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'scale(1.1)'
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>

            <Input
              label={t('createGoal.notes')}
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder={t('createGoal.notesPlaceholder')}
              multiline
              rows={4}
              fullWidth
              sx={{ mb: 3 }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Box 
              sx={{ 
                p: 3, 
                backgroundColor: 'background.paper',
                borderRadius: 3,
                position: 'sticky',
                top: 100
              }}
            >
              <Typography variant="h6" fontWeight="600" gutterBottom>
                {isEdit ? 'Update Goal' : 'Create Goal'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Fill in all the details to create your new goal. Make sure to set realistic targets!
              </Typography>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                startIcon={isEdit ? 'Save' : 'Add'}
                sx={{ mb: 2 }}
              >
                {isEdit ? t('createGoal.update') : t('createGoal.create')}
              </Button>

              <Button
                variant="outlined"
                color="inherit"
                fullWidth
                onClick={() => navigate('/goals')}
              >
                {t('createGoal.cancel')}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}