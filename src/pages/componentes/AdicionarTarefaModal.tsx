;('')

import React, {
  useState,
  FC,
  useEffect,
  Dispatch,
  SetStateAction,
} from 'react'

import supabase from './../api/supabase'

import { Autocomplete, TextField, styled } from '@mui/material'
import Modal from './commons/Modal'
import { AddCircle } from '@mui/icons-material'

import Notification from './commons/Notification'

import { Tomorrow } from 'next/font/google'
import Toggle from './commons/Toggle'

const tomorrow = Tomorrow({ subsets: ['latin'], weight: '600' })

interface PropsAdicionarTarefa {
  activeModal: boolean
  setActiveModal: Dispatch<SetStateAction<boolean>>
  loading: boolean
  setLoading: Dispatch<SetStateAction<boolean>>
  isEditing?: boolean
  idTarefa?: number
  setorTarefa?: PropsSetores | null
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

const BlackTextField = styled(TextField)`
  input {
    color: black !important; /* Defina a cor do texto */
  }
  .MuiOutlinedInput-root {
    fieldset {
      border: none;
      background-color: rgba(232, 232, 232, 0.5);
    }
    &:hover fieldset {
      border-color: black !important; /* Cor da borda quando o mouse está sobre o TextField */
    }
    &.Mui-focused fieldset {
      border-color: black !important; /* Cor da borda quando o TextField está focado */
    }
  }
`

const AdicionarTarefa: FC<PropsAdicionarTarefa> = ({
  activeModal,
  setActiveModal,
  loading,
  setLoading,
  isEditing,
  idTarefa,
  setorTarefa,
}) => {
  const [allSetores, setAllSetores] = useState<PropsSetores[]>([])
  const [tarefaEditar, setTarefaEditar] = useState<PropsTarefas | null>(
    null
  )
  const [allTarefas, setAllTarefas] = useState<PropsTarefas[]>([])
  const [setor, setSetor] = useState<PropsSetores | null>(null)
  const [tarefa, setTarefa] = useState<string>('')
  const [linkTarefa, setLinkTarefa] = useState<string>('')
  const [numero, setNumero] = useState<number | string>(0)
  const [lote, setLote] = useState<number | string>('')
  const [horario, setHorario] = useState('')
  const [pontuacaoMaxima, setPontuacaoMaxima] = useState<number | string>(
    0
  )
  const [pontuacaoPrimeiro, setPontuacaoPrimeiro] = useState<
    number | string
  >(0)
  const [pontuacaoSegundo, setPontuacaoSegundo] = useState<
    number | string
  >(0)
  const [pontuacaoTerceiro, setPontuacaoTerceiro] = useState<
    number | string
  >(0)
  const [pontuacaoQuarto, setPontuacaoQuarto] = useState<number | string>(
    0
  )

  const [showNotification, setShowNotification] = useState<boolean>(false)
  const [artisticaEspecial, setArtisticaEspecial] =
    useState<boolean>(false)

  const verificarIdExistente = (num: number | string) => {
    return allTarefas.some(tarefa => tarefa.numero_tarefa == num)
  }

  useEffect(() => {
    fetchDataSetores()
    fetchDataTarefas()
    fetchDataTarefaById()
  }, [])

  const fetchDataSetores = async () => {
    const { data, error } = await supabase
      .from('Setores')
      .select('*')
      .order('setor')

    if (error) {
      console.error('Erro ao buscar dados setores:', error.message)
      return
    }
    setAllSetores(data)
  }

  const fetchDataTarefas = async () => {
    const { data, error } = await supabase
      .from('Tarefas')
      .select('*')
      .order('created_at')

    if (error) {
      console.error('Erro ao buscar dados tarefas:', error.message)
      return
    }
    setAllTarefas(data)
  }

  const fetchDataTarefaById = async () => {
    const { data, error } = await supabase
      .from('Tarefas')
      .select('*')
      .eq('id', idTarefa)
      .single()

    if (error) {
      console.error('Erro ao buscar dados tarefas ID:', error.message)
      return
    }

    setTarefaEditar(data)
    setTarefa(data.tarefa)
    setLinkTarefa(data.link)
    setNumero(data.numero_tarefa)
    setLote(data.id_lote)
    if (setorTarefa) {
      setSetor(setorTarefa)
    }
    setPontuacaoMaxima(data.pontuacaoMaxima)
    setPontuacaoPrimeiro(data.pontuacaoPrimeiro)
    setPontuacaoSegundo(data.pontuacaoSegundo)
    setPontuacaoTerceiro(data.pontuacaoTerceiro)
    setPontuacaoQuarto(data.pontuacaoQuarto)
    setHorario(data.horario)
  }

  const [notificationProps, setNotificationProps] = useState({
    importantMessage: '',
    message: '',
    setShowNotification: false,
    type: 0,
  })

  const adicionar = async () => {
    if (!tarefa || !numero || !setor) {
      setNotificationProps({
        importantMessage: 'Erro!',
        message: 'Preencha todos os campos.',
        setShowNotification: true,
        type: 3,
      })
    } else if (verificarIdExistente(numero)) {
      setNotificationProps({
        importantMessage: 'Erro!',
        message:
          'Tarefa já foi cadastrada. Verifique com outros usuários.',
        setShowNotification: true,
        type: 3,
      })
    } else {
      const { data, error } = await supabase.from('Tarefas').insert([
        {
          tarefa: tarefa,
          link: linkTarefa,
          numero_tarefa: numero,
          id_lote: lote || null,
          id_setor: setor?.id,
          pontuacaoMaxima: pontuacaoMaxima ? pontuacaoMaxima : null,
          pontuacaoPrimeiro: pontuacaoPrimeiro ? pontuacaoPrimeiro : null,
          pontuacaoSegundo: pontuacaoSegundo ? pontuacaoSegundo : null,
          pontuacaoTerceiro: pontuacaoTerceiro ? pontuacaoTerceiro : null,
          pontuacaoQuarto: pontuacaoQuarto ? pontuacaoQuarto : null,
          horario: horario ? horario : null,
        },
      ])
      setNotificationProps({
        importantMessage: 'Sucesso!',
        message: 'Tarefa adicionada com sucesso.',
        setShowNotification: true,
        type: 1,
      })
      setTimeout(() => {
        closeModal()
        setNotificationProps(prevProps => ({
          ...prevProps,
          setShowNotification: false,
        }))
      }, 3000)
    }
    setLoading(!loading)
  }
  const editar = async () => {
    if (!tarefa || !numero || !setor) {
      setNotificationProps({
        importantMessage: 'Erro!',
        message: 'Preencha todos os campos.',
        setShowNotification: true,
        type: 3,
      })
    } else {
      const { data, error } = await supabase
        .from('Tarefas')
        .update({
          tarefa: tarefa,
          link: linkTarefa,
          numero_tarefa: numero,
          id_lote: lote || null,
          id_setor: setor?.id,
          pontuacaoMaxima: pontuacaoMaxima ? pontuacaoMaxima : null,
          pontuacaoPrimeiro: pontuacaoPrimeiro ? pontuacaoPrimeiro : null,
          pontuacaoSegundo: pontuacaoSegundo ? pontuacaoSegundo : null,
          pontuacaoTerceiro: pontuacaoTerceiro ? pontuacaoTerceiro : null,
          pontuacaoQuarto: pontuacaoQuarto ? pontuacaoQuarto : null,
          horario: horario ? horario : null,
        })
        .eq('id', idTarefa)
      setNotificationProps({
        importantMessage: 'Sucesso!',
        message: 'Tarefa editada com sucesso.',
        setShowNotification: true,
        type: 1,
      })
      setTimeout(() => {
        closeModal()
        setNotificationProps(prevProps => ({
          ...prevProps,
          setShowNotification: false,
        }))
      }, 3000)
    }
    setLoading(!loading)
  }

  const closeModal = () => {
    setActiveModal(false)
  }

  return (
    <>
      <Modal
        title={isEditing ? 'EDITAR TAREFA' : 'ADICIONAR TAREFA'}
        icon={<AddCircle sx={{ fontSize: '40px' }} />}
        buttonLabel={isEditing ? 'EDITAR' : 'ADICIONAR'}
        isOpen={activeModal}
        onClose={closeModal}
        setor={setor?.id}
        onClickButton={
          isEditing
            ? () => {
                setShowNotification(true)
                editar()
              }
            : () => {
                setShowNotification(true)
                adicionar()
              }
        }
        isEditing={isEditing && isEditing}
      >
        {/*  tarefas e numero*/}
        <div className='flex flex-col gap-5 md:flex-row'>
          <div className='w-full md:w-9/12'>
            <BlackTextField
              required
              type='String'
              onChange={event => {
                setTarefa(event.target.value)
              }}
              value={tarefa}
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
              label='Tarefa'
            />
          </div>

          <div className='w-full md:w-3/12 '>
            <BlackTextField
              required
              type='number'
              onChange={event => {
                setNumero(event.target.value)
              }}
              value={numero}
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
              label='Número'
            />
          </div>
        </div>

        {/*  setor*/}
        <div className='flex my-5 md:flex-col gap-5'>
          <div className='w-full md:w-full'>
            <BlackTextField
              type='String'
              onChange={event => {
                setLinkTarefa(event.target.value)
              }}
              value={linkTarefa}
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
              label='Link da Tarefa'
            />
          </div>
          <div className='w-full'>
            <Autocomplete
              options={allSetores}
              getOptionLabel={option => option.setor}
              ListboxProps={{
                style: { maxHeight: 190, fontFamily: 'Montserrat' },
              }}
              size='medium'
              onChange={(event, newValue) => {
                setSetor(newValue)
              }}
              value={setor}
              sx={{
                '.MuiFormLabel-root': {
                  alignItems: 'center',
                  display: 'flex',
                  height: '25px',
                  color: 'black',
                  fontWeight: 600,
                },
              }}
              renderInput={params => (
                <BlackTextField
                  {...params}
                  label='Setor'
                  required
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
          </div>
        </div>

        {/*  entrega e pontuação */}
        <div className='flex flex-col gap-5 my-5 md:flex-col'>
          {!setor ? (
            <span className='flex justify-end my-2 text-sm font-semibold '>
              *Selecione o setor para acessar mais informações.
            </span>
          ) : setor?.setor === 'Esportivas' ? (
            <>
              <div className='flex flex-col gap-5 my-5 md:flex-col'>
                <span className={`${tomorrow.className} text-lg flex`}>
                  ENTREGA
                </span>
                <div className='w-full'>
                  <BlackTextField
                    required
                    color='primary'
                    type='time'
                    onChange={event => {
                      setHorario(event.target.value)
                    }}
                    value={horario}
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
                    label='Horário'
                  />
                </div>
              </div>
              <div className='flex flex-col md:flex-col '>
                <span className={`${tomorrow.className} text-lg flex`}>
                  PONTUAÇÃO
                </span>
                <div className='flex flex-col gap-3 my-5 md:flex-row'>
                  <div>
                    <BlackTextField
                      required
                      type='number'
                      inputProps={{ min: 0 }}
                      value={pontuacaoPrimeiro}
                      onChange={event => {
                        setPontuacaoPrimeiro(event.target.value)
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
                      label='1º lugar'
                    />
                  </div>
                  <div>
                    <BlackTextField
                      required
                      type='number'
                      onChange={event => {
                        setPontuacaoSegundo(event.target.value)
                      }}
                      value={pontuacaoSegundo}
                      inputProps={{ min: 0 }}
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
                      label='2º lugar'
                    />
                  </div>
                  <div>
                    <BlackTextField
                      required
                      type='number'
                      onChange={event => {
                        setPontuacaoTerceiro(event.target.value)
                      }}
                      value={pontuacaoTerceiro}
                      inputProps={{ min: 0 }}
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
                      label='3º lugar'
                    />
                  </div>
                  <div>
                    <BlackTextField
                      required
                      type='number'
                      onChange={event => {
                        setPontuacaoQuarto(event.target.value)
                      }}
                      value={pontuacaoQuarto}
                      inputProps={{ min: 0 }}
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
                      label='4º lugar'
                    />
                  </div>
                </div>
              </div>
            </>
          ) : setor?.setor === 'Rua' ? (
            <div className='flex w-full gap-5'>
              <div className='flex flex-col w-1/2 gap-5 my-5 md:flex-col'>
                <span className={`${tomorrow.className} text-lg flex`}>
                  ENTREGA
                </span>
                <div className='w-full'>
                  <BlackTextField
                    required
                    color='primary'
                    type='time'
                    onChange={event => {
                      setHorario(event.target.value)
                    }}
                    value={horario}
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
                    label='Horário'
                  />
                </div>
              </div>
              <div className='flex flex-col w-1/2 gap-5 my-5 md:flex-col'>
                <span className={`${tomorrow.className} text-lg flex`}>
                  PONTUAÇÃO
                </span>
                <div className='flex w-full'>
                  <BlackTextField
                    required
                    type='number'
                    inputProps={{ min: 0 }}
                    onChange={event => {
                      setPontuacaoMaxima(event.target.value)
                    }}
                    value={pontuacaoMaxima}
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
                    label='Pontuação Máxima'
                  />
                </div>
              </div>
            </div>
          ) : setor?.setor === 'Artísticas' ? (
            <>
              <div className='flex flex-col gap-5 my-5 md:flex-col'>
                <span className={`${tomorrow.className} text-lg flex`}>
                  ENTREGA
                </span>
                <div className='w-full'>
                  <BlackTextField
                    required
                    color='primary'
                    type='time'
                    onChange={event => {
                      setHorario(event.target.value)
                    }}
                    value={horario}
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
                    label='Horário'
                  />
                </div>
                <div>
                  <span
                    className={`${tomorrow.className} text-lg flex uppercase my-4`}
                  >
                    Tarefa do Baile
                  </span>
                  <Toggle
                    setChange={setArtisticaEspecial}
                    change={artisticaEspecial}
                    save={pontuacaoPrimeiro ? true : false}
                  />
                </div>
              </div>

              {artisticaEspecial || pontuacaoPrimeiro ? (
                <div className='flex flex-col md:flex-col '>
                  <span className={`${tomorrow.className} text-lg flex`}>
                    PONTUAÇÃO
                  </span>
                  <div className='flex flex-col gap-3 my-5 md:flex-row'>
                    <div>
                      <BlackTextField
                        required
                        type='number'
                        inputProps={{ min: 0 }}
                        value={pontuacaoPrimeiro}
                        onChange={event => {
                          setPontuacaoPrimeiro(event.target.value)
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
                        label='1º lugar'
                      />
                    </div>
                    <div>
                      <BlackTextField
                        required
                        type='number'
                        onChange={event => {
                          setPontuacaoSegundo(event.target.value)
                        }}
                        value={pontuacaoSegundo}
                        inputProps={{ min: 0 }}
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
                        label='2º lugar'
                      />
                    </div>
                    <div>
                      <BlackTextField
                        required
                        type='number'
                        onChange={event => {
                          setPontuacaoTerceiro(event.target.value)
                        }}
                        value={pontuacaoTerceiro}
                        inputProps={{ min: 0 }}
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
                        label='3º lugar'
                      />
                    </div>
                    <div>
                      <BlackTextField
                        required
                        type='number'
                        onChange={event => {
                          setPontuacaoQuarto(event.target.value)
                        }}
                        value={pontuacaoQuarto}
                        inputProps={{ min: 0 }}
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
                        label='4º lugar'
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className='flex flex-col w-full gap-5  md:flex-col'>
                  <span className={`${tomorrow.className} text-lg flex`}>
                    PONTUAÇÃO
                  </span>
                  <div className='flex w-full'>
                    <BlackTextField
                      required
                      type='number'
                      inputProps={{ min: 0 }}
                      onChange={event => {
                        setPontuacaoMaxima(event.target.value)
                      }}
                      value={pontuacaoMaxima}
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
                      label='Pontuação Máxima'
                    />
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className='flex w-full gap-5'>
              <div className='flex flex-col w-1/2 gap-5 my-5 md:flex-col'>
                <span className={`${tomorrow.className} text-lg flex`}>
                  ENTREGA
                </span>
                <div className='w-full'>
                  <BlackTextField
                    required
                    color='primary'
                    type='number'
                    onChange={event => {
                      setLote(event.target.value)
                    }}
                    value={lote}
                    inputProps={{ min: 0, max: 4 }}
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
                    label='Lote'
                  />
                </div>
              </div>
              <div className='flex flex-col w-1/2 gap-5 my-5 md:flex-col'>
                <span className={`${tomorrow.className} text-lg flex`}>
                  PONTUAÇÃO
                </span>
                <div className='flex w-full'>
                  <BlackTextField
                    required
                    type='number'
                    inputProps={{ min: 0 }}
                    onChange={event => {
                      setPontuacaoMaxima(event.target.value)
                    }}
                    value={pontuacaoMaxima}
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
                    label='Pontuação Máxima'
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>

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
    </>
  )
}

export default AdicionarTarefa
