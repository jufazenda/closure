/* eslint-disable react-hooks/exhaustive-deps */
import { Dispatch, SetStateAction, useState, useEffect } from 'react'

import { Tomorrow } from 'next/font/google'
import {
  Autocomplete,
  Button,
  IconButton,
  TextField,
  ThemeProvider,
  Tooltip,
  createTheme,
  styled,
} from '@mui/material'
import Image from 'next/image'
import Toggle from './commons/Toggle'
import supabase from '../api/supabase'
import Notification from './commons/Notification'
import { Edit, OpenInNew } from '@mui/icons-material'
import Link from 'next/link'
import AdicionarTarefa from './AdicionarTarefaModal'

const tomorrow = Tomorrow({ subsets: ['latin'], weight: '600' })

interface PropsTarefasModal {
  tarefas: PropsTarefas
  activeModal: boolean
  setActiveModal: Dispatch<SetStateAction<boolean>>
  loading: boolean
  setLoading: Dispatch<SetStateAction<boolean>>
  idTarefa: number
  allSetores: PropsSetores | null
}

interface PropsSetores {
  id: number
  setor: string
  responsavel: string
  created_at: Date
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
  observacao?: string
  link?: string
}

interface PropsColocacao {
  id: number
  label: string
}

interface PropsResultado {
  id: number
  forcask: number
  aguia: number
  poupanca: number
  medonhos: number
  id_tarefa: number
}

interface ModalComponents {
  [key: string]: JSX.Element
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#000000',
    },
  },
})

const BlackTextField = styled(TextField)`
  input {
    color: black !important; /* Defina a cor do texto */
  }
  .MuiOutlinedInput-root {
    fieldset {
      border: none;
      color: black;
      background-color: rgba(232, 232, 232, 0.5);
    }
    &:hover fieldset {
      border-color: black !important;
      color: black;
    }
    &.Mui-focused fieldset {
      border-color: black !important;
      color: black;
    }
  }
`

const TarefasModal = ({
  tarefas,
  activeModal,
  setActiveModal,
  loading,
  setLoading,
  idTarefa,
  allSetores,
}: PropsTarefasModal) => {
  const [forcask, setForcask] = useState<number | string>('')
  const [aguia, setAguia] = useState<number | string>('')
  const [poupanca, setPoupanca] = useState<number | string>('')
  const [medonhos, setMedonhos] = useState<number | string>('')

  const [tarefaCumpridaSK, setTarefaCumpridaSK] = useState(false)

  const [tarefaCumpridaAguia, setTarefaCumpridaAguia] = useState(false)

  const [tarefaCumpridaPoups, setTarefaCumpridaPoups] = useState(false)

  const [tarefaCumpridaMed, setTarefaCumpridaMed] = useState(false)

  const [forcaskColocacao, setForcaskColocacao] =
    useState<PropsColocacao | null>({
      id: 0,
      label: '',
    })
  const [aguiaColocacao, setAguiaColocacao] =
    useState<PropsColocacao | null>({
      id: 0,
      label: '',
    })
  const [poupancaColocacao, setPoupancaColocacao] =
    useState<PropsColocacao | null>({
      id: 0,
      label: '',
    })
  const [medonhosColocacao, setMedonhosColocacao] =
    useState<PropsColocacao | null>({
      id: 0,
      label: '',
    })

  const [bonificacaoSK, setBonificacaoSK] = useState<number | string>('')
  const [bonificacaoAguia, setBonificacaoAguia] = useState<
    number | string
  >('')
  const [bonificacaoPoups, setBonificacaoPoups] = useState<
    number | string
  >('')
  const [bonificacaoMedonhos, setBonificacaoMedonhos] = useState<
    number | string
  >('')

  const [respostaCharada, setRespostaCharada] = useState<string>('')
  const [observacao, setObservacao] = useState<string>('')
  const [resultadoById, setResultadoById] = useState<PropsResultado[]>([])
  const [horarioPadrao, setHorarioPadrao] = useState<string>('')

  const [notificationProps, setNotificationProps] = useState({
    importantMessage: '',
    message: '',
    setShowNotification: false,
    type: 0,
  })

  const [opcoesColocacao, setOpcoesColocacao] = useState<PropsColocacao[]>(
    []
  )

  const [editModalActive, setEditModalActive] = useState(false)

  const [modalComponentName, setModalComponentName] = useState('')

  const openModalEdit = (modalName: string) => {
    setEditModalActive(true)
    setModalComponentName(modalName)
  }

  const chooseModal = (modalName: string) => {
    const components: ModalComponents = {
      Editar: (
        <AdicionarTarefa
          key={tarefas?.id}
          activeModal={editModalActive}
          setActiveModal={setEditModalActive}
          loading={loading}
          setLoading={setLoading}
          idTarefa={tarefas?.id}
          isEditing
        />
      ),
    }
    return components[modalName]
  }

  const closeModal = () => {
    setActiveModal(false)
  }

  const onClickButton = async () => {
    const { data, error } = await supabase
      .from('Resultado')
      .update({
        forcask: forcask,
        aguia: aguia,
        poupanca: poupanca,
        medonhos: medonhos,
      })
      .eq('id_tarefa', idTarefa)

    if (error) {
      console.error('Erro ao buscar dados setores:', error.message)
      return
    }
    salvarInfos()
    salvarResultadoSK()
    salvarResultadoAguia()
    salvarResultadPoups()
    salvarResultadoMed()

    setNotificationProps({
      importantMessage: 'Sucesso!',
      message: 'Resultado registrado.',
      setShowNotification: true,
      type: 1,
    })
  }

  const buscaTarefa = async () => {
    const { data, error } = await supabase
      .from('Tarefas')
      .select('*')
      .eq('id', idTarefa)
      .single()

    if (error) {
      console.error('Erro ao buscar observação:', error.message)
      return
    }

    if (data) {
      setObservacao(data.observacao || '')
      setRespostaCharada(data.respostaCharada || '')
    }
  }

  const buscaColocacao = async () => {
    const { data, error } = await supabase
      .from('Colocacao')
      .select('*')
      .order('id')

    if (error) {
      console.error('Erro ao buscar colocacao:', error.message)
      return
    }

    if (data) {
      setOpcoesColocacao(data)
    }
  }

  const salvarInfos = async () => {
    const { data, error } = await supabase
      .from('Tarefas')
      .update({
        respostaCharada: respostaCharada,
        observacao: observacao,
      })
      .eq('id', idTarefa)
    if (error) {
      console.error('Erro ao buscar dados setores:', error.message)
      return
    }
  }

  const salvarResultadoSK = async () => {
    const { data, error } = await supabase
      .from('ForcaSK')
      .update({
        colocacao: forcaskColocacao?.id || null,
        tarefaCumprida: tarefas?.pontuacaoMaxima ? tarefaCumpridaSK : null,
        bonificacao: Number(bonificacaoSK),
      })
      .eq('id_tarefa', idTarefa)

    if (error) {
      console.error('Erro ao buscar dados setores:', error.message)
      return
    }
  }

  const salvarResultadoAguia = async () => {
    const { data, error } = await supabase
      .from('AguiaDeFogo')
      .update({
        colocacao: aguiaColocacao?.id || null,
        tarefaCumprida: tarefas?.pontuacaoMaxima
          ? tarefaCumpridaAguia
          : null,
        bonificacao: Number(bonificacaoAguia),
      })
      .eq('id_tarefa', idTarefa)
    if (error) {
      console.error('Erro ao buscar dados setores:', error.message)
      return
    }
  }

  const salvarResultadPoups = async () => {
    const { data, error } = await supabase
      .from('Poupanca')
      .update({
        colocacao: poupancaColocacao?.id || null,
        tarefaCumprida: tarefas?.pontuacaoMaxima
          ? tarefaCumpridaPoups
          : null,
        bonificacao: Number(bonificacaoPoups),
      })
      .eq('id_tarefa', idTarefa)
    if (error) {
      console.error('Erro ao buscar dados setores:', error.message)
      return
    }
  }

  const salvarResultadoMed = async () => {
    const { data, error } = await supabase
      .from('Medonhos')
      .update({
        colocacao: medonhosColocacao?.id || null,
        tarefaCumprida: tarefas?.pontuacaoMaxima
          ? tarefaCumpridaMed
          : null,
        bonificacao: Number(bonificacaoMedonhos),
      })
      .eq('id_tarefa', idTarefa)
    if (error) {
      console.error('Erro ao buscar dados setores:', error.message)
      return
    }
  }

  const buscarResultadoSK = async () => {
    const { data, error } = await supabase
      .from('ForcaSK')
      .select('*')
      .eq('id_tarefa', idTarefa)
      .single()

    if (error) {
      console.error('Erro ao buscar observação:', error.message)
      return
    }

    if (data) {
      const findColocacao = opcoesColocacao?.find(
        colocacao => colocacao.id === data.colocacao
      )

      if (findColocacao) {
        setForcaskColocacao(findColocacao)
      }

      setTarefaCumpridaSK(data.tarefaCumprida || false)
      setBonificacaoSK(data.bonificacao || '')
    }
  }

  const buscarResultadoAguia = async () => {
    const { data, error } = await supabase
      .from('AguiaDeFogo')
      .select('*')
      .eq('id_tarefa', idTarefa)
      .single()

    if (error) {
      console.error('Erro ao buscar observação:', error.message)
      return
    }

    if (data) {
      const findColocacao = opcoesColocacao?.find(
        colocacao => colocacao.id === data.colocacao
      )

      if (findColocacao) {
        setAguiaColocacao(findColocacao)
      }

      setTarefaCumpridaAguia(data.tarefaCumprida || false)
      setBonificacaoAguia(data.bonificacao || '')
    }
  }

  const buscarResultadPoups = async () => {
    const { data, error } = await supabase
      .from('Poupanca')
      .select('*')
      .eq('id_tarefa', idTarefa)
      .single()

    if (error) {
      console.error('Erro ao buscar observação:', error.message)
      return
    }

    if (data) {
      const findColocacao = opcoesColocacao?.find(
        colocacao => colocacao.id === data.colocacao
      )

      if (findColocacao) {
        setPoupancaColocacao(findColocacao)
      }

      setTarefaCumpridaPoups(data.tarefaCumprida || false)
      setBonificacaoPoups(data.bonificacao || '')
    }
  }

  const buscarResultadoMed = async () => {
    const { data, error } = await supabase
      .from('Medonhos')
      .select('*')
      .eq('id_tarefa', idTarefa)
      .single()

    if (error) {
      console.error('Erro ao buscar observação:', error.message)
      return
    }

    if (data) {
      const findColocacao = opcoesColocacao?.find(
        colocacao => colocacao.id === data.colocacao
      )

      if (findColocacao) {
        setMedonhosColocacao(findColocacao)
      }

      setTarefaCumpridaMed(data.tarefaCumprida || false)
      setBonificacaoMedonhos(data.bonificacao || '')
    }
  }

  const ajustarHorario = () => {
    const partesHorario = tarefas?.horario?.split(':')

    if (partesHorario) {
      const hora = partesHorario[0]
      const minuto = partesHorario[1]

      setHorarioPadrao(`${hora}:${minuto}`)
    } else {
      setHorarioPadrao('')
    }
  }

  const ajustarNumero = () => {
    return String(tarefas?.numero_tarefa).padStart(3, '0')
  }

  useEffect(() => {
    calculandoResultado()
  }, [
    tarefaCumpridaSK,
    bonificacaoSK,
    tarefaCumpridaAguia,
    bonificacaoAguia,
    tarefaCumpridaPoups,
    bonificacaoPoups,
    tarefaCumpridaMed,
    bonificacaoMedonhos,
    forcaskColocacao,
    aguiaColocacao,
    medonhosColocacao,
    poupancaColocacao,
  ])

  useEffect(() => {
    const fetchData = async () => {
      if (activeModal && idTarefa) {
        await buscaTarefa()
        await buscaColocacao()
        ajustarHorario()
      }
    }

    fetchData()
  }, [activeModal, idTarefa])

  useEffect(() => {
    buscarResultadoSK()
    buscarResultadoAguia()
    buscarResultadoMed()
    buscarResultadPoups()
  }, [opcoesColocacao])

  const calculandoResultado = () => {
    if (tarefas?.pontuacaoMaxima) {
      if (tarefaCumpridaSK) {
        setForcask(
          Number(tarefas?.pontuacaoMaxima) + Number(bonificacaoSK)
        )
      } else if (bonificacaoSK) {
        setForcask(Number(bonificacaoSK))
      } else {
        setForcask(0)
      }

      if (tarefaCumpridaAguia) {
        setAguia(
          Number(tarefas?.pontuacaoMaxima) + Number(bonificacaoAguia)
        )
      } else if (bonificacaoAguia) {
        setAguia(Number(bonificacaoAguia))
      } else {
        setAguia(0)
      }

      if (tarefaCumpridaPoups) {
        setPoupanca(
          Number(tarefas?.pontuacaoMaxima) + Number(bonificacaoPoups)
        )
      } else if (bonificacaoPoups) {
        setPoupanca(Number(bonificacaoPoups))
      } else {
        setPoupanca(0)
      }

      if (tarefaCumpridaMed) {
        setMedonhos(
          Number(tarefas?.pontuacaoMaxima) + Number(bonificacaoMedonhos)
        )
      } else if (bonificacaoMedonhos) {
        setMedonhos(Number(bonificacaoMedonhos))
      } else {
        setMedonhos(0)
      }
    } else {
      if (forcaskColocacao?.id === 1) {
        setForcask(
          Number(tarefas?.pontuacaoPrimeiro) + Number(bonificacaoSK)
        )
      } else if (forcaskColocacao?.id === 2) {
        setForcask(
          Number(tarefas?.pontuacaoSegundo) + Number(bonificacaoSK)
        )
      } else if (forcaskColocacao?.id === 3) {
        setForcask(
          Number(tarefas?.pontuacaoTerceiro) + Number(bonificacaoSK)
        )
      } else if (forcaskColocacao?.id === 4) {
        setForcask(
          Number(tarefas?.pontuacaoQuarto) + Number(bonificacaoSK)
        )
      } else if (forcaskColocacao?.id === 5 && bonificacaoSK) {
        setForcask(Number(bonificacaoSK))
      } else {
        setForcask(0)
      }

      if (aguiaColocacao?.id === 1) {
        setAguia(
          Number(tarefas?.pontuacaoPrimeiro) + Number(bonificacaoAguia)
        )
      } else if (aguiaColocacao?.id === 2) {
        setAguia(
          Number(tarefas?.pontuacaoSegundo) + Number(bonificacaoAguia)
        )
      } else if (aguiaColocacao?.id === 3) {
        setAguia(
          Number(tarefas?.pontuacaoTerceiro) + Number(bonificacaoAguia)
        )
      } else if (aguiaColocacao?.id === 4) {
        setAguia(
          Number(tarefas?.pontuacaoQuarto) + Number(bonificacaoAguia)
        )
      } else if (aguiaColocacao?.id === 5 && bonificacaoAguia) {
        setAguia(Number(bonificacaoAguia))
      } else {
        setAguia(0)
      }

      if (poupancaColocacao?.id === 1) {
        setPoupanca(
          Number(tarefas?.pontuacaoPrimeiro) + Number(bonificacaoPoups)
        )
      } else if (poupancaColocacao?.id === 2) {
        setPoupanca(
          Number(tarefas?.pontuacaoSegundo) + Number(bonificacaoPoups)
        )
      } else if (poupancaColocacao?.id === 3) {
        setPoupanca(
          Number(tarefas?.pontuacaoTerceiro) + Number(bonificacaoPoups)
        )
      } else if (poupancaColocacao?.id === 4) {
        setPoupanca(
          Number(tarefas?.pontuacaoQuarto) + Number(bonificacaoPoups)
        )
      } else if (poupancaColocacao?.id === 5 && bonificacaoPoups) {
        setPoupanca(Number(bonificacaoPoups))
      } else {
        setPoupanca(0)
      }

      if (medonhosColocacao?.id === 1) {
        setMedonhos(
          Number(tarefas?.pontuacaoPrimeiro) + Number(bonificacaoMedonhos)
        )
      } else if (medonhosColocacao?.id === 2) {
        setMedonhos(
          Number(tarefas?.pontuacaoSegundo) + Number(bonificacaoMedonhos)
        )
      } else if (medonhosColocacao?.id === 3) {
        setMedonhos(
          Number(tarefas?.pontuacaoTerceiro) + Number(bonificacaoMedonhos)
        )
      } else if (medonhosColocacao?.id === 4) {
        setMedonhos(
          Number(tarefas?.pontuacaoQuarto) + Number(bonificacaoMedonhos)
        )
      } else if (medonhosColocacao?.id === 5 && bonificacaoMedonhos) {
        setMedonhos(Number(bonificacaoMedonhos))
      } else {
        setMedonhos(0)
      }
    }
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
    <ThemeProvider theme={theme}>
      <div
        className='fixed top-0 left-0 flex items-center justify-center w-full h-full mt-10 overflow-auto bg-black-shadow'
        onClick={closeModal}
      >
        <div
          className='bg-white rounded-2xl m-10 shadow w-3/4 md:w-3/5 max-h-450 md:max-h-80% overflow-auto '
          onClick={e => e.stopPropagation()}
        >
          {editModalActive ? (
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
          ) : (
            <>
              <header
                className={`${getColorClass500()} flex flex-col items-center gap-6 p-8 border-b-2`}
              >
                <div className='flex justify-between w-full'>
                  <span
                    className={`${tomorrow.className} text-3xl flex break-words w-3/4`}
                  >
                    {tarefas?.tarefa}
                  </span>

                  <span className={`${tomorrow.className} text-2xl flex`}>
                    {ajustarNumero()}
                  </span>
                </div>
                <div className='flex gap-5 w-full justify-end '>
                  <Tooltip title='Editar'>
                    <IconButton
                      onClick={() => {
                        setEditModalActive(true)
                      }}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='Abrir Link da Tarefa'>
                    <Link href={tarefas?.link || '/'} target='_blank'>
                      <IconButton>
                        <OpenInNew />
                      </IconButton>
                    </Link>
                  </Tooltip>
                </div>
                <div className='flex flex-col justify-between w-full items-center md:flex-row'>
                  <span className={`${tomorrow.className} text-lg flex`}>
                    {tarefas?.id_lote
                      ? `Lote ${tarefas?.id_lote} `
                      : horarioPadrao}
                  </span>
                  <div>
                    <span className={`${tomorrow.className} text-md flex`}>
                      {tarefas?.pontuacaoMaxima ? (
                        <span
                          className={`p-2 rounded-md ${getColorClass300()} `}
                        >{`Pontuação: ${tarefas?.pontuacaoMaxima} `}</span>
                      ) : (
                        <div className='flex gap-7'>
                          <span
                            className={`p-2 rounded-md ${getColorClass300()} `}
                          >{`1º - ${tarefas?.pontuacaoPrimeiro} `}</span>
                          <span
                            className={`p-2 rounded-md ${getColorClass300()} `}
                          >{`2º - ${tarefas?.pontuacaoSegundo} `}</span>
                          <span
                            className={`p-2 rounded-md ${getColorClass300()} `}
                          >{`3º - ${tarefas?.pontuacaoTerceiro} `}</span>
                          <span
                            className={`p-2 rounded-md ${getColorClass300()} `}
                          >{`4º - ${tarefas?.pontuacaoQuarto} `}</span>
                        </div>
                      )}
                    </span>
                  </div>
                </div>
              </header>

              <section className='w-full px-10 pt-8 pb-0 md:h-full'>
                <div className='flex flex-col w-full gap-5 my-5 md:flex-col'>
                  <span
                    className={`${tomorrow.className} text-xl flex justify-between items-center`}
                  >
                    RESULTADO
                    {tarefas?.id_setor === 1 ? (
                      <div>
                        <BlackTextField
                          type='String'
                          value={respostaCharada}
                          onChange={event => {
                            setRespostaCharada(event.target.value)
                          }}
                          sx={{
                            '.MuiFormLabel-root': {
                              alignItems: 'center',
                              display: 'flex',
                              height: '25px',
                              color: 'black',
                              fontWeight: 600,
                            },
                          }}
                          label='Resposta'
                        />
                      </div>
                    ) : null}
                  </span>
                  <span className='flex justify-center w-full'>
                    {tarefas?.pontuacaoMaxima ? (
                      <div className='grid grid-cols-1 gap-10 mb-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                        <div className='flex flex-col items-center justify-center gap-5 '>
                          <Image
                            src='/logosEquipes/sk.png'
                            alt='Logo Força SK'
                            width={110}
                            height={100}
                            priority
                          />
                          <Toggle
                            setChange={setTarefaCumpridaSK}
                            change={tarefaCumpridaSK}
                          />
                          <BlackTextField
                            type='number'
                            inputProps={{ min: 0 }}
                            onChange={event => {
                              setBonificacaoSK(event.target.value)
                            }}
                            value={bonificacaoSK && bonificacaoSK}
                            sx={{
                              '.MuiFormLabel-root': {
                                alignItems: 'center',
                                display: 'flex',
                                height: '25px',
                                color: 'black',
                                fontWeight: 600,
                              },
                              width: '100%',
                            }}
                            label='Bonificação'
                          />
                        </div>
                        <div className='flex flex-col items-center justify-center gap-5'>
                          <Image
                            src='/logosEquipes/aguia.png'
                            alt='Logo Águia de Fogo'
                            width={130}
                            height={100}
                            priority
                          />
                          <Toggle
                            setChange={setTarefaCumpridaAguia}
                            change={tarefaCumpridaAguia}
                          />
                          <BlackTextField
                            type='number'
                            inputProps={{ min: 0 }}
                            onChange={event => {
                              setBonificacaoAguia(event.target.value)
                            }}
                            value={bonificacaoAguia && bonificacaoAguia}
                            sx={{
                              '.MuiFormLabel-root': {
                                alignItems: 'center',
                                display: 'flex',
                                height: '25px',
                                color: 'black',
                                fontWeight: 600,
                              },
                              width: '100%',
                            }}
                            label='Bonificação'
                          />
                        </div>
                        <div className='flex flex-col items-center justify-center gap-5 '>
                          <Image
                            src='/logosEquipes/poupanca.png'
                            alt='Logo Poupança'
                            width={130}
                            height={100}
                            priority
                          />
                          <Toggle
                            setChange={setTarefaCumpridaPoups}
                            change={tarefaCumpridaPoups}
                          />
                          <BlackTextField
                            type='number'
                            inputProps={{ min: 0 }}
                            onChange={event => {
                              setBonificacaoPoups(event.target.value)
                            }}
                            value={bonificacaoPoups && bonificacaoPoups}
                            sx={{
                              '.MuiFormLabel-root': {
                                alignItems: 'center',
                                display: 'flex',
                                height: '25px',
                                color: 'black',
                                fontWeight: 600,
                              },
                              width: '100%',
                            }}
                            label='Bonificação'
                          />
                        </div>
                        <div className='flex flex-col items-center justify-center gap-5'>
                          <Image
                            src='/logosEquipes/medonhos.png'
                            alt='Logo Medonhos'
                            width={130}
                            height={100}
                            priority
                          />
                          <Toggle
                            setChange={setTarefaCumpridaMed}
                            change={tarefaCumpridaMed}
                          />
                          <BlackTextField
                            type='number'
                            inputProps={{ min: 0 }}
                            onChange={event => {
                              setBonificacaoMedonhos(event.target.value)
                            }}
                            value={
                              bonificacaoMedonhos && bonificacaoMedonhos
                            }
                            sx={{
                              '.MuiFormLabel-root': {
                                alignItems: 'center',
                                display: 'flex',
                                height: '25px',
                                color: 'black',
                                fontWeight: 600,
                              },
                              width: '100%',
                            }}
                            label='Bonificação'
                          />
                        </div>
                      </div>
                    ) : (
                      <div className='grid grid-cols-1 gap-10 mb-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                        <div className='flex flex-col items-center justify-center gap-5 '>
                          <Image
                            src='/logosEquipes/sk.png'
                            alt='Logo Força SK'
                            width={110}
                            height={100}
                            priority
                          />
                          <Autocomplete
                            options={opcoesColocacao}
                            getOptionLabel={option => option.label}
                            ListboxProps={{
                              style: {
                                maxHeight: 190,
                                fontFamily: 'Montserrat',
                              },
                            }}
                            size='medium'
                            onChange={(event, newValue) => {
                              setForcaskColocacao(newValue)
                            }}
                            value={forcaskColocacao}
                            sx={{
                              '.MuiFormLabel-root': {
                                alignItems: 'center',
                                display: 'flex',
                                height: '25px',
                                color: 'black',
                                fontWeight: 600,
                              },
                              width: '100%',
                            }}
                            renderInput={params => (
                              <BlackTextField
                                {...params}
                                label='Colocação'
                                variant='outlined'
                                sx={{
                                  '.MuiFormLabel-root': {
                                    alignItems: 'center',
                                    display: 'flex',
                                    height: '25px',
                                    color: 'black',
                                    fontWeight: 600,
                                  },
                                  width: '100%',
                                }}
                              />
                            )}
                          />
                          <BlackTextField
                            type='number'
                            inputProps={{ min: 0 }}
                            onChange={event => {
                              setBonificacaoSK(event.target.value)
                            }}
                            value={bonificacaoSK && bonificacaoSK}
                            sx={{
                              '.MuiFormLabel-root': {
                                alignItems: 'center',
                                display: 'flex',
                                height: '25px',
                                color: 'black',
                                fontWeight: 600,
                              },
                              width: '100%',
                            }}
                            label='Bonificação'
                          />
                        </div>
                        <div className='flex flex-col items-center justify-center gap-5'>
                          <Image
                            src='/logosEquipes/aguia.png'
                            alt='Logo Águia de Fogo'
                            width={130}
                            height={100}
                            priority
                          />
                          <Autocomplete
                            options={opcoesColocacao}
                            getOptionLabel={option => option.label}
                            ListboxProps={{
                              style: {
                                maxHeight: 190,
                                fontFamily: 'Montserrat',
                              },
                            }}
                            size='medium'
                            onChange={(event, newValue) => {
                              setAguiaColocacao(newValue)
                            }}
                            value={aguiaColocacao}
                            sx={{
                              '.MuiFormLabel-root': {
                                alignItems: 'center',
                                display: 'flex',
                                height: '25px',
                                color: 'black',
                                fontWeight: 600,
                              },
                              width: '100%',
                            }}
                            renderInput={params => (
                              <BlackTextField
                                {...params}
                                label='Colocação'
                                variant='outlined'
                                sx={{
                                  '.MuiFormLabel-root': {
                                    alignItems: 'center',
                                    display: 'flex',
                                    height: '25px',
                                    color: 'black',
                                    fontWeight: 600,
                                  },
                                  width: '100%',
                                }}
                              />
                            )}
                          />
                          <BlackTextField
                            type='number'
                            inputProps={{ min: 0 }}
                            onChange={event => {
                              setBonificacaoAguia(event.target.value)
                            }}
                            value={bonificacaoAguia && bonificacaoAguia}
                            sx={{
                              '.MuiFormLabel-root': {
                                alignItems: 'center',
                                display: 'flex',
                                height: '25px',
                                color: 'black',
                                fontWeight: 600,
                              },
                              width: '100%',
                            }}
                            label='Bonificação'
                          />
                        </div>
                        <div className='flex flex-col items-center justify-center gap-5 '>
                          <Image
                            src='/logosEquipes/poupanca.png'
                            alt='Logo Poupança'
                            width={130}
                            height={100}
                            priority
                          />
                          <Autocomplete
                            options={opcoesColocacao}
                            getOptionLabel={option => option.label}
                            ListboxProps={{
                              style: {
                                maxHeight: 190,
                                fontFamily: 'Montserrat',
                              },
                            }}
                            size='medium'
                            onChange={(event, newValue) => {
                              setPoupancaColocacao(newValue)
                            }}
                            value={poupancaColocacao}
                            sx={{
                              '.MuiFormLabel-root': {
                                alignItems: 'center',
                                display: 'flex',
                                height: '25px',
                                color: 'black',
                                fontWeight: 600,
                              },
                              width: '100%',
                            }}
                            renderInput={params => (
                              <BlackTextField
                                {...params}
                                label='Colocação'
                                variant='outlined'
                                sx={{
                                  '.MuiFormLabel-root': {
                                    alignItems: 'center',
                                    display: 'flex',
                                    height: '25px',
                                    color: 'black',
                                    fontWeight: 600,
                                  },
                                  width: '100%',
                                }}
                              />
                            )}
                          />
                          <BlackTextField
                            type='number'
                            inputProps={{ min: 0 }}
                            onChange={event => {
                              setBonificacaoPoups(event.target.value)
                            }}
                            value={bonificacaoPoups && bonificacaoPoups}
                            sx={{
                              '.MuiFormLabel-root': {
                                alignItems: 'center',
                                display: 'flex',
                                height: '25px',
                                color: 'black',
                                fontWeight: 600,
                              },
                              width: '100%',
                            }}
                            label='Bonificação'
                          />
                        </div>
                        <div className='flex flex-col items-center justify-center gap-5 '>
                          <Image
                            src='/logosEquipes/medonhos.png'
                            alt='Logo Medonhos'
                            width={130}
                            height={100}
                            priority
                          />
                          <Autocomplete
                            options={opcoesColocacao}
                            getOptionLabel={option => option.label}
                            ListboxProps={{
                              style: {
                                maxHeight: 190,
                                fontFamily: 'Montserrat',
                              },
                            }}
                            size='medium'
                            onChange={(event, newValue) => {
                              setMedonhosColocacao(newValue)
                            }}
                            value={medonhosColocacao}
                            sx={{
                              '.MuiFormLabel-root': {
                                alignItems: 'center',
                                display: 'flex',
                                height: '25px',
                                color: 'black',
                                fontWeight: 600,
                              },
                              width: '100%',
                            }}
                            renderInput={params => (
                              <BlackTextField
                                {...params}
                                label='Colocação'
                                variant='outlined'
                                sx={{
                                  '.MuiFormLabel-root': {
                                    alignItems: 'center',
                                    display: 'flex',
                                    height: '25px',
                                    color: 'black',
                                    fontWeight: 600,
                                  },
                                  width: '100%',
                                }}
                              />
                            )}
                          />
                          <BlackTextField
                            type='number'
                            inputProps={{ min: 0 }}
                            onChange={event => {
                              setBonificacaoMedonhos(event.target.value)
                            }}
                            value={
                              bonificacaoMedonhos && bonificacaoMedonhos
                            }
                            sx={{
                              '.MuiFormLabel-root': {
                                alignItems: 'center',
                                display: 'flex',
                                height: '25px',
                                color: 'black',
                                fontWeight: 600,
                              },
                              width: '100%',
                            }}
                            label='Bonificação'
                          />
                        </div>
                      </div>
                    )}
                  </span>
                  <span className='flex w-full'>
                    <BlackTextField
                      type='String'
                      multiline
                      rows={3}
                      value={observacao}
                      onChange={event => {
                        setObservacao(event.target.value)
                      }}
                      sx={{
                        '.MuiFormLabel-root': {
                          alignItems: 'center',
                          display: 'flex',
                          height: '25px',
                          color: 'black',
                          fontWeight: 600,
                        },
                        width: '100%',
                      }}
                      label='Observação'
                    />
                  </span>
                </div>
              </section>
              <footer
                className={`${tomorrow.className} flex p-10 justify-end gap-10 items-center`}
              >
                <span
                  onClick={closeModal}
                  className='cursor-pointer hover:-webkit-text-stroke-[0.2px] hover:underline text-xs uppercase'
                >
                  Cancelar
                </span>
                <Button
                  variant='contained'
                  className={`bg-black hover:${getColorClass300()} hover:text-white ${
                    tomorrow.className
                  }`}
                  onClick={onClickButton}
                >
                  Salvar
                </Button>
              </footer>
            </>
          )}
        </div>
        {/* PopUp */}
        {notificationProps.setShowNotification && (
          <Notification
            importantMessage={notificationProps.importantMessage}
            message={notificationProps.message}
            setShowNotification={() =>
              setNotificationProps(prevProps => ({
                ...prevProps,
                setShowNotification: false,
              }))
            }
            type={notificationProps.type}
          />
        )}
        {editModalActive && chooseModal(modalComponentName)}
      </div>
    </ThemeProvider>
  )
}

export default TarefasModal
