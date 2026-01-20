"use client"

import { useState } from "react"
import { ActivateProfileModal } from "@/components/activate-profile-modal"

interface ActivateProfileButtonProps {
  firmName: string
  className?: string
}

export function ActivateProfileButton({ firmName, className }: ActivateProfileButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={className || "px-6 py-2 bg-rose-500 text-white rounded text-center hover:bg-rose-600 transition-colors whitespace-nowrap"}
      >
        ACTIVATE PROFILE
      </button>

      <ActivateProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        firmName={firmName}
      />
    </>
  )
}
