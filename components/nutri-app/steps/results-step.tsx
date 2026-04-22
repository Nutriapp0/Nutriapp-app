"use client"

import { useState, useEffect } from "react"
import type { UserData } from "../nutri-wizard"
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Brain,
  Sparkles,
  Save,
  TrendingUp,
  Droplets,
  Activity,
  Scale,
  Users,
  Cigarette,
  Apple,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useUser } from "../context/user-context"
import { apiPostAssessment, type AssessmentResult } from "@/lib/api"

interface ResultsStepProps {
  userData: UserData
  onSaveResults: (result: {
    imc: number
    riskLevel: "bajo" | "moderado" | "alto"
    classification: string
    nObeyesdad: string
    diagnostico?: string
  }) => void
}

type RiskLevel = "bajo" | "moderado" | "alto"

const NOB_TO_CLASSIFICATION: Record<string, { classification: string; riskLevel: RiskLevel }> = {
  Insufficient_Weight:  { classification: "Peso Insuficiente",  riskLevel: "moderado" },
  Normal_Weight:        { classification: "Peso Normal",         riskLevel: "bajo"     },
  Overweight_Level_I:   { classification: "Sobrepeso Nivel I",   riskLevel: "moderado" },
  Overweight_Level_II:  { classification: "Sobrepeso Nivel II",  riskLevel: "moderado" },
  Obesity_Type_I:       { classification: "Obesidad Tipo I",     riskLevel: "alto"     },
  Obesity_Type_II:      { classification: "Obesidad Tipo II",    riskLevel: "alto"     },
  Obesity_Type_III:     { classification: "Obesidad Tipo III",   riskLevel: "alto"     },
}

const riskConfig = {
  bajo: {
    color: "text-[#4A8C3B]",
    bgColor: "bg-[#4A8C3B]/20",
    borderColor: "border-[#4A8C3B]/30",
    icon: CheckCircle2,
    label: "Riesgo Bajo / Normal",
  },
  moderado: {
    color: "text-[#E8913A]",
    bgColor: "bg-[#E8913A]/20",
    borderColor: "border-[#E8913A]/30",
    icon: AlertTriangle,
    label: "Riesgo Moderado",
  },
  alto: {
    color: "text-[#DC2626]",
    bgColor: "bg-[#DC2626]/20",
    borderColor: "border-[#DC2626]/30",
    icon: AlertCircle,
    label: "Riesgo Alto",
  },
}

