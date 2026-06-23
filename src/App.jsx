import { useState, useCallback, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [length, setLength] = useState(8)
  const [numberAllowed, setNumberAll] = useState(false)
  const [charAllowed, setCharAllowed] = useState(false)
  const [password, setPassword] = useState("")
  const [upperCase, setUpperCase] = useState(false)
  const [lowerCase, setLowerCase] = useState(false)
  const [isCopied, setIsCopied] = useState(false) // Standardized variable name

  // ref hook
  const passwordRef = useRef(null)

  const passwordGenerator = useCallback(() => {
    let pass = ""
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

    if (numberAllowed) str += "0123456789"
    if (charAllowed) str += "!@#$%^&*(){}~"

    for (let i = 1; i <= length; i++) {
      let char = Math.floor(Math.random() * str.length)
      pass += str.charAt(char)
    }

    setPassword(pass)
    setIsCopied(false) // Reset status when a fresh password is created
  }, [length, numberAllowed, charAllowed])

  // Helper function to get the correctly formatted password string
  const getFormattedPassword = useCallback(() => {
    if (upperCase) return password.toUpperCase()
    if (lowerCase) return password.toLowerCase()
    return password
  }, [password, upperCase, lowerCase])

  // copy button handler
  const copyPasswordToClipboard = useCallback(() => {
    passwordRef.current?.select();
    passwordRef.current?.setSelectionRange(0, 100)

    const finalPassword = getFormattedPassword()
    globalThis.navigator.clipboard.writeText(finalPassword)
    
    setIsCopied(true) // Turn on feedback text

    // Automatically change back to normal after 2 seconds
    setTimeout(() => {
      setIsCopied(false)
    }, 2000)
  }, [getFormattedPassword])

  useEffect(() => {
    passwordGenerator()
  }, [length, numberAllowed, charAllowed, passwordGenerator])

  // password Strength indicator
  const strength = () => {
    if (length >= 8 && numberAllowed && charAllowed) {
      return "Strong"
    }
    if (length > 8 && charAllowed) {
      return "Medium"
    }
    return "Weak"
  }

  return (
    <div className='w-full max-w-md mx-auto shadow-md rounded-lg px-4 py-4 my-8 text-orange-500 bg-gray-700 text-center'>
      <h1 className='text-white text-2xl text-center mb-4'>Password Generator</h1>

      <div className='flex shadow rounded-lg text-center overflow-hidden mb-4'>
        <input
          type="text"
          value={getFormattedPassword()}
          className='outline-none w-full py-2 px-3 bg-white text-gray-800'
          placeholder='password'
          readOnly
          ref={passwordRef}
        />
        <button
          onClick={copyPasswordToClipboard}
          // Dynamic styling: turns green when copied successfully!
          className={`w-auto font-medium py-2 px-4 rounded-r-lg shadow-md transition-all duration-200 ease-in-out transform hover:scale-[1.01] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
            isCopied ? 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500' 
              : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500'
          }`}
        >
          {isCopied ? "copied!" : "copy"}
        </button>
      </div>

      <div className='flex flex-col gap-y-3 text-sm'>
        {/* Length Slider */}
        <div className='flex items-center justify-between gap-x-2'>
          <input
            type="range"
            min={6}
            max={100}
            value={length}
            className='cursor-pointer'
            onChange={(e) => { setLength(Number(e.target.value)) }}
          />
          <label className='text-white'>Length: {length}</label>
        </div>

        {/* Options Row */}
        <div className='flex justify-between items-center gap-x-2'>
          <div className='flex items-center gap-x-1'>
            <input
              type="checkbox"
              checked={numberAllowed}
              id="numberInput"
              onChange={() => setNumberAll((prev) => !prev)}
            />
            <label htmlFor="numberInput" className='text-white'>Numbers</label>
          </div>

          <div className='flex items-center gap-x-1'>
            <input
              type="checkbox"
              checked={charAllowed}
              id="charInput"
              onChange={() => setCharAllowed((prev) => !prev)}
            />
            <label htmlFor="charInput" className='text-white'>Characters</label>
          </div>

          {/* Uppercase Toggle */}
          <div className='flex items-center gap-x-1'>
            <input
              type="checkbox"
              id="uppercase"
              checked={upperCase}
              onChange={() => {
                setUpperCase((prev) => !prev)
                if (!upperCase) setLowerCase(false)
              }}
            />
            <label htmlFor="uppercase" className='text-white'>Upper</label>
          </div>

          {/* Lowercase Toggle */}
          <div className='flex items-center gap-x-1'>
            <input
              type="checkbox"
              id="lowercase"
              checked={lowerCase}
              onChange={() => {
                setLowerCase((prev) => !prev)
                if (!lowerCase) setUpperCase(false)
              }}
            />
            <label htmlFor="lowercase" className='text-white'>Lower</label>
          </div>
        </div>
      </div>
      <div>

        {/* new password */}
        <button
          onClick={passwordGenerator}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:scale-[1.01] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Generate New Password
        </button>
      </div>

      {/* Info Stats Section */}
      <div className='flex justify-around items-center mt-4 pt-2 border-t border-gray-600 text-white text-sm'>
        <p>Password Strength: <span className='font-bold text-green-400'>{strength()}</span></p>
        <p>Status: <span className={`font-bold ${isCopied ? 'text-green-400' : 'text-orange-400'}`}>{isCopied ? "Copied!" : "Not Copied"}</span></p>
      </div>
    </div>
  )
}

export default App