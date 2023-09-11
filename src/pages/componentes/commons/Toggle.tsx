import React, { useState, useEffect } from 'react'

interface PropsToggle {
  setChange: (value: boolean) => void
  change: boolean
  save?: boolean
}

const Toggle = ({ setChange, change, save }: PropsToggle) => {
  const [isChecked, setIsChecked] = useState(change)

  const toggleHandler = () => {
    const newCheckedState = !isChecked
    setIsChecked(newCheckedState)
    setChange(newCheckedState)
  }

  useEffect(() => {
    if (save) {
      setIsChecked(true)
    } else {
      setIsChecked(change)
    }
  }, [change, save])

  return (
    <div className='flex items-center'>
      <button
        className={`w-10 h-6 bg-gray-300 rounded-full p-1 transition ${
          isChecked ? 'bg-green-500' : 'bg-gray-400'
        }`}
        onClick={toggleHandler}
      >
        <div
          className={`bg-white w-4 h-4 rounded-full shadow-md transform ${
            isChecked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  )
}

export default Toggle
