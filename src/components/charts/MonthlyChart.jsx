import { Box, Card, CardContent, Typography, useMediaQuery, useTheme } from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useLanguage } from '../../hooks/useLanguage';
import { prepareMonthlyData } from '../../utils/chartUtils';

export default function MonthlyChart({ goals }) {
  const { t, direction } = useLanguage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const data = prepareMonthlyData(goals);
  const isRTL = direction === 'rtl';

  const chartHeight = isMobile ? 280 : 340;
  const barSize = isMobile ? 35 : 42;
  const fontSize = isMobile ? 11 : 12;

  if (!data || data.length === 0) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h6" fontWeight="600" gutterBottom>
            {t('charts.monthlyProgress') || 'Monthly Progress'}
          </Typography>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              No data available
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // شماره ماه به جای اسم ماه (برای خلاصی از متن‌های طولانی)
  const numberedData = data.map((item, index) => ({
    ...item,
    month: `${index + 1}`
  }));

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" fontWeight="600" gutterBottom sx={{ mb: 2 }}>
          {t('charts.monthlyProgress') || 'Monthly Progress'}
        </Typography>

        <Box sx={{ width: '100%', height: chartHeight }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={numberedData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: fontSize, fill: '#999' }}
                interval={0}
                axisLine={false}
                tickLine={false}
              />
              
              <YAxis 
                tick={{ fontSize: fontSize, fill: '#666' }}
                width={isMobile ? 35 : 45}
              />
              
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'created') return [value, isRTL ? 'ایجاد شده' : 'Created'];
                  return [value, isRTL ? 'تکمیل شده' : 'Completed'];
                }}
                labelFormatter={(label, payload) => {
                  const originalMonth = data[label - 1]?.month;
                  return originalMonth || `Month ${label}`;
                }}
                contentStyle={{ 
                  borderRadius: 8,
                  fontSize: fontSize,
                  backgroundColor: theme.palette.background.paper
                }}
              />
              
              <Bar 
                dataKey="created" 
                fill="#3b82f6" 
                name="created"
                barSize={barSize}
                radius={[4, 4, 0, 0]}
              />
              
              <Bar 
                dataKey="completed" 
                fill="#22c55e" 
                name="completed"
                barSize={barSize}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>

        {/* Legend */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 14, height: 14, borderRadius: 2, bgcolor: '#3b82f6' }} />
            <Typography variant="body2">
              {isRTL ? 'ایجاد شده' : (t('charts.created') || 'Created')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 14, height: 14, borderRadius: 2, bgcolor: '#22c55e' }} />
            <Typography variant="body2">
              {isRTL ? 'تکمیل شده' : (t('charts.completed') || 'Completed')}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}