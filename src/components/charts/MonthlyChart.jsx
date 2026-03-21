import { Box, Card, CardContent, Typography } from '@mui/material';
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useLanguage } from '../../hooks/useLanguage';
import { prepareStreakData } from '../../utils/chartUtils';

export default function StreakChart({ goals }) {
  const { t, direction } = useLanguage();
  const data = prepareStreakData(goals);

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
          {t('charts.streakHistory')}
        </Typography>

        <Box sx={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={data} margin={margin}>

              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />

              <XAxis
                dataKey="date"
                reversed={isRTL}
                interval="preserveStartEnd"
                tick={{ fontSize: 10, fill: '#666' }}
                axisLine={{ stroke: '#e0e0e0' }}
                tickLine={false}
              />

              <YAxis
                orientation={isRTL ? 'right' : 'left'}
                domain={[0, 1]}
                ticks={[0, 1]}
                tick={{ fontSize: 11, fill: '#666' }}
                axisLine={{ stroke: '#e0e0e0' }}
                tickLine={false}
                tickFormatter={(value) => value === 1 ? '✓' : '○'}
              />

              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  direction: direction,
                  textAlign: isRTL ? 'right' : 'left'
                }}
                formatter={(value) => [
                  value === 1
                    ? (t('charts.active') || 'Active')
                    : (t('charts.inactive') || 'Inactive'),
                  t('charts.status') || 'Status'
                ]}
              />

              <Line
                type="monotone"
                dataKey="active"
                stroke="#f97316"
                name={t('charts.active')}
                dot={{ r: 4, fill: '#f5771d', strokeWidth: 2 }}
                strokeWidth={2}
              />

            </LineChart>
          </ResponsiveContainer>
        </Box>

      </CardContent>
    </Card>
  );
}