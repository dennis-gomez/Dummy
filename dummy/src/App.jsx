import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import MiscellaneousPage from './components/pages/miscellaneousPage'
import Navbar from './components/organisms/navbar'
import MedicKitPage from './components/pages/medicKitPage'
import VehiclePage from './components/pages/vehiclePage'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/catalogo/gestionar" element={<MiscellaneousPage />} />
        <Route path="/salud/botiquin" element={<MedicKitPage />} />
        <Route path="/vehiculos" element={<VehiclePage />} />
        {/* aquí más rutas */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
