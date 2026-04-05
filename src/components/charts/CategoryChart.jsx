import { Box, Card, CardContent, Typography, useMediaQuery, useTheme } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../../hooks/useLanguage';

export default function CategoryChart({ goals }) {
  const { t, direction } = useLanguage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isLandscape = useMediaQuery('(orientation: landscape) and (max-height: 600px)');
  
  // سایزهای داینامیک بر اساس وضعیت دستگاه
  const getDynamicSizes = () => {
    if (isLandscape) {
      return { chartHeight: 160, outerRadius: 50, innerRadius: 20, legendColumns: 4 };
    }
    if (isMobile) {
      return { chartHeight: 180, outerRadius: 55, innerRadius: 25, legendColumns: 2 };
    }
    if (isTablet) {
      return { chartHeight: 220, outerRadius: 70, innerRadius: 32, legendColumns: 3 };
    }
    return { chartHeight: 260, outerRadius: 85, innerRadius: 40, legendColumns: 4 };
  };
  
  const { chartHeight, outerRadius, innerRadius, legendColumns } = getDynamicSizes();
  
  // فونت‌های داینامیک
  const getFontSize = () => {
    if (isLandscape) return '9px';
    if (isMobile) return '10px';
    if (isTablet) return '11px';
    return '12px';
  };
  
  const getLabelFontSize = () => {
    if (isLandscape) return '8px';
    if (isMobile) return '9px';
    if (isTablet) return '10px';
    return '11px';
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
            variant="subtitle1" 
            fontWeight="600" 
            gutterBottom 
            sx={{ 
              mb: 2,
              textAlign: direction === 'rtl' ? 'right' : 'left',
              fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' }
            }}
          >
            {t('charts.categoryDistribution') || 'Goals by Category'}
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            py: { xs: 4, sm: 6 },
            flexDirection: 'column',
            gap: 2
          }}>
            <Box sx={{ 
              width: 60, 
              height: 60, 
              borderRadius: '50%', 
              bgcolor: 'action.hover',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Typography variant="h4" color="text.disabled">📊</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
              {t('charts.noCategoryData') || 'No goals data available'}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // تبدیل داده‌ها برای نمایش بهتر
  const sortedData = [...translatedData].sort((a, b) => b.value - a.value);
  
  // محاسبه درصد کل برای نمایش
  const total = sortedData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card 
      sx={{ 
        height: '100%', 
        width: '100%',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        direction: direction,
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 6px 20px rgba(0,0,0,0.1)'
        }
      }}
    >
      <CardContent sx={{ 
        p: { xs: 1.5, sm: 2, md: 3 }, 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        '&:last-child': { pb: { xs: 1.5, sm: 2, md: 3 } }
      }}>
        <Typography 
          variant="subtitle1" 
          fontWeight="600" 
          gutterBottom 
          sx={{ 
            mb: { xs: 1.5, sm: 2, md: 2.5 },
            textAlign: direction === 'rtl' ? 'right' : 'left',
            fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1
          }}
        >
          <span>{t('charts.categoryDistribution') || 'Goals by Category'}</span>
          <Typography 
            component="span" 
            variant="caption" 
            color="text.secondary"
            sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
          >
            {/* {sortedData.length} {t('common.categories') || 'categories'} */}
          </Typography>
        </Typography>
        
        <Box 
          sx={{ 
            width: '100%', 
            height: chartHeight, 
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'center',
            direction: 'ltr',
            position: 'relative',
            my: { xs: 1, sm: 1.5, md: 2 }
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sortedData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) => {
                  if (isLandscape) return `${Math.round(value)}%`;
                  if (isMobile) {
                    const percentage = Math.round(value);
                    return percentage > 15 ? `${percentage}%` : '';
                  }
                  if (isTablet) {
                    const shortName = name.length > 10 ? name.slice(0, 8) + '..' : name;
                    return `${shortName} ${Math.round(value)}%`;
                  }
                  return `${name} ${Math.round(value)}%`;
                }}
                outerRadius={outerRadius}
                innerRadius={innerRadius}
                dataKey="value"
                paddingAngle={1.5}
                labelStyle={{
                  fontSize: getLabelFontSize(),
                  fontWeight: 600,
                  fill: theme.palette.text.primary,
                  filter: 'drop-shadow(0 1px 1px rgba(255,255,255,0.5))'
                }}
                animationBegin={0}
                animationDuration={800}
                animationEasing="ease-out"
              >
                {sortedData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    stroke={theme.palette.background.paper}
                    strokeWidth={2} 
                    style={{ cursor: 'pointer' }}
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name, props) => {
                  const percentage = Math.round(value);
                  const item = sortedData.find(d => d.value === value);
                  return [`${percentage}%`, item?.name || name];
                }}
                contentStyle={{ 
                  borderRadius: 8, 
                  border: 'none', 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  direction: direction,
                  fontSize: getFontSize(),
                  padding: isMobile ? '6px 10px' : '8px 12px',
                  backgroundColor: theme.palette.background.paper,
                  color: theme.palette.text.primary
                }}
                itemStyle={{ 
                  padding: '2px 0',
                  fontSize: getFontSize()
                }}
                labelStyle={{ 
                  fontWeight: 600,
                  marginBottom: '4px',
                  fontSize: getFontSize()
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        {/* Legend - Modern Grid with Progress Bars */}
        <Box 
          sx={{ 
            display: 'grid',
            gridTemplateColumns: {
              xs: `repeat(${Math.min(legendColumns, 2)}, 1fr)`,
              sm: `repeat(${Math.min(legendColumns, 3)}, 1fr)`,
              md: `repeat(${legendColumns}, 1fr)`
            },
            gap: { xs: 0.75, sm: 1, md: 1.25 },
            mt: { xs: 1.5, sm: 2, md: 2.5 },
            pt: { xs: 1, sm: 1.5, md: 2 },
            borderTop: '1px solid',
            borderColor: 'divider'
          }}
        >
          {sortedData.map((item) => (
            <Box 
              key={item.name}
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 0.75,
                p: { xs: 0.5, sm: 0.75 },
                borderRadius: 1.5,
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: `${item.color}10`,
                  transform: 'translateX(4px)'
                }
              }}
            >
              <Box 
                sx={{ 
                  width: { xs: 8, sm: 10, md: 12 }, 
                  height: { xs: 8, sm: 10, md: 12 }, 
                  borderRadius: '50%', 
                  bgcolor: item.color,
                  flexShrink: 0,
                  boxShadow: `0 0 0 2px ${item.color}20`
                }} 
              />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography 
                  variant="caption" 
                  fontWeight="500" 
                  sx={{ 
                    fontSize: getFontSize(),
                    lineHeight: 1.3,
                    display: 'block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {item.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
                  <Box sx={{ 
                    flex: 1, 
                    height: 3, 
                    bgcolor: `${item.color}20`, 
                    borderRadius: 1.5,
                    overflow: 'hidden'
                  }}>
                    <Box sx={{ 
                      width: `${item.value}%`, 
                      height: '100%', 
                      bgcolor: item.color,
                      borderRadius: 1.5
                    }} />
                  </Box>
                  <Typography 
                    variant="caption" 
                    fontWeight="600" 
                    sx={{ 
                      fontSize: getFontSize(),
                      color: item.color,
                      minWidth: 35,
                      textAlign: 'right'
                    }}
                  >
                    {Math.round(item.value)}%
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}