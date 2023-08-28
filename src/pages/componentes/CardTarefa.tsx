;('')
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import supabase from '../api/supabase'

interface PropsCardTarefa {
  tarefas: PropsTarefas
  loading: boolean
  setLoading: Dispatch<SetStateAction<boolean>>
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
interface PropsSetores {
  id: number
  setor: string
  responsavel: string
  created_at: Date
}

interface ModalComponents {
  [key: string]: JSX.Element
}

import { Tomorrow } from 'next/font/google'
import AdicionarTarefa from './AdicionarTarefaModal'

const tomorrow = Tomorrow({ subsets: ['latin'], weight: '600' })

const CardTarefa = ({ tarefas, loading, setLoading }: PropsCardTarefa) => {
  const [allSetores, setAllSetores] = useState<PropsSetores | null>(null)
  const [horario, setHorario] = useState('')
  const [activeModal, setActiveModal] = useState<boolean>(false)
  const [modalComponentName, setModalComponentName] = useState('')

  useEffect(() => {
    fetchData()
    ajustarHorario()
  }, [])

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

    let horarioCorreto: string = ''

    if (partesHorario) {
      const hora = partesHorario[0]
      const minuto = partesHorario[1]

      setHorario(`${hora}:${minuto}`)
    } else {
      setHorario('')
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

  const openModal = (modalName: string) => {
    setActiveModal(true)
    setModalComponentName(modalName)
  }

  const chooseModal = (modalName: string) => {
    const components: ModalComponents = {
      Editar: (
        <AdicionarTarefa
          activeModal={activeModal}
          setActiveModal={setActiveModal}
          loading={loading}
          setLoading={setLoading}
          isEditing
          idTarefa={tarefas?.id}
          setorTarefa={
            allSetores?.id === tarefas?.id_setor ? allSetores : null
          }
        />
      ),
    }
    return components[modalName]
  }

  return (
    <div>
      <span
        className='flex cursor-pointer'
        onClick={() => openModal('Editar')}
      >
        <div
          className={`${getColorClass()} w-64 h-40 flex text-black rounded-lg flex-col cursor-pointer`}
        >
          <div className='flex m-2 justify-between h-full'>
            <div className='my-4 mx-2'>
              <span className='flex max-w-170'>{tarefas?.tarefa}</span>
            </div>
            <div className='flex justify-between flex-col h-full items-end'>
              <span className={`${tomorrow.className} flex`}>
                {tarefas?.numero_tarefa}
              </span>
              <span>{horario ? horario : `Lote ${tarefas?.id_lote}`}</span>
            </div>
          </div>

          <div className=' justify-end  items-end'>
            <hr className='border-t-2 border-black justify-end  items-end' />
            <span className={`${tomorrow.className} m-2`}>
              {allSetores?.setor}
            </span>
          </div>
        </div>
      </span>
      {activeModal && chooseModal(modalComponentName)}
    </div>
  )
}

export default CardTarefa