export function ResultsStep({ userData, onSaveResults }: ResultsStepProps) {
  const { token } = useUser()
  const [result, setResult] = useState<AssessmentResult | null>(null)
  const [apiError, setApiError] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  // Local IMC (siempre disponible inmediatamente)
  const weight = parseFloat(userData.weight)
  const height = parseFloat(userData.height)
  const imc = weight / (height * height)

  useEffect(() => {
    if (!token) return
    apiPostAssessment(token, userData)
      .then(setResult)
      .catch((err: unknown) => {
        setApiError(err instanceof Error ? err.message : "Error al generar el diagnóstico")
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Derivar clasificación: preferir la del backend, fallar a IMC local
  const nObeyesdad = result?.NObeyesdad ?? (() => {
    if (imc < 18.5) return "Insufficient_Weight"
    if (imc < 25) return "Normal_Weight"
    if (imc < 27) return "Overweight_Level_I"
    if (imc < 30) return "Overweight_Level_II"
    if (imc < 35) return "Obesity_Type_I"
    if (imc < 40) return "Obesity_Type_II"
    return "Obesity_Type_III"
  })()

  const { classification, riskLevel } = NOB_TO_CLASSIFICATION[nObeyesdad] ?? {
    classification: nObeyesdad,
    riskLevel: "moderado" as RiskLevel,
  }

  const risk = riskConfig[result?.nivelRiesgo ?? riskLevel]
  const RiskIcon = risk.icon
  const displayImc = result?.imc ?? imc

  const getActivityLabel = () => {
    const faf = parseInt(userData.faf)
    if (faf === 0) return "Sedentario"
    if (faf === 1) return "Bajo"
    if (faf === 2) return "Moderado"
    return "Alto"
  }

  const getWaterLabel = () => {
    const ch2o = parseInt(userData.ch2o)
    if (ch2o === 1) return "<1L"
    if (ch2o === 2) return "1-2L"
    return ">2L"
  }

  const handleSave = () => {
    setIsSaving(true)
    onSaveResults({
      imc: displayImc,
      riskLevel: result?.nivelRiesgo ?? riskLevel,
      classification,
      nObeyesdad,
      diagnostico: result?.diagnostico,
    })
  }

  return (
    <div className="py-4">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#4A8C3B]/20">
          <Sparkles className="h-8 w-8 text-[#4A8C3B]" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Resultados del Diagnóstico</h2>
        <p className="mt-2 text-muted-foreground">
          Análisis generado por nuestro sistema de inteligencia nutricional
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Estado Nutricional */}
        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4A8C3B]/20">
                <TrendingUp className="h-4 w-4 text-[#4A8C3B]" />
              </div>
              Tu Estado Nutricional
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Índice de Masa Corporal (IMC) y clasificación
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* IMC Display */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-[#4A8C3B]/30 bg-[#4A8C3B]/10">
                  <span className="text-4xl font-bold text-[#4A8C3B]">
                    {displayImc.toFixed(1)}
                  </span>
                </div>
              </div>
              <span className="mt-3 text-sm text-muted-foreground">
                Clasificación: <span className="font-medium text-foreground">{classification}</span>
              </span>
              <span className="mt-1 text-xs text-muted-foreground">
                NObeyesdad: <span className="font-mono text-foreground">{nObeyesdad}</span>
              </span>
            </div>

            {/* Risk Badge */}
            <div
              className={cn(
                "flex items-center justify-center gap-3 rounded-lg border p-4",
                risk.bgColor,
                risk.borderColor
              )}
            >
              <RiskIcon className={cn("h-6 w-6", risk.color)} />
              <span className={cn("text-lg font-semibold", risk.color)}>
                {risk.label}
              </span>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-secondary p-3 text-center">
                <Scale className="mx-auto mb-1 h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Peso</span>
                <p className="text-sm font-medium text-foreground">{userData.weight} kg</p>
              </div>
              <div className="rounded-lg bg-secondary p-3 text-center">
                <TrendingUp className="mx-auto mb-1 h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Estatura</span>
                <p className="text-sm font-medium text-foreground">{userData.height} m</p>
              </div>
              <div className="rounded-lg bg-secondary p-3 text-center">
                <Activity className="mx-auto mb-1 h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Actividad</span>
                <p className="text-sm font-medium text-foreground">{getActivityLabel()}</p>
              </div>
              <div className="rounded-lg bg-secondary p-3 text-center">
                <Droplets className="mx-auto mb-1 h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Agua</span>
                <p className="text-sm font-medium text-foreground">{getWaterLabel()}</p>
              </div>
            </div>

            {/* Risk Factors */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground">Factores de Riesgo Detectados</h4>
              <div className="flex flex-wrap gap-2">
                {userData.familyHistory === "yes" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#E8913A]/20 px-2 py-1 text-xs text-[#E8913A]">
                    <Users className="h-3 w-3" /> Historial Familiar
                  </span>
                )}
                {userData.favc === "yes" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#E8913A]/20 px-2 py-1 text-xs text-[#E8913A]">
                    <Apple className="h-3 w-3" /> Alto en Calorías
                  </span>
                )}
                {userData.smoke === "yes" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#DC2626]/20 px-2 py-1 text-xs text-[#DC2626]">
                    <Cigarette className="h-3 w-3" /> Fumador
                  </span>
                )}
                {parseInt(userData.faf) === 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#E8913A]/20 px-2 py-1 text-xs text-[#E8913A]">
                    <Activity className="h-3 w-3" /> Sedentario
                  </span>
                )}
                {userData.familyHistory !== "yes" && userData.favc === "no" && userData.smoke === "no" && parseInt(userData.faf) > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#4A8C3B]/20 px-2 py-1 text-xs text-[#4A8C3B]">
                    <CheckCircle2 className="h-3 w-3" /> Sin factores de riesgo
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recomendaciones de IA */}
        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E8913A]/20">
                <Brain className="h-4 w-4 text-[#E8913A]" />
              </div>
              Diagnóstico IA
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Análisis personalizado generado por inteligencia artificial
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Loading state */}
            {!result && !apiError && (
              <div className="flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-[#E8913A]" />
                <p className="text-sm">Generando diagnóstico con IA...</p>
              </div>
            )}

            {/* Error fallback */}
            {apiError && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0 text-destructive" />
                  <p className="text-sm text-destructive">{apiError}</p>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Se muestra el análisis basado en IMC local.
                </p>
              </div>
            )}

            {/* AI Diagnostic text */}
            {result?.diagnostico && (
              <div className="space-y-3">
                {result.diagnostico.split('\n').filter(Boolean).map((line, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-lg bg-secondary p-3">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#4A8C3B]/20">
                      <span className="text-xs font-medium text-[#4A8C3B]">{i + 1}</span>
                    </div>
                    <span className="text-sm text-foreground">{line}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Alerta riesgo alto */}
            {(result?.nivelRiesgo ?? riskLevel) === "alto" && (
              <div className="mt-4 rounded-lg border border-[#DC2626]/30 bg-[#DC2626]/10 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 shrink-0 text-[#DC2626]" />
                  <div>
                    <p className="text-sm font-medium text-[#DC2626]">Atención Prioritaria</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Te recomendamos agendar una cita con el servicio de bienestar
                      universitario para una evaluación más detallada.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex justify-center">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full max-w-md bg-[#4A8C3B] text-white hover:bg-[#4A8C3B]/90 transition-all duration-200"
          size="lg"
        >
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Guardar y Ver Mi Perfil
        </Button>
      </div>
    </div>
  )
}
