;('')

import { useEffect, useState } from 'react'
import supabase from './api/supabase'
import Head from 'next/head'
import AdicionarTarefa from './componentes/AdicionarTarefaModal'

import { AddCircle, Apps, Reorder } from '@mui/icons-material'
import CardTarefa from './componentes/CardTarefa'

import { Tomorrow } from 'next/font/google'
import SearchBox from './componentes/SearchBox'
import {
  ButtonGroup,
  IconButton,
  Tooltip,
  createTheme,
} from '@mui/material'
import { ThemeProvider } from '@emotion/react'

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

interface PropsSetores {
  id: number
  setor: string
  responsavel: string
  created_at: Date
}
interface PropsLotes {
  id: number
  numero_lote: string
  horario_inicio: string
  horario_fim: string
  created_at: Date
}

const theme = createTheme({
  palette: {
    primary: {
      main: 'rgba(0, 0, 0, 1)',
    },
  },
})

const Home = () => {
  const [activeModal, setActiveModal] = useState<boolean>(false)
  const [modalComponentName, setModalComponentName] = useState('')
  const [loading, setLoading] = useState(false)
  const [listMode, setListMode] = useState(true)

  const [allTarefas, setAllTarefas] = useState<PropsTarefas[]>([])

  const [buscando, setBuscando] = useState('')

  const [setor, setSetor] = useState<PropsSetores | null>(null)
  const [lote, setLote] = useState<PropsLotes | null>(null)
  const [filteredTarefas, setFilteredTarefas] = useState<PropsTarefas[]>(
    []
  )

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
    setFilteredTarefas(data)
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
    <ThemeProvider theme={theme}>
      <Head>
        <title>Closure - Organizador de Fechamento</title>
      </Head>
      <main>
        <div className='px-6 py-12 space-y-10 md:px-14 md:space-y-12'>
          <div className='flex items-center justify-center gap-16'>
            <div className='w-8/12 flex'>
              <SearchBox
                buscando={buscando}
                setBuscando={setBuscando}
                allTarefas={allTarefas}
                setFilteredTarefas={setFilteredTarefas}
                setSetor={setSetor}
                setLote={setLote}
              />
            </div>
            <div className='flex items-center justify-end text-lg gap-10'>
              <button
                className='flex gap-1 items-center font-semibold cursor-pointer hover:text-padrao-pink-300'
                onClick={() => openModal('AdicionarTarefa')}
              >
                <AddCircle />
                Adicionar
              </button>
            </div>
            <div className='flex items-center justify-end text-lg gap-3'>
              <ButtonGroup
                variant='contained'
                aria-label='text button group'
                disableElevation
              >
                <Tooltip title='Modo Lista'>
                  <IconButton
                    onClick={() => {
                      setListMode(true)
                    }}
                    color='primary'
                  >
                    <Reorder />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Modo Grade'>
                  <IconButton
                    onClick={() => {
                      setListMode(false)
                    }}
                    color='primary'
                  >
                    <Apps />
                  </IconButton>
                </Tooltip>
              </ButtonGroup>
            </div>
          </div>

          <div className='flex flex-col items-center justify-center w-full md:flex-row'>
            {listMode ? (
              buscando === '' && setor === null && lote === null ? (
                allTarefas.length ? (
                  <div className='w-full flex flex-col gap-2'>
                    {allTarefas.map(tarefas => (
                      <CardTarefa
                        key={tarefas.id}
                        tarefas={tarefas}
                        loading={loading}
                        setLoading={setLoading}
                        listMode={listMode}
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
                )
              ) : (buscando || setor || lote) && filteredTarefas.length ? (
                <div className='w-full flex flex-col gap-2'>
                  {filteredTarefas.map(tarefas => (
                    <CardTarefa
                      key={tarefas.id}
                      tarefas={tarefas}
                      loading={loading}
                      setLoading={setLoading}
                      listMode={listMode}
                    />
                  ))}
                </div>
              ) : (
                <div className='flex flex-col items-center justify-center'>
                  <span
                    className={`${tomorrow.className} text-3xl flex uppercase`}
                  >
                    Sem tarefas correspondentes
                  </span>
                  <span className='m-5'>Nenhum resultado encontrado.</span>
                </div>
              )
            ) : buscando === '' && setor === null && lote === null ? (
              allTarefas.length ? (
                <div className='grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 '>
                  {allTarefas.map(tarefas => (
                    <CardTarefa
                      key={tarefas.id}
                      tarefas={tarefas}
                      loading={loading}
                      setLoading={setLoading}
                      listMode={listMode}
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
              )
            ) : (buscando || setor || lote) && filteredTarefas.length ? (
              <div className='grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 '>
                {filteredTarefas.map(tarefas => (
                  <CardTarefa
                    key={tarefas.id}
                    tarefas={tarefas}
                    loading={loading}
                    setLoading={setLoading}
                    listMode={listMode}
                  />
                ))}
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center'>
                <span
                  className={`${tomorrow.className} text-3xl flex uppercase`}
                >
                  Sem tarefas correspondentes
                </span>
                <span className='m-5'>Nenhum resultado encontrado.</span>
              </div>
            )}
          </div>

          {activeModal && chooseModal(modalComponentName)}
        </div>
      </main>
    </ThemeProvider>
  )
}

export default Home
