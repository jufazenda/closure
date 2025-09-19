import { useState, useEffect } from 'react'
import {
  Autocomplete,
  TextField,
  styled,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Box,
} from '@mui/material'
import { FileDownload, SelectAll, Deselect } from '@mui/icons-material'
import ExcelJS from 'exceljs'
import Modal from './commons/Modal'
import { Tomorrow } from 'next/font/google'

const tomorrow = Tomorrow({ subsets: ['latin'], weight: '600' })

interface PropsLotes {
  id: number
  numero_lote: string
  horario_inicio: string
  horario_fim: string
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
  descricao_item: string
  parte: number
}

interface ExportModalProps {
  open: boolean
  onClose: () => void
  allTarefas: PropsTarefas[]
  supabase: any
}

const BlackTextField = styled(TextField)`
  input {
    color: black !important;
  }
  .MuiOutlinedInput-root {
    fieldset {
      border: none;
      background-color: rgba(232, 232, 232, 0.5);
    }
    &:hover fieldset {
      border-color: black !important;
    }
    &.Mui-focused fieldset {
      border-color: black !important;
    }
  }
`

const ExportModal = ({
  open,
  onClose,
  allTarefas,
  supabase,
}: ExportModalProps) => {
  const [lotes, setLotes] = useState<PropsLotes[]>([])
  const [selectedLote, setSelectedLote] = useState<number | 'all'>('all')
  const [filteredTarefas, setFilteredTarefas] =
    useState<PropsTarefas[]>(allTarefas)
  const [selectedTarefas, setSelectedTarefas] = useState<number[]>([])
  const [nomeEquipe, setNomeEquipe] = useState('Força SK')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchLotes()
  }, [])

  useEffect(() => {
    if (selectedLote === 'all') {
      setFilteredTarefas(allTarefas)
    } else {
      const tarefasFiltradas = allTarefas.filter(
        tarefa => tarefa.id_lote === selectedLote
      )
      setFilteredTarefas(tarefasFiltradas)
    }
    setSelectedTarefas([]) // Limpa seleção ao trocar filtro
  }, [selectedLote, allTarefas])

  const fetchLotes = async () => {
    const { data, error } = await supabase
      .from('Lote')
      .select('*')
      .order('numero_lote')

    if (error) {
      console.error('Erro ao buscar lotes:', error.message)
      return
    }
    setLotes(data || [])
  }

  const handleSelectTarefa = (tarefaId: number) => {
    setSelectedTarefas(prev => {
      if (prev.includes(tarefaId)) {
        return prev.filter(id => id !== tarefaId)
      } else {
        return [...prev, tarefaId]
      }
    })
  }

  const handleSelectAll = () => {
    const allIds = filteredTarefas.map(tarefa => tarefa.id)
    setSelectedTarefas(allIds)
  }

  const handleDeselectAll = () => {
    setSelectedTarefas([])
  }

  const exportData = async () => {
    if (selectedTarefas.length === 0) {
      alert('Selecione pelo menos uma tarefa para exportar')
      return
    }

    setLoading(true)

    try {
      const { data: dataLotes } = await supabase
        .from('Lote')
        .select('*')
        .order('numero_lote')

      // Filtrar apenas as tarefas selecionadas
      const tarefasSelecionadas = filteredTarefas.filter(tarefa =>
        selectedTarefas.includes(tarefa.id)
      )

      const tarefasData = tarefasSelecionadas.map(tarefa => {
        const lote = dataLotes?.find(
          (l: { id: number | null }) => l.id === tarefa.id_lote
        )
        return {
          numero_tarefa: tarefa.numero_tarefa,
          tarefa: tarefa.tarefa,
          descricao: tarefa.descricao_item,
          observacoes: '',
          data_entrega: '',
          lote: lote ? lote.numero_lote : 'Sem lote',
        }
      })

      // 1. Carregar modelo existente
      const workbook = new ExcelJS.Workbook()
      const response = await fetch('/modeloPlanilha2025.xlsx')
      const arrayBuffer = await response.arrayBuffer()
      await workbook.xlsx.load(arrayBuffer)

      const worksheet = workbook.worksheets[0]

      // 2. Preencher cabeçalho
      const loteTexto =
        selectedLote === 'all'
          ? 'Todos os Lotes'
          : lotes.find(l => l.id === selectedLote)?.numero_lote ||
            'Sem lote'

      worksheet.getCell('B3').value = loteTexto
      worksheet.getCell('F3').value = nomeEquipe

      // 3. Preencher tarefas a partir da linha 6
      let startRow = 6
      tarefasData.forEach((t, i) => {
        const rowNumber = startRow + i
        const row = worksheet.getRow(rowNumber)

        // Coluna 1: número
        row.getCell(1).value = t.numero_tarefa

        // Mesclar colunas 2 e 3 apenas se ainda não estiverem mescladas
        if (!worksheet.getCell(`B${rowNumber}`).isMerged) {
          worksheet.mergeCells(`B${rowNumber}:C${rowNumber}`)
        }
        worksheet.getCell(`B${rowNumber}`).value = t.tarefa

        // Mesclar colunas 4 e 5 apenas se ainda não estiverem mescladas
        if (!worksheet.getCell(`D${rowNumber}`).isMerged) {
          worksheet.mergeCells(`D${rowNumber}:E${rowNumber}`)
        }
        worksheet.getCell(`D${rowNumber}`).value = t.descricao

        // Observações na coluna 6
        row.getCell(6).value = t.observacoes
        row.commit()
      })

      // 4. Gerar arquivo para download
      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })

      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)

      // Nome do arquivo baseado no filtro
      const nomeArquivo =
        selectedLote === 'all'
          ? `tarefas_todas_${selectedTarefas.length}itens.xlsx`
          : `tarefas_lote_${loteTexto}_${selectedTarefas.length}itens.xlsx`

      link.download = nomeArquivo
      link.click()

      onClose()
    } catch (error) {
      console.error('Erro ao exportar:', error)
      alert('Erro ao exportar planilha')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title='EXPORTAR TAREFAS'
      icon={<FileDownload sx={{ fontSize: '40px' }} />}
      buttonLabel={
        loading
          ? 'Exportando...'
          : `Exportar ${selectedTarefas.length} Tarefas`
      }
      isOpen={open}
      onClose={onClose}
      onClickButton={exportData}
    >
      {/* Nome da Equipe */}
      <div className='flex flex-col gap-5 my-5'>
        <BlackTextField
          label='Nome da Equipe'
          value={nomeEquipe}
          onChange={e => setNomeEquipe(e.target.value)}
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
      </div>

      {/* Filtro por Lote */}
      <div className='flex flex-col gap-5 my-5'>
        <span className={`${tomorrow.className} text-lg flex`}>
          FILTRAR POR LOTE
        </span>
        <Autocomplete
          options={[
            { id: 'all', numero_lote: 'Todos os Lotes' },
            ...lotes,
          ]}
          getOptionLabel={option => option.numero_lote}
          ListboxProps={{
            style: { maxHeight: 190, fontFamily: 'Montserrat' },
          }}
          size='medium'
          onChange={(event, newValue) => {
            setSelectedLote(
              newValue?.id === 'all'
                ? 'all'
                : typeof newValue?.id === 'number'
                ? newValue.id
                : 'all'
            )
          }}
          value={
            selectedLote === 'all'
              ? { id: 'all', numero_lote: 'Todos os Lotes' }
              : lotes.find(l => l.id === selectedLote) || null
          }
          renderInput={params => (
            <BlackTextField
              {...params}
              label='Lote'
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

      {/* Controles de Seleção */}
      <div className='flex flex-col gap-5 my-5'>
        <div className='flex justify-between items-center'>
          <span className={`${tomorrow.className} text-lg flex`}>
            SELECIONAR TAREFAS ({selectedTarefas.length}/
            {filteredTarefas.length})
          </span>
          <div className='flex gap-3'>
            <button
              className='flex gap-1 items-center text-sm font-semibold cursor-pointer hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed'
              onClick={handleSelectAll}
              disabled={selectedTarefas.length === filteredTarefas.length}
            >
              <SelectAll fontSize='small' />
              Todas
            </button>
            <button
              className='flex gap-1 items-center text-sm font-semibold cursor-pointer hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed'
              onClick={handleDeselectAll}
              disabled={selectedTarefas.length === 0}
            >
              <Deselect fontSize='small' />
              Nenhuma
            </button>
          </div>
        </div>

        {/* Lista de Tarefas */}
        <div
          style={{
            maxHeight: '300px',
            overflow: 'auto',
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            backgroundColor: 'rgba(232, 232, 232, 0.3)',
          }}
        >
          {filteredTarefas.length === 0 ? (
            <div className='p-4 text-center text-gray-600'>
              <span>Nenhuma tarefa encontrada</span>
              <br />
              <span className='text-sm'>
                Tente selecionar um lote diferente
              </span>
            </div>
          ) : (
            filteredTarefas.map(tarefa => {
              const lote = lotes.find(l => l.id === tarefa.id_lote)
              const isSelected = selectedTarefas.includes(tarefa.id)

              return (
                <div
                  key={tarefa.id}
                  className={`p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-100 ${
                    isSelected ? 'bg-gray-100' : 'bg-white'
                  }`}
                  onClick={() => handleSelectTarefa(tarefa.id)}
                >
                  <div className='flex items-start gap-3'>
                    <Checkbox
                      checked={isSelected}
                      size='small'
                      sx={{
                        color: 'black',
                        '&.Mui-checked': {
                          color: 'black',
                        },
                        padding: '4px',
                      }}
                    />
                    <div className='flex-1'>
                      <div className='font-semibold text-black'>
                        {tarefa.numero_tarefa}. {tarefa.tarefa}
                      </div>
                      <div className='text-sm text-gray-600 mt-1'>
                        <span className='font-medium'>Lote:</span>{' '}
                        {lote?.numero_lote || 'Sem lote'}
                        {tarefa.descricao_item && (
                          <>
                            <span className='mx-2'>|</span>
                            <span className='font-medium'>
                              Descrição:
                            </span>{' '}
                            {tarefa.descricao_item}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </Modal>
  )
}

export default ExportModal
