"use client"

import { useState } from "react"
import { Shield, FileText, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useUser } from "../context/user-context"
import { apiPostConsent } from "@/lib/api"

interface ConsentStepProps {
  onNext: () => void
  onCancel: () => void
}

export function ConsentStep({ onNext, onCancel }: ConsentStepProps) {
  const { token } = useUser()
  const [accepted, setAccepted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!accepted || !token) return
    setError("")
    setIsLoading(true)
    try {
      await apiPostConsent(token)
      onNext()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar el consentimiento")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center py-4">
      <Card className="w-full max-w-3xl border-border bg-card">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Consentimiento Informado
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Autorización para el tratamiento de datos personales y de salud
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-lg border border-border bg-secondary/30 p-1">
              <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                <FileText className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  Política de Tratamiento de Datos - Ley 1581 de 2012
                </span>
              </div>
              <ScrollArea className="h-64 p-4">
                <div className="space-y-4 pr-4 text-sm text-muted-foreground">
                  <p>
                    <strong className="text-foreground">AUTORIZACIÓN PARA EL TRATAMIENTO DE DATOS PERSONALES Y DATOS SENSIBLES</strong>
                  </p>
                  
                  <p>
                    De conformidad con lo establecido en la Ley 1581 de 2012, el Decreto 1377 de 2013 
                    y demás normas concordantes sobre protección de datos personales, la Universidad 
                    solicita su autorización para recolectar, almacenar, usar, circular, suprimir, 
                    procesar, compilar, intercambiar, dar tratamiento, actualizar y disponer de los 
                    datos que usted suministre.
                  </p>

                  <p>
                    <strong className="text-foreground">1. RESPONSABLE DEL TRATAMIENTO</strong>
                  </p>
                  <p>
                    La Universidad, a través del programa NutriApp - Portal de Diagnóstico Nutricional, 
                    será responsable del tratamiento de sus datos personales y sensibles de salud.
                  </p>

                  <p>
                    <strong className="text-foreground">2. FINALIDAD DEL TRATAMIENTO</strong>
                  </p>
                  <p>
                    Los datos recolectados serán utilizados para:
                  </p>
                  <ul className="list-inside list-disc space-y-1 pl-4">
                    <li>Realizar evaluaciones nutricionales personalizadas</li>
                    <li>Generar diagnósticos y recomendaciones de salud</li>
                    <li>Seguimiento del estado nutricional del estudiante</li>
                    <li>Elaboración de estadísticas institucionales anónimas</li>
                    <li>Mejora continua de los servicios de bienestar universitario</li>
                  </ul>

                  <p>
                    <strong className="text-foreground">3. DATOS SENSIBLES</strong>
                  </p>
                  <p>
                    Se recolectarán datos considerados sensibles de acuerdo con la ley, incluyendo 
                    información sobre su estado de salud, hábitos alimenticios, medidas antropométricas 
                    y nivel de actividad física. Estos datos recibirán especial protección conforme a 
                    la normativa vigente.
                  </p>

                  <p>
                    <strong className="text-foreground">4. DERECHOS DEL TITULAR</strong>
                  </p>
                  <p>
                    Como titular de los datos, usted tiene derecho a:
                  </p>
                  <ul className="list-inside list-disc space-y-1 pl-4">
                    <li>Conocer, actualizar y rectificar sus datos personales</li>
                    <li>Solicitar prueba de la autorización otorgada</li>
                    <li>Ser informado sobre el uso dado a sus datos</li>
                    <li>Revocar la autorización y/o solicitar la supresión de datos</li>
                    <li>Acceder de forma gratuita a sus datos personales</li>
                  </ul>

                  <p>
                    <strong className="text-foreground">5. CONFIDENCIALIDAD</strong>
                  </p>
                  <p>
                    La Universidad garantiza la confidencialidad, seguridad, veracidad, transparencia, 
                    acceso y circulación restringida de sus datos, y se reservará el derecho de 
                    modificar su Política de Tratamiento de Datos en cualquier momento.
                  </p>

                  <p>
                    <strong className="text-foreground">6. VIGENCIA</strong>
                  </p>
                  <p>
                    La presente autorización tendrá vigencia a partir de la fecha de su aceptación 
                    y hasta que el titular solicite su revocatoria.
                  </p>
                </div>
              </ScrollArea>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-border bg-secondary/30 p-4">
              <Checkbox
                id="consent"
                checked={accepted}
                onCheckedChange={(checked) => setAccepted(checked === true)}
                className="mt-1 border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
              />
              <Label
                htmlFor="consent"
                className="text-sm leading-relaxed text-foreground cursor-pointer"
              >
                He leído y autorizo el tratamiento de mis datos personales y de salud conforme 
                a lo establecido en la política de tratamiento de datos y la Ley 1581 de 2012.
              </Label>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              {error && (
                <div className="flex w-full items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2">
                  <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
                  <p className="text-xs text-destructive">{error}</p>
                </div>
              )}
              <Button
                type="button"
                variant="ghost"
                onClick={onCancel}
                disabled={isLoading}
                className="text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={!accepted || isLoading}
                className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isLoading ? "Guardando..." : "Aceptar y Continuar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
