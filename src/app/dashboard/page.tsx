'use client'
import { useAuth } from '@/hooks/useAuth.hook'
import React from 'react'

const Dashboard = () => {
  const { user  } = useAuth()
  console.log(user)
  return <div className="flex flex-1 items-center justify-center">Your are logged in</div>
}

export default Dashboard