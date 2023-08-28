;('')

import { useEffect, useState } from 'react'
import supabase from './api/supabase'
import Head from 'next/head'
import AdicionarTarefa from './componentes/AdicionarTarefaModal'

import { AddCircle, FilterNone } from '@mui/icons-material'
import Notification from './componentes/commons/Notification'
import CardTarefa from './componentes/CardTarefa'

import { Tomorrow } from 'next/font/google'

const tomorrow = Tomorrow({ subsets: ['latin'], weight: '600' })

interface ModalComponents {
  [key: string]: JSX.Element
}

interface PropsTarefas {
  id: number
  tarefa: string
  numero_tarefa: number
  id_lote: number | null
  id_setor: number
  pontuacaoPrimeiro: number
  pontuacaoSegundo: number
  pontuacaoTerceiro: number
  pontuacaoQuarto: number
  horario: string
}

const Home = () => {
  const [activeModal, setActiveModal] = useState<boolean>(false)
  const [modalComponentName, setModalComponentName] = useState('')
  const [loading, setLoading] = useState(false)

  const [allTarefas, setAllTarefas] = useState<PropsTarefas[]>([])

  useEffect(() => {
    fetchData()
  }, [loading])

  const fetchData = async () => {
    const { data, error } = await supabase
      .from('Tarefas')
      .select('*')
      .order('numero_tarefa')

    if (error) {
      console.error('Erro ao buscar dados tarefas:', error.message)
      return
    }
    setAllTarefas(data)
  }

  const openModal = (modalName: string) => {
    setActiveModal(true)
    setModalComponentName(modalName)
  }

  const chooseModal = (modalName: string) => {
    const components: ModalComponents = {
      AdicionarTarefa: (
        <AdicionarTarefa
          activeModal={activeModal}
          setActiveModal={setActiveModal}
          loading={loading}
          setLoading={setLoading}
        />
      ),
    }
    return components[modalName]
  }

  return (
    <>
      <Head>
        <title>Closure - Organizador de Fechamento</title>
      </Head>
      <main>
        <div className='py-12 px-6 md:px-14 space-y-10 md:space-y-12'>
          <div>
            <div className='flex items-center justify-end text-md gap-10'>
              <span
                className='flex cursor-pointer font-semibold gap-1'
                onClick={() => openModal('AdicionarTarefa')}
              >
                <AddCircle />
                Adicionar
              </span>
              <span
                className='flex cursor-pointer font-semibold gap-1'
                //onClick={option.onClick}
              >
                <FilterNone />
                Filtrar
              </span>
            </div>
          </div>

          <div className='flex justify-center items-center w-full flex-col md:flex-row'>
            {allTarefas.length ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-10 '>
                {allTarefas.map(tarefas => (
                  <CardTarefa
                    key={tarefas.id}
                    tarefas={tarefas}
                    loading={loading}
                    setLoading={setLoading}
                  />
                ))}
              </div>
            ) : (
              <div className='flex justify-center items-center flex-col'>
                <span
                  className={`${tomorrow.className} text-3xl flex uppercase`}
                >
                  Sem tarefas cadastradas
                </span>
                <span className='m-5'>
                  Clique em Adicionar e comece a gincana!
                </span>
              </div>
            )}
          </div>

          {activeModal && chooseModal(modalComponentName)}
        </div>
      </main>
    </>
  )
}

export default Home
