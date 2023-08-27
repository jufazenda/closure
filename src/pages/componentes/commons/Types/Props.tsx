import { Dispatch, ReactNode, SetStateAction } from 'react'

export default interface PropsModal {
  title: string
  subtitle?: string
  icon: ReactNode
  buttonIcon?: JSX.Element | null
  buttonLabel: string
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  setor?: number | null
  onClickButton: () => void
}

export default interface PropsAdicionarTarefa {
  activeModal: boolean
  setActiveModal: Dispatch<SetStateAction<boolean>>
}

export interface ModalComponents {
  [key: string]: JSX.Element
}
