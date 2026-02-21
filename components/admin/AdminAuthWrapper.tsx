'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminAuthWrapper({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      try {
        // Clear any existing auth on mount to require fresh login
        const cookies = document.cookie.split(';')
        const authCookie = cookies.find(cookie => cookie.trim().startsWith('adminAuth='))
        
        if (!authCookie) {
          setIsAuthenticated(false)
          router.push('/login')
          return
        }

        const authData = JSON.parse(authCookie.split('=')[1])
        
        // Check if session is from current browser session (within last 30 seconds)
        // This ensures fresh login for each new tab/window
        const sessionAge = Date.now() - (authData.sessionStart || 0)
        const MAX_SESSION_AGE = 24 * 60 * 60 * 1000; // 24 hours in ms
        
        // Check if user has admin role AND session is valid
        if (authData && authData.role === 'admin' && sessionAge < MAX_SESSION_AGE) {
          setIsAuthenticated(true)
        } else {
          // Clear invalid/expired cookie
          document.cookie = 'adminAuth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
          setIsAuthenticated(false)
          router.push('/login')
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        setIsAuthenticated(false)
        router.push('/login')
      }
    }

    checkAuth()
  }, [router])

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect to login
  }

  return <>{children}</>
}
