export const exportGoalsJSON = (goals) => {
  const dataStr = JSON.stringify(goals, null, 2)
  const blob = new Blob([dataStr], { type: "application/json" })
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.download = "trackly_goals.json"
  link.click()

  URL.revokeObjectURL(url)
}

export const exportGoalsCSV = (goals) => {
  if (!goals.length) return

  const headers = [
    "id",
    "title",
    "category",
    "type",
    "target",
    "progress",
    "status",
    "startDate",
    "endDate"
  ]

  const rows = goals.map(goal =>
    headers.map(field => goal[field] ?? "").join(",")
  )

  const csv = [headers.join(","), ...rows].join("\n")

  const blob = new Blob([csv], { type: "text/csv" })
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.download = "trackly_goals.csv"
  link.click()

  URL.revokeObjectURL(url)
}