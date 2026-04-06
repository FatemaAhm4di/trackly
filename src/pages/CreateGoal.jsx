import { useState } from 'react'
import { Box, Grid } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage' 
import { useGoalService } from '../services/goalService'
import { useToast } from '../hooks/useToast'
import { getTypeLabel } from '../utils/goalUtils'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Typography from '../components/ui/Typography'
import Icon from '../components/ui/Icon'
import { ButtonLoading } from '../components/ui/Loading'

const COLORS = ['#368ac7', '#0e5488', '#4caf50', '#ff9800', '#f44336', '#9c27b0', '#e91e63', '#00bcd4']
const CATEGORIES = ['education', 'creative', 'mental', 'career', 'health', 'fitness', 'finance', 'productivity', 'social', 'family', 'travel', 'spiritual']

export default function CreateGoal() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { t } = useLanguage()
  const { createGoal, updateGoal, getGoalById } = useGoalService()
  const { showToast } = useToast()
  
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
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.title.trim()) newErrors.title = t('validation.required')
    if (!formData.category) newErrors.category = t('validation.required')
    if (!formData.type) newErrors.type = t('validation.required')
    if (!formData.target || formData.target <= 0) newErrors.target = t('validation.positiveNumber')
    if (!formData.startDate) newErrors.startDate = t('validation.invalidDate')
    if (formData.endDate && formData.endDate < formData.startDate) newErrors.endDate = t('validation.endDateAfterStart')
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) {
      showToast({ title: '⚠️ Validation Error', message: 'Please check the form and fix the errors.', type: 'warning' })
      return
    }
    setIsSubmitting(true)
    try {
      const preparedData = { ...formData, category: formData.category.toLowerCase().trim(), target: Number(formData.target), endDate: formData.endDate || null }
      if (isEdit && existingGoal) {
        updateGoal(id, preparedData)
        showToast({ title: '✏️ Goal Updated!', message: `"${formData.title}" has been updated successfully.`, type: 'success' })
      } else {
        createGoal(preparedData)
        showToast({ title: '🎯 Goal Created!', message: `"${formData.title}" has been added to your goals.`, type: 'success' })
      }
      setTimeout(() => navigate('/goals'), 500)
    } catch (error) {
      console.error('Error saving goal:', error)
      showToast({ title: '❌ Failed', message: error.message || 'Could not save goal. Please try again.', type: 'error' })
      setIsSubmitting(false)
    }
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Button variant="text" startIcon={<Icon name="ArrowBack" size={20} />} onClick={() => navigate('/goals')} sx={{ mb: 2 }}>{t('goalDetail.back')}</Button>
        <Typography variant="h4" fontWeight="700">{isEdit ? t('createGoal.editTitle') : t('createGoal.title')}</Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Input label={t('createGoal.goalTitle')} value={formData.title} onChange={(e) => handleChange('title', e.target.value)} placeholder={t('createGoal.titlePlaceholder')} required error={Boolean(errors.title)} helperText={errors.title} fullWidth sx={{ mb: 3 }} disabled={isSubmitting} />

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Input label={t('createGoal.category')} value={formData.category} onChange={(e) => handleChange('category', e.target.value)} select SelectProps={{ native: true }} InputLabelProps={{ shrink: true }} required error={Boolean(errors.category)} helperText={errors.category} fullWidth sx={{ mb: 3 }} disabled={isSubmitting}>
                  <option value="">{t('createGoal.selectCategory')}</option>
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{t(`categories_list.${cat}`) !== `categories_list.${cat}` ? t(`categories_list.${cat}`) : cat.charAt(0).toUpperCase() + cat.slice(1)}</option>)}
                </Input>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Input label={t('createGoal.goalType')} value={formData.type} onChange={(e) => handleChange('type', e.target.value)} select SelectProps={{ native: true }} InputLabelProps={{ shrink: true }} required error={Boolean(errors.type)} helperText={errors.type} fullWidth sx={{ mb: 3 }} disabled={isSubmitting}>
                  <option value="">{t('createGoal.selectType')}</option>
                  <option value="daily">{t('createGoal.daily')}</option>
                  <option value="count">{t('createGoal.count')}</option>
                  <option value="time">{t('createGoal.time')}</option>
                </Input>
              </Grid>
            </Grid>

            <Input label={`${t('createGoal.target')} (${getTypeLabel(formData.type, t)})`} value={formData.target} onChange={(e) => handleChange('target', e.target.value)} type="number" placeholder={t('createGoal.targetPlaceholder')} required error={Boolean(errors.target)} helperText={errors.target} fullWidth sx={{ mb: 3 }} inputProps={{ min: 1 }} disabled={isSubmitting} />

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}><Input label={t('createGoal.startDate')} value={formData.startDate} onChange={(e) => handleChange('startDate', e.target.value)} type="date" required error={Boolean(errors.startDate)} helperText={errors.startDate} fullWidth sx={{ mb: 3 }} InputLabelProps={{ shrink: true }} disabled={isSubmitting} /></Grid>
              <Grid item xs={12} sm={6}><Input label={t('createGoal.endDate')} value={formData.endDate} onChange={(e) => handleChange('endDate', e.target.value)} type="date" error={Boolean(errors.endDate)} helperText={errors.endDate} fullWidth sx={{ mb: 3 }} InputLabelProps={{ shrink: true }} disabled={isSubmitting} /></Grid>
            </Grid>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>{t('createGoal.color')}</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {COLORS.map(color => (
                  <Box key={color} onClick={() => !isSubmitting && handleChange('color', color)} sx={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: color, cursor: isSubmitting ? 'not-allowed' : 'pointer', border: formData.color === color ? '3px solid text.primary' : '2px solid transparent', transition: 'all 0.2s ease', opacity: isSubmitting ? 0.5 : 1, '&:hover': { transform: isSubmitting ? 'none' : 'scale(1.1)' } }} />
                ))}
              </Box>
            </Box>

            <Input label={t('createGoal.notes')} value={formData.notes} onChange={(e) => handleChange('notes', e.target.value)} placeholder={t('createGoal.notesPlaceholder')} multiline rows={4} fullWidth sx={{ mb: 3 }} disabled={isSubmitting} />
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 3, position: 'sticky', top: 100 }}>
              <Typography variant="h6" fontWeight="600" gutterBottom>{isEdit ? t('createGoal.update') : t('createGoal.create')}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>{isEdit ? "Update your goal details below." : "Fill in all the details to create your new goal. Make sure to set realistic targets!"}</Typography>
              <Button type="submit" variant="contained" color="primary" fullWidth disabled={isSubmitting} startIcon={isSubmitting ? null : <Icon name={isEdit ? 'Save' : 'Add'} size={20} />} sx={{ mb: 2 }}>{isSubmitting ? <ButtonLoading /> : (isEdit ? t('createGoal.update') : t('createGoal.create'))}</Button>
              <Button variant="outlined" color="inherit" fullWidth onClick={() => navigate('/goals')} disabled={isSubmitting}>{t('createGoal.cancel')}</Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}