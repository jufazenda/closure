;('')

import Head from 'next/head'

import { Tomorrow } from 'next/font/google'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import supabase from './api/supabase'
import CardResultado from './components/CardResultado'

const tomorrow = Tomorrow({ subsets: ['latin'], weight: '600' })

interface PropsEquipesResultado {
  id: number
  equipe: string
  pontuacaoTotal: number
}

const Resultado = () => {
  const [allResultado, setAllResultado] = useState<
    PropsEquipesResultado[]
  >([])

  const equipeEscolhida = (id: number) => {
    let src = ''
    let bgColor = ''

    switch (id) {
      case 1:
        src = '/logosEquipes/sk.png'
        bgColor = 'bg-padrao-red-500'
        break
      case 2:
        src = '/logosEquipes/aguia.png'
        bgColor = 'bg-padrao-yellow-500'
        break
      case 3:
        src = '/logosEquipes/medonhos.png'
        bgColor = 'bg-padrao-green-500'
        break
      case 4:
        src = '/logosEquipes/poupanca.png'
        bgColor = 'bg-padrao-pink-500'
        break
    }

    return { src, bgColor }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data, error } = await supabase
      .from('Equipes')
      .select('*')
      .order('pontuacaoTotal', { ascending: false })

    if (error) {
      console.error('Erro ao buscar dados tarefas:', error.message)
      return
    }
    setAllResultado(data)
  }

  return (
    <>
      <Head>
        <title>Closure - Organizador de Fechamento</title>
      </Head>
      <main>
        <div className='flex flex-row w-full justify-center items-center px-6 py-12 space-y-10 md:px-14 md:space-y-12'>
          <div
            className={`${tomorrow.className} flex flex-col gap-16 justify-center items-center text-7xl w-1/2`}
          >
            <div className='flex flex-row justify-center items-center gap-16 w-full '>
              <span className='w-16'> 1º </span>
              <CardResultado
                allResultado={allResultado[0]}
                {...equipeEscolhida(allResultado[0]?.id)}
              />
            </div>
            <div className='flex flex-row justify-center items-center gap-16 w-full '>
              <span className='w-16'> 2º </span>
              <CardResultado
                allResultado={allResultado[1]}
                {...equipeEscolhida(allResultado[1]?.id)}
              />
            </div>
            <div className='flex flex-row justify-center items-center gap-16 w-full'>
              <span className='w-16'> 3º </span>
              <CardResultado
                allResultado={allResultado[2]}
                {...equipeEscolhida(allResultado[2]?.id)}
              />
            </div>
            <div className='flex flex-row justify-center items-center gap-16 w-full'>
              <span className='w-16'> 4º </span>
              <CardResultado
                allResultado={allResultado[3]}
                {...equipeEscolhida(allResultado[3]?.id)}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default Resultado
