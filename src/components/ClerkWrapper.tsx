"use client"

import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/nextjs'

export default function ClerkWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <header className="flex">
      </header>
      <div className="min-h-screen flex items-center justify-center">
        {children}
      </div>
    </ClerkProvider>
  )
}
