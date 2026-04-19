"use client"

import Image from "next/image"
import { ArrowRight, Heart, Activity, Apple, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

interface WelcomeStepProps {
  onNext: () => void
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  const features = [
    {
      icon: Heart,
      title: "Diagnóstico Personalizado",
      description: "Evaluación nutricional adaptada a tus necesidades",
    },
    {
      icon: Activity,
      title: "Análisis de Hábitos",
      description: "Comprende tus patrones de alimentación y actividad",
    },
    {
      icon: Apple,
      title: "Recomendaciones Inteligentes",
      description: "Planes alimenticios basados en inteligencia artificial",
    },
    {
      icon: Users,
      title: "Apoyo Universitario",
      description: "Conectado con el servicio de bienestar estudiantil",
    },
  ]

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl text-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute -inset-4 rounded-full bg-[#4A8C3B]/10 blur-xl" />
            <Image
              src="/logo.png"
              alt="NutriApp Logo"
              width={120}
              height={120}
              className="relative h-28 w-28 object-contain"
            />
          </div>
        </div>

        {/* Title */}
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Bienvenido a{" "}
          <span className="text-[#4A8C3B]">NutriApp</span>
        </h1>

        {/* Subtitle */}
        <p className="mb-12 text-lg text-muted-foreground">
          Tu portal de diagnóstico nutricional universitario. Descubre cómo mejorar 
          tu alimentación y bienestar con herramientas inteligentes diseñadas para ti.
        </p>

        {/* Features Grid */}
        <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group flex items-start gap-4 rounded-xl border border-border bg-card p-4 text-left transition-all duration-300 hover:border-[#4A8C3B]/30 hover:shadow-md"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#4A8C3B]/10 text-[#4A8C3B] transition-colors group-hover:bg-[#4A8C3B] group-hover:text-white">
                <feature.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <Button
          onClick={onNext}
          size="lg"
          className="group h-14 px-8 text-base font-semibold bg-[#4A8C3B] hover:bg-[#3d7530] text-white shadow-lg shadow-[#4A8C3B]/20 transition-all duration-300 hover:shadow-xl hover:shadow-[#4A8C3B]/30"
        >
          Comenzar Ahora
          <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Button>

        {/* Footer note */}
        <p className="mt-8 text-sm text-muted-foreground">
          Proceso rápido y seguro. Tus datos están protegidos bajo la{" "}
          <span className="text-[#E8913A]">Ley 1581 de 2012</span>.
        </p>
      </div>
    </div>
  )
}
