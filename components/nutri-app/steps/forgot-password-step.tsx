"use client"

import { useState } from "react"
import { ArrowLeft, Mail, KeyRound, Lock, Eye, EyeOff, CheckCircle2, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type ForgotFrame = "email" | "code" | "newPassword" | "success"

interface ForgotPasswordStepProps {
  onBack: () => void
}

export function ForgotPasswordStep({ onBack }: ForgotPasswordStepProps) {
  const [frame, setFrame] = useState<ForgotFrame>("email")

  // Email frame
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")

  // Code frame
  const [code, setCode] = useState(["", "", "", "", "", ""])
  const [codeError, setCodeError] = useState("")
  const [resendTimer, setResendTimer] = useState(0)

  // New password frame
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [passwordError, setPasswordError] = useState("")

  /* ─── handlers ─── */
  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) { setEmailError("Ingresa tu correo institucional"); return }
    if (!/\S+@\S+\.\S+/.test(email)) { setEmailError("Correo inválido"); return }
    setEmailError("")
    toast.success(`Código enviado a ${email}`)
    setFrame("code")
    startResendTimer()
  }

  const startResendTimer = () => {
    setResendTimer(60)
    const interval = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) { clearInterval(interval); return 0 }
        return prev - 1
      })
    }, 1000)
  }

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const next = [...code]
    next[index] = value.slice(-1)
    setCode(next)
    if (value && index < 5) {
      document.getElementById(`code-${index + 1}`)?.focus()
    }
  }

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      document.getElementById(`code-${index - 1}`)?.focus()
    }
  }

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault()
    const joined = code.join("")
    if (joined.length < 6) { setCodeError("Ingresa el código completo de 6 dígitos"); return }
    setCodeError("")
    toast.success("Código verificado correctamente")
    setFrame("newPassword")
  }

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword.length < 8) { setPasswordError("La contraseña debe tener al menos 8 caracteres"); return }
    if (newPassword !== confirmPassword) { setPasswordError("Las contraseñas no coinciden"); return }
    setPasswordError("")
    toast.success("¡Contraseña restablecida exitosamente!")
    setFrame("success")
  }

  /* ─── Frame 1: Correo ─── */
  if (frame === "email") {
    return (
      <Card className="w-full max-w-md border-border bg-card">
        <CardHeader>
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2 w-fit"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio de sesión
          </button>
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-2">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">¿Olvidaste tu contraseña?</CardTitle>
          <CardDescription className="text-muted-foreground">
            Ingresa tu correo institucional y te enviaremos un código de verificación.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSendCode} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="forgot-email" className="text-foreground">Correo institucional</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="usuario@universidad.edu"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError("") }}
                  className="bg-input pl-10 text-foreground placeholder:text-muted-foreground focus:ring-primary"
                />
              </div>
              {emailError && <p className="text-sm text-destructive">{emailError}</p>}
            </div>
            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200"
            >
              Enviar código de verificación
            </Button>
          </form>
        </CardContent>
      </Card>
    )
  }

  /* ─── Frame 2: Código ─── */
  if (frame === "code") {
    return (
      <Card className="w-full max-w-md border-border bg-card">
        <CardHeader>
          <button
            onClick={() => setFrame("email")}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2 w-fit"
          >
            <ArrowLeft className="h-4 w-4" />
            Cambiar correo
          </button>
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-2">
            <KeyRound className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">Verifica tu correo</CardTitle>
          <CardDescription className="text-muted-foreground">
            Ingresa el código de 6 dígitos que enviamos a{" "}
            <span className="font-medium text-foreground">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerifyCode} className="space-y-6">
            {/* OTP boxes */}
            <div className="space-y-2">
              <div className="flex gap-2 justify-center">
                {code.map((digit, i) => (
                  <input
                    key={i}
                    id={`code-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(i, e.target.value)}
                    onKeyDown={(e) => handleCodeKeyDown(i, e)}
                    className={`
                      w-11 h-12 text-center text-lg font-bold rounded-lg border
                      bg-input text-foreground
                      focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                      transition-all duration-150
                      ${digit ? "border-primary bg-primary/5" : "border-border"}
                    `}
                  />
                ))}
              </div>
              {codeError && <p className="text-sm text-destructive text-center">{codeError}</p>}
            </div>

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200"
            >
              Verificar código
            </Button>

            {/* Resend */}
            <div className="text-center text-sm text-muted-foreground">
              ¿No recibiste el código?{" "}
              {resendTimer > 0 ? (
                <span className="text-primary font-medium">Reenviar en {resendTimer}s</span>
              ) : (
                <button
                  type="button"
                  onClick={() => { setCode(["","","","","",""]); startResendTimer() }}
                  className="inline-flex items-center gap-1 text-primary font-medium hover:underline"
                >
                  <RefreshCw className="h-3 w-3" />
                  Reenviar código
                </button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    )
  }

  /* ─── Frame 3: Nueva contraseña ─── */
  if (frame === "newPassword") {
    const strength = getPasswordStrength(newPassword)
    return (
      <Card className="w-full max-w-md border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-2">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">Crea una nueva contraseña</CardTitle>
          <CardDescription className="text-muted-foreground">
            Tu nueva contraseña debe tener al menos 8 caracteres.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetPassword} className="space-y-4">
            {/* Nueva contraseña */}
            <div className="space-y-2">
              <Label htmlFor="new-password" className="text-foreground">Nueva contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="new-password"
                  type={showNew ? "text" : "password"}
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setPasswordError("") }}
                  className="bg-input pl-10 pr-10 text-foreground placeholder:text-muted-foreground focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {/* Strength bar */}
              {newPassword.length > 0 && (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          strength >= level
                            ? level <= 1 ? "bg-destructive"
                            : level <= 2 ? "bg-accent"
                            : level <= 3 ? "bg-yellow-400"
                            : "bg-primary"
                            : "bg-border"
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs ${
                    strength <= 1 ? "text-destructive"
                    : strength <= 2 ? "text-accent"
                    : strength <= 3 ? "text-yellow-600"
                    : "text-primary"
                  }`}>
                    {["", "Débil", "Regular", "Buena", "Fuerte"][strength]}
                  </p>
                </div>
              )}
            </div>

            {/* Confirmar contraseña */}
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-foreground">Confirmar contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="confirm-password"
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setPasswordError("") }}
                  className="bg-input pl-10 pr-10 text-foreground placeholder:text-muted-foreground focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {confirmPassword.length > 0 && newPassword === confirmPassword && (
                <p className="text-xs text-primary flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Las contraseñas coinciden
                </p>
              )}
            </div>

            {passwordError && <p className="text-sm text-destructive">{passwordError}</p>}

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200"
            >
              Restablecer contraseña
            </Button>
          </form>
        </CardContent>
      </Card>
    )
  }

  /* ─── Frame 4: Éxito ─── */
  return (
    <Card className="w-full max-w-md border-border bg-card">
      <CardContent className="pt-8 pb-8 text-center space-y-5">
        {/* Animated checkmark */}
        <div className="flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center animate-[pulse_2s_ease-in-out_infinite]">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-foreground">¡Listo!</h2>
          <p className="text-muted-foreground">
            Tu contraseña ha sido restablecida exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.
          </p>
        </div>
        <Button
          onClick={onBack}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200"
        >
          Iniciar sesión
        </Button>
      </CardContent>
    </Card>
  )
}

/* ─── helpers ─── */
function getPasswordStrength(password: string): number {
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  return score
}
