;('')

import React, {
  useState,
  FC,
  useEffect,
  Dispatch,
  ReactNode,
  SetStateAction,
} from 'react'

import supabase from './../api/supabase'

import {
  Autocomplete,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  styled,
} from '@mui/material'

import Modal from './commons/Modal'
import { AddCircle, Edit } from '@mui/icons-material'

import Notification from './commons/Notification'

import { Tomorrow } from 'next/font/google'

const tomorrow = Tomorrow({ subsets: ['latin'], weight: '600' })

interface PropsEditarTarefa {
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

const EditarTarefa = ({}) => {}

export default EditarTarefa

{
  /*  
  <div className='flex w-full gap-5'>
          <div className='flex flex-col md:flex-col gap-5 my-5 w-1/2'>
            <span className={`${tomorrow.className} text-lg flex`}>
              RESULTADO
            </span>
            <div className='flex w-full'>
              <FormControl>
                <FormLabel id='demo-controlled-radio-buttons-group'>
                  Gender
                </FormLabel>
                <RadioGroup
                  aria-labelledby='demo-controlled-radio-buttons-group'
                  name='controlled-radio-buttons-group'
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
            </div>
          </div>
        </div>

  <div className="row-1">
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
      </div> */
}
