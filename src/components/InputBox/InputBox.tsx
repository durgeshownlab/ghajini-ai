import React, { MouseEvent } from 'react'
import loaderIcon from '../../assets/loader.gif'

interface InputBoxProps {
  promptText: string,
  setPromptText: Function,
  handleSubmit: Function,
  isInputDisabled: boolean,
  setIsInputDisabled: Function,
  isSubmitBtnDisabled: boolean,
  setIsSubmitBtnDisabled: Function,
  chatInput: React.RefObject<HTMLInputElement>
}

const InputBox: React.FC<InputBoxProps> = ({promptText, setPromptText, handleSubmit, isInputDisabled, isSubmitBtnDisabled, setIsInputDisabled, setIsSubmitBtnDisabled, chatInput}) => {

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPromptText(e.target.value)
    if(promptText!=="") {
      setIsSubmitBtnDisabled(false)
    }
    else {
      setIsSubmitBtnDisabled(true)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>)=>{
    if(e.key==="Enter") {
      e.preventDefault()

      if(promptText.trim()!=="") {
        handleSubmit()
        setIsSubmitBtnDisabled(true)
        setIsInputDisabled(true)
      }
    }
  }

  const handleSubmitBtn = (e: MouseEvent)=>{
    e.preventDefault();
    if(promptText.trim()!=="") {
      handleSubmit(e)
      setIsSubmitBtnDisabled(true)
      setIsInputDisabled(true)
    }

  }

  return (
    <>
      <input 
        type="text"
        value={promptText}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        placeholder='Ask me'
        className='w-10/12 sm:w-11/12 bg-white px-5 h-full focus:outline-none'
        disabled={isInputDisabled}
        ref={chatInput}
      />

      <button 
        className='w-2/12 sm:w-1/12 h-full bg-blue-700 text-white rounded-full rounded-s-none p-3 flex justify-center items-center' 
        onClick={handleSubmitBtn}
        disabled={isSubmitBtnDisabled}
      >
        {
          isInputDisabled && isSubmitBtnDisabled?(<img src={loaderIcon} />):(<>&uarr;</>)
        }
        {/* &uarr; */}
      </button>
    </>
  )
}

export default InputBox
