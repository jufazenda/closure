import Image from 'next/image'
import Link from 'next/link'
import { Tomorrow } from 'next/font/google'
import Menu from './Menu'
import { useState, useCallback } from 'react'
import { MenuOutlined } from '@mui/icons-material'

const tomorrow = Tomorrow({ subsets: ['latin'], weight: '500' })

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const openMenu = () => {
    setIsMenuOpen(true)
  }
  const closeMenu = useCallback(() => {
    setIsMenuOpen(false)
  }, [])

  return (
    <header
      className={`${tomorrow.className} bg-black text-sm flex py-3 px-5 
      justify-between items-center sticky top-0 z-20 text-white `}
    >
      <Link href={'/'}>
        <div className='w-24'>
          <Image
            src='/logoBranco.svg'
            alt='Icone'
            width={70}
            height={70}
            priority
          />
        </div>
      </Link>
      <button className='p-1 md:hidden' onClick={openMenu}>
        <MenuOutlined className='w-10 h-10 fill-white' />
      </button>
      <nav className='items-center hidden gap-12 text-lg md:flex '>
        <Link
          href={'/'}
          className='uppercase hover:text-padrao-green-300 '
        >
          Tarefas
        </Link>
        <Link
          href={'/resultado'}
          className='uppercase hover:text-padrao-blue-300'
        >
          Resultado
        </Link>
        <Link
          href={
            'https://armadaorganizadora.com.br/gymkhana/7befb3a6-9fc0-4c3b-971a-a361f5bcba53'
          }
          target='_blank'
          className='mr-8 uppercase hover:text-padrao-purple-300'
        >
          Site Organizadora
        </Link>
      </nav>
      <Menu isVisible={isMenuOpen} onClose={closeMenu} />
    </header>
  )
}

export default Header
