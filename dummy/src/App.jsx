import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import MiscellaneousPage from './components/pages/miscellaneousPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta principal que muestra directamente start_page */}
        <Route path="/" element={<MiscellaneousPage />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App
