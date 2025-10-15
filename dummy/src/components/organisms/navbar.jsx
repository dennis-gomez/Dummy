import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import Tooltip from '@mui/material/Tooltip';
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import NotificationDrawer from './drawer';
import { fetchAllNotifications, getAllNotifications } from '../../services/useNotifications';

const navConfig = [
  {
    label: 'Vehículos',
    sub: [
      { label: 'Gestión de Vehículos', path: '/vehiculos' },
      { label: 'Registro de Combustible', path: '/vehiculos/registro-combustible' },
      { label: 'Mantenimiento de Vehículos', path: '/vehiculos/registro-mantenimientos' },
    ],
  },
  {
    label: 'Mantenimiento Preventivo',
    sub: [
      { label: 'Gestion del Edificio', path: '/mantenimiento_edificio/gestion' },
      
    ],
  },
  {
    label: 'Suministros',
    sub: [
      { label: 'Proveedores', path: '/suministros/proveedores' },
      { label: 'Inventario', path: '/suministros/inventario' },
      { label: 'Órdenes de Compra', path: '/suministros/ordenes' },
    ],
  },
  {
    label: 'Caja Chica',
    sub: [
       { label: 'Gestión de Cajas Chicas', path: '/caja/gestion' },
     
    ],
  },
  {
    label: 'Libros Legales',
    sub: [
      { label: 'Gestión de Libros Legales', path: '/libros/mantenimiento' },
      { label: 'Registros de Libros Legales', path: '/libros/registros' },
    ],
  },
  {
    label: 'Salud Ocupacional',
    sub: [
      { label: 'Botiquines', path: '/salud/botiquin' },
      { label: 'Extintores', path: '/salud/extinguidores' },
      { label: 'Brigadas', path: '/salud/brigadas' },
    ],
  },
  {
    label: 'Garantías',
    sub: [
      { label: 'Gestión de Garantías', path: '/garantias/gestion' },
      { label: 'Cuadro de Resumen', path: '/garantias/resumen' },
    ],
  },
  /*{
    label: 'TI',
    sub: [
      { label: 'Usuarios', path: '/ti/usuarios' },
      { label: 'Roles y Permisos', path: '/ti/roles' },
      { label: 'Configuraciones del Sistema', path: '/ti/config' },
    ],
  },*/
  {
    label: 'Catálogo',
    sub: [{ label: 'Gestionar Catálogo', path: '/catalogo/gestionar' }],
  },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [mobileSubMenu, setMobileSubMenu] = React.useState(null);
  const [desktopSubMenu, setDesktopSubMenu] = React.useState({ anchor: null, index: null });
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState([]);
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
    setMobileSubMenu(null);
    setDesktopSubMenu({ anchor: null, index: null });
  };

  // Traer notificaciones cada 15 segundos
  React.useEffect(() => {
    const fetchNotifications = async () => {
      await fetchAllNotifications(); // actualiza backend
      setNotifications(getAllNotifications()); // actualiza estado
    };

    fetchNotifications(); // fetch inicial
    const interval = setInterval(fetchNotifications, 3600000); // cada hora
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src="/src/assets/logo.png"
              alt="FleetManager Logo"
              className="h-10 w-10 rounded cursor-pointer hover:opacity-80 transition"
              onClick={() => handleNavigate("/")}
            />

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

          {/* Notificaciones */}
          <div className="flex items-center">
            <Tooltip title="Notificaciones">
              <Badge
                badgeContent={notifications.length}
                color="primary"
                onClick={() => setDrawerOpen(true)}
                className="cursor-pointer"
              >
                <MailIcon color="action" />
              </Badge>
            </Tooltip>
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

      {/* Drawer de notificaciones */}
      <NotificationDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        notifications={notifications}
        setNotifications={setNotifications}
      />
    </nav>
  );
}
