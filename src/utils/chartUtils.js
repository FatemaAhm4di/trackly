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
    
    const progress = goal.target > 0 ? (goal.progress / goal.target) * 100 : 0;
    categories[cat].totalProgress += progress;
    categories[cat].count += 1;
  });
  
  return Object.values(categories).map(cat => ({
    name: cat.name,
    value: Math.round(cat.totalProgress / cat.count), 
    color: getCategoryColor(cat.name)
  })).filter(cat => cat.value > 0); 
};

const getCategoryColor = (category) => {
  const colors = {
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
    work: '#804df8',
    personal: '#ec4899',
    other: '#64748b'          
  };

  return colors[category] || colors.other;
};

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
    social: '#ef5252',
    family: '#f59e0b',
    travel: '#06b6d4',
    spiritual: '#a855f7',
    other: '#64748b'
  };
};