;('')
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import supabase from '../api/supabase'

import { Tomorrow } from 'next/font/google'
import TarefasModal from './TarefasModal'

interface PropsCardTarefa {
  tarefas: PropsTarefas
  loading: boolean
  setLoading: Dispatch<SetStateAction<boolean>>
  listMode: boolean
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

interface ModalComponents {
  [key: string]: JSX.Element
}

interface PropsLotes {
  id: number
  numero_lote: string
  horario_inicio: string
  horario_fim: string
  created_at: Date
}

const tomorrow = Tomorrow({ subsets: ['latin'], weight: '600' })

const Loop = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='30'
    height='80'
    viewBox='0 0 60 80'
    fill='none'
  >
    <path
      d='M30 10.9091V0L15 14.5455L30 29.0909V18.1818C42.4125 18.1818 52.5 27.9636 52.5 40C52.5 43.6727 51.5625 47.1636 49.875 50.1818L55.35 55.4909C58.275 51.0182 60 45.7091 60 40C60 23.9273 46.575 10.9091 30 10.9091ZM30 61.8182C17.5875 61.8182 7.5 52.0364 7.5 40C7.5 36.3273 8.4375 32.8364 10.125 29.8182L4.65 24.5091C1.725 28.9818 0 34.2909 0 40C0 56.0727 13.425 69.0909 30 69.0909V80L45 65.4545L30 50.9091V61.8182Z'
      fill='rgba(250, 218, 0, 200)'
    />
  </svg>
)

const Check = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='30'
    height='60'
    viewBox='0 0 60 60'
    fill='none'
  >
    <path
      d='M30 0C13.44 0 0 13.44 0 30C0 46.56 13.44 60 30 60C46.56 60 60 46.56 60 30C60 13.44 46.56 0 30 0ZM24 45L9 30L13.23 25.77L24 36.51L46.77 13.74L51 18L24 45Z'
      fill='rgba(31, 170, 77, 1)'
    />
  </svg>
)

const CardTarefa = ({
  tarefas,
  loading,
  setLoading,
  listMode,
}: PropsCardTarefa) => {
  const [allSetores, setAllSetores] = useState<PropsSetores | null>(null)
  const [horario, setHorario] = useState('')
  const [activeModal, setActiveModal] = useState<boolean>(false)
  const [modalComponentName, setModalComponentName] = useState('')
  const [resultadoOk, setResultadoOk] = useState(false)

  const [lotes, setLotes] = useState<PropsLotes | null>(null)

  useEffect(() => {
    fetchData()
    ajustarHorario()
    buscaResultado()
    fetchDataLotes()
  }, [tarefas])

  const fetchDataLotes = async () => {
    const { data, error } = await supabase
      .from('Lote')
      .select('*')
      .order('id')

    if (error) {
      console.error('Erro ao buscar dados tarefas:', error.message)
      return
    } else {
      const loteTarefa = data.find(lotes => lotes?.id === tarefas?.id_lote)
      setLotes(loteTarefa)
    }
  }
  const fetchData = async () => {
    const { data, error } = await supabase
      .from('Setores')
      .select('*')
      .order('setor')

    if (error) {
      console.error('Erro ao buscar dados setores:', error.message)
      return
    } else {
      const setorTarefa = data.find(
        setores => setores?.id === tarefas?.id_setor
      )
      setAllSetores(setorTarefa)
    }
  }

  const ajustarHorario = () => {
    const partesHorario = tarefas?.horario?.split(':')

    if (partesHorario) {
      const hora = partesHorario[0]
      const minuto = partesHorario[1]

      setHorario(`${hora}:${minuto}`)
    } else {
      setHorario('')
    }
  }

  const ajustarNumero = () => {
    return String(tarefas?.numero_tarefa).padStart(3, '0')
  }

  const buscaResultado = async () => {
    const { data, error } = await supabase
      .from('Resultado')
      .select('*')
      .eq('id_tarefa', tarefas.id)
      .single()

    if (error) {
      console.error('Erro ao buscar observação:', error.message)
      return
    }

    const zerada = await supabase
      .from('Tarefas')
      .select('status')
      .eq('id', tarefas.id)
      .single()

    if (data.forcask || data.aguia || data.poupanca || data.medonhos) {
      setResultadoOk(true)
    } else if (zerada.data?.status) {
      setResultadoOk(true)
    } else {
      setResultadoOk(false)
    }
  }

  const getColorClass = () => {
    switch (tarefas?.id_setor) {
      case 1:
        return 'bg-padrao-orange-500 hover:bg-padrao-orange-300'
      case 2:
        return 'bg-padrao-yellow-500 hover:bg-padrao-yellow-300'
      case 3:
        return 'bg-padrao-pink-500 hover:bg-padrao-pink-300'
      case 4:
        return 'bg-padrao-blue-500 hover:bg-padrao-blue-300'
      case 5:
        return 'bg-padrao-green-500 hover:bg-padrao-green-300'
      case 6:
        return 'bg-padrao-purple-500 hover:bg-padrao-purple-300'
      case 7:
        return 'bg-padrao-red-500 hover:bg-padrao-red-300'
      default:
        return 'bg-gray-600 hover:bg-gray-600'
    }
  }

  const getColorResult = () => {
    if (resultadoOk) {
      return 'bg-padrao-green-500'
    } else {
      return 'bg-padrao-yellow-500'
    }
  }

  const openModal = (modalName: string) => {
    setActiveModal(true)
    setModalComponentName(modalName)
  }

  const chooseModal = (modalName: string) => {
    const components: ModalComponents = {
      Informacoes: (
        <TarefasModal
          key={tarefas.id}
          tarefas={tarefas}
          activeModal={activeModal}
          setActiveModal={setActiveModal}
          loading={loading}
          setLoading={setLoading}
          idTarefa={tarefas?.id}
          allSetores={allSetores}
          lotes={lotes}
        />
      ),
    }
    return components[modalName]
  }

  return (
    <>
      {listMode ? (
        <div className='flex w-full gap-2'>
          <span
            className='flex w-full cursor-pointer gap-2'
            onClick={() => openModal('Informacoes')}
          >
            <div
              className={`${getColorClass()} w-full h-40 md:h-16 flex text-black rounded-lg cursor-pointer`}
            >
              <div className='flex m-2 items-center w-full gap-5'>
                <span
                  className={`${tomorrow.className} flex w-1/12 justify-center `}
                >
                  {ajustarNumero()}
                </span>
                <span className='flex w-7/12 md:w-3/4 overflow-hidden whitespace-nowrap'>
                  <div className='flex-1 w-3/4 overflow-hidden overflow-ellipsis'>
                    {tarefas?.tarefa}
                  </div>
                </span>
                <span className='flex w-2/12 justify-center'>
                  {horario ? horario : lotes?.numero_lote}
                </span>
                <span
                  className={`${tomorrow.className} m-2 w-1/12 justify-center hidden md:flex`}
                >
                  {allSetores?.setor}
                </span>
              </div>
            </div>
          </span>
          <div
            className={`${getColorResult()} w-5% h-40 md:h-16 flex text-black rounded-lg justify-center items-center`}
          >
            {resultadoOk ? <Check /> : <Loop />}
          </div>
          {activeModal && chooseModal(modalComponentName)}
        </div>
      ) : (
        <div>
          <span
            className='flex cursor-pointer'
            onClick={() => openModal('Informacoes')}
          >
            <div
              className={`${getColorClass()} w-64 h-44 flex text-black rounded-lg flex-col cursor-pointer`}
            >
              <div className='flex justify-between h-full m-2'>
                <div className='mx-2 my-4 w-max h-24'>
                  <span className='flex max-w-170 overflow-hidden whitespace-nowrap'>
                    <div className='flex-1 w-full h-full overflow-hidden overflow-ellipsis'>
                      {tarefas?.tarefa}
                    </div>
                  </span>
                </div>
                <div className='flex flex-col items-end justify-between h-full'>
                  <span className={`${tomorrow.className} flex`}>
                    {ajustarNumero()}
                  </span>
                  <span>
                    {horario ? horario : `Lote ${tarefas?.id_lote}`}
                  </span>
                </div>
              </div>
              <div className='items-end justify-end '>
                <hr className='items-end justify-end border-t-2 border-black' />
                <span className={`${tomorrow.className} m-2`}>
                  {allSetores?.setor}
                </span>
              </div>
            </div>
          </span>
          {activeModal && chooseModal(modalComponentName)}
        </div>
      )}
    </>
  )
}

export default CardTarefa
