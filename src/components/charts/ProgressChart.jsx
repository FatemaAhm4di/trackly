// import {
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid
// } from "recharts";

// import { Box } from "@mui/material";
// import Typography from "../ui/Typography";

// export default function ProgressChart({ goals = [] }) {
//   // تبدیل دیتا
//   const data = goals
//     .filter(g => g.target > 0)
//     .map(g => ({
//       name: g.title.length > 10 ? g.title.slice(0, 10) + "..." : g.title,
//       progress: Math.round((g.progress / g.target) * 100)
//     }));

//   if (!data.length) {
//     return (
//       <Box sx={{ textAlign: "center", py: 4 }}>
//         <Typography color="text.secondary">
//           No data yet
//         </Typography>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ width: "100%", height: 300 }}>
//       <Typography variant="h6" fontWeight="700" sx={{ mb: 2 }}>
//         Goals Progress
//       </Typography>

//       <ResponsiveContainer>
//         <BarChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" />

//           <XAxis dataKey="name" />

//           <YAxis domain={[0, 100]} />

//           <Tooltip />

//           <Bar dataKey="progress" radius={[6, 6, 0, 0]} />
//         </BarChart>
//       </ResponsiveContainer>
//     </Box>
//   );
// }