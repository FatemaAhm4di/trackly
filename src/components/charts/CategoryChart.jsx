import { Box, Card, CardContent, Typography, useMediaQuery, useTheme } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../../hooks/useLanguage';

export default function CategoryChart({ goals }) {
  const { t, direction } = useLanguage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  // سایزهای داینامیک برای موبایل - بزرگتر و واضح‌تر
  const getDynamicSizes = () => {
    if (isMobile) {
      return { chartHeight: 280, outerRadius: 100, innerRadius: 50 };
    }
    if (isTablet) {
      return { chartHeight: 300, outerRadius: 110, innerRadius: 55 };
    }
    return { chartHeight: 320, outerRadius: 120, innerRadius: 60 };
  };
  
  const { chartHeight, outerRadius, innerRadius } = getDynamicSizes();
  
  // فونت‌های مناسب موبایل
  const getFontSize = () => {
    if (isMobile) return '13px';
    if (isTablet) return '14px';
    return '15px';
  };
  
  // محاسبه داده‌ها
  const prepareCategoryData = (goalsList) => {
    if (!goalsList || goalsList.length === 0) return [];
    
    const categoryMap = new Map();
    
    goalsList.forEach(goal => {
      const category = goal.category || 'other';
      const progress = goal.target > 0 ? (goal.progress / goal.target) * 100 : 0;
      
      if (!categoryMap.has(category)) {
        categoryMap.set(category, {
          name: category,
          value: 0,
          totalProgress: 0,
          count: 0
        });
      }
      
      const catData = categoryMap.get(category);
      catData.totalProgress += progress;
      catData.count += 1;
      catData.value = catData.totalProgress / catData.count;
    });
    
    const COLORS = {
      education: '#278de0',
      creative: '#9c27b0',
      mental: '#1b781e',
      career: '#c97b06',
      health: '#f44336',
      fitness: '#00bcd4',
      finance: '#ffc107',
      productivity: '#26389f',
      social: '#e91e63',
      family: '#8bc34a',
      travel: '#04544c',
      spiritual: '#673ab7',
      other: '#9e9e9e'
    };
    
    return Array.from(categoryMap.values()).map(cat => ({
      name: cat.name,
      value: Math.round(cat.value),
      color: COLORS[cat.name] || COLORS.other
    })).filter(cat => cat.value > 0);
  };
  
  const data = prepareCategoryData(goals);

  const getTranslatedCategory = (categoryKey) => {
    const translation = t(`categories_list.${categoryKey}`);
    if (!translation || translation === `categories_list.${categoryKey}`) {
      return categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1);
    }
    return translation;
  };

  const translatedData = data.map(item => ({
    ...item,
    name: getTranslatedCategory(item.name)
  }));

  if (translatedData.length === 0) {
    return (
      <Card sx={{ height: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <CardContent>
          <Typography variant="h6" fontWeight="600" gutterBottom>
            {t('charts.categoryDistribution') || 'Goals by Category'}
          </Typography>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              {t('charts.noCategoryData') || 'No goals data available'}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  const sortedData = [...translatedData].sort((a, b) => b.value - a.value);

  return (
    <Card sx={{ 
      height: '100%', 
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      transition: 'all 0.3s ease',
      '&:hover': { boxShadow: '0 6px 20px rgba(0,0,0,0.1)' }
    }}>
      <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
        <Typography 
          variant="h6" 
          fontWeight="600" 
          gutterBottom 
          sx={{ 
            mb: { xs: 2, sm: 2.5 },
            textAlign: direction === 'rtl' ? 'right' : 'left'
          }}
        >
          {t('charts.categoryDistribution') || 'Goals by Category'}
        </Typography>
        
        {/* چارت دایره‌ای بزرگ و واضح */}
        <Box sx={{ 
          width: '100%', 
          height: chartHeight, 
          display: 'flex', 
          justifyContent: 'center',
          alignItems: 'center',
          my: { xs: 1, sm: 2 }
        }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sortedData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ value }) => `${Math.round(value)}%`}
                outerRadius={outerRadius}
                innerRadius={innerRadius}
                dataKey="value"
                paddingAngle={2}
                labelStyle={{
                  fontSize: isMobile ? '12px' : '13px',
                  fontWeight: 600,
                  fill: theme.palette.text.primary
                }}
                animationBegin={0}
                animationDuration={800}
              >
                {sortedData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    stroke={theme.palette.background.paper}
                    strokeWidth={2} 
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => `${Math.round(value)}%`}
                contentStyle={{ 
                  borderRadius: 8, 
                  fontSize: getFontSize(),
                  backgroundColor: theme.palette.background.paper,
                  border: 'none',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        {/* لیست دسته‌بندی‌ها به صورت ستونی و مرتب */}
        <Box sx={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          mt: 2,
          pt: 2,
          borderTop: '1px solid',
          borderColor: 'divider'
        }}>
          {sortedData.map((item) => (
            <Box 
              key={item.name}
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                py: 0.75,
                px: 1,
                borderRadius: 2,
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: `${item.color}10`,
                  transform: 'translateX(4px)'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box 
                  sx={{ 
                    width: 14, 
                    height: 14, 
                    borderRadius: '50%', 
                    bgcolor: item.color,
                    boxShadow: `0 0 0 2px ${item.color}20`
                  }} 
                />
                <Typography variant="body2" sx={{ fontSize: getFontSize(), fontWeight: 500 }}>
                  {item.name}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 60 }}>
                <Box sx={{ 
                  flex: 1, 
                  width: 80, 
                  height: 6, 
                  bgcolor: `${item.color}20`, 
                  borderRadius: 3,
                  overflow: 'hidden'
                }}>
                  <Box sx={{ 
                    width: `${item.value}%`, 
                    height: '100%', 
                    bgcolor: item.color,
                    borderRadius: 3
                  }} />
                </Box>
                <Typography 
                  variant="body2" 
                  fontWeight="700" 
                  sx={{ 
                    fontSize: getFontSize(),
                    color: item.color,
                    minWidth: 45,
                    textAlign: 'right'
                  }}
                >
                  {Math.round(item.value)}%
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}