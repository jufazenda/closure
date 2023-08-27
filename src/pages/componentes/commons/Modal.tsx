'use client'

import React, { useState } from 'react'
import { Button } from '@mui/material'

import { FC } from 'react'
import { PropsModal } from './Types/Props'

import { ThemeProvider, createTheme, styled } from '@mui/material/styles'
import { Tomorrow } from 'next/font/google'

const tomorrow = Tomorrow({ subsets: ['latin'], weight: '600' })

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
}) => {
  const getColorClass = () => {
    switch (setor) {
      case 1:
        return 'hover:bg-padrao-orange-300'
      case 2:
        return 'hover:bg-padrao-yellow-300'
      case 3:
        return 'hover:bg-padrao-pink-300'
      case 4:
        return 'hover:bg-padrao-blue-300'
      case 5:
        return 'hover:bg-padrao-green-300'
      case 6:
        return 'hover:bg-padrao-purple-300'
      case 7:
        return 'hover:bg-padrao-red-300'
      default:
        return 'hover:bg-gray-600'
    }
  }
  return (
    <ThemeProvider theme={theme}>
      <div
        className='flex fixed top-0 left-0 w-full h-full
         bg-black-shadow justify-center items-center'
        onClick={onClose}
      >
        <div
          className='bg-white rounded m-3 shadow w-3/4 md:w-1/2'
          onClick={e => e.stopPropagation()}
        >
          <header className='flex p-8 items-center border-b-2 gap-4'>
            <div>{icon}</div>
            <span className={`${tomorrow.className} text-xl flex`}>
              {title}
            </span>
          </header>
          <section className='px-10 py-8 overflow-auto max-h-450 md:h-full'>
            {children}
          </section>
          <footer
            className={`${tomorrow.className} flex p-10 justify-end gap-5`}
          >
            <Button
              color='primary'
              variant='contained'
              className={`bg-black ${getColorClass()} hover:text-white`}
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