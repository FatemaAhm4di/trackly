import { Box, Grid, Card, CardContent, alpha } from '@mui/material'
import { useLanguage } from '../hooks/useLanguage'
import { useGoalService } from '../services/goalService'
import Typography from '../components/ui/Typography'
import Icon from '../components/ui/Icon'

export default function Categories() {
  const { t } = useLanguage()
  const { goals, getGoalsByCategory } = useGoalService()
const CATEGORIES = [
  { key: 'health', icon: 'Favorite' },
  { key: 'study', icon: 'School' },
  { key: 'work', icon: 'Work' },
  { key: 'personal', icon: 'Person' },
  { key: 'fitness', icon: 'FitnessCenter' },
  { key: 'finance', icon: 'AttachMoney' },
  { key: 'creative', icon: 'Palette' },
  { key: 'social', icon: 'People' },
  { key: 'spiritual', icon: 'SelfImprovement' },
  { key: 'learning', icon: 'MenuBook' },
  { key: 'career', icon: 'TrendingUp' },
  { key: 'relationships', icon: 'FavoriteBorder' }
]
  const getCategoryStats = (categoryKey) => {
    const categoryGoals = getGoalsByCategory(categoryKey)
    const active = categoryGoals.filter(g => g.status === 'active').length
    const completed = categoryGoals.filter(g => g.status === 'completed').length
    const total = categoryGoals.length
    
    return { active, completed, total }
  }

  return (
    <Box sx={{ py: 4 }}>
      {/* عنوان وسط‌چین */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" fontWeight="800" gutterBottom sx={{ letterSpacing: '-1px' }}>
          {t('categories.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Overview of your goals across different areas
        </Typography>
      </Box>

      {/* 
         چیدمان ۱۰ کارته:
         - lg={3}: هر ردیف حداکثر ۴ کارت جا می‌دهد.
         - ۱۰ کارت یعنی: ۴ تا ردیف اول، ۴ تا ردیف دوم، ۲ تا ردیف سوم.
         - justifyContent="center": باعث می‌شود آن ۲ تای آخر دقیقاً بیفتند زیرِ فضای خالی وسط.
      */}
      <Grid container spacing={2}>
  {CATEGORIES.map((category) => {
    const stats = getCategoryStats(category.key)
    const progress = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0

    return (
      <Grid
        item
        xs={12}
        sm={6}
        md={4}
        sx={{
          flexBasis: { lg: '20%' },
          maxWidth: { lg: '20%' }
        }}
        key={category.key}
      >
              <Card 
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  p: 2,
                  border: 1,
                  borderColor: 'divider',
                  maxWidth: '350px',
                  mx: 'auto',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                    borderColor: 'primary.main',
                    '& .category-icon-box': {
                      bgcolor: 'primary.main',
                      color: 'white',
                      transform: 'scale(1.1) rotate(5deg)'
                    }
                  },
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                  
                  <Box 
                    className="category-icon-box"
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: '20px',
                      bgcolor: alpha('#0966a8', 0.1),
                      color: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2.5,
                      transition: 'all 0.4s ease',
                      boxShadow: '0 4px 12px rgba(9, 102, 168, 0.15)'
                    }}
                  >
                    <Icon name={category.icon} size={32} />
                  </Box>

                  <Typography variant="h6" fontWeight="700" gutterBottom sx={{ mb: 3, minHeight: '44px' }}>
                    {t(`categories_list.${category.key}`) !== `categories_list.${category.key}` 
                      ? t(`categories_list.${category.key}`) 
                      : category.key.charAt(0).toUpperCase() + category.key.slice(1)}
                  </Typography>

                  <Box sx={{ width: '100%', spaceY: 1.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, px: 2, borderRadius: 2, bgcolor: 'background.default', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary" fontWeight="500">
                        {t('categories.activeGoals')}
                      </Typography>
                      <Typography variant="body1" fontWeight="700" color="text.primary">{stats.active}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, px: 2, borderRadius: 2, bgcolor: 'background.default', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary" fontWeight="500">
                        {t('categories.completedGoals')}
                      </Typography>
                      <Typography variant="body1" fontWeight="700" color="success.main">{stats.completed}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, px: 2, borderRadius: 2, bgcolor: 'background.default' }}>
                      <Typography variant="body2" color="text.secondary" fontWeight="500">
                        {t('categories.totalGoals')}
                      </Typography>
                      <Typography variant="body1" fontWeight="800" color="primary.main">{stats.total}</Typography>
                    </Box>
                  </Box>

                  {stats.total > 0 && (
                    <Box sx={{ width: '100%', mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="caption" fontWeight="600" color="text.secondary">
                          {t('categories.progress')}
                        </Typography>
                        <Typography variant="caption" fontWeight="700" color="primary.main">{Math.round(progress)}%</Typography>
                      </Box>
                      <Box sx={{ width: '100%', height: 6, bgcolor: 'action.hover', borderRadius: 3, overflow: 'hidden' }}>
                        <Box sx={{ height: '100%', width: `${progress}%`, bgcolor: 'success.main', transition: 'width 1s ease-in-out', borderRadius: 3 }} />
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      {goals.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <Box sx={{ width: 80, height: 80, mx: 'auto', mb: 2, borderRadius: '50%', bgcolor: 'action.hover', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="Inbox" size={40} color="text.disabled" />
          </Box>
          <Typography variant="h6" color="text.secondary">
            {t('categories.noCategories')}
          </Typography>
        </Box>
      )}
    </Box>
  )
}