"use client"

import { createClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"
import React from "react"
interface UserProfileData {
  full_name: string | null
  role: string
}

interface UserProfileProviderProps {
  children: React.ReactNode
  role: "student" | "teacher"
}

export function UserProfileProvider({ children, role }: UserProfileProviderProps) {
  const [profileData, setProfileData] = useState<UserProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchUserProfile() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("full_name, role")
          .eq("id", user.id)
          .single()
        
        setProfileData(data)
      }
      
      setIsLoading(false)
    }

    fetchUserProfile()
  }, [])

  // Clone the children and pass the profile data as props
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<any>, { 
        profileData,
        isLoading
      })
    }
    return child
  })

  return <>{childrenWithProps}</>
} 