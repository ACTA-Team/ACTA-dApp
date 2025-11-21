"use client"

import { useState, useEffect } from "react"

interface Tutorial {
  id: string
  title: string
  description: string
  category: string
  duration: string
  videoPath: string
}

const TUTORIALS_DATA: Tutorial[] = [
  {
    id: "1",
    title: "Getting Started",
    description: "Learn the basics of the platform and how to set up your account",
    category: "Basics",
    duration: "5:30",
    videoPath: "/videos/getting-started.mp4",
  },
  {
    id: "2",
    title: "Connect Your Wallet",
    description: "Step-by-step guide to connecting your Web3 wallet to the platform",
    category: "Setup",
    duration: "3:45",
    videoPath: "/videos/connect-wallet.mp4",
  },
  {
    id: "3",
    title: "Creating Your Vault",
    description: "How to create and configure your personal credential vault",
    category: "Setup",
    duration: "4:20",
    videoPath: "/videos/create-vault.mp4",
  },
  {
    id: "4",
    title: "Issuing Credentials",
    description: "Learn how to issue and manage verifiable credentials",
    category: "Advanced",
    duration: "6:15",
    videoPath: "/videos/issue-credentials.mp4",
  },
  {
    id: "5",
    title: "Managing Credentials",
    description: "View, organize, and revoke credentials in your dashboard",
    category: "Advanced",
    duration: "5:50",
    videoPath: "/videos/manage-credentials.mp4",
  },
]

export function useTutorials() {
  const [tutorials] = useState<Tutorial[]>(TUTORIALS_DATA)
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null)
  const [completedTutorials, setCompletedTutorials] = useState<Set<string>>(new Set())

  // Load completed tutorials from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("completedTutorials")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setCompletedTutorials(new Set(parsed))
      } catch (e) {
        console.error("Failed to parse completed tutorials:", e)
      }
    }
  }, [])

  // Save completed tutorials to localStorage whenever it changes
  useEffect(() => {
    if (completedTutorials.size > 0) {
      localStorage.setItem("completedTutorials", JSON.stringify([...completedTutorials]))
    }
  }, [completedTutorials])

  const selectTutorial = (tutorial: Tutorial) => {
    setSelectedTutorial(tutorial)
  }

  const markComplete = (tutorialId: string) => {
    setCompletedTutorials((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(tutorialId)) {
        newSet.delete(tutorialId)
      } else {
        newSet.add(tutorialId)
      }
      return newSet
    })
  }

  return {
    tutorials,
    selectedTutorial,
    completedTutorials,
    selectTutorial,
    markComplete,
  }
}
