import { Box, Card, CardContent, Typography } from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import { useLanguage } from '../../hooks/useLanguage';
import { prepareMonthlyData } from '../../utils/chartUtils';

export default function MonthlyChart({ goals }) {
  const { t, direction } = useLanguage();
  const data = prepareMonthlyData(goals);

  const isRTL = direction === 'rtl';

  const margin = isRTL
    ? { top: 20, right: 20, left: 50, bottom: 20 }
    : { top: 20, right: 50, left: 20, bottom: 20 };

  return (
    <Card sx={{ height: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      <CardContent sx={{ p: 3 }}>
        
        <Typography
          variant="h6"
          fontWeight="600"
          gutterBottom
          sx={{ mb: 3, textAlign: isRTL ? 'right' : 'left' }}
        >
          {t('charts.monthlyProgress')}
        </Typography>

        <Box sx={{ width: '100%', height: 320 }}>
          <ResponsiveContainer>
            <BarChart data={data} margin={margin}>

              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />

              <XAxis
                dataKey="month"
                reversed={isRTL}
                interval="preserveStartEnd"
                tick={{ fontSize: 12, fill: '#666' }}
                axisLine={{ stroke: '#e0e0e0' }}
                tickLine={false}
              />

              <YAxis
                orientation={isRTL ? 'right' : 'left'}
                tick={{ fontSize: 12, fill: '#666' }}
                axisLine={{ stroke: '#e0e0e0' }}
                tickLine={false}
              />

              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  direction: direction,
                  textAlign: isRTL ? 'right' : 'left'
                }}
              />

              <Legend
                wrapperStyle={{
                  paddingTop: 20,
                  direction: direction
                }}
                iconType="circle"
              />

              <Bar
                dataKey="created"
                fill="#3b82f6"
                name={t('charts.created')}
                radius={[4, 4, 0, 0]}
                barSize={28}
              />

              <Bar
                dataKey="completed"
                fill="#22c55e"
                name={t('charts.completed')}
                radius={[4, 4, 0, 0]}
                barSize={28}
              />

            </BarChart>
          </ResponsiveContainer>
        </Box>

      </CardContent>
    </Card>
  );
}