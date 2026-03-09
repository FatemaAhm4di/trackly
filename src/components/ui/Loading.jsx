// components/ui/Loading.jsx
import { Box, CircularProgress, Skeleton } from '@mui/material'
import Typography from './Typography'
import PageLoadingWithProgress from './PageLoadingWithProgress'  // ✅ این خط رو اضافه کن

// لودینگ صفحه کامل با درصد (جدید)
export function PageLoading() {
  return <PageLoadingWithProgress />  // ✅ این خط رو عوض کن
}

// لودینگ برای کارت‌ها
export function CardLoading() {
  return (
    <Box sx={{ p: 3 }}>
      <Skeleton variant="text" height={40} />
      <Skeleton variant="rectangular" height={100} sx={{ my: 2 }} />
      <Skeleton variant="rounded" height={60} />
    </Box>
  )
}

// لودینگ برای دکمه
export function ButtonLoading() {
  return <CircularProgress size={24} thickness={4} />
}