import { Box, Card, CardContent, Typography, useMediaQuery, useTheme } from '@mui/material';
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useLanguage } from '../../hooks/useLanguage';
import { prepareStreakData } from '../../utils/chartUtils';

export default function StreakChart({ goals }) {
  const { t, direction } = useLanguage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const data = prepareStreakData(goals);
  const isRTL = direction === 'rtl';

  const chartHeight = isMobile ? 240 : 280;
  const fontSize = isMobile ? 10 : 11;
  const dotSize = isMobile ? 4 : 5;

  // تبدیل تاریخ به شماره روز
  const numberedData = data.map((item, index) => ({
    ...item,
    day: index + 1
  }));

  if (!data || data.length === 0) {
    return (
      <Card sx={{ height: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <CardContent>
          <Typography variant="h6" fontWeight="600" gutterBottom>
            {t('charts.streakHistory') || 'Streak History'}
          </Typography>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              {t('charts.noData') || 'No streak data available'}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      <CardContent>
        <Typography variant="h6" fontWeight="600" gutterBottom sx={{ mb: 2 }}>
          {t('charts.streakHistory') || 'Streak History'}
        </Typography>

        <Box sx={{ width: '100%', height: chartHeight }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={numberedData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              
              <XAxis
                dataKey="day"
                reversed={isRTL}
                interval={isMobile ? 4 : 6}
                tick={{ fontSize: fontSize, fill: theme.palette.text.secondary }}
                tickMargin={8}
                axisLine={{ stroke: theme.palette.divider }}
              />

              <YAxis
                orientation={isRTL ? 'right' : 'left'}
                domain={[0, 1]}
                ticks={[0, 1]}
                tick={{ fontSize: fontSize, fill: theme.palette.text.secondary }}
                tickFormatter={(value) => value === 1 ? '✓' : '○'}
                width={isMobile ? 30 : 40}
              />

              <Tooltip
                labelFormatter={(label, payload) => {
                  const originalDate = data[label - 1]?.date;
                  return originalDate || `Day ${label}`;
                }}
                formatter={(value) => [
                  value === 1
                    ? (t('charts.active') || 'Active')
                    : (t('charts.inactive') || 'Inactive'),
                  t('charts.status') || 'Status'
                ]}
                contentStyle={{ 
                  borderRadius: 8,
                  fontSize: fontSize,
                  backgroundColor: theme.palette.background.paper
                }}
              />

              <Line
                type="monotone"
                dataKey="active"
                stroke="#f97316"
                name={t('charts.active') || 'Active'}
                dot={{ r: dotSize, fill: '#f97316', strokeWidth: 2 }}
                strokeWidth={2}
                animationBegin={0}
                animationDuration={800}
              />

            </LineChart>
          </ResponsiveContainer>
        </Box>

        {/* Legend */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#f97316' }} />
            <Typography variant="caption" sx={{ fontSize: fontSize }}>
              {isRTL ? 'فعال' : (t('charts.active') || 'Active')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#e0e0e0' }} />
            <Typography variant="caption" sx={{ fontSize: fontSize }}>
              {isRTL ? 'غیرفعال' : (t('charts.inactive') || 'Inactive')}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}