/* eslint-disable react-hooks/exhaustive-deps */
import { Dispatch, SetStateAction, useState, useEffect } from 'react'

import { Tomorrow } from 'next/font/google'
import {
  Autocomplete,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  ThemeProvider,
  createTheme,
  styled,
} from '@mui/material'
import Image from 'next/image'
import Toggle from './commons/Toggle'
import supabase from '../api/supabase'

const tomorrow = Tomorrow({ subsets: ['latin'], weight: '600' })

interface PropsTarefasModal {
  tarefas: PropsTarefas
  activeModal: boolean
  setActiveModal: Dispatch<SetStateAction<boolean>>
  loading: boolean
  setLoading: Dispatch<SetStateAction<boolean>>
  idTarefa: number
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

  const closeModal = () => {
    setActiveModal(false)
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

  const salvarResultado = async () => {
    const { data, error } = await supabase.from('Resultado').insert([
      {
        forcask: forcask,
        aguia: aguia,
        poupanca: poupanca,
        medonhos: medonhos,
        id_tarefa: idTarefa,
      },
    ])

    if (error) {
      console.error('Erro ao buscar dados setores:', error.message)
      return
    }
  }

  const buscarResultado = async () => {
    const { data, error } = await supabase
      .from('Resultado')
      .select('*')
      .order('created_at')
      .eq('id', idTarefa)

    if (error) {
      console.error('Erro ao buscar dados setores:', error.message)
      return
    }

    setResultadoById(data)
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
    salvarInfos()
  }, [respostaCharada, observacao])

  useEffect(() => {
    buscarResultado()
    salvarResultado()
  }, [forcask, aguia, poupanca, medonhos])

  const calculandoResultado = () => {
    if (tarefas.pontuacaoMaxima) {
      if (tarefaCumpridaSK) {
        setForcask(Number(tarefas.pontuacaoMaxima) + Number(bonificacaoSK))
      } else if (bonificacaoSK) {
        setForcask(Number(bonificacaoSK))
      } else {
        setForcask(0)
      }

      if (tarefaCumpridaAguia) {
        setAguia(
          Number(tarefas.pontuacaoMaxima) + Number(bonificacaoAguia)
        )
      } else if (bonificacaoAguia) {
        setAguia(Number(bonificacaoAguia))
      } else {
        setAguia(0)
      }

      if (tarefaCumpridaPoups) {
        setPoupanca(
          Number(tarefas.pontuacaoMaxima) + Number(bonificacaoPoups)
        )
      } else if (bonificacaoPoups) {
        setPoupanca(Number(bonificacaoPoups))
      } else {
        setPoupanca(0)
      }

      if (tarefaCumpridaMed) {
        setMedonhos(
          Number(tarefas.pontuacaoMaxima) + Number(bonificacaoMedonhos)
        )
      } else if (bonificacaoMedonhos) {
        setMedonhos(Number(bonificacaoMedonhos))
      } else {
        setMedonhos(0)
      }
    } else {
      if (forcaskColocacao?.id === 1) {
        setForcask(
          Number(tarefas.pontuacaoPrimeiro) + Number(bonificacaoSK)
        )
      } else if (forcaskColocacao?.id === 2) {
        setForcask(
          Number(tarefas.pontuacaoSegundo) + Number(bonificacaoSK)
        )
      } else if (forcaskColocacao?.id === 3) {
        setForcask(
          Number(tarefas.pontuacaoTerceiro) + Number(bonificacaoSK)
        )
      } else if (forcaskColocacao?.id === 4) {
        setForcask(Number(tarefas.pontuacaoQuarto) + Number(bonificacaoSK))
      } else if (forcaskColocacao?.id === 5 && bonificacaoSK) {
        setForcask(Number(bonificacaoSK))
      } else {
        setForcask(0)
      }

      if (aguiaColocacao?.id === 1) {
        setAguia(
          Number(tarefas.pontuacaoPrimeiro) + Number(bonificacaoAguia)
        )
      } else if (aguiaColocacao?.id === 2) {
        setAguia(
          Number(tarefas.pontuacaoSegundo) + Number(bonificacaoAguia)
        )
      } else if (aguiaColocacao?.id === 3) {
        setAguia(
          Number(tarefas.pontuacaoTerceiro) + Number(bonificacaoAguia)
        )
      } else if (aguiaColocacao?.id === 4) {
        setAguia(
          Number(tarefas.pontuacaoQuarto) + Number(bonificacaoAguia)
        )
      } else if (aguiaColocacao?.id === 5 && bonificacaoAguia) {
        setAguia(Number(bonificacaoAguia))
      } else {
        setAguia(0)
      }

      if (poupancaColocacao?.id === 1) {
        setPoupanca(
          Number(tarefas.pontuacaoPrimeiro) + Number(bonificacaoPoups)
        )
      } else if (poupancaColocacao?.id === 2) {
        setPoupanca(
          Number(tarefas.pontuacaoSegundo) + Number(bonificacaoPoups)
        )
      } else if (poupancaColocacao?.id === 3) {
        setPoupanca(
          Number(tarefas.pontuacaoTerceiro) + Number(bonificacaoPoups)
        )
      } else if (poupancaColocacao?.id === 4) {
        setPoupanca(
          Number(tarefas.pontuacaoQuarto) + Number(bonificacaoPoups)
        )
      } else if (poupancaColocacao?.id === 5 && bonificacaoPoups) {
        setPoupanca(Number(bonificacaoPoups))
      } else {
        setPoupanca(0)
      }

      if (medonhosColocacao?.id === 1) {
        setMedonhos(
          Number(tarefas.pontuacaoPrimeiro) + Number(bonificacaoMedonhos)
        )
      } else if (medonhosColocacao?.id === 2) {
        setMedonhos(
          Number(tarefas.pontuacaoSegundo) + Number(bonificacaoMedonhos)
        )
      } else if (medonhosColocacao?.id === 3) {
        setMedonhos(
          Number(tarefas.pontuacaoTerceiro) + Number(bonificacaoMedonhos)
        )
      } else if (medonhosColocacao?.id === 4) {
        setMedonhos(
          Number(tarefas.pontuacaoQuarto) + Number(bonificacaoMedonhos)
        )
      } else if (medonhosColocacao?.id === 5 && bonificacaoMedonhos) {
        setMedonhos(Number(bonificacaoMedonhos))
      } else {
        setMedonhos(0)
      }
    }
  }

