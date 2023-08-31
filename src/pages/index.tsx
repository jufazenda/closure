;('')

import { useEffect, useState } from 'react'
import supabase from './api/supabase'
import Head from 'next/head'
import AdicionarTarefa from './componentes/AdicionarTarefaModal'

import { AddCircle, FilterNone } from '@mui/icons-material'
import Notification from './componentes/commons/Notification'
import CardTarefa from './componentes/CardTarefa'

import { Tomorrow } from 'next/font/google'
import TarefasModal from './componentes/TarefasModal'

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
  pontuacaoMaxima: number
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
        <div className='px-6 py-12 space-y-10 md:px-14 md:space-y-12'>
          <div>
            <div className='flex items-center justify-end gap-10 text-md'>
              <button
                className='flex gap-1 font-semibold cursor-pointer'
                onClick={() => openModal('AdicionarTarefa')}
              >
                <AddCircle />
                Adicionar
              </button>
              <button
                className='flex gap-1 font-semibold cursor-pointer'
                //onClick={option.onClick}
              >
                <FilterNone />
                Filtrar
              </button>
            </div>
          </div>

          <div className='flex flex-col items-center justify-center w-full md:flex-row'>
            {allTarefas.length ? (
              <div className='grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 '>
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
              <div className='flex flex-col items-center justify-center'>
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
