import { Box, Grid, Card, CardContent } from '@mui/material'
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
    { key: 'social', icon: 'People' }
  ]

  const getCategoryStats = (categoryKey) => {
    const categoryGoals = getGoalsByCategory(categoryKey)
    const active = categoryGoals.filter(g => g.status === 'active').length
    const completed = categoryGoals.filter(g => g.status === 'completed').length
    const total = categoryGoals.length
    
    return { active, completed, total }
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="700" gutterBottom>
          {t('categories.title')}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {CATEGORIES.map((category) => {
          const stats = getCategoryStats(category.key)
          
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={category.key}>
              <Card 
                sx={{
                  height: '100%',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box 
                      sx={{ 
                        p: 2, 
                        backgroundColor: 'primary.light',
                        borderRadius: 3
                      }}
                    >
                      <Icon name={category.icon} size={32} color="primary" />
                    </Box>
                    <Typography variant="h6" fontWeight="600">
                      {t(`categories_list.${category.key}`)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {t('categories.activeGoals')}
                    </Typography>
                    <Typography variant="body1" fontWeight="600" color="primary">
                      {stats.active}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {t('categories.completedGoals')}
                    </Typography>
                    <Typography variant="body1" fontWeight="600" color="success">
                      {stats.completed}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      {t('categories.totalGoals')}
                    </Typography>
                    <Typography variant="body1" fontWeight="700">
                      {stats.total}
                    </Typography>
                  </Box>

                  {stats.total > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Box 
                        sx={{ 
                          height: 6, 
                          backgroundColor: 'rgba(54, 138, 199, 0.1)',
                          borderRadius: 3,
                          overflow: 'hidden'
                        }}
                      >
                        <Box 
                          sx={{ 
                            height: '100%',
                            width: `${(stats.completed / stats.total) * 100}%`,
                            backgroundColor: 'success.main',
                            transition: 'width 0.5s ease'
                          }}
                        />
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
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Icon name="Inbox" size={64} color="text.disabled" sx={{ mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            {t('categories.noCategories')}
          </Typography>
        </Box>
      )}
    </Box>
  )
}