"use client"

import { createContext, useContext, useState, ReactNode } from "react"

export interface UserProfile {
  id: string
  nombre: string
  codigo: string
  email: string
}

export interface Assessment {
  id: string
  date: string
  gender: string
  age: string
  height: string
  weight: string
  familyHistory: string
  favc: string
  fcvc: string
  ncp: string
  caec: string
  smoke: string
  ch2o: string
  scc: string
  faf: string
  tue: string
  calc: string
  mtrans: string
  imc: number
  riskLevel: "bajo" | "moderado" | "alto"
  classification: string
  nObeyesdad: string
}

interface UserContextType {
  user: UserProfile | null
  assessments: Assessment[]
  isLoggedIn: boolean
  login: (profile: UserProfile) => void
  logout: () => void
  addAssessment: (assessment: Omit<Assessment, "id" | "date">) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [assessments, setAssessments] = useState<Assessment[]>([])

  const login = (profile: UserProfile) => {
    setUser(profile)
  }

  const logout = () => {
    setUser(null)
    setAssessments([])
  }

  const addAssessment = (assessment: Omit<Assessment, "id" | "date">) => {
    const newAssessment: Assessment = {
      ...assessment,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    }
    setAssessments((prev) => [newAssessment, ...prev])
  }

  return (
    <UserContext.Provider
      value={{
        user,
        assessments,
        isLoggedIn: !!user,
        login,
        logout,
        addAssessment,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
