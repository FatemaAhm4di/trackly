import { Box, Card, CardContent, Typography, useMediaQuery, useTheme } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../../hooks/useLanguage';

export default function CategoryChart({ goals }) {
  const { t, direction } = useLanguage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  // تعیین سایز متن بر اساس دستگاه و زبان
  const getFontSize = () => {
    if (direction === 'en') {
      // انگلیسی: فونت کوچیکتر
      if (isMobile) return '9px';
      if (isTablet) return '10px';
      return '11px';
    } else {
      // فارسی: فونت معمولی
      if (isMobile) return '11px';
      if (isTablet) return '12px';
      return '13px';
    }
  };
  
  const getLabelFontSize = () => {
    if (direction === 'en') {
      if (isMobile) return '8px';
      if (isTablet) return '9px';
      return '10px';
    } else {
      if (isMobile) return '10px';
      if (isTablet) return '11px';
      return '12px';
    }
  };
  
  const getTitleSize = () => {
    if (isMobile) return 'subtitle1';
    return 'h6';
  };
  
  // محاسبه واقعی پیشرفت هر دسته
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
      education: '#2196f3',
      creative: '#9c27b0',
      mental: '#4caf50',
      career: '#ff9800',
      health: '#f44336',
      fitness: '#00bcd4',
      finance: '#ffc107',
      productivity: '#3f51b5',
      social: '#e91e63',
      family: '#8bc34a',
      travel: '#009688',
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
      <Card sx={{ height: '100%', width: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography 
            variant={getTitleSize()} 
            fontWeight="600" 
            gutterBottom 
            sx={{ 
              mb: 2,
              textAlign: direction === 'rtl' ? 'right' : 'left',
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }
            }}
          >
            {t('charts.categoryDistribution') || 'Goals by Category'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
            {t('charts.noCategoryData') || 'No goals data available'}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // سایز چارت بر اساس دستگاه
  const chartHeight = isMobile ? 220 : isTablet ? 260 : 300;

  return (
    <Card 
      sx={{ 
        height: '100%', 
        width: '100%',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        direction: direction,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 }, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography 
          variant={getTitleSize()} 
          fontWeight="600" 
          gutterBottom 
          sx={{ 
            mb: { xs: 2, sm: 3 },
            textAlign: direction === 'rtl' ? 'right' : 'left',
            fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }
          }}
        >
          {t('charts.categoryDistribution') || 'Goals by Category'}
        </Typography>
        
        <Box 
          sx={{ 
            width: '100%', 
            height: chartHeight, 
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'center',
            direction: 'ltr'
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={translatedData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) => {
                  const percentValue = `${Math.round(value)}%`;
                  // در موبایل فقط درصد
                  if (isMobile) {
                    return percentValue;
                  }
                  // در دسکتاپ با نام
                  if (direction === 'en') {
                    return `${name} ${percentValue}`;
                  }
                  return `${percentValue} ${name}`;
                }}
                outerRadius={isMobile ? 65 : isTablet ? 80 : 95}
                innerRadius={isMobile ? 30 : isTablet ? 35 : 45}
                fill="#8884d8"
                dataKey="value"
                paddingAngle={2}
                labelStyle={{
                  fontSize: getLabelFontSize(),
                  fontWeight: 500,
                  fill: theme.palette.text.primary,
                  fontFamily: direction === 'en' ? 'inherit' : 'inherit'
                }}
              >
                {translatedData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    stroke="white" 
                    strokeWidth={2} 
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => `${Math.round(value)}%`}
                contentStyle={{ 
                  borderRadius: 8, 
                  border: 'none', 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  direction: direction,
                  fontSize: getFontSize(),
                  padding: isMobile ? '4px 8px' : '8px 12px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        {/* LEGEND */}
        <Box 
          sx={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 0.75, sm: 1, md: 1.5 }, 
            justifyContent: 'center',
            alignItems: { xs: 'flex-start', sm: 'center' },
            mt: { xs: 2, sm: 2.5 },
            pt: { xs: 1.5, sm: 2 },
            borderTop: '1px solid',
            borderColor: 'divider',
            direction: direction
          }}
        >
          {translatedData.map((item) => (
            <Box 
              key={item.name}
              sx={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: 0.5,
                px: { xs: 0.75, sm: 1 },
                py: { xs: 0.25, sm: 0.5 },
                borderRadius: 1.5,
                bgcolor: `${item.color}10`,
                transition: 'all 0.2s ease',
                flexDirection: direction === 'rtl' ? 'row-reverse' : 'row',
                textAlign: direction === 'rtl' ? 'right' : 'left',
                '&:hover': {
                  bgcolor: `${item.color}20`,
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <Box 
                sx={{ 
                  width: { xs: 8, sm: 10 }, 
                  height: { xs: 8, sm: 10 }, 
                  borderRadius: '50%', 
                  bgcolor: item.color 
                }} 
              />
              <Typography 
                variant="caption" 
                fontWeight="500" 
                sx={{ 
                  fontSize: getFontSize(),
                  lineHeight: 1.2
                }}
              >
                {direction === 'rtl'
                  ? `${Math.round(item.value)}% : ${item.name}`
                  : `${item.name}: ${Math.round(item.value)}%`}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}