import Image from 'next/image'
import Link from 'next/link'
import { Tomorrow } from 'next/font/google'

const tomorrow = Tomorrow({ subsets: ['latin'], weight: '500' })

const Header = () => {
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
      <nav className='hidden md:flex items-center gap-10 text-md'>
        <Link href={'/'}>FECHAMENTO</Link>
        <Link href={'/resultado'}>RESULTADO</Link>
      </nav>
    </header>
  )
}

export default Header
