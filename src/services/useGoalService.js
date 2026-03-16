import { useState, useEffect } from "react"

export function useGoalService() {

  const [goals, setGoals] = useState([])

  useEffect(() => {
    const storedGoals = localStorage.getItem("trackly_goals")

    if (storedGoals) {
      setGoals(JSON.parse(storedGoals))
    }
  }, [])

  const saveGoals = (newGoals) => {
    setGoals(newGoals)
    localStorage.setItem("trackly_goals", JSON.stringify(newGoals))
  }

  return {
    goals,
    saveGoals
  }
}