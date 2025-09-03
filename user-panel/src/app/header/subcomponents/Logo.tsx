import React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

const Logo = ({ logoSrc, router }: { logoSrc: string; router: any }) => {
  return (
    <div className="flex items-center">
      <div className="flex-shrink-0 cursor-pointer" onClick={() => router.push("/")}>
        <Image 
          src={logoSrc} 
          alt="Ummah Community Logo" 
          width={150} 
          height={50} 
          priority
          className="h-10 w-auto"
        />
      </div>
    </div>
  )
}

export default Logo