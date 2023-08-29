'use client'

import React, { useState, ReactNode } from 'react'
import { Button } from '@mui/material'

import { FC } from 'react'

import { ThemeProvider, createTheme, styled } from '@mui/material/styles'
import { Tomorrow } from 'next/font/google'
import { blue } from '@mui/material/colors'

const tomorrow = Tomorrow({ subsets: ['latin'], weight: '600' })

interface PropsModal {
  title: string
  subtitle?: string
  icon?: ReactNode
  buttonIcon?: JSX.Element | null
  buttonLabel?: string
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  setor?: number | null
  onClickButton?: () => void
  isEditing?: boolean
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#000000',
    },
  },
})

const Modal: FC<PropsModal> = ({
  title,
  subtitle,
  icon,
  buttonIcon,
  buttonLabel,
  isOpen,
  onClose,
  onClickButton,
  setor,
  children,
  isEditing
}) => {
  const getColorClass = () => {
    switch (setor) {
      case 1:
        return 'bg-padrao-orange-300'
      case 2:
        return 'bg-padrao-yellow-300'
      case 3:
        return 'bg-padrao-pink-300'
      case 4:
        return 'bg-padrao-blue-300'
      case 5:
        return 'bg-padrao-green-300'
      case 6:
        return 'bg-padrao-purple-300'
      case 7:
        return 'bg-padrao-red-300'
      default:
        return 'bg-gray-600'
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <div
        className='fixed top-0 left-0 flex items-center justify-center w-full h-full overflow-auto bg-black-shadow'
        onClick={onClose}
      >
        <div
          className='bg-white rounded m-10 shadow w-3/4 md:w-1/2 max-h-450 md:max-h-80% overflow-auto'
          onClick={e => e.stopPropagation()}
        >
          <header className='flex items-center gap-4 p-8 border-b-2'>
            <div>{icon}</div>
            <span className={`${tomorrow.className} text-xl flex`}>
              {title}
            </span>
          </header>
          <section className='px-10 pt-8 pb-0 md:h-full'>
            {children}
          </section>
          <footer
            className={`${tomorrow.className} flex p-10 justify-end gap-10 items-center`}
          >
            <span
              onClick={onClose}
              className='cursor-pointer hover:-webkit-text-stroke-[0.2px] hover:underline text-xs'
            >
              CANCELAR
            </span>
            <Button
              variant='contained'
              className={`bg-black hover:${getColorClass()} hover:text-white`}
              onClick={onClickButton}
              startIcon={buttonIcon}
            >
              {buttonLabel}
            </Button>
          </footer>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default Modal
