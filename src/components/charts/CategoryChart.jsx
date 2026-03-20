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
    name: getTranslatedCategory(item.name)
  }));

  return (
    <Card 
      sx={{ 
        height: '100%', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        direction: direction // ✅ مهم برای RTL
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography 
          variant="h6" 
          fontWeight="600" 
          gutterBottom 
          sx={{ 
            mb: 3,
            textAlign: direction === 'rtl' ? 'right' : 'left' // ✅ fix
          }}
        >
          {t('charts.categoryDistribution')}
        </Typography>
        
        <Box 
          sx={{ 
            width: '100%', 
            height: 280, 
            display: 'flex', 
            justifyContent: 'center',
            direction: 'ltr' // ✅ چارت همیشه LTR باشه
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={translatedData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => {
                  const pct = `${(percent * 100).toFixed(0)}%`;
                  return direction === 'rtl' 
                    ? `${pct} ${name}` 
                    : `${name} ${pct}`;
                }}
                outerRadius={90}
                innerRadius={40}
                fill="#8884d8"
                dataKey="value"
                paddingAngle={2}
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
                contentStyle={{ 
                  borderRadius: 8, 
                  border: 'none', 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  direction: direction // ✅ tooltip هم درست
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
            gap: 2, 
            justifyContent: 'center',
            mt: 3,
            pt: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
            direction: direction // ✅ کل باکس RTL-aware
          }}
        >
          {translatedData.map((item) => (
            <Box 
              key={item.name}
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                px: 1.5,
                py: 0.75,
                borderRadius: 2,
                bgcolor: `${item.color}10`,
                transition: 'all 0.2s ease',
                flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', // ✅ مهم
                textAlign: direction === 'rtl' ? 'right' : 'left',
                '&:hover': {
                  bgcolor: `${item.color}20`,
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <Box 
                sx={{ 
                  width: 12, 
                  height: 12, 
                  borderRadius: '50%', 
                  bgcolor: item.color 
                }} 
              />
              <Typography variant="body2" fontWeight="500">
                {direction === 'rtl'
                  ? `${item.value} : ${item.name}`
                  : `${item.name}: ${item.value}`}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}