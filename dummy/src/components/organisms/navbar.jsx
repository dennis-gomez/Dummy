import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';

const navConfig = [
  {
    label: 'Vehiculos',
    sub: [
      { label: 'Gestion de Vehículos', path: '/vehiculos' },
      { label: 'Marcas y modelos', path: '/vehiculos/marcas-modelos' },
      { label: 'Tipos de vehículos', path: '/vehiculos/tipos' },
      { label: 'Combustibles', path: '/vehiculos/combustibles' },
      { label: 'Colores', path: '/vehiculos/colores' },
      { label: 'Ubicaciones', path: '/vehiculos/ubicaciones' },
    ],
  },
  {
    label: 'Mantenimiento Preventivo',
    sub: [
      { label: 'Planes de mantenimiento', path: '/mp/planes' },
      { label: 'Tareas de mantenimiento', path: '/mp/tareas' },
      { label: 'Frecuencias', path: '/mp/frecuencias' },
      { label: 'Historial de mantenimiento', path: '/mp/historial' },
    ],
  },
  {
    label: 'Suministros',
    sub: [
      { label: 'Proveedores', path: '/suministros/proveedores' },
      { label: 'Servicios', path: '/suministros/servicios' },
      { label: 'Categorías', path: '/suministros/categorias' },
      { label: 'Items', path: '/suministros/items' },
      { label: 'Órdenes de compra', path: '/suministros/ordenes' },
    ],
  },
  {
    label: 'Caja chica',
    sub: [
      { label: 'Fondos', path: '/caja/fondos' },
      { label: 'Gastos', path: '/caja/gastos' },
      { label: 'Reportes', path: '/caja/reportes' },
    ],
  },
  {
    label: 'Libros legales',
    sub: [
      { label: 'Registros de mantenimiento', path: '/libros/mantenimiento' },
      { label: 'Registros de inspección', path: '/libros/inspeccion' },
      { label: 'Registros de combustible', path: '/libros/combustible' },
    ],
  },
  {
    label: 'Salud ocupacional',
    sub: [
      { label: 'Botiquines', path: '/salud/botiquin' },
      { label: 'Extinguidores', path: '/salud/extinguidores' },
    ],
  },
  {
    label: 'TI',
    sub: [
      { label: 'Usuarios', path: '/ti/usuarios' },
      { label: 'Roles y permisos', path: '/ti/roles' },
      { label: 'Configuraciones del sistema', path: '/ti/config' },
    ],
  },
  {
    label: 'Catalogo',
    sub: [{ label: 'gestionar catalogo', path: '/catalogo/gestionar' }]
  }
];

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [mobileSubMenu, setMobileSubMenu] = React.useState(null);
  const [desktopSubMenu, setDesktopSubMenu] = React.useState({ anchor: null, index: null });
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
    setMobileSubMenu(null);
    setDesktopSubMenu({ anchor: null, index: null });
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <img
              src="/src/assets/logo.png"   
              alt="FleetManager Logo"
              className="h-10 w-10 mr-3 rounded" 
            />
            <div className="hidden md:flex items-center">
              <span className="text-xl font-bold"></span>
            </div>
            <div className="md:hidden flex items-center">
              <span className="text-xl font-bold"></span>
            </div>

            {/* Menú desktop */}
            <div className="hidden md:flex ml-10 space-x-4">
              {navConfig.map((page, idx) => (
                <div key={page.label} className="relative group">
                  <button
                    onClick={(e) => setDesktopSubMenu({ anchor: e.currentTarget, index: idx })}
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    {page.label}
                  </button>

                  {desktopSubMenu.index === idx && (
                    <div
                      className="absolute left-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg py-1 z-50"
                      onMouseLeave={() => setDesktopSubMenu({ anchor: null, index: null })}
                    >
                      {page.sub.map((sub) => (
                        <button
                          key={sub.label}
                          onClick={() => handleNavigate(sub.path)}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-100 transition-colors"
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Menú usuario */}
          <div className="flex items-center">
            <Tooltip title="Open settings">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="p-1 rounded-full hover:bg-blue-700 transition-colors"
              >
                <Avatar className="w-8 h-8" alt="User" src="/static/images/avatar/2.jpg" />
              </button>
            </Tooltip>

            {userMenuOpen && (
              <div className="absolute right-4 top-16 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg py-1 z-50">
                {settings.map((setting) => (
                  <button
                    key={setting}
                    onClick={() => setUserMenuOpen(false)}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-100 transition-colors"
                  >
                    {setting}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Botón menú móvil */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-blue-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {mobileSubMenu === null ? (
              // Menú principal móvil
              navConfig.map((page, idx) => (
                <button
                  key={page.label}
                  onClick={() => setMobileSubMenu(idx)}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-blue-600 transition-colors"
                >
                  {page.label}
                </button>
              ))
            ) : (
              // Submenú móvil
              <>
                <button
                  onClick={() => setMobileSubMenu(null)}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-blue-200 hover:bg-blue-600 transition-colors"
                >
                  ← Volver
                </button>
                {navConfig[mobileSubMenu].sub.map((sub) => (
                  <button
                    key={sub.label}
                    onClick={() => handleNavigate(sub.path)}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-blue-600 transition-colors"
                  >
                    {sub.label}
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;