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

    const localDateStr = date.toLocaleDateString('en-CA');

    const hasActivity = goals.some(goal =>
      goal.logs?.some(log => log.date === localDateStr)
    );

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

// آماده‌سازی داده‌ها برای نمودار دسته‌بندی - با محاسبه پیشرفت واقعی
export const prepareCategoryData = (goals) => {
  if (!goals || goals.length === 0) return [];
  
  const categories = {};

  goals.forEach(goal => {
    const cat = goal.category || 'other';
    
    if (!categories[cat]) {
      categories[cat] = {
        name: cat,
        totalProgress: 0,
        count: 0,
        value: 0
      };
    }
    
    // محاسبه پیشرفت هر هدف (درصد)
    const progress = goal.target > 0 ? (goal.progress / goal.target) * 100 : 0;
    categories[cat].totalProgress += progress;
    categories[cat].count += 1;
  });
  
  // تبدیل به آرایه با میانگین پیشرفت هر دسته
  return Object.values(categories).map(cat => ({
    name: cat.name,
    value: Math.round(cat.totalProgress / cat.count), // میانگین پیشرفت
    color: getCategoryColor(cat.name)
  })).filter(cat => cat.value > 0); // فقط دسته‌هایی که پیشرفت دارن
};

// رنگ‌بندی کامل برای ۱۲ دسته‌بندی + other
const getCategoryColor = (category) => {
  const colors = {
    // 12 دسته اصلی
    education: '#3b82f6',     // آبی
    creative: '#f97316',      // نارنجی
    mental: '#8b5cf6',        // بنفش روشن
    career: '#ec489a',        // صورتی
    health: '#22c55e',        // سبز
    fitness: '#eab308',       // زرد
    finance: '#10b981',       // سبز زمردی
    productivity: '#6366f1',  // آبی بنفش
    social: '#ef4444',        // قرمز
    family: '#f59e0b',        // نارنجی طلایی
    travel: '#06b6d4',        // فیروزه‌ای
    spiritual: '#a855f7',     // بنفش
    // fallback
    work: '#804df8',
    personal: '#ec4899',
    other: '#64748b'          // طوسی
  };

  return colors[category] || colors.other;
};

// تابع کمکی برای گرفتن همه رنگ‌ها (اگه نیاز باشه)
export const getAllCategoryColors = () => {
  return {
    education: '#3b82f6',
    creative: '#f97316',
    mental: '#8b5cf6',
    career: '#ec489a',
    health: '#22c55e',
    fitness: '#eab308',
    finance: '#10b981',
    productivity: '#6366f1',
    social: '#ef4444',
    family: '#f59e0b',
    travel: '#06b6d4',
    spiritual: '#a855f7',
    other: '#64748b'
  };
};