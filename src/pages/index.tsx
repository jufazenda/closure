;('')

import { useState } from 'react'
import supabase from './api/supabase'
import Head from 'next/head'
import { ModalComponents } from './componentes/commons/Types/Props'
import AdicionarTarefa from './componentes/AdicionarTarefaModal'

import { AddCircle, FilterNone } from '@mui/icons-material'

const Home = () => {
  const [activeModal, setActiveModal] = useState<boolean>(false)
  const [modalComponentName, setModalComponentName] = useState('')

  const openModal = (modalName: string) => {
    setActiveModal(true)
    setModalComponentName(modalName)
  }

  const chooseModal = (modalName: string) => {
    const components: ModalComponents = {
      AdicionarTarefa: (
        <AdicionarTarefa
          activeModal={activeModal}
          setActiveModal={setActiveModal}
        />
      ),
    }
    return components[modalName]
  }
  return (
    <>
      <Head>
        <title>Closure - Organizador de Fechamento</title>
      </Head>
      <div className='py-12 px-6 md:px-20 space-y-10 md:space-y-12'>
        <div>
          <div className='flex items-center justify-end text-md gap-10'>
            <span
              className='flex cursor-pointer font-semibold gap-1'
              onClick={() => openModal('AdicionarTarefa')}
            >
              <AddCircle />
              Adicionar
            </span>

            <span
              className='flex cursor-pointer font-semibold gap-1'
              //onClick={option.onClick}
            >
              <FilterNone />
              Filtrar
            </span>
          </div>
        </div>

        <div>aa</div>
        {activeModal && chooseModal(modalComponentName)}
      </div>
    </>
  )
}

export default Home
