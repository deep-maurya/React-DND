import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {DND} from './DND'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <DND/>
    </>
  )
}

export default App
