import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { useNavigate } from 'react-router-dom';

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
      { label: 'botiquines', path: '/salud/botiquin' },
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
  { label: 'Catalogo', 
    sub: [{ label: 'gestionar catalogo', path: '/catalogo/gestionar' },]
  }
];

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];


function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [mobileSubMenu, setMobileSubMenu] = React.useState(null); // para submenús en móvil
  const [desktopSubMenu, setDesktopSubMenu] = React.useState({ anchor: null, index: null });
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();


  // Menú hamburguesa (móvil)
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
    setMobileSubMenu(null);
  };

  // Submenú móvil: ahora solo muestra el submenú, ocultando el menú principal
  const handleOpenMobileSubMenu = (index) => {
    setMobileSubMenu({ index });
  };
  const handleCloseMobileSubMenu = () => {
    setMobileSubMenu(null);
  };

  // Submenú desktop
  const handleOpenDesktopSubMenu = (event, index) => {
    setDesktopSubMenu({ anchor: event.currentTarget, index });
  };
  const handleCloseDesktopSubMenu = () => {
    setDesktopSubMenu({ anchor: null, index: null });
  };

  // Menú usuario
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // Navegación
  const handleNavigate = (path) => {
    navigate(path);
    handleCloseNavMenu();
    handleCloseMobileSubMenu();
    handleCloseDesktopSubMenu();
  };

  return (
    <AppBar position="static">
      <Toolbar disableGutters>
        <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
        <Typography
          variant="h6"
          noWrap
          component="a"
          href="#app-bar-with-responsive-menu"
          sx={{
            mr: 2,
            display: { xs: 'none', md: 'flex' },
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '.3rem',
            color: 'inherit',
            textDecoration: 'none',
          }}
        >
          LOGO
        </Typography>


        {/* Menú hamburguesa (móvil) */}
        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            size="large"
            aria-label="open navigation menu"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
          {/* Menú principal móvil */}
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            open={Boolean(anchorElNav) && !mobileSubMenu}
            onClose={handleCloseNavMenu}
            sx={{ display: { xs: 'block', md: 'none' } }}
            PaperProps={{ style: { minWidth: 220 } }}
          >
            {navConfig.map((page, idx) => (
              <MenuItem key={page.label} onClick={() => handleOpenMobileSubMenu(idx)}>
                <Typography sx={{ textAlign: 'center' }}>{page.label}</Typography>
              </MenuItem>
            ))}
          </Menu>
          {/* Submenú móvil: ocupa el menú completo y tiene botón de volver */}
          <Menu
            anchorEl={anchorElNav}
            open={Boolean(anchorElNav) && !!mobileSubMenu}
            onClose={handleCloseMobileSubMenu}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            sx={{ display: { xs: 'block', md: 'none' } }}
            PaperProps={{ style: { minWidth: 220 } }}
          >
            <MenuItem onClick={handleCloseMobileSubMenu} sx={{ fontWeight: 700, color: 'primary.main' }}>
              ← Volver
            </MenuItem>
            {mobileSubMenu && navConfig[mobileSubMenu.index].sub.map((sub) => (
              <MenuItem key={sub.label} onClick={() => handleNavigate(sub.path)}>
                <Typography>{sub.label}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>

        {/* Logo móvil */}
        <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
        <Typography
          variant="h5"
          noWrap
          component="a"
          href="#app-bar-with-responsive-menu"
          sx={{
            mr: 2,
            display: { xs: 'flex', md: 'none' },
            flexGrow: 1,
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '.3rem',
            color: 'inherit',
            textDecoration: 'none',
          }}
        >
          LOGO
        </Typography>

        {/* Menú desktop */}
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          {navConfig.map((page, idx) => (
            <React.Fragment key={page.label}>
              <Button
                onClick={(e) => handleOpenDesktopSubMenu(e, idx)}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page.label}
              </Button>
              <Menu
                anchorEl={desktopSubMenu.anchor}
                open={desktopSubMenu.index === idx && Boolean(desktopSubMenu.anchor)}
                onClose={handleCloseDesktopSubMenu}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                MenuListProps={{ onMouseLeave: handleCloseDesktopSubMenu }}
              >
                {page.sub.map((sub) => (
                  <MenuItem key={sub.label} onClick={() => handleNavigate(sub.path)}>
                    <Typography>{sub.label}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </React.Fragment>
          ))}
        </Box>

        {/* Menú usuario */}
        <Box sx={{ flexGrow: 0 }}>
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: '45px' }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {settings.map((setting) => (
              <MenuItem key={setting} onClick={handleCloseUserMenu}>
                <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
export default Navbar;
