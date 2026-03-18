import { Box, Card, CardContent, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../../hooks/useLanguage';
import { prepareMonthlyData } from '../../utils/chartUtils';

export default function MonthlyChart({ goals }) {
  const { t, direction } = useLanguage();
  const data = prepareMonthlyData(goals);

  return (
    <Card sx={{ height: '100%', width: '100%' }}>
      <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 }, '&:last-child': { pb: { xs: 2, sm: 3, md: 4 } } }}>
        <Typography 
          variant="h6" 
          fontWeight="600" 
          gutterBottom 
          sx={{ 
            mb: { xs: 2, sm: 3, md: 4 },
            textAlign: direction === 'rtl' ? 'right' : 'left'
          }}
        >
          {t('charts.monthlyProgress')}
        </Typography>
        
        <Box sx={{ width: '100%', height: { xs: 250, sm: 280, md: 320 } }}>
          <ResponsiveContainer>
            <BarChart 
              data={data} 
              margin={{ top: 20, right: direction === 'rtl' ? 10 : 30, left: direction === 'rtl' ? 30 : 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: { xs: 10, sm: 11, md: 12 } }}
                interval="preserveStartEnd"
              />
              <YAxis tick={{ fontSize: { xs: 10, sm: 11, md: 12 } }} />
              <Tooltip />
              <Legend wrapperStyle={{ paddingTop: 20, fontSize: { xs: 10, sm: 11, md: 12 } }} />
              <Bar dataKey="created" fill="#3b82f6" name={t('charts.created')} />
              <Bar dataKey="completed" fill="#22c55e" name={t('charts.completed')} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}