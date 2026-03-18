import { Box, Card, CardContent, Typography } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../../hooks/useLanguage';
import { prepareCategoryData } from '../../utils/chartUtils';

export default function CategoryChart({ goals }) {
  const { t, direction } = useLanguage();
  const data = prepareCategoryData(goals);

  const getTranslatedCategory = (categoryKey) => {
    const translation = t(`categories_list.${categoryKey}`);
    if (!translation || translation === `categories_list.${categoryKey}`) {
      return categoryKey;
    }
    return translation;
  };

  const translatedData = data.map(item => ({
    ...item,
    displayName: getTranslatedCategory(item.name)
  }));

  return (
    <Card sx={{ height: '100%', width: '100%' }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 }, '&:last-child': { pb: { xs: 2, sm: 3 } } }}>
        <Typography 
          variant="h6" 
          fontWeight="600" 
          gutterBottom 
          sx={{ 
            mb: { xs: 2, sm: 3 },
            textAlign: direction === 'rtl' ? 'right' : 'left',
            fontSize: { xs: '1.1rem', sm: '1.25rem' }
          }}
        >
          {t('charts.categoryDistribution')}
        </Typography>
        
        <Box sx={{ 
          width: '100%', 
          height: { xs: 280, sm: 300 }, 
          display: 'flex', 
          justifyContent: 'center', 
          mb: { xs: 2, sm: 3 } 
        }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
              <Pie
                data={translatedData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                outerRadius={{ xs: 90, sm: 110 }}
                innerRadius={{ xs: 35, sm: 45 }}
                fill="#8884d8"
                dataKey="value"
                paddingAngle={0}
                nameKey="displayName"
              >
                {translatedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name, props) => {
                  return [`${value} ${t('common.goal')}${value > 1 ? 's' : ''}`, props.payload.displayName];
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: { xs: 1.5, sm: 2 }, 
          justifyContent: 'center',
          mt: { xs: 2, sm: 3 },
          pt: { xs: 1.5, sm: 2 },
          borderTop: '2px solid',
          borderColor: 'divider'
        }}>
          {translatedData.map((item) => (
            <Box 
              key={item.name}
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: { xs: 0.75, sm: 1 },
                px: { xs: 1.5, sm: 2 },
                py: { xs: 0.75, sm: 1 },
                borderRadius: 3,
                bgcolor: `${item.color}15`,
                flexDirection: direction === 'rtl' ? 'row-reverse' : 'row'
              }}
            >
              <Box sx={{ width: { xs: 10, sm: 12 }, height: { xs: 10, sm: 12 }, borderRadius: '50%', bgcolor: item.color }} />
              <Typography variant={{ xs: 'body2', sm: 'body2' }} fontWeight="500" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                {item.displayName}: {item.value}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}