import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MiscellaneousPage from './components/pages/miscellaneousPage'
import ExtinguisherPage from './components/pages/extinguisherPage'
import Navbar from './components/organisms/navbar'
import Footer from './components/organisms/footer'
import MedicKitPage from './components/pages/medicKitPage'
import VehiclePage from './components/pages/vehiclePage'
import LegalBookRecordPage from './components/pages/legalBookRecordPage'
import LegalBookPage from './components/pages/legalBookPage'

function App() {
  return (
    <BrowserRouter>
      {/* Contenedor padre */}
      <div className="flex flex-col min-h-screen">
        
        <Navbar />

        {/* Main ocupa todo el espacio libre */}
        <main className="flex-grow">
          <Routes>
            <Route path="/catalogo/gestionar" element={<MiscellaneousPage />} />
            <Route path="/salud/botiquin" element={<MedicKitPage />} />
            <Route path="/vehiculos" element={<VehiclePage />} />
            <Route path="/salud/extinguidores" element={<ExtinguisherPage />} />
            <Route path="/libros/registros" element={<LegalBookRecordPage />} />
            <Route path="/libros/mantenimiento" element={<LegalBookPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
