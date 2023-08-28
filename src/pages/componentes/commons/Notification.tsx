;('')

import { SetStateAction, useEffect, useState } from 'react'

import { Tomorrow } from 'next/font/google'

const tomorrow = Tomorrow({ subsets: ['latin'], weight: '600' })

interface PropsNotification {
  message: string
  importantMessage: string
  setShowNotification: (value: boolean) => void
  type: number
}

const Error = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='50'
    height='80'
    viewBox='0 0 80 80'
    fill='none'
  >
    <path
      d='M40 0C17.88 0 0 17.88 0 40C0 62.12 17.88 80 40 80C62.12 80 80 62.12 80 40C80 17.88 62.12 0 40 0ZM60 54.36L54.36 60L40 45.64L25.64 60L20 54.36L34.36 40L20 25.64L25.64 20L40 34.36L54.36 20L60 25.64L45.64 40L60 54.36Z'
      fill='white'
    />
  </svg>
)

const Alert = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='50'
    height='80'
    viewBox='0 0 80 80'
    fill='none'
  >
    <path
      d='M34.5 0C15.456 0 0 15.68 0 35C0 54.32 15.456 70 34.5 70C53.544 70 69 54.32 69 35C69 15.68 53.544 0 34.5 0ZM37.95 52.5H31.05V45.5H37.95V52.5ZM37.95 38.5H31.05V17.5H37.95V38.5Z'
      fill='black'
    />
  </svg>
)

const Check = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='60'
    height='60'
    viewBox='0 0 60 60'
    fill='none'
  >
    <path
      d='M30 0C13.44 0 0 13.44 0 30C0 46.56 13.44 60 30 60C46.56 60 60 46.56 60 30C60 13.44 46.56 0 30 0ZM24 45L9 30L13.23 25.77L24 36.51L46.77 13.74L51 18L24 45Z'
      fill='white'
    />
  </svg>
)

const Notification = ({
  message,
  importantMessage,
  setShowNotification,
  type,
}: PropsNotification) => {
  const [isVisible, setIsVisible] = useState(false)
  const [icone, setIcone] = useState<JSX.Element>(<Alert />)
  const [corBox, setCorBox] = useState<string>('')

  useEffect(() => {
    typeNotification()
    const notificationOpen = setTimeout(() => {
      setIsVisible(true)
    }, 0)
    const notificationTimeout = setTimeout(() => {
      setIsVisible(false)
    }, 2000)
    const notificationShow = setTimeout(() => {
      setShowNotification(false)
    }, 3000)

    return () => {
      clearTimeout(notificationTimeout)
      clearTimeout(notificationOpen)
      clearTimeout(notificationShow)
    }
  }, [setShowNotification])

  const closeNotification = () => {
    setIsVisible(false)
  }

  const typeNotification = () => {
    if (type === 1) {
      setIcone(<Check />)
      setCorBox(' bg-padrao-green-300 text-white ')
    } else if (type === 2) {
      setIcone(<Alert />)
      setCorBox(' bg-padrao-yellow-300 text-black ')
    } else if (type === 3) {
      setIcone(<Error />)
      setCorBox(' bg-padrao-red-300 text-white ')
    }
  }

  return (
    <div
      className={`absolute top-20 z-50  ${
        isVisible ? 'right-20' : 'right-custom-right '
      } 
      rounded-xl flex justify-center items-center ${corBox} w-96 shadow-md transition-right duration-1000 ease-in-out p-5
      `}
      onClick={closeNotification}
    >
      {icone && icone}
      <div>
        <p
          className={`${tomorrow.className} text-xl mx-5 my-2 uppercase `}
        >
          {importantMessage}
        </p>
        <p className='mx-5'> {message}</p>
      </div>
    </div>
  )
}

export default Notification

/* ${
   
  } */
