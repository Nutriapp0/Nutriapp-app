"use client"

import { useMemo } from "react"
import type { UserData } from "../nutri-wizard"
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Brain,
  Sparkles,
  Save,
  TrendingUp,
  Apple,
  Droplets,
  Activity,
  Scale,
  Users,
  Cigarette,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ResultsStepProps {
  userData: UserData
  onSaveResults: (result: {
    imc: number
    riskLevel: "bajo" | "moderado" | "alto"
    classification: string
    nObeyesdad: string
  }) => void
}

type RiskLevel = "bajo" | "moderado" | "alto"

interface NutritionalResult {
  imc: number
  riskLevel: RiskLevel
  classification: string
  nObeyesdad: string
  recommendations: string[]
}

function calculateNutritionalResult(userData: UserData): NutritionalResult {
  const weight = parseFloat(userData.weight)
  const height = parseFloat(userData.height)
  
  // Calculate IMC (BMI)
  const imc = weight / (height * height)
  
  // Determine NObeyesdad classification based on IMC
  let nObeyesdad: string
  let riskLevel: RiskLevel
  let classification: string
  
  if (imc < 18.5) {
    nObeyesdad = "Insufficient_Weight"
    riskLevel = "moderado"
    classification = "Peso Insuficiente"
  } else if (imc >= 18.5 && imc < 25) {
    nObeyesdad = "Normal_Weight"
    riskLevel = "bajo"
    classification = "Peso Normal"
  } else if (imc >= 25 && imc < 27) {
    nObeyesdad = "Overweight_Level_I"
    riskLevel = "moderado"
    classification = "Sobrepeso Nivel I"
  } else if (imc >= 27 && imc < 30) {
    nObeyesdad = "Overweight_Level_II"
    riskLevel = "moderado"
    classification = "Sobrepeso Nivel II"
  } else if (imc >= 30 && imc < 35) {
    nObeyesdad = "Obesity_Type_I"
    riskLevel = "alto"
    classification = "Obesidad Tipo I"
  } else if (imc >= 35 && imc < 40) {
    nObeyesdad = "Obesity_Type_II"
    riskLevel = "alto"
    classification = "Obesidad Tipo II"
  } else {
    nObeyesdad = "Obesity_Type_III"
    riskLevel = "alto"
    classification = "Obesidad Tipo III"
  }
  
  // Adjust risk based on other factors
  const hasHighRiskFactors = 
    userData.familyHistory === "yes" ||
    userData.favc === "yes" ||
    parseInt(userData.fcvc) < 2 ||
    userData.smoke === "yes" ||
    parseInt(userData.faf) === 0
  
  if (riskLevel === "bajo" && hasHighRiskFactors) {
    riskLevel = "moderado"
  }
  
  // Generate recommendations based on data
  const recommendations: string[] = []
  
  if (riskLevel === "bajo") {
    recommendations.push("Plan de mantenimiento recomendado")
    recommendations.push("Continúa con tus hábitos alimenticios actuales")
  } else if (riskLevel === "moderado") {
    recommendations.push("Se sugiere ajuste en el plan alimentario")
    if (imc < 18.5) {
      recommendations.push("Aumentar ingesta calórica de forma saludable")
      recommendations.push("Incluir más proteínas en la dieta")
    } else {
      recommendations.push("Reducir consumo de alimentos procesados")
      recommendations.push("Aumentar consumo de frutas y verduras")
    }
  } else {
    recommendations.push("Alerta: Se sugiere revisión por bienestar universitario")
    recommendations.push("Consulta prioritaria con nutricionista")
    recommendations.push("Evaluación médica recomendada")
  }
  
  // Add recommendations based on habits
  if (parseInt(userData.ch2o) < 2) {
    recommendations.push("Aumentar consumo de agua a mínimo 2 litros diarios")
  }
  
  if (parseInt(userData.ncp) < 3) {
    recommendations.push("Distribuir la alimentación en al menos 3 comidas principales")
  }
  
  if (parseInt(userData.faf) === 0) {
    recommendations.push("Incrementar actividad física gradualmente")
  }
  
  if (userData.familyHistory === "yes") {
    recommendations.push("Debido al historial familiar, se recomienda seguimiento regular")
  }
  
  if (userData.favc === "yes") {
    recommendations.push("Reducir consumo de alimentos hipercalóricos")
  }
  
  if (userData.smoke === "yes") {
    recommendations.push("Considerar programa para dejar de fumar")
  }
  
  if (parseInt(userData.tue) > 1) {
    recommendations.push("Reducir tiempo de pantalla y aumentar actividad física")
  }
  
  if (userData.calc === "Frequently" || userData.calc === "Always") {
    recommendations.push("Moderar el consumo de alcohol")
  }
  
  return { imc, riskLevel, classification, nObeyesdad, recommendations }
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
  const result = useMemo(() => calculateNutritionalResult(userData), [userData])
  const risk = riskConfig[result.riskLevel]
  const RiskIcon = risk.icon

  const handleSave = () => {
    onSaveResults({
      imc: result.imc,
      riskLevel: result.riskLevel,
      classification: result.classification,
      nObeyesdad: result.nObeyesdad,
    })
  }

  // Get activity level label
  const getActivityLabel = () => {
    const faf = parseInt(userData.faf)
    if (faf === 0) return "Sedentario"
    if (faf === 1) return "Bajo"
    if (faf === 2) return "Moderado"
    return "Alto"
  }

  // Get water label
  const getWaterLabel = () => {
    const ch2o = parseInt(userData.ch2o)
    if (ch2o === 1) return "<1L"
    if (ch2o === 2) return "1-2L"
    return ">2L"
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
                    {result.imc.toFixed(1)}
                  </span>
                </div>
              </div>
              <span className="mt-3 text-sm text-muted-foreground">
                Clasificación: <span className="font-medium text-foreground">{result.classification}</span>
              </span>
              <span className="mt-1 text-xs text-muted-foreground">
                NObeyesdad: <span className="font-mono text-foreground">{result.nObeyesdad}</span>
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
                <p className="text-sm font-medium text-foreground">
                  {userData.weight} kg
                </p>
              </div>
              <div className="rounded-lg bg-secondary p-3 text-center">
                <TrendingUp className="mx-auto mb-1 h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Estatura</span>
                <p className="text-sm font-medium text-foreground">
                  {userData.height} m
                </p>
              </div>
              <div className="rounded-lg bg-secondary p-3 text-center">
                <Activity className="mx-auto mb-1 h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Actividad</span>
                <p className="text-sm font-medium text-foreground">
                  {getActivityLabel()}
                </p>
              </div>
              <div className="rounded-lg bg-secondary p-3 text-center">
                <Droplets className="mx-auto mb-1 h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Agua</span>
                <p className="text-sm font-medium text-foreground">
                  {getWaterLabel()}
                </p>
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
                {!userData.familyHistory && userData.favc === "no" && userData.smoke === "no" && parseInt(userData.faf) > 0 && (
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
              Recomendaciones de IA
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Plan de acción personalizado basado en tu perfil
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {result.recommendations.slice(0, 8).map((rec, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 rounded-lg bg-secondary p-3"
                >
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#4A8C3B]/20">
                    <span className="text-xs font-medium text-[#4A8C3B]">
                      {index + 1}
                    </span>
                  </div>
                  <span className="text-sm text-foreground">{rec}</span>
                </li>
              ))}
            </ul>

            {result.riskLevel === "alto" && (
              <div className="mt-4 rounded-lg border border-[#DC2626]/30 bg-[#DC2626]/10 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 shrink-0 text-[#DC2626]" />
                  <div>
                    <p className="text-sm font-medium text-[#DC2626]">
                      Atención Prioritaria
                    </p>
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
          className="w-full max-w-md bg-[#4A8C3B] text-white hover:bg-[#4A8C3B]/90 transition-all duration-200"
          size="lg"
        >
          <Save className="mr-2 h-4 w-4" />
          Guardar y Ver Mi Perfil
        </Button>
      </div>
    </div>
  )
}
