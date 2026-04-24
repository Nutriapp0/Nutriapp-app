"use client"

import { useMemo } from "react"
import { useUser, Assessment } from "../context/user-context"
import {
  User,
  History,
  TrendingUp,
  TrendingDown,
  Minus,
  PlusCircle,
  LogOut,
  Calendar,
  Activity,
  Scale,
  Ruler,
  ChevronRight,
  Award,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ProfileStepProps {
  onNewAssessment: () => void
  onLogout: () => void
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function getProgressIndicator(current: Assessment, previous: Assessment | null) {
  if (!previous) return null
  
  const diff = current.imc - previous.imc
  const isNormalRange = current.imc >= 18.5 && current.imc < 25
  const wasNormalRange = previous.imc >= 18.5 && previous.imc < 25
  
  // If both are in normal range, no significant change
  if (isNormalRange && wasNormalRange && Math.abs(diff) < 0.5) {
    return { type: "stable", icon: Minus, color: "text-muted-foreground" }
  }
  
  // Moving towards normal range is improvement
  const movingTowardsNormal = 
    (previous.imc < 18.5 && diff > 0) || // Underweight gaining
    (previous.imc >= 25 && diff < 0)      // Overweight losing
  
  if (movingTowardsNormal) {
    return { type: "improvement", icon: TrendingUp, color: "text-[#4A8C3B]" }
  }
  
  // Moving away from normal is regression
  const movingAwayFromNormal =
    (current.imc < 18.5 && diff < 0) || // Underweight losing more
    (current.imc >= 25 && diff > 0)      // Overweight gaining more
  
  if (movingAwayFromNormal) {
    return { type: "regression", icon: TrendingDown, color: "text-[#DC2626]" }
  }
  
  return { type: "stable", icon: Minus, color: "text-muted-foreground" }
}

const riskColors = {
  bajo: { bg: "bg-[#4A8C3B]/20", text: "text-[#4A8C3B]", border: "border-[#4A8C3B]/30" },
  moderado: { bg: "bg-[#E8913A]/20", text: "text-[#E8913A]", border: "border-[#E8913A]/30" },
  alto: { bg: "bg-[#DC2626]/20", text: "text-[#DC2626]", border: "border-[#DC2626]/30" },
}

export function ProfileStep({ onNewAssessment, onLogout }: ProfileStepProps) {
  const { user, assessments } = useUser()
  
  const latestAssessment = assessments[0] || null
  const previousAssessment = assessments[1] || null
  
  const progress = useMemo(() => {
    if (!latestAssessment) return null
    return getProgressIndicator(latestAssessment, previousAssessment)
  }, [latestAssessment, previousAssessment])

  const imcChange = useMemo(() => {
    if (!latestAssessment || !previousAssessment) return null
    return latestAssessment.imc - previousAssessment.imc
  }, [latestAssessment, previousAssessment])

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* User Header */}
      <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{user?.nombre}</h1>
            <p className="text-sm text-muted-foreground">
              Código: {user?.codigo} | {user?.email}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={onLogout}
          className="border-border text-muted-foreground hover:text-foreground"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar sesión
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
              <History className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{assessments.length}</p>
              <p className="text-xs text-muted-foreground">Evaluaciones</p>
            </div>
          </CardContent>
        </Card>

        {latestAssessment && (
          <>
            <Card className="border-border bg-card">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
                  <Scale className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {latestAssessment.imc.toFixed(1)}
                  </p>
                  <p className="text-xs text-muted-foreground">IMC Actual</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="flex items-center gap-4 p-4">
                {(() => {
                  const risk = riskColors[latestAssessment.riskLevel]
                  if (!risk) {
                    console.warn("[ProfileStep] riskLevel inesperado:", latestAssessment.riskLevel)
                  }
                  const safeRisk = risk || riskColors["moderado"]
                  return (
                    <div className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-lg",
                      safeRisk.bg
                    )}>
                      <Activity className={cn("h-6 w-6", safeRisk.text)} />
                    </div>
                  )
                })()}
                <div>
                  <p className={cn("text-lg font-bold capitalize", (riskColors[latestAssessment.riskLevel] || riskColors["moderado"]).text)}>
                    {latestAssessment.riskLevel}
                  </p>
                  <p className="text-xs text-muted-foreground">Nivel de Riesgo</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="flex items-center gap-4 p-4">
                {progress ? (
                  <>
                    <div className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-lg",
                      progress.type === "improvement" ? "bg-[#4A8C3B]/20" :
                      progress.type === "regression" ? "bg-[#DC2626]/20" : "bg-secondary"
                    )}>
                      <progress.icon className={cn("h-6 w-6", progress.color)} />
                    </div>
                    <div>
                      <p className={cn("text-lg font-bold", progress.color)}>
                        {imcChange && imcChange > 0 ? "+" : ""}{imcChange?.toFixed(1) || "0"}
                      </p>
                      <p className="text-xs text-muted-foreground">Cambio IMC</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                      <Award className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-foreground">Primera</p>
                      <p className="text-xs text-muted-foreground">Evaluación</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* New Assessment CTA */}
      <Card className="mb-8 border-primary/30 bg-primary/5">
        <CardContent className="flex flex-col items-center gap-4 p-6 sm:flex-row sm:justify-between">
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-semibold text-foreground">
              {assessments.length === 0 
                ? "Realiza tu primera evaluación nutricional"
                : "Realiza una nueva evaluación"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {assessments.length === 0
                ? "Completa tus datos antropométricos para obtener recomendaciones personalizadas"
                : "Monitorea tu progreso con evaluaciones periódicas"}
            </p>
          </div>
          <Button
            onClick={onNewAssessment}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            size="lg"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Nueva Evaluación
          </Button>
        </CardContent>
      </Card>

      {/* Assessment History */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <History className="h-5 w-5 text-primary" />
            Historial de Evaluaciones
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Seguimiento de tus diagnósticos nutricionales
          </CardDescription>
        </CardHeader>
        <CardContent>
          {assessments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                <History className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">
                Aún no tienes evaluaciones registradas
              </p>
              <p className="text-sm text-muted-foreground">
                Realiza tu primera evaluación para comenzar el seguimiento
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {assessments.map((assessment, index) => {
                const prevAssessment = assessments[index + 1] || null
                const assessmentProgress = getProgressIndicator(assessment, prevAssessment)
                let risk = riskColors[assessment.riskLevel]
                if (!risk) {
                  console.warn("[ProfileStep] riskLevel inesperado en historial:", assessment.riskLevel)
                  risk = riskColors["moderado"]
                }
                return (
                  <div
                    key={assessment.id}
                    className="flex items-center gap-4 rounded-lg border border-border bg-secondary/30 p-4 transition-colors hover:bg-secondary/50"
                  >
                    <div className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                      risk.bg
                    )}>
                      <span className={cn("text-sm font-bold", risk.text)}>
                        {assessment.imc.toFixed(1)}
                      </span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "rounded px-2 py-0.5 text-xs font-medium",
                          risk.bg, risk.text
                        )}>
                          {assessment.classification}
                        </span>
                        <span className={cn(
                          "rounded px-2 py-0.5 text-xs font-medium capitalize",
                          risk.bg, risk.text
                        )}>
                          Riesgo {assessment.riskLevel}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(assessment.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Scale className="h-3 w-3" />
                          {assessment.peso} kg
                        </span>
                        <span className="flex items-center gap-1">
                          <Ruler className="h-3 w-3" />
                          {assessment.estatura} cm
                        </span>
                      </div>
                    </div>
                    
                    {assessmentProgress && (
                      <div className={cn("flex items-center gap-1", assessmentProgress.color)}>
                        <assessmentProgress.icon className="h-4 w-4" />
                      </div>
                    )}
                    
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
