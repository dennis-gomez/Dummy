import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MiscellaneousPage from './components/pages/miscellaneousPage'
import ExtinguisherPage from './components/pages/extinguisherPage'
import Navbar from './components/organisms/navbar'
import Footer from './components/organisms/footer'
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
        <Route path="/salud/extinguidores" element={<ExtinguisherPage />} />
        {/* aquí más rutas */}
      </Routes>
        <Footer />
    </BrowserRouter>
  )
}

export default App
