"use client"

import GigCreationWizard from "@/features/gig/GigCreationWizard"
import GigCardList from "@/features/gig/GigCardList"

export default function GigPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gigs</h1>
      <GigCardList />
      <GigCreationWizard />
    </div>
  )
}
