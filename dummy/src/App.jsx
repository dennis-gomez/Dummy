import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import MiscellaneousPage from './components/pages/miscellaneousPage'
import Navbar from './components/organisms/navbar'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/catalogo/gestionar" element={<MiscellaneousPage />} />
        {/* aquí más rutas */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
