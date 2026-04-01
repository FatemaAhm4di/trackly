import { Box, Grid, Card, CardContent, alpha } from "@mui/material";
import { useState, useEffect, useMemo } from "react";
import { useLanguage } from "../hooks/useLanguage";
import { useGoalService } from "../services/goalService";
import { useNavigate } from "react-router-dom";

import Typography from "../components/ui/Typography";
import Icon from "../components/ui/Icon";
import { PageLoading } from "../components/ui/Loading";

export default function Categories() {
  const { t } = useLanguage();
  const { goals } = useGoalService(); // دریافت مستقیم لیست اهداف به جای تابع
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const CATEGORIES = [
    { key: "education", icon: "School" },
    { key: "creative", icon: "Palette" },
    { key: "mental", icon: "Psychology" },
    { key: "career", icon: "WorkOutline" },
    { key: "health", icon: "Favorite" },
    { key: "fitness", icon: "FitnessCenter" },
    { key: "finance", icon: "AttachMoney" },
    { key: "productivity", icon: "TrendingUp" },
    { key: "social", icon: "People" },
    { key: "family", icon: "Groups" },
    { key: "travel", icon: "Flight" },
    { key: "spiritual", icon: "SelfImprovement" },
  ];

  // ✅ استفاده از useMemo برای محاسبه آمار بدون ایجاد حلقه بی‌نهایت
  // این کد فقط زمانی اجرا می‌شود که لیست 'goals' تغییر کند، نه در هر رندر!
  const categoryStats = useMemo(() => {
    const stats = {};
    
    CATEGORIES.forEach((category) => {
      // فیلتر کردن اهداف مربوط به این دسته‌بندی
      const safeGoals = Array.isArray(goals) 
        ? goals.filter(g => g.category === category.key) 
        : [];
      
      const active = safeGoals.filter((g) => g.status === "active").length;
      const completed = safeGoals.filter((g) => g.status === "completed").length;
      const total = safeGoals.length;

      // محاسبه پیشرفت واقعی (مجموع پیشرفت‌ها / مجموع تارگت‌ها)
      const totalProgress = safeGoals.reduce((sum, goal) => sum + (Number(goal.progress) || 0), 0);
      const totalTarget = safeGoals.reduce((sum, goal) => sum + (Number(goal.target) || 0), 0);
      
      const progressPercent = totalTarget > 0 ? (totalProgress / totalTarget) * 100 : 0;
      
      stats[category.key] = { 
        active, 
        completed, 
        total,
        progressPercent 
      };
    });
    
    return stats;
  }, [goals]); // فقط با تغییر لیست goals دوباره محاسبه می‌شود

  // شبیه‌سازی لودینگ اولیه برای نرمی انیمیشن
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const getProgressColor = (progress) => {
    if (progress >= 70) return "success.main";
    if (progress >= 30) return "warning.main";
    return "primary.main";
  };

  if (loading) return <PageLoading />;

  return (
    <Box sx={{ py: 4 }}>
      {/* title */}
      <Box sx={{ mb: 6, textAlign: "center" }}>
        <Typography variant="h3" fontWeight="800" gutterBottom>
          {t("categories.title")}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t("categories.subtitle")}
        </Typography>
      </Box>

      <Grid container spacing={2} justifyContent="center">
        {CATEGORIES.map((category) => {
          const stats = categoryStats[category.key] || { active: 0, completed: 0, total: 0, progressPercent: 0 };
          const progress = stats.progressPercent;

          return (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              sx={{
                flexBasis: { lg: "20%" },
                maxWidth: { lg: "20%" },
              }}
              key={category.key}
            >
              <Card
                onClick={() => navigate(`/goals?category=${category.key}`)}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  p: 2,
                  border: 1,
                  borderColor: "divider",
                  maxWidth: "350px",
                  mx: "auto",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
                    borderColor: "primary.main",
                    "& .category-icon-box": {
                      bgcolor: "primary.main",
                      color: "white",
                      transform: "scale(1.1) rotate(5deg)",
                    },
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  {/* icon */}
                  <Box
                    className="category-icon-box"
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: "20px",
                      bgcolor: alpha("#0966a8", 0.1),
                      color: "primary.main",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2.5,
                      transition: "all 0.3s ease",
                    }}
                  >
                    <Icon name={category.icon} size={32} />
                  </Box>

                  {/* title */}
                  <Typography
                    variant="h6"
                    fontWeight="700"
                    gutterBottom
                    sx={{ mb: 3 }}
                  >
                    {t(`categories_list.${category.key}`) !==
                    `categories_list.${category.key}`
                      ? t(`categories_list.${category.key}`)
                      : category.key.charAt(0).toUpperCase() + category.key.slice(1)}
                  </Typography>

                  {/* stats */}
                  <Box sx={{ width: "100%" }}>
                    <StatRow label={t("categories.activeGoals")} value={stats.active} />
                    <StatRow label={t("categories.completedGoals")} value={stats.completed} color="success.main" />
                    <StatRow label={t("categories.totalGoals")} value={stats.total} color="primary.main" />
                  </Box>

                  {/* Progress Bar */}
                  <Box sx={{ width: "100%", mt: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography variant="caption">{t("categories.progress")}</Typography>
                      <Typography variant="caption" fontWeight="700" color="primary.main">
                        {Math.round(progress)}%
                      </Typography>
                    </Box>

                    <Box sx={{ width: "100%", height: 6, bgcolor: "action.hover", borderRadius: 3, overflow: "hidden" }}>
                      <Box
                        sx={{
                          height: "100%",
                          width: `${progress}%`,
                          bgcolor: stats.total > 0 ? getProgressColor(progress) : "action.disabled",
                          transition: "width 0.6s ease",
                        }}
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

function StatRow({ label, value, color = "text.primary" }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        py: 1,
        px: 2,
        borderRadius: 2,
        bgcolor: "background.default",
        mb: 1,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1" fontWeight="700" color={color}>
        {value}
      </Typography>
    </Box>
  );
}