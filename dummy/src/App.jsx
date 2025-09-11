import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import MiscellaneousPage from './components/pages/miscellaneousPage'
import ExtinguisherPage from './components/pages/extinguisherPage'
import Navbar from './components/organisms/navbar'
import VehiclePage from './components/pages/vehiclePage'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/catalogo/gestionar" element={<MiscellaneousPage />} />
        <Route path="/vehiculos" element={<VehiclePage />} />
        <Route path="/salud/extinguidores" element={<ExtinguisherPage />} />
        {/* aquí más rutas */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
