import React, { useState } from 'react'

const Toggle = () => {
  const [isChecked, setIsChecked] = useState(false)

  const toggleHandler = () => {
    setIsChecked(!isChecked)
  }

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