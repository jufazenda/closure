import { Close, MenuOutlined } from '@mui/icons-material'
import Image from 'next/image'
import Link from 'next/link'

interface MenuProps {
  isVisible: boolean
  onClose: () => void
}

const Menu = ({ isVisible, onClose }: MenuProps) => {
  return (
    <div
      className={`${isVisible ? 'flex' : 'hidden'}
        fixed inset-0 w-full bg-black bg-opacity-40 backdrop-blur-sm md:hidden`}
      onClick={onClose}
    >
      <div
        className='w-full px-5 py-4 bg-black shadow-md h-80'
        onClick={e => e.stopPropagation()}
      >
        <div className='flex justify-between mb-5'>
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
          <button onClick={onClose}>
            <MenuOutlined className='w-10 h-10' />
          </button>
        </div>
        <nav className='flex flex-col items-center gap-5 p-5 text-xl '>
          <Link
            href={'/'}
            className='uppercase hover:text-padrao-green-300 '
            onClick={onClose}
          >
            Tarefas
          </Link>
          <Link
            href={'/resultado'}
            className='uppercase hover:text-padrao-blue-300'
            onClick={onClose}
          >
            Resultado
          </Link>
          <Link
            href={'https://armadaorganizadora.com.br/gymkhana/194ac0f4-78f5-4344-a42c-e935ff91ecaa/tasks'}
            target='_blank'
            className='uppercase hover:text-padrao-purple-300'
            onClick={onClose}
          >
            Site Organizadora
          </Link>
        </nav>
      </div>
    </div>
  )
}
export default Menu
