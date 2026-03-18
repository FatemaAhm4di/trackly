import { Box, Card, CardContent, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../../hooks/useLanguage';
import { prepareStreakData } from '../../utils/chartUtils';

export default function StreakChart({ goals }) {
  const { t } = useLanguage();
  const data = prepareStreakData(goals);

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
        <Typography variant="h6" fontWeight="600" gutterBottom sx={{ mb: 3 }}>
          {t('charts.streakHistory')}
        </Typography>
        <Box sx={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" height={50} />
              <YAxis domain={[0, 1]} ticks={[0, 1]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="active" 
                stroke="#f97316" 
                name={t('charts.active')}
                dot={{ r: 4 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}