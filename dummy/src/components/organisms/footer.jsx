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
              <div className="bg-blue-600 p-2 rounded-lg mr-3">
                <AdbIcon className="text-white text-2xl" />
              </div>
              <span className="text-xl font-bold">FleetManager</span>
            </div>
            <p className="text-gray-400 mb-4 text-sm">
              Sistema integral de gestión de flota vehicular. Optimizamos el control y mantenimiento de tu parque automotor.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <FacebookIcon />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <TwitterIcon />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <InstagramIcon />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
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
                <span className="text-gray-400 text-sm">Av. Principal #123, Ciudad, País</span>
              </div>
              <div className="flex items-center">
                <PhoneIcon className="text-blue-400 mr-3 text-sm" />
                <span className="text-gray-400 text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <EmailIcon className="text-blue-400 mr-3 text-sm" />
                <span className="text-gray-400 text-sm">info@fleetmanager.com</span>
              </div>
            </div>
            
            {/* Newsletter Subscription */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2 text-blue-400">Suscríbete</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Tu correo electrónico"
                  className="px-3 py-2 bg-gray-800 text-white text-sm rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                />
                <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-lg text-sm font-medium transition-colors">
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 FleetManager. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Términos de Servicio
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Política de Privacidad
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Componente de ícono simple para reemplazar AdbIcon
const AdbIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
  </svg>
);

export default Footer;