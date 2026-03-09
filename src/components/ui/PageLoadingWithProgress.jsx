import { Box, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import CircularProgressWithLabel from './CircularProgressWithLabel'

export default function PageLoadingWithProgress() {
  const { t } = useLanguage()  // ❌ language رو برداشتم
  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState('')

  useEffect(() => {
    // شبیه‌سازی پیشرفت لودینگ
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 100
        }
        const diff = Math.random() * 15
        return Math.min(oldProgress + diff, 100)
      })
    }, 200)

    // متن‌های مختلف برای لودینگ (با پشتیبانی از چندزبانه)
    const texts = [
      t('loading.preparing') || 'Preparing your dashboard...',
      t('loading.loadingGoals') || 'Loading your goals...',
      t('loading.almostThere') || 'Almost there...',
      t('loading.ready') || 'Ready!'
    ]
    
    let textIndex = 0
    const textTimer = setInterval(() => {
      textIndex = (textIndex + 1) % texts.length
      setLoadingText(texts[textIndex])
    }, 1000)

    return () => {
      clearInterval(timer)
      clearInterval(textTimer)
    }
  }, [t])

  // وقتی به ۱۰۰٪ رسید، کمی مکث کن
  useEffect(() => {
    if (progress === 100) {
      const timer = setTimeout(() => {
        // اینجا می‌تونی setLoading(false) رو صدا بزنی
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [progress])

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      gap: 4,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }}>
      <CircularProgressWithLabel value={progress} size={150} />
      
      <Typography 
        variant="h6" 
        sx={{ 
          color: 'white', 
          animation: 'pulse 1.5s ease-in-out infinite',
          fontWeight: 400,
          textAlign: 'center',
          px: 2
        }}
      >
        {loadingText}
      </Typography>
      
      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
        {t('loading.pleaseWait') || 'Please wait...'}
      </Typography>
      
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(0.98); }
          }
        `}
      </style>
    </Box>
  )
}