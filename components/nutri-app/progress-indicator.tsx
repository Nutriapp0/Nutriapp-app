"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step {
  id: number
  label: string
}

interface ProgressIndicatorProps {
  steps: Step[]
  currentStep: number
}

export function ProgressIndicator({ steps, currentStep }: ProgressIndicatorProps) {
  return (
    <div className="w-full border-b border-border bg-card/50 py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-2 md:gap-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium transition-all duration-300",
                      currentStep > step.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : currentStep === step.id
                          ? "border-primary bg-primary/20 text-primary"
                          : "border-border bg-secondary text-muted-foreground"
                    )}
                  >
                    {currentStep > step.id ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span
                    className={cn(
                      "mt-2 hidden text-xs font-medium md:block",
                      currentStep >= step.id
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </span>
                </div>
                
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "mx-2 h-0.5 w-8 md:w-16 transition-colors duration-300",
                      currentStep > step.id ? "bg-primary" : "bg-border"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
