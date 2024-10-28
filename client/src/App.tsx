import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import MapComponent from './components/Map'
import ImportJsonButton from './components/ImportJsonButton'

function App() {

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <MapComponent />
      <br></br>
      <div className='flex justify-center items-center mt-4'>
        <ImportJsonButton />
      </div>
    </>
  )
}

export default App
