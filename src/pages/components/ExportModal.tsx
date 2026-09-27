/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { Autocomplete, TextField, styled, Checkbox } from '@mui/material'
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
  const [filteredTarefas, setFilteredTarefas] = useState<PropsTarefas[]>(
    allTarefas ?? []
  )
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

      const tarefasSelecionadas = filteredTarefas
        .filter(tarefa => selectedTarefas.includes(tarefa.id))
        .sort((a, b) => a.numero_tarefa - b.numero_tarefa)

      const loteTexto =
        selectedLote === 'all'
          ? 'todos'
          : lotes.find(l => l.id === selectedLote)?.numero_lote || 'Sem Lote'

      // Agrupar tarefas por lote
      const gruposPorLote: { loteNumero: string; tarefas: PropsTarefas[] }[] = []

      if (selectedLote === 'all') {
        const loteMap = new Map<number | null, PropsTarefas[]>()
        for (const t of tarefasSelecionadas) {
          if (!loteMap.has(t.id_lote)) loteMap.set(t.id_lote, [])
          loteMap.get(t.id_lote)!.push(t)
        }
        Array.from(loteMap.entries()).forEach(([loteId, tarefas]) => {
          const loteInfo = dataLotes?.find((l: { id: number }) => l.id === loteId)
          gruposPorLote.push({
            loteNumero: loteInfo?.numero_lote || 'Sem Lote',
            tarefas,
          })
        })
        gruposPorLote.sort((a, b) => a.loteNumero.localeCompare(b.loteNumero))
      } else {
        const lote = lotes.find(l => l.id === selectedLote)
        gruposPorLote.push({
          loteNumero: lote?.numero_lote || 'Sem Lote',
          tarefas: tarefasSelecionadas,
        })
      }

      const TEMPLATE_URL = '/formularioEntregaLote.xlsx'
      const DATA_START_ROW = 7
      const MAX_ROWS = 18

      // Para cada lote, carregar uma cópia do template e preencher
      const finalWorkbook = new ExcelJS.Workbook()

      for (const grupo of gruposPorLote) {
        const templateWb = new ExcelJS.Workbook()
        const res = await fetch(TEMPLATE_URL)
        const buf = await res.arrayBuffer()
        await templateWb.xlsx.load(buf)

        const templateWs = templateWb.worksheets[0]

        const EXTRA_ROWS = 10
        const totalDataRows = Math.max(MAX_ROWS, grupo.tarefas.length + EXTRA_ROWS)
        const footerStartRow = DATA_START_ROW + totalDataRows
        const lastRow = footerStartRow + 1

        // Criar worksheet final direto (evita problemas de merge/cópia do template)
        const sheetName = `Lote ${grupo.loteNumero}`.substring(0, 31)
        const newWs = finalWorkbook.addWorksheet(sheetName)

        // Copiar larguras de colunas do template
        for (let c = 1; c <= 5; c++) {
          newWs.getColumn(c).width = templateWs.getColumn(c).width
        }

        // Copiar merges do cabeçalho (linhas 1-6) e replicar merges do rodapé (linhas 25-26) na posição dinâmica
        const merges = (templateWs.model as any).merges || []
        for (const merge of merges) {
          const rowNum = parseInt(merge.split(':')[0].replace(/[A-Z]/g, ''))
          if (rowNum <= 6) {
            newWs.mergeCells(merge)
          } else if (rowNum >= 25 && rowNum <= 26) {
            const offset = rowNum - 25
            const shifted = merge.replace(/(\d+)/g, (_: string, num: string) => {
              return String(parseInt(num) - 25 + footerStartRow)
            })
            newWs.mergeCells(shifted)
          }
        }

        // Copiar estilos do cabeçalho (linhas 1-6) do template
        for (let r = 1; r <= 6; r++) {
          const srcRow = templateWs.getRow(r)
          const dstRow = newWs.getRow(r)
          dstRow.height = srcRow.height
          for (let c = 1; c <= 5; c++) {
            const src = templateWs.getCell(r, c)
            const dst = newWs.getCell(r, c)
            dst.style = JSON.parse(JSON.stringify(src.style))
          }
        }

        // Copiar estilo de uma linha de dados do template pra todas as linhas de dados
        const templateDataRow = DATA_START_ROW
        const dataRowHeight = templateWs.getRow(templateDataRow).height
        const dataStyles: object[] = []
        for (let c = 1; c <= 5; c++) {
          dataStyles.push(JSON.parse(JSON.stringify(templateWs.getCell(templateDataRow, c).style)))
        }
        for (let r = DATA_START_ROW; r < DATA_START_ROW + totalDataRows; r++) {
          newWs.getRow(r).height = dataRowHeight
          for (let c = 1; c <= 5; c++) {
            newWs.getCell(r, c).style = JSON.parse(JSON.stringify(dataStyles[c - 1]))
          }
        }

        // Row 1: BLACKOUT - Lexend 19.6
        const cell1 = newWs.getCell('A1')
        cell1.value = {
          richText: [{ font: { size: 19.6, name: 'Lexend' }, text: 'BLACKOUT - Gincanas e Eventos' }],
        }

        // Row 2: 41ª Gincana - Lexend bold 19.6 + "- 2026" Lexend regular 19.6
        const cell2 = newWs.getCell('A2')
        cell2.value = {
          richText: [
            { font: { bold: true, size: 19.6, name: 'Lexend' }, text: '41ª Gincana Cultural de São Jerônimo ' },
            { font: { size: 19.6, name: 'Lexend' }, text: '- 2026' },
          ],
        }

        // Row 3: FORMULÁRIO - Calibri bold 16.08
        const cell3 = newWs.getCell('A3')
        cell3.value = {
          richText: [{ font: { bold: true, size: 16.08, name: 'Calibri', family: 1 }, text: 'FORMULÁRIO DE ENTREGA DE LOTE' }],
        }

        // Row 4: Lote nº - Calibri bold 13.08
        newWs.getCell('A4').value = {
          richText: [
            { font: { bold: true, size: 13.08, name: 'Calibri', family: 1 }, text: `Lote n°: ${grupo.loteNumero.replace(/\D/g, '')}` },
          ],
        }

        // Row 5: NOME DA EQUIPE - Calibri bold 12.15
        newWs.getCell('A5').value = {
          richText: [
            { font: { bold: true, size: 12.15, name: 'Calibri', family: 1 }, text: `NOME DA EQUIPE: ${nomeEquipe}` },
          ],
        }

        // Row 6: Header
        const headerCells = [
          { col: 'A', size: 10.2, text: 'Entregou' },
          { col: 'B', size: 13, text: 'Nº' },
          { col: 'C', size: 11.2, text: 'TÍTULO DA TAREFA' },
          { col: 'D', size: 11.2, text: 'RESPOSTA / O QUE:' },
          { col: 'E', size: 11.2, text: 'Pontuação' },
        ]
        for (const h of headerCells) {
          newWs.getCell(`${h.col}6`).value = {
            richText: [{ font: { bold: true, size: h.size, name: 'Calibri', family: 1, color: { argb: 'FFFFFFFF' } }, text: h.text }],
          }
        }

        // Preencher tarefas - Calibri 12
        for (let i = 0; i < grupo.tarefas.length; i++) {
          const r = DATA_START_ROW + i
          const t = grupo.tarefas[i]

          newWs.getCell(`B${r}`).value = { richText: [{ font: { size: 12, name: 'Calibri', family: 1 }, text: String(t.numero_tarefa) }] }
          newWs.getCell(`C${r}`).value = { richText: [{ font: { size: 12, name: 'Calibri', family: 1 }, text: t.tarefa }] }

          if (t.descricao_item) {
            newWs.getCell(`D${r}`).value = { richText: [{ font: { size: 12, name: 'Calibri', family: 1 }, text: t.descricao_item }] }
          }
        }

        // Copiar estilos do rodapé do template (linhas 25-26) para as linhas dinâmicas do rodapé
        for (let offset = 0; offset <= 1; offset++) {
          const srcRow = templateWs.getRow(25 + offset)
          const dstRow = newWs.getRow(footerStartRow + offset)
          dstRow.height = srcRow.height
          for (let c = 1; c <= 5; c++) {
            const src = templateWs.getCell(25 + offset, c)
            const dst = newWs.getCell(footerStartRow + offset, c)
            dst.style = JSON.parse(JSON.stringify(src.style))
          }
        }

        // Footer: Nome do Líder
        newWs.getCell(`A${footerStartRow}`).value = {
          richText: [{ font: { bold: true, size: 14.02, name: 'Calibri', family: 1 }, text: 'Nome do Líder:' }],
        }

        // Footer: Blackout + Horário final
        newWs.getCell(`A${footerStartRow + 1}`).value = {
          richText: [{ font: { bold: true, size: 14.02, name: 'Calibri', family: 1 }, text: 'Blackout:' }],
        }
        newWs.getCell(`D${footerStartRow + 1}`).value = {
          richText: [{ font: { bold: true, size: 14.02, name: 'Calibri', family: 1 }, text: 'Horário final:' }],
        }

        // Centralizar títulos e header
        for (const r of [1, 2, 3]) {
          for (let c = 1; c <= 5; c++) {
            newWs.getCell(r, c).alignment = { ...newWs.getCell(r, c).alignment, horizontal: 'center', vertical: 'middle', indent: 0 }
          }
        }
        for (let c = 1; c <= 5; c++) {
          newWs.getCell(6, c).alignment = { ...newWs.getCell(6, c).alignment, horizontal: 'center', vertical: 'middle', indent: 0 }
        }

        // Padding nas demais células
        for (const r of [4, 5, footerStartRow, footerStartRow + 1]) {
          for (let c = 1; c <= 5; c++) {
            newWs.getCell(r, c).alignment = { ...newWs.getCell(r, c).alignment, vertical: 'middle', indent: 1 }
          }
        }
        for (let r = DATA_START_ROW; r < DATA_START_ROW + totalDataRows; r++) {
          for (let c = 1; c <= 5; c++) {
            newWs.getCell(r, c).alignment = { ...newWs.getCell(r, c).alignment, vertical: 'middle', indent: 1 }
          }
        }

        // Page setup
        newWs.pageSetup = { ...templateWs.pageSetup }
      }

      const buffer = await finalWorkbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })

      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download =
        selectedLote === 'all'
          ? `formulario_entrega_todos_${selectedTarefas.length}itens.xlsx`
          : `formulario_entrega_lote_${loteTexto}_${selectedTarefas.length}itens.xlsx`
      link.click()
      URL.revokeObjectURL(link.href)

      onClose()
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'message' in error) {
        const errMsg = (error as { message?: string }).message
        console.error('Erro ao exportar:', error)
        alert(`Erro ao exportar planilha: ${errMsg || 'Erro desconhecido'}`)
      } else {
        console.error('Erro ao exportar:', error)
        alert('Erro ao exportar planilha: Erro desconhecido')
      }
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
          getOptionLabel={option => option?.numero_lote ?? ''}
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
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
          {filteredTarefas?.length === 0 ? (
            <div className='p-4 text-center text-gray-600'>
              <span>Nenhuma tarefa encontrada</span>
              <br />
              <span className='text-sm'>
                Tente selecionar um lote diferente
              </span>
            </div>
          ) : (
            filteredTarefas?.map(tarefa => {
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
