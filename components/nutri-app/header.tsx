"use client"

import Image from "next/image"
import { User } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  onProfileClick?: () => void
}

export function Header({ onProfileClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="NutriApp Logo"
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
          />
          <span className="text-lg font-semibold tracking-tight text-foreground">
            NutriApp - Portal Nutricional
          </span>
        </div>
        
        {onProfileClick && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onProfileClick}
            className="rounded-full hover:bg-secondary"
          >
            <User className="h-5 w-5 text-primary" />
            <span className="sr-only">Perfil de usuario</span>
          </Button>
        )}
      </div>
    </header>
  )
}
