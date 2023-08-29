import Head from 'next/head'
import Link from 'next/link'

const NotFound = () => {
  return (
    <>
      <Head>
        <title>Closure - Organizador de Fechamento</title>
      </Head>
      <div className='flex justify-center items-center flex-col mt-10'>
        <h1 className='text-8xl'>404</h1>
        <h2 className='text-3xl mt-10 mb-5'>Página não encontrada.</h2>
        <span className='text-xl'>
          Acesse a página inicial clicando{' '}
          <Link className='hover:underline text-padrao-red-300' href={'/'}>
            aqui
          </Link>
        </span>
      </div>
    </>
  )
}

export default NotFound
