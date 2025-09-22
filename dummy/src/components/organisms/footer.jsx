import React from 'react';
import { Link } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
           <div className="flex items-center mb-4">
  <img
    src="/src/assets/logo.png"   // ajusta la ruta según donde pongas la imagen
    alt="FleetManager Logo"
    className="h-10 w-10 mr-3 rounded" // puedes jugar con tamaño y estilos
  />
  <span className="text-xl font-bold">NovaComp</span>
</div>
            </div>
            <p className="text-gray-400 mb-4 text-sm">
              Creemos en el impacto humano detrás de cada tecnología implementada, lo que nos convierte en un verdadero acelerador de capacidades. No solo ofrecemos soluciones tecnológicas, sino que también construimos el futuro digital del continente con el poder del talento humano especializado y la innovación constante.   </p>
            <div className="flex space-x-4">
          <a href="https://www.facebook.com/NovacompCR" target="_blank"
  rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
  <FacebookIcon />
</a>

               <a href="https://x.com/Novacomp" target="_blank"
  rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
  <TwitterIcon/>
</a>
               <a href="https://www.instagram.com/novacompcr/" target="_blank"
  rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
  <InstagramIcon />
              </a>
               <a href="https://www.linkedin.com/company/novacomp/" target="_blank"
  rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
  <LinkedInIcon />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-400">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/vehiculos" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Gestión de Vehículos
                </Link>
              </li>
              <li>
                <Link to="/mp/planes" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Mantenimiento Preventivo
                </Link>
              </li>
              <li>
                <Link to="/suministros/proveedores" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Suministros
                </Link>
              </li>
              <li>
                <Link to="/caja/fondos" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Caja Chica
                </Link>
              </li>
              <li>
                <Link to="/salud/botiquin" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Salud Ocupacional
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-400">Servicios</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Control de Flota
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Mantenimiento Programado
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Gestión de Combustible
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Reportes Automatizados
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Soporte 24/7
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-400">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <LocationOnIcon className="text-blue-400 mr-3 text-sm" />
                <span className="text-gray-400 text-sm">Oficentro Momentum, San José, Curridabat</span>
              </div>
              <div className="flex items-center">
                <PhoneIcon className="text-blue-400 mr-3 text-sm" />
                <span className="text-gray-400 text-sm">+506 4000-2521 (CR)</span>
              </div>
              <div className="flex items-center">
                <EmailIcon className="text-blue-400 mr-3 text-sm" />
                <span className="text-gray-400 text-sm">marketing@crnova.com</span>
              </div>
            </div>
            
      
          </div>
        </div>
      </div>

     
    </footer>
  );
};

// Componente de ícono simple para reemplazar AdbIcon


export default Footer;