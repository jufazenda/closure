import { Dispatch, SetStateAction } from 'react'

import { Tomorrow } from 'next/font/google'
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material'
import Image from 'next/image'
import Toggle from './commons/Toggle'

const tomorrow = Tomorrow({ subsets: ['latin'], weight: '600' })

interface PropsTarefasModal {
  tarefas: PropsTarefas
  activeModal: boolean
  setActiveModal: Dispatch<SetStateAction<boolean>>
  loading: boolean
  setLoading: Dispatch<SetStateAction<boolean>>
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

const TarefasModal = ({
  tarefas,
  activeModal,
  setActiveModal,
}: PropsTarefasModal) => {
  const closeModal = () => {
    setActiveModal(false)
  }

  const getColorClass500 = () => {
    switch (tarefas?.id_setor) {
      case 1:
        return 'bg-padrao-orange-500'
      case 2:
        return 'bg-padrao-yellow-500'
      case 3:
        return 'bg-padrao-pink-500'
      case 4:
        return 'bg-padrao-blue-500'
      case 5:
        return 'bg-padrao-green-500'
      case 6:
        return 'bg-padrao-purple-500'
      case 7:
        return 'bg-padrao-red-500'
      default:
        return 'bg-gray-600'
    }
  }

  const getColorClass300 = () => {
    switch (tarefas?.id_setor) {
      case 1:
        return 'bg-padrao-orange-300'
      case 2:
        return 'bg-padrao-yellow-300'
      case 3:
        return 'bg-padrao-pink-300'
      case 4:
        return 'bg-padrao-blue-300'
      case 5:
        return 'bg-padrao-green-300'
      case 6:
        return 'bg-padrao-purple-300'
      case 7:
        return 'bg-padrao-red-300'
      default:
        return 'bg-gray-600'
    }
  }

  return (
    <div
      className='fixed top-0 left-0 flex items-center justify-center w-full h-full mt-10 overflow-auto '
      //onClick={onClose}
    >
      <div
        className='bg-white rounded m-10 shadow w-3/4 md:w-3/5 max-h-450 md:max-h-80% overflow-auto'
        onClick={e => e.stopPropagation()}
      >
        <header
          className={`${getColorClass500()} flex flex-col items-center gap-4 p-8 border-b-2`}
        >
          <div className='flex justify-between w-full'>
            <span
              className={`${tomorrow.className} text-3xl flex break-words w-3/4`}
            >
              {tarefas.tarefa}
            </span>
            <span className={`${tomorrow.className} text-2xl flex`}>
              {tarefas.numero_tarefa}
            </span>
          </div>
          <div className='flex flex-col justify-between w-full md:flex-row'>
            <span className={`${tomorrow.className} text-lg flex`}>
              {tarefas.id_lote
                ? `Lote ${tarefas.id_lote} `
                : tarefas.horario}
            </span>
            <div>
              <span className={`${tomorrow.className} text-md flex`}>
                {tarefas.pontuacaoMaxima ? (
                  <span
                    className={`p-2 rounded-md ${getColorClass300()} `}
                  >{`Pontuação: ${tarefas.pontuacaoMaxima} `}</span>
                ) : (
                  <div className='flex gap-7'>
                    <span
                      className={`p-2 rounded-md ${getColorClass300()} `}
                    >{`1º - ${tarefas.pontuacaoMaxima} `}</span>
                    <span
                      className={`p-2 rounded-md ${getColorClass300()} `}
                    >{`2º - ${tarefas.pontuacaoMaxima} `}</span>
                    <span
                      className={`p-2 rounded-md ${getColorClass300()} `}
                    >{`3º - ${tarefas.pontuacaoMaxima} `}</span>
                    <span
                      className={`p-2 rounded-md ${getColorClass300()} `}
                    >{`4º - ${tarefas.pontuacaoMaxima} `}</span>
                  </div>
                )}
              </span>
            </div>
          </div>
        </header>
        <section className='w-full px-10 pt-8 pb-0 md:h-full'>
          <div className='flex flex-col w-full gap-5 my-5 md:flex-col'>
            <span className={`${tomorrow.className} text-xl flex`}>
              RESULTADO
            </span> 
            <span className='flex justify-center w-full'>
              <div className='grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                <div className='flex flex-col items-center justify-center gap-5 border-r-2 w-36'>
                  <Image
                    src='/logosEquipes/sk.png'
                    alt='Logo Força SK'
                    width={100}
                    height={100}
                    priority
                  />
                  <Toggle />
                </div>
                <div className='flex flex-col items-center justify-center gap-5 border-r-2 w-36'>
                  <Image
                    src='/logosEquipes/aguia.png'
                    alt='Logo Águia de Fogo'
                    width={130}
                    height={100}
                    priority
                  />
                  <Toggle />
                </div>
                <div className='flex flex-col items-center justify-center gap-5 border-r-2 w-36'>
                  <Image
                    src='/logosEquipes/poupanca.png'
                    alt='Logo Poupança'
                    width={130}
                    height={100}
                    priority
                  />
                  <Toggle />
                </div>
                <div className='flex flex-col items-center justify-center gap-5 w-36'>
                  <Image
                    src='/logosEquipes/medonhos.png'
                    alt='Logo Medonhos'
                    width={130}
                    height={100}
                    priority
                  />
                  <Toggle />
                </div>
              </div>
            </span>
          </div>
        </section>
      </div>
    </div>
  )
}

export default TarefasModal

//ajustar 

{
  /* <div className='flex w-full'>
                  <FormControl>
                    <FormLabel id='tarefa-cumprida'>
                      Tarefa Cumprida
                    </FormLabel>
                    <RadioGroup
                      aria-labelledby='tarefa-cumprida'
                      name='tarefa-cumprida'
                      color='black'
                       value={value}
                      onChange={handleChange} 
                    >
                      <FormControlLabel
                        value='female'
                        control={<Radio />}
                        label='Female'
                      />
                      <FormControlLabel
                        value='male'
                        control={<Radio />}
                        label='Male'
                      />
                    </RadioGroup>
                  </FormControl>
                </div> */
}

{
  /* <div className='row-1'>
              <div className='tarefa'>
                <BlackTextField
                  type='String'
                  multiline
                  rows={2}
                  onChange={event => {
                    setActionText(event.target.value)
                  }}
                  sx={{
                    '.MuiFormLabel-root': {
                      fontFamily: 'Montserrat',
                      alignItems: 'center',
                      display: 'flex',
                      height: '25px',
                      color: 'black',
                      fontWeight: 600,
                    },
                  }}
                  label='Observação'
                />
              </div>
            </div>*/
}
