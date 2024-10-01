import { Tomorrow } from 'next/font/google'
import Image from 'next/image'
import React from 'react'

const tomorrow = Tomorrow({ subsets: ['latin'], weight: '600' })

interface PropsSetorBox {
  srcImage: string
  alt: string
  value: number | undefined
  width: number
  height: number
  isMax: boolean
}

const SetorBox = ({
  srcImage,
  alt,
  value,
  width,
  height,
  isMax,
}: PropsSetorBox) => {
  return (
    <div
      className={`flex flex-col items-center gap-6 p-6 rounded-xl ${
        isMax ? 'bg-black bg-opacity-20' : 'bg-transparent'
      }`}
    >
      <Image
        src={srcImage}
        alt={alt}
        width={width}
        height={height}
        priority
      />
      <span className={`${tomorrow.className} text-5xl`}>{value}</span>
    </div>
  )
}

export default SetorBox