  const opcoesColocacao = [
    { id: 1, label: '1º lugar' },
    { id: 2, label: '2º lugar' },
    { id: 3, label: '3º lugar' },
    { id: 4, label: '4º lugar' },
    { id: 5, label: 'Zerou' },
  ]

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
                      >{`1º - ${tarefas.pontuacaoPrimeiro} `}</span>
                      <span
                        className={`p-2 rounded-md ${getColorClass300()} `}
                      >{`2º - ${tarefas.pontuacaoSegundo} `}</span>
                      <span
                        className={`p-2 rounded-md ${getColorClass300()} `}
                      >{`3º - ${tarefas.pontuacaoTerceiro} `}</span>
                      <span
                        className={`p-2 rounded-md ${getColorClass300()} `}
                      >{`4º - ${tarefas.pontuacaoQuarto} `}</span>
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
                {tarefas.id_setor === 1 ? (
                  <div>
                    <BlackTextField
                      type='String'
                      onChange={event => {
                        setRespostaCharada(event.target.value)
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
                      label='Resposta'
                    />
                  </div>
                ) : null}
              </span>
              <span className='flex justify-center w-full'>
                {tarefas.pontuacaoMaxima ? (
                  <div className='grid grid-cols-1 gap-10 mb-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                    <div className='flex flex-col items-center justify-center gap-5 '>
                      <Image
                        src='/logosEquipes/sk.png'
                        alt='Logo Força SK'
                        width={110}
                        height={100}
                        priority
                      />
                      <Toggle setTarefaCumprida={setTarefaCumpridaSK} />
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
                      <Toggle setTarefaCumprida={setTarefaCumpridaAguia} />
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
                      <Toggle setTarefaCumprida={setTarefaCumpridaPoups} />
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
                      <Toggle setTarefaCumprida={setTarefaCumpridaMed} />
                      <BlackTextField
                        type='number'
                        inputProps={{ min: 0 }}
                        onChange={event => {
                          setBonificacaoMedonhos(event.target.value)
                        }}
                        value={bonificacaoMedonhos && bonificacaoMedonhos}
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
                        value={bonificacaoMedonhos && bonificacaoMedonhos}
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
                  onChange={event => {
                    setObservacao(event.target.value)
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
                    width: '100%',
                  }}
                  label='Observação'
                />
              </span>
            </div>
            <div className='flex flex-col w-full gap-5 my-5 md:flex-col'></div>
          </section>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default TarefasModal

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
