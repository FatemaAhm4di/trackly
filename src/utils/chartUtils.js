// آماده‌سازی داده‌ها برای نمودار ماهانه
export const prepareMonthlyData = (goals) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const monthlyData = months.map(month => ({
    month,
    completed: 0,
    created: 0
  }));

  goals.forEach(goal => {
    const createdMonth = new Date(goal.createdAt).getMonth();
    monthlyData[createdMonth].created += 1;

    if (goal.status === 'completed' && goal.completedAt) {
      const completedMonth = new Date(goal.completedAt).getMonth();
      monthlyData[completedMonth].completed += 1;
    }
  });

  return monthlyData;
};

// آماده‌سازی داده‌ها برای نمودار استریک
export const prepareStreakData = (goals) => {
  const last30Days = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    // بررسی فعالیت در این روز
    const hasActivity = goals.some(goal => 
      goal.logs?.some(log => log.date === dateStr)
    );

    last30Days.push({
      date: dateStr.slice(5), // نمایش MM-DD
      active: hasActivity ? 1 : 0
    });
  }

  return last30Days;
};

// آماده‌سازی داده‌ها برای نمودار دسته‌بندی
export const prepareCategoryData = (goals) => {
  const categories = {};
  
  goals.forEach(goal => {
    const cat = goal.category || 'other';
    if (!categories[cat]) {
      categories[cat] = { name: cat, value: 0, color: getCategoryColor(cat) };
    }
    categories[cat].value += 1;
  });

  return Object.values(categories);
};

const getCategoryColor = (category) => {
  const colors = {
    health: '#22c55e',
    fitness: '#eab308',
    education: '#3b82f6',
    work: '#8b5cf6',
    personal: '#ec4899',
    creative: '#f97316',
    finance: '#10b981',
    social: '#6366f1',
    other: '#64748b'
  };
  return colors[category] || colors.other;
};