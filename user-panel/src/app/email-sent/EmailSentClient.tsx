import { Suspense } from "react"
import EmailSentClient from "./EmailSentClient"

export default function EmailSentPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center bg-white">
                    <p className="text-sm text-gray-600">Loading...</p>
                </div>
            }
        >
            <EmailSentClient />
        </Suspense>
    )
}
