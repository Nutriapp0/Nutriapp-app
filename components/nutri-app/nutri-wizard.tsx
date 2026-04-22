"use client"

import { useState } from "react"
import { UserProvider, useUser } from "./context/user-context"
import { Header } from "./header"
import { WelcomeStep } from "./steps/welcome-step"
import { AuthStep } from "./steps/auth-step"
import { ConsentStep } from "./steps/consent-step"
import { DataCaptureStep } from "./steps/data-capture-step"
import { ResultsStep } from "./steps/results-step"
import { ProfileStep } from "./steps/profile-step"

export interface UserData {
  gender: string           // Gender (Male/Female)
  age: string              // Age
  height: string           // Height (meters)
  weight: string           // Weight (kg)
  familyHistory: string    // family_history_with_overweight (yes/no)
  favc: string             // FAVC - Frequent consumption of high caloric food (yes/no)
  fcvc: string             // FCVC - Frequency of consumption of vegetables (1-3)
  ncp: string              // NCP - Number of main meals (1-4)
  caec: string             // CAEC - Consumption of food between meals
  smoke: string            // SMOKE (yes/no)
  ch2o: string             // CH2O - Consumption of water daily (1-3 liters)
  scc: string              // SCC - Calories consumption monitoring (yes/no)
  faf: string              // FAF - Physical activity frequency (0-3)
  tue: string              // TUE - Time using technology devices (0-2)
  calc: string             // CALC - Consumption of alcohol
  mtrans: string           // MTRANS - Transportation used
}



function NutriWizardContent() {
  const { isLoggedIn, logout, addAssessment } = useUser()
  const [showWelcome, setShowWelcome] = useState(true)
  const [showProfile, setShowProfile] = useState(false)
  const [isNewAssessment, setIsNewAssessment] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [userData, setUserData] = useState<UserData>({
    gender: "",
    age: "",
    height: "",
    weight: "",
    familyHistory: "",
    favc: "",
    fcvc: "",
    ncp: "",
    caec: "",
    smoke: "",
    ch2o: "",
    scc: "",
    faf: "",
    tue: "",
    calc: "",
    mtrans: "",
  })

  const handleStartFromWelcome = () => {
    setShowWelcome(false)
    // If already logged in, go directly to profile
    if (isLoggedIn) {
      setShowProfile(true)
    }
  }

  const handleLoginSuccess = () => {
    // After login, show profile
    setShowProfile(true)
  }

  const handleStartNewAssessment = () => {
    // Start a new assessment from profile
    setShowProfile(false)
    setIsNewAssessment(true)
    setCurrentStep(1) // Start at step 1 of assessment flow (Captura de Datos)
    setUserData({
      gender: "",
      age: "",
      height: "",
      weight: "",
      familyHistory: "",
      favc: "",
      fcvc: "",
      ncp: "",
      caec: "",
      smoke: "",
      ch2o: "",
      scc: "",
      faf: "",
      tue: "",
      calc: "",
      mtrans: "",
    })
  }

  const goToNextStep = () => {
    const maxSteps = isNewAssessment ? 2 : 4
    if (currentStep < maxSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      // If at step 1 and user is logged in, go back to profile
      if (isLoggedIn && isNewAssessment) {
        setShowProfile(true)
        setIsNewAssessment(false)
      }
    }
  }

  const handleSaveResults = (result: {
    imc: number
    riskLevel: "bajo" | "moderado" | "alto"
    classification: string
    nObeyesdad: string
    diagnostico?: string
  }) => {
    // Save the assessment to user profile
    addAssessment({
      ...userData,
      imc: result.imc,
      riskLevel: result.riskLevel,
      classification: result.classification,
      nObeyesdad: result.nObeyesdad,
    })
    // Show profile with history
    setShowProfile(true)
    setIsNewAssessment(false)
    setCurrentStep(1)
  }

  const handleLogout = () => {
    logout()
    setShowWelcome(true)
    setShowProfile(false)
    setIsNewAssessment(false)
    setCurrentStep(1)
    setUserData({
      gender: "",
      age: "",
      height: "",
      weight: "",
      familyHistory: "",
      favc: "",
      fcvc: "",
      ncp: "",
      caec: "",
      smoke: "",
      ch2o: "",
      scc: "",
      faf: "",
      tue: "",
      calc: "",
      mtrans: "",
    })
  }

  // Show welcome screen
  if (showWelcome) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header onProfileClick={isLoggedIn ? () => { setShowWelcome(false); setShowProfile(true); } : undefined} />
        <WelcomeStep onNext={handleStartFromWelcome} />
      </div>
    )
  }

  // Show profile dashboard for logged in users
  if (showProfile && isLoggedIn) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header onProfileClick={() => setShowProfile(true)} />
        <ProfileStep onNewAssessment={handleStartNewAssessment} onLogout={handleLogout} />
      </div>
    )
  }

  // For new assessment flow (logged-in users) - no progress indicator
  if (isNewAssessment) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header onProfileClick={() => { setShowProfile(true); setIsNewAssessment(false); }} />
        
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          {currentStep === 1 && (
            <DataCaptureStep
              userData={userData}
              setUserData={setUserData}
              onNext={goToNextStep}
            />
          )}
          {currentStep === 2 && (
            <ResultsStep userData={userData} onSaveResults={handleSaveResults} />
          )}
        </main>
      </div>
    )
  }

  // For registration flow (new users) - no progress indicator
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header onProfileClick={isLoggedIn ? () => setShowProfile(true) : undefined} />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {currentStep === 1 && (
          <AuthStep onNext={handleLoginSuccess} />
        )}
        {currentStep === 2 && (
          <ConsentStep onNext={goToNextStep} onCancel={goToPreviousStep} />
        )}
        {currentStep === 3 && (
          <DataCaptureStep
            userData={userData}
            setUserData={setUserData}
            onNext={goToNextStep}
          />
        )}
        {currentStep === 4 && (
          <ResultsStep userData={userData} onSaveResults={handleSaveResults} />
        )}
      </main>
    </div>
  )
}

export function NutriWizard() {
  return (
    <UserProvider>
      <NutriWizardContent />
    </UserProvider>
  )
}
