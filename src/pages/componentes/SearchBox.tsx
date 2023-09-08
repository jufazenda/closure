import { Search } from '@mui/icons-material'

import React from 'react'

import {
  InputAdornment,
  TextField,
  ThemeProvider,
  createTheme,
  styled,
} from '@mui/material'

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

interface SearchBoxProps {
  buscando: string
  allTarefas: PropsTarefas[]
  setBuscando: (value: string) => void
  setFilteredTarefas: (value: PropsTarefas[]) => void
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
}: SearchBoxProps) => {
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
              width: '100%',
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
        </div>
      </div>
    </ThemeProvider>
  )
}

export default SearchBox
