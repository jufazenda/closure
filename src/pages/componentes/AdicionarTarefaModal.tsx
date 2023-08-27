;('')

import React, { useState, FC, useEffect } from 'react'

import supabase from './../api/supabase'

import { Autocomplete, Button, TextField, styled } from '@mui/material'
import Modal from './commons/Modal'
import { AddCircle } from '@mui/icons-material'

import { Tomorrow } from 'next/font/google'
import { PropsAdicionarTarefa } from './commons/Types/Props'
import PropsSetores from './Types/Props'

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

const AdicionarTarefa: FC<PropsAdicionarTarefa> = ({
  activeModal,
  setActiveModal,
}) => {
  const [allSetores, setAllSetores] = useState<PropsSetores[]>([])
  const [setor, setSetor] = useState<PropsSetores | null>(null)
  const [tarefa, setTarefa] = useState<string>('')
  const [numero, setNumero] = useState<number | string>(0)
  const [lote, setLote] = useState<number | string>('')
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

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data, error } = await supabase
      .from('Setores')
      .select('*')
      .order('setor')

    if (error) {
      console.error('Erro ao buscar dados:', error.message)
      return
    }
    setAllSetores(data)
  }

  const adicionar = async () => {
    const { data, error } = await supabase.from('Tarefas').insert([
      { nome: 'Produto 1', preco: 19.99 },
      { nome: 'Produto 2', preco: 29.99 },
    ])

    if (error) {
      console.error('Erro ao inserir dados:', error.message)
      return
    }

    console.log('Dados inseridos com sucesso:', data)
  }

  const closeModal = () => {
    setActiveModal(false)
  }

  return (
    <Modal
      title={'ADICIONAR TAREFA'}
      icon={<AddCircle sx={{ fontSize: '40px' }} />}
      buttonLabel={'ADICIONAR'}
      isOpen={activeModal}
      onClose={closeModal}
      setor={setor?.id}
      onClickButton={() => console.log('AAAAAAAAAAAA')}
    >
      <div className='flex flex-col gap-5 md:flex-row'>
        <div className='w-full md:w-9/12'>
          <BlackTextField
            required
            type='String'
            onChange={event => {
              setTarefa(event.target.value)
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
            label='Número'
          />
        </div>
      </div>
      <div className='flex md:flex-row my-5'>
        <div className='w-full'>
          <Autocomplete
            options={allSetores}
            getOptionLabel={option => option.setor}
            ListboxProps={{
              style: { maxHeight: 190, fontFamily: 'Montserrat' },
            }}
            value={setor}
            size='medium'
            onChange={(event, newValue) => {
              setSetor(newValue)
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
            renderInput={params => (
              <BlackTextField
                {...params}
                label='Setor'
                required
                variant='outlined'
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
              />
            )}
          />
        </div>
      </div>
      <div className='flex flex-col md:flex-col gap-5 my-5'>
        <span className={`${tomorrow.className} text-lg flex`}>
          ENTREGA
        </span>
        {!setor ? (
          <span>Selecione o setor</span>
        ) : setor?.setor === 'Esportivas' ? (
          <div className='w-full'>
            <BlackTextField
              required
              color='primary'
              type='time'
              onChange={event => {
                setLote(event.target.value)
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
              label='Horário'
            />
          </div>
        ) : (
          <div className='w-full'>
            <BlackTextField
              required
              color='primary'
              type='number'
              onChange={event => {
                setLote(event.target.value)
              }}
              inputProps={{ min: 0, max: 4 }}
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
              label='Lote'
            />
          </div>
        )}
      </div>
      <div className='flex flex-col md:flex-col '>
        <span className={`${tomorrow.className} text-lg flex`}>
          PONTUAÇÃO
        </span>
        <div className='flex flex-col md:flex-row gap-3 my-5'>
          <div>
            <BlackTextField
              required
              type='number'
              inputProps={{ min: 0 }}
              onChange={event => {
                setPontuacaoPrimeiro(event.target.value)
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
              inputProps={{ min: 0 }}
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
              inputProps={{ min: 0 }}
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
              inputProps={{ min: 0 }}
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
              label='4º lugar'
            />
          </div>
        </div>
      </div>
      {/*  <div className="row-1">
        <div className="tarefa">
          <BlackTextField
            type="String"
            multiline
            rows={2}
             onChange={(event) => {
          setActionText(event.target.value);
        }}
            sx={{
              ".MuiFormLabel-root": {
                fontFamily: "Montserrat",
                alignItems: "center",
                display: "flex",
                height: "25px",
                color: "black",
                fontWeight: 600,
              },
            }}
            label="Observação"
          />
        </div>
      </div> */}
    </Modal>
  )
}

export default AdicionarTarefa
