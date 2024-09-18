;('')
import Image from 'next/image'

interface PropsEquipesResultado {
  id: number
  equipe: string
  pontuacaoTotal: number
}
interface PropsCardResultado {
  allResultado: PropsEquipesResultado
  src: string
  bgColor: string
}

const CardResultado = ({
  allResultado,
  src,
  bgColor,
}: PropsCardResultado) => {
  return (
    <div
      className={`${bgColor} flex rounded-lg w-full max-h-1/4 py-5 px-10 justify-between items-center`}
    >
      <Image
        src={src}
        alt={`Logo da ${allResultado?.equipe}`}
        width={120}
        height={100}
        priority
      />
      <span className='text-5xl'>{allResultado?.pontuacaoTotal || 0}</span>
    </div>
  )
}

export default CardResultado
