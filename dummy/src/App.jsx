import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MiscellaneousPage from './components/pages/miscellaneousPage'
import ExtinguisherPage from './components/pages/extinguisherPage'
import Navbar from './components/organisms/navbar'
import Footer from './components/organisms/footer'
import MedicKitPage from './components/pages/medicKitPage'
import VehiclePage from './components/pages/vehiclePage'
import FuelLogPage from './components/pages/fuelLogPage'
import LegalBookRecordPage from './components/pages/legalBookRecordPage'
import OHPersonnelPage from './components/pages/ohPersonnelPage'
import LegalBookPage from './components/pages/legalBookPage'
import LandingPage from './components/pages/landingPage'
import ErrorPage from './components/pages/errorPage'
import ScrollToTop from './components/organisms/scrollToTop';
import ResumePage from './components/pages/resumePage'
import GuaranteePage from './components/pages/guaranteePage'
import PettyCashPage from './components/pages/pettyCashPage'
import PettyCashDetailPage from './components/pages/pettyCashDetailPage'
import ActionPlanAndRevisionPage from './components/pages/actionPlanAndRevisionPage'
import VehicleMaintenance from './components/pages/vehicleMaintenancePage'


function App() {
  return (
    <BrowserRouter>
      {/* Contenedor padre */}
         <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        {/* Main ocupa todo el espacio libre */}
        <main className="flex-grow">
          <Routes>
             <Route path="/" element={<LandingPage />} />
                <Route path="/errorPage" element={<ErrorPage />} />
            <Route path="/catalogo/gestionar" element={<MiscellaneousPage />} />
            <Route path="/salud/botiquin" element={<MedicKitPage />} />
            <Route path="/vehiculos" element={<VehiclePage />} />
            <Route path="/salud/extinguidores" element={<ExtinguisherPage />} />
            <Route path="/libros/registros" element={<LegalBookRecordPage />} />
            <Route path="/salud/brigadas" element={<OHPersonnelPage />} />
            <Route path="/libros/mantenimiento" element={<LegalBookPage />} />
            <Route path="/vehiculos/registro-combustible" element={<FuelLogPage />} />
            <Route path="/garantias/resumen" element={<ResumePage />} />
            <Route path="/garantias/gestion" element={<GuaranteePage />} />
            <Route path="/caja/gestion" element={<PettyCashPage />} />
            <Route path="/caja/registros-desembolsos/:cashBoxId" element={<PettyCashDetailPage />} />
            <Route path="/mantenimiento_edificio/gestion" element={<ActionPlanAndRevisionPage />} />
            <Route path="/vehiculos/registro-mantenimientos" element={<VehicleMaintenance />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
