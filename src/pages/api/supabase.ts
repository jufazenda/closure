import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl!, supabaseAnonKey!)

interface PropsResultadoSetor {
  forcask: number
  aguia: number
  medonhos: number
  poupanca: number
}

export const calcularResultadosPorSetor = async (
  setorId: string
): Promise<PropsResultadoSetor> => {
  const { data, error } = await supabase
    .from('Resultado')
    .select('forcask, aguia, medonhos, poupanca, Tarefas!inner(id_setor)')
    .eq('Tarefas.id_setor', setorId)

  if (error) {
    console.error('Erro ao buscar os dados:', error)
    return { forcask: 0, aguia: 0, medonhos: 0, poupanca: 0 }
  } else {
    const totals = data.reduce(
      (acc, item) => ({
        forcask: acc.forcask + item.forcask,
        aguia: acc.aguia + item.aguia,
        medonhos: acc.medonhos + item.medonhos,
        poupanca: acc.poupanca + item.poupanca,
      }),
      { forcask: 0, aguia: 0, medonhos: 0, poupanca: 0 }
    )
    return totals
  }
}

export default supabase
