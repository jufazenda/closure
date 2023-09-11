import { Search } from '@mui/icons-material'

import React, { useState, useEffect } from 'react'

import {
  Autocomplete,
  Divider,
  InputAdornment,
  TextField,
  ThemeProvider,
  createTheme,
  styled,
} from '@mui/material'
import supabase from '../api/supabase'

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

interface SearchBoxProps {
  buscando: string
  allTarefas: PropsTarefas[]
  setBuscando: (value: string) => void
  setFilteredTarefas: (value: PropsTarefas[]) => void
  setSetor: (value: PropsSetores | null) => void
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

const SearchBox = ({
  buscando,
  allTarefas,
  setBuscando,
  setFilteredTarefas,
  setSetor,
}: SearchBoxProps) => {
  const [allSetores, setAllSetores] = useState<PropsSetores[]>([])

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

  const handleSearch = (searchTerm: string) => {
    setBuscando(searchTerm)

    setFilteredTarefas(
      allTarefas?.filter(
        tarefa =>
          tarefa.numero_tarefa.toString().includes(searchTerm) ||
          tarefa.tarefa.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  }

  const handleSearchSetor = (searchTerm: PropsSetores | null) => {
    setSetor(searchTerm)

    if (searchTerm) {
      setFilteredTarefas(
        allTarefas?.filter(tarefa => tarefa.id_setor == searchTerm.id)
      )
    }
  }

  useEffect(() => {
    fetchDataSetores()
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <div className='w-full flex items-center justify-end'>
        <div className='w-full flex items-center'>
          <BlackTextField
            required
            type='String'
            onChange={event => {
              handleSearch(event.target.value)
            }}
            value={buscando}
            sx={{
              '.MuiFormLabel-root': {
                alignItems: 'center',
                display: 'flex',
                height: '25px',
                color: 'black',
                fontWeight: 600,
              },
              width: '80%',
            }}
            placeholder={'Buscar tarefa por nome ou número...'}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <Divider />
          <Autocomplete
            options={allSetores}
            getOptionLabel={option => option.setor}
            ListboxProps={{
              style: { maxHeight: 190, fontFamily: 'Montserrat' },
            }}
            size='medium'
            onChange={(event, newValue) => {
              handleSearchSetor(newValue)
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
                  width: '200px',
                }}
              />
            )}
          />
        </div>
      </div>
    </ThemeProvider>
  )
}

export default SearchBox
