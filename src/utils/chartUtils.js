// آماده‌سازی داده‌ها برای نمودار ماهانه
export const prepareMonthlyData = (goals, locale = 'en') => {
  const months = Array.from({ length: 12 }, (_, i) => {
    return new Intl.DateTimeFormat(locale, { month: 'short' }).format(new Date(2024, i));
  });

  const monthlyData = months.map(month => ({
    month,
    completed: 0,
    created: 0
  }));

  goals.forEach(goal => {
    if (goal.createdAt) {
      const createdDate = new Date(goal.createdAt);
      const createdMonth = createdDate.getMonth();
      monthlyData[createdMonth].created += 1;
    }

    if (goal.status === 'completed' && goal.completedAt) {
      const completedDate = new Date(goal.completedAt);
      const completedMonth = completedDate.getMonth();
      monthlyData[completedMonth].completed += 1;
    }
  });

  return monthlyData;
};


// آماده‌سازی داده‌ها برای نمودار استریک
export const prepareStreakData = (goals, locale = 'en') => {
  const last30Days = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);

    // ✅ تاریخ لوکال واقعی (نه UTC خراب)
    const localDateStr = date.toLocaleDateString('en-CA'); // YYYY-MM-DD

    // بررسی فعالیت
    const hasActivity = goals.some(goal =>
      goal.logs?.some(log => log.date === localDateStr)
    );

    // ✅ فرمت نمایشی درست برای هر زبان
    const displayDate = new Intl.DateTimeFormat(locale, {
      month: '2-digit',
      day: '2-digit'
    }).format(date);

    last30Days.push({
      date: displayDate,
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
      categories[cat] = {
        name: cat,
        value: 0,
        color: getCategoryColor(cat)
      };
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
    work: '#804df8',
    personal: '#ec4899',
    creative: '#f97316',
    finance: '#10b981',
    social: '#6366f1',
    other: '#64748b'
  };

  return colors[category] || colors.other;
};