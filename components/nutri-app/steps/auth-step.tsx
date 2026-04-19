"use client"

import { useState } from "react"
import { Eye, EyeOff, Mail, Lock, User, BadgeCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { useUser } from "../context/user-context"
import { ForgotPasswordStep } from "./forgot-password-step"

interface AuthStepProps {
  onNext: () => void
}

export function AuthStep({ onNext }: AuthStepProps) {
  const { login } = useUser()
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState("login")
  const [showForgot, setShowForgot] = useState(false)
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  
  // Register form state
  const [registerName, setRegisterName] = useState("")
  const [registerCode, setRegisterCode] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (loginEmail && loginPassword) {
      // Simulate login - in production this would validate with backend
      login({
        id: Date.now().toString(),
        nombre: loginEmail.split("@")[0].replace(".", " "),
        codigo: "2024" + Math.random().toString().slice(2, 8),
        email: loginEmail,
      })
      onNext()
    }
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    if (registerName && registerCode && registerEmail && registerPassword) {
      login({
        id: Date.now().toString(),
        nombre: registerName,
        codigo: registerCode,
        email: registerEmail,
      })
      onNext()
    }
  }

  if (showForgot) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <ForgotPasswordStep onBack={() => setShowForgot(false)} />
      </div>
    )
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-md border-border bg-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-foreground">
            Bienvenido a NutriApp
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Accede a tu portal de diagnóstico nutricional
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-secondary">
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Iniciar Sesión
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Registrarse
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="mt-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-foreground">
                    Correo institucional
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="usuario@universidad.edu"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="bg-input pl-10 text-foreground placeholder:text-muted-foreground focus:ring-primary"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-foreground">
                    Contraseña
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="bg-input pl-10 pr-10 text-foreground placeholder:text-muted-foreground focus:ring-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="text-sm text-primary hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </button>
                
                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200"
                >
                  Ingresar
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register" className="mt-6">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name" className="text-foreground">
                    Nombre completo
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="Juan Pérez García"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      className="bg-input pl-10 text-foreground placeholder:text-muted-foreground focus:ring-primary"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-code" className="text-foreground">
                    Código estudiantil
                  </Label>
                  <div className="relative">
                    <BadgeCheck className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="register-code"
                      type="text"
                      placeholder="2024001234"
                      value={registerCode}
                      onChange={(e) => setRegisterCode(e.target.value)}
                      className="bg-input pl-10 text-foreground placeholder:text-muted-foreground focus:ring-primary"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-email" className="text-foreground">
                    Correo institucional
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="usuario@universidad.edu"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      className="bg-input pl-10 text-foreground placeholder:text-muted-foreground focus:ring-primary"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-password" className="text-foreground">
                    Contraseña
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="register-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      className="bg-input pl-10 pr-10 text-foreground placeholder:text-muted-foreground focus:ring-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200"
                >
                  Crear cuenta
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
