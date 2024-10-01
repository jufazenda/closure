;('')

import Head from 'next/head'

import { Tomorrow } from 'next/font/google'
import { useEffect, useState } from 'react'
import supabase, { calcularResultadosPorSetor } from './api/supabase'
import CardResultado from './components/CardResultado'
import { Autocomplete, styled, TextField } from '@mui/material'
import SetorBox from './components/commons/SetorBox'

const tomorrow = Tomorrow({ subsets: ['latin'], weight: '600' })

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

interface PropsEquipesResultado {
  id: number
  equipe: string
  pontuacaoTotal: number
}

interface PropsResultadoSetor {
  forcask: number
  aguia: number
  medonhos: number
  poupanca: number
}

interface PropsSetores {
  id: number
  setor: string
  responsavel: string
  created_at: Date
}

const Resultado = () => {
  const [allResultado, setAllResultado] = useState<
    PropsEquipesResultado[]
  >([])
  const [porSetor, setPorSetor] = useState<PropsResultadoSetor | null>(
    null
  )
  const [allSetores, setAllSetores] = useState<PropsSetores[]>([])
  const [setorName, setSetorName] = useState<string>('')
  const [setorId, setSetorId] = useState<string>('')

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

  useEffect(() => {
    const fetchResultadosPorSetor = async () => {
      if (setorId) {
        const resultados = await calcularResultadosPorSetor(setorId)
        setPorSetor(resultados)
      }
    }

    fetchResultadosPorSetor()
  }, [setorId])

  useEffect(() => {
    fetchData()
    fetchDataSetores()
  }, [])

  return (
    <>
      <Head>
        <title>Closure - Organizador de Fechamento</title>
      </Head>
      <main className='divide-y-4 px-20'>
        <div className='flex flex-col gap-10 w-full justify-center items-center px-6 py-20 md:px-14'>
          <div
            className={`${tomorrow.className} grid grid-cols-1 md:grid-cols-2 gap-16 w-full`}
          >
            {allResultado.map((resultado, index) => (
              <div
                key={resultado.id}
                className='flex flex-row justify-start items-center gap-16'
              >
                <span className='w-16 text-7xl '>{index + 1}º</span>
                <CardResultado
                  allResultado={resultado}
                  {...equipeEscolhida(resultado.id)}
                />
              </div>
            ))}
          </div>
          <div className='flex flex-col gap-5 justify-center items-center py-3'>
            <span className='text-3xl font-semibold'>
              Diferença do 1° para o 2°
            </span>
            <span className={`${tomorrow.className} text-5xl`}>
              {Math.abs(
                allResultado[0]?.pontuacaoTotal -
                  allResultado[1]?.pontuacaoTotal
              )}
            </span>
          </div>
        </div>
        <div className='flex flex-col justify-center items-center gap-5 px-6 py-20 md:px-14'>
          <div className='flex flex-col gap-5 justify-center items-center py-3'>
            <span className='text-3xl font-semibold'>
              {porSetor ? 'Resultado por Setor' : 'Selecione um setor'}
            </span>
          </div>
          <Autocomplete
            options={allSetores}
            getOptionLabel={option => option.setor}
            ListboxProps={{
              style: { maxHeight: 190 },
            }}
            size='medium'
            onChange={(event, newValue) => {
              setSetorId(newValue?.id.toString() || '')
              setSetorName(newValue?.setor || '')
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
            renderInput={params => (
              <BlackTextField
                {...params}
                placeholder='Setor'
                variant='outlined'
                sx={{
                  '.MuiFormLabel-root': {
                    alignItems: 'center',
                    display: 'flex',
                    height: '25px',
                    color: 'black',
                    fontWeight: 600,
                  },
                  width: '500px',
                }}
              />
            )}
          />

          <div className='flex gap-20 justify-center'>
            {(() => {
              const maxValue = Math.max(
                porSetor?.forcask ?? 0,
                porSetor?.aguia ?? 0,
                porSetor?.poupanca ?? 0,
                porSetor?.medonhos ?? 0
              )

              return (
                <>
                  <SetorBox
                    srcImage='/logosEquipes/sk.png'
                    alt='Logo Força SK'
                    width={110}
                    height={100}
                    value={porSetor?.forcask}
                    isMax={porSetor?.forcask === maxValue}
                  />
                  <SetorBox
                    srcImage='/logosEquipes/aguia.png'
                    alt='Logo Aguia de Fogo'
                    width={130}
                    height={100}
                    value={porSetor?.aguia}
                    isMax={porSetor?.aguia === maxValue}
                  />
                  <SetorBox
                    srcImage='/logosEquipes/poupanca.png'
                    alt='Logo Poupança'
                    width={130}
                    height={100}
                    value={porSetor?.poupanca}
                    isMax={porSetor?.poupanca === maxValue}
                  />
                  <SetorBox
                    srcImage='/logosEquipes/medonhos.png'
                    alt='Logo Medonhos'
                    width={130}
                    height={100}
                    value={porSetor?.medonhos}
                    isMax={porSetor?.medonhos === maxValue}
                  />
                </>
              )
            })()}
          </div>
          <div className='flex flex-col gap-5 justify-center items-center py-3'>
            <span className='text-3xl font-semibold'>
              Diferença do 1° para o 2° no setor {setorName}
            </span>
            <span className={`${tomorrow.className} text-5xl`}>
              {(() => {
                const values = [
                  porSetor?.forcask ?? 0,
                  porSetor?.aguia ?? 0,
                  porSetor?.poupanca ?? 0,
                  porSetor?.medonhos ?? 0,
                ]

                const sortedValues = values.sort((a, b) => b - a)

                const firstPlace = sortedValues[0]
                const secondPlace = sortedValues[1]

                return Math.abs(firstPlace - secondPlace)
              })()}
            </span>
          </div>
        </div>
      </main>
    </>
  )
}

export default Resultado
