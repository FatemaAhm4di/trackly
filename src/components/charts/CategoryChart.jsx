import { Box, Card, CardContent, Typography, useMediaQuery, useTheme } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../../hooks/useLanguage';

export default function CategoryChart({ goals }) {
  const { t, direction } = useLanguage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const chartHeight = isMobile ? 260 : 300;
  const outerRadius = isMobile ? 85 : 110;
  const innerRadius = isMobile ? 40 : 55;
  const fontSize = isMobile ? '11px' : '13px';
  
  const prepareCategoryData = (goalsList) => {
    if (!goalsList?.length) return [];
    
    const categoryMap = new Map();
    const COLORS = {
      education: '#278de0', creative: '#9c27b0', mental: '#2e7d32', career: '#ed6c02',
      health: '#d32f2f', fitness: '#00bcd4', finance: '#ffc107', productivity: '#3f51b5',
      social: '#e91e63', family: '#8bc34a', travel: '#00695c', spiritual: '#673ab7', other: '#9e9e9e'
    };
    
    goalsList.forEach(goal => {
      const category = goal.category || 'other';
      const progress = goal.target > 0 ? (goal.progress / goal.target) * 100 : 0;
      if (!categoryMap.has(category)) categoryMap.set(category, { name: category, totalProgress: 0, count: 0 });
      const cat = categoryMap.get(category);
      cat.totalProgress += progress;
      cat.count++;
    });
    
    return Array.from(categoryMap.values()).map(cat => ({
      name: cat.name,
      value: Math.round(cat.totalProgress / cat.count),
      color: COLORS[cat.name] || COLORS.other
    })).filter(cat => cat.value > 0);
  };
  
  const getTranslatedCategory = (key) => {
    const translation = t(`categories_list.${key}`);
    return translation !== `categories_list.${key}` ? translation : key.charAt(0).toUpperCase() + key.slice(1);
  };

  const rawData = prepareCategoryData(goals);
  if (!rawData.length) {
    return (
      <Card sx={{ height: '100%', boxShadow: 3 }}>
        <CardContent><Typography variant="h6" fontWeight="600" gutterBottom>{t('charts.categoryDistribution') || 'Goals by Category'}</Typography>
        <Box sx={{ textAlign: 'center', py: 4 }}><Typography variant="body2" color="text.secondary">{t('charts.noCategoryData') || 'No goals data available'}</Typography></Box></CardContent>
      </Card>
    );
  }

  const sortedData = rawData.map(d => ({ ...d, name: getTranslatedCategory(d.name) })).sort((a, b) => b.value - a.value);

  return (
    <Card sx={{ height: '100%', boxShadow: 3, transition: '0.3s', '&:hover': { boxShadow: 6 } }}>
      <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
        <Typography variant="h6" fontWeight="600" gutterBottom sx={{ mb: { xs: 1.5, sm: 2 }, textAlign: direction === 'rtl' ? 'right' : 'left' }}>
          {t('charts.categoryDistribution') || 'Goals by Category'}
        </Typography>
        
        <Box sx={{ width: '100%', height: chartHeight, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={sortedData} cx="50%" cy="50%" labelLine={false} label={({ value }) => `${Math.round(value)}%`} outerRadius={outerRadius} innerRadius={innerRadius} dataKey="value" paddingAngle={2} labelStyle={{ fontSize: isMobile ? '10px' : '12px', fontWeight: 600, fill: theme.palette.text.primary }} animationDuration={800}>
                {sortedData.map((entry, idx) => <Cell key={`cell-${idx}`} fill={entry.color} stroke={theme.palette.background.paper} strokeWidth={2} />)}
              </Pie>
              <Tooltip formatter={(v) => `${Math.round(v)}%`} contentStyle={{ borderRadius: 8, fontSize, bgcolor: theme.palette.background.paper, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }} />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(2, 1fr)' }, gap: 1, mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          {sortedData.map(item => (
            <Box key={item.name} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 0.5, px: 0.5, borderRadius: 1, transition: '0.2s', '&:hover': { bgcolor: `${item.color}10` } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: item.color, flexShrink: 0 }} />
                <Typography variant="caption" sx={{ fontSize, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</Typography>
              </Box>
              <Typography variant="caption" fontWeight="700" sx={{ fontSize, color: item.color, ml: 1, flexShrink: 0 }}>{Math.round(item.value)}%</Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}