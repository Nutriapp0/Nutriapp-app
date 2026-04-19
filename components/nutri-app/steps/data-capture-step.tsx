"use client"

import type { UserData } from "../nutri-wizard"
import { User, Calendar, Ruler, Scale, Users, Utensils, Salad, Clock, Cigarette, Droplets, Activity, Tv, Wine, Car } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface DataCaptureStepProps {
  userData: UserData
  setUserData: React.Dispatch<React.SetStateAction<UserData>>
  onNext: () => void
}

export function DataCaptureStep({ userData, setUserData, onNext }: DataCaptureStepProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isFormValid) {
      onNext()
    }
  }

  const updateField = (field: keyof UserData, value: string) => {
    setUserData((prev) => ({ ...prev, [field]: value }))
  }

  const isFormValid =
    userData.gender &&
    userData.age &&
    userData.height &&
    userData.weight &&
    userData.familyHistory &&
    userData.favc &&
    userData.fcvc &&
    userData.ncp &&
    userData.caec &&
    userData.smoke &&
    userData.ch2o &&
    userData.scc &&
    userData.faf &&
    userData.tue &&
    userData.calc &&
    userData.mtrans

  return (
    <div className="py-4">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-foreground">Captura de Datos</h2>
        <p className="mt-2 text-muted-foreground">
          Completa la siguiente información para generar tu diagnóstico nutricional
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Datos Personales */}
        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg text-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4A8C3B]/20">
                <User className="h-4 w-4 text-[#4A8C3B]" />
              </div>
              Datos Personales
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Información básica sobre ti
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Gender */}
            <div className="space-y-2">
              <Label className="text-foreground">Género</Label>
              <Select value={userData.gender} onValueChange={(v) => updateField("gender", v)}>
                <SelectTrigger className="bg-input text-foreground border-border">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="Male">Masculino</SelectItem>
                  <SelectItem value="Female">Femenino</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Age */}
            <div className="space-y-2">
              <Label className="text-foreground">Edad</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="number"
                  min="14"
                  max="100"
                  placeholder="Ej: 25"
                  value={userData.age}
                  onChange={(e) => updateField("age", e.target.value)}
                  className="bg-input pl-10 text-foreground placeholder:text-muted-foreground border-border"
                />
              </div>
            </div>

            {/* Height */}
            <div className="space-y-2">
              <Label className="text-foreground">Estatura (m)</Label>
              <div className="relative">
                <Ruler className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="number"
                  step="0.01"
                  min="1.0"
                  max="2.5"
                  placeholder="Ej: 1.75"
                  value={userData.height}
                  onChange={(e) => updateField("height", e.target.value)}
                  className="bg-input pl-10 text-foreground placeholder:text-muted-foreground border-border"
                />
              </div>
            </div>

            {/* Weight */}
            <div className="space-y-2">
              <Label className="text-foreground">Peso (kg)</Label>
              <div className="relative">
                <Scale className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="number"
                  step="0.1"
                  min="30"
                  max="300"
                  placeholder="Ej: 70"
                  value={userData.weight}
                  onChange={(e) => updateField("weight", e.target.value)}
                  className="bg-input pl-10 text-foreground placeholder:text-muted-foreground border-border"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Historial y Hábitos Alimenticios */}
        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg text-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E8913A]/20">
                <Utensils className="h-4 w-4 text-[#E8913A]" />
              </div>
              Historial y Hábitos Alimenticios
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Información sobre tu historial familiar y alimentación
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Family History */}
              <div className="space-y-3">
                <Label className="text-foreground flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  Historial familiar con sobrepeso
                </Label>
                <RadioGroup
                  value={userData.familyHistory}
                  onValueChange={(v) => updateField("familyHistory", v)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="fh-yes" className="border-border text-[#4A8C3B]" />
                    <Label htmlFor="fh-yes" className="text-foreground cursor-pointer">Sí</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="fh-no" className="border-border text-[#4A8C3B]" />
                    <Label htmlFor="fh-no" className="text-foreground cursor-pointer">No</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* FAVC - High Caloric Food */}
              <div className="space-y-3">
                <Label className="text-foreground flex items-center gap-2">
                  <Utensils className="h-4 w-4 text-muted-foreground" />
                  Consumo frecuente de alimentos hipercalóricos
                </Label>
                <RadioGroup
                  value={userData.favc}
                  onValueChange={(v) => updateField("favc", v)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="favc-yes" className="border-border text-[#4A8C3B]" />
                    <Label htmlFor="favc-yes" className="text-foreground cursor-pointer">Sí</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="favc-no" className="border-border text-[#4A8C3B]" />
                    <Label htmlFor="favc-no" className="text-foreground cursor-pointer">No</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {/* FCVC - Vegetables */}
              <div className="space-y-2">
                <Label className="text-foreground flex items-center gap-2">
                  <Salad className="h-4 w-4 text-muted-foreground" />
                  Consumo de verduras (1-3)
                </Label>
                <Select value={userData.fcvc} onValueChange={(v) => updateField("fcvc", v)}>
                  <SelectTrigger className="bg-input text-foreground border-border">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="1">1 - Nunca/Rara vez</SelectItem>
                    <SelectItem value="2">2 - A veces</SelectItem>
                    <SelectItem value="3">3 - Siempre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* NCP - Main Meals */}
              <div className="space-y-2">
                <Label className="text-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  Comidas principales al día
                </Label>
                <Select value={userData.ncp} onValueChange={(v) => updateField("ncp", v)}>
                  <SelectTrigger className="bg-input text-foreground border-border">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="1">1 comida</SelectItem>
                    <SelectItem value="2">2 comidas</SelectItem>
                    <SelectItem value="3">3 comidas</SelectItem>
                    <SelectItem value="4">4 o más comidas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* CAEC - Food Between Meals */}
              <div className="space-y-2">
                <Label className="text-foreground flex items-center gap-2">
                  <Utensils className="h-4 w-4 text-muted-foreground" />
                  Comida entre comidas
                </Label>
                <Select value={userData.caec} onValueChange={(v) => updateField("caec", v)}>
                  <SelectTrigger className="bg-input text-foreground border-border">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="Sometimes">A veces</SelectItem>
                    <SelectItem value="Frequently">Frecuentemente</SelectItem>
                    <SelectItem value="Always">Siempre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hábitos de Vida */}
        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg text-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4A8C3B]/20">
                <Activity className="h-4 w-4 text-[#4A8C3B]" />
              </div>
              Hábitos de Vida
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Información sobre tu estilo de vida diario
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* SMOKE */}
              <div className="space-y-3">
                <Label className="text-foreground flex items-center gap-2">
                  <Cigarette className="h-4 w-4 text-muted-foreground" />
                  ¿Fumas?
                </Label>
                <RadioGroup
                  value={userData.smoke}
                  onValueChange={(v) => updateField("smoke", v)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="smoke-yes" className="border-border text-[#4A8C3B]" />
                    <Label htmlFor="smoke-yes" className="text-foreground cursor-pointer">Sí</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="smoke-no" className="border-border text-[#4A8C3B]" />
                    <Label htmlFor="smoke-no" className="text-foreground cursor-pointer">No</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* SCC - Calorie Monitoring */}
              <div className="space-y-3">
                <Label className="text-foreground flex items-center gap-2">
                  <Scale className="h-4 w-4 text-muted-foreground" />
                  ¿Monitoreas calorías?
                </Label>
                <RadioGroup
                  value={userData.scc}
                  onValueChange={(v) => updateField("scc", v)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="scc-yes" className="border-border text-[#4A8C3B]" />
                    <Label htmlFor="scc-yes" className="text-foreground cursor-pointer">Sí</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="scc-no" className="border-border text-[#4A8C3B]" />
                    <Label htmlFor="scc-no" className="text-foreground cursor-pointer">No</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* CH2O - Water Consumption */}
              <div className="space-y-2">
                <Label className="text-foreground flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-muted-foreground" />
                  Consumo de agua diario
                </Label>
                <Select value={userData.ch2o} onValueChange={(v) => updateField("ch2o", v)}>
                  <SelectTrigger className="bg-input text-foreground border-border">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="1">Menos de 1 litro</SelectItem>
                    <SelectItem value="2">Entre 1 y 2 litros</SelectItem>
                    <SelectItem value="3">Más de 2 litros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* FAF - Physical Activity */}
              <div className="space-y-2">
                <Label className="text-foreground flex items-center gap-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  Actividad física (días/semana)
                </Label>
                <Select value={userData.faf} onValueChange={(v) => updateField("faf", v)}>
                  <SelectTrigger className="bg-input text-foreground border-border">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="0">0 - No hago ejercicio</SelectItem>
                    <SelectItem value="1">1-2 días</SelectItem>
                    <SelectItem value="2">3-4 días</SelectItem>
                    <SelectItem value="3">5+ días</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* TUE - Technology Use */}
              <div className="space-y-2">
                <Label className="text-foreground flex items-center gap-2">
                  <Tv className="h-4 w-4 text-muted-foreground" />
                  Horas en dispositivos/día
                </Label>
                <Select value={userData.tue} onValueChange={(v) => updateField("tue", v)}>
                  <SelectTrigger className="bg-input text-foreground border-border">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="0">0-2 horas</SelectItem>
                    <SelectItem value="1">3-5 horas</SelectItem>
                    <SelectItem value="2">Más de 5 horas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* CALC - Alcohol */}
              <div className="space-y-2">
                <Label className="text-foreground flex items-center gap-2">
                  <Wine className="h-4 w-4 text-muted-foreground" />
                  Consumo de alcohol
                </Label>
                <Select value={userData.calc} onValueChange={(v) => updateField("calc", v)}>
                  <SelectTrigger className="bg-input text-foreground border-border">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="no">No consumo</SelectItem>
                    <SelectItem value="Sometimes">A veces</SelectItem>
                    <SelectItem value="Frequently">Frecuentemente</SelectItem>
                    <SelectItem value="Always">Siempre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* MTRANS - Transportation */}
              <div className="space-y-2">
                <Label className="text-foreground flex items-center gap-2">
                  <Car className="h-4 w-4 text-muted-foreground" />
                  Medio de transporte
                </Label>
                <Select value={userData.mtrans} onValueChange={(v) => updateField("mtrans", v)}>
                  <SelectTrigger className="bg-input text-foreground border-border">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="Walking">Caminando</SelectItem>
                    <SelectItem value="Bike">Bicicleta</SelectItem>
                    <SelectItem value="Motorbike">Moto</SelectItem>
                    <SelectItem value="Public_Transportation">Transporte público</SelectItem>
                    <SelectItem value="Automobile">Automóvil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center pt-4">
          <Button
            type="submit"
            disabled={!isFormValid}
            className="w-full max-w-md bg-[#4A8C3B] text-white hover:bg-[#4A8C3B]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            size="lg"
          >
            Generar Diagnóstico Nutricional
          </Button>
        </div>
      </form>
    </div>
  )
}
