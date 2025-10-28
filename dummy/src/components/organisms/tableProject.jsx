import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  MenuItem,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Box,
  Typography,
  Card,
  CardContent
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import projectService from '../../services/projectService';

const TableProject = ({ projects, onEdit, onRefresh }) => {
  const [searchFeature, setSearchFeature] = useState('project_name');
  const [searchText, setSearchText] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const searchFields = [
    { value: 'project_name', label: 'Nombre del Proyecto' },
    { value: 'project_company', label: 'Empresa' },
    { value: 'project_client_name', label: 'Cliente' },
    { value: 'project_sector', label: 'Sector' },
    { value: 'project_contact_full_name', label: 'Contacto' }
  ];

  const handleSearch = async () => {
    if (!searchText.trim()) {
      alert('Por favor, ingrese un texto para buscar');
      return;
    }

    setIsSearching(true);
    try {
      const results = await projectService.findProjects(searchFeature, searchText);
      onRefresh(results);
    } catch (error) {
      console.error('Error al buscar:', error);
      alert('Error al realizar la búsqueda');
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearSearch = async () => {
    setSearchText('');
    try {
      const allProjects = await projectService.getAllProjects();
      onRefresh(allProjects);
    } catch (error) {
      console.error('Error al cargar proyectos:', error);
    }
  };

  const handleDelete = async (cod_project, projectName) => {
    if (window.confirm(`¿Está seguro de que desea desactivar el proyecto "${projectName}"?`)) {
      try {
        await projectService.deleteProject(cod_project);
        alert('Proyecto desactivado correctamente');
        onRefresh();
      } catch (error) {
        console.error('Error al desactivar proyecto:', error);
        alert('Error al desactivar el proyecto');
      }
    }
  };

  const handleReactivate = async (cod_project, projectName) => {
    if (window.confirm(`¿Está seguro de que desea reactivar el proyecto "${projectName}"?`)) {
      try {
        await projectService.reactiveProject(cod_project);
        alert('Proyecto reactivado correctamente');
        onRefresh();
      } catch (error) {
        console.error('Error al reactivar proyecto:', error);
        alert('Error al reactivar el proyecto');
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" component="h2" fontWeight="bold">
            Lista de Proyectos
          </Typography>
          
          <Tooltip title="Actualizar lista">
            <IconButton onClick={() => onRefresh()} color="primary">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Controles de búsqueda */}
        <Box display="flex" gap={2} alignItems="center" mb={3} flexWrap="wrap">
          <TextField
            select
            label="Buscar por"
            value={searchFeature}
            onChange={(e) => setSearchFeature(e.target.value)}
            size="small"
            sx={{ minWidth: 200 }}
          >
            {searchFields.map(field => (
              <MenuItem key={field.value} value={field.value}>
                {field.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Texto a buscar"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            size="small"
            sx={{ minWidth: 250 }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
          />

          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
            disabled={isSearching || !searchText.trim()}
          >
            Buscar
          </Button>

          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={handleClearSearch}
          >
            Limpiar
          </Button>
        </Box>

        {/* Tabla */}
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Empresa</strong></TableCell>
                <TableCell><strong>Proyecto</strong></TableCell>
                <TableCell><strong>Cliente</strong></TableCell>
                <TableCell><strong>Sector</strong></TableCell>
                <TableCell><strong>Fechas</strong></TableCell>
                <TableCell><strong>Contacto</strong></TableCell>
                <TableCell><strong>Estado</strong></TableCell>
                <TableCell><strong>Acciones</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects && projects.length > 0 ? (
                projects.map((project) => (
                  <TableRow 
                    key={project.cod_project}
                    sx={{ 
                      '&:last-child td, &:last-child th': { border: 0 },
                      backgroundColor: project.project_is_active ? 'inherit' : 'rgba(0,0,0,0.04)'
                    }}
                  >
                    <TableCell>{project.cod_project}</TableCell>
                    <TableCell>{project.project_company}</TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {project.project_name}
                        </Typography>
                        {project.project_description && (
                          <Typography variant="caption" color="textSecondary" noWrap>
                            {project.project_description.substring(0, 50)}...
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>{project.project_client_name}</TableCell>
                    <TableCell>
                      <Chip 
                        label={project.project_sector} 
                        size="small" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          Inicio: {formatDate(project.project_start_date)}
                        </Typography>
                        <Typography variant="body2">
                          Fin: {formatDate(project.project_end_date)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {project.project_contact_full_name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {project.project_contact_email}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={project.project_is_active ? <CheckCircleIcon /> : undefined}
                        label={project.project_is_active ? 'Activo' : 'Inactivo'}
                        color={project.project_is_active ? 'success' : 'default'}
                        size="small"
                        variant={project.project_is_active ? 'filled' : 'outlined'}
                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Tooltip title="Editar proyecto">
                          <IconButton 
                            size="small" 
                            onClick={() => onEdit(project)}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>

                        {project.project_is_active ? (
                          <Tooltip title="Desactivar proyecto">
                            <IconButton 
                              size="small" 
                              onClick={() => handleDelete(project.cod_project, project.project_name)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Tooltip title="Reactivar proyecto">
                            <IconButton 
                              size="small" 
                              onClick={() => handleReactivate(project.cod_project, project.project_name)}
                              color="success"
                            >
                              <CheckCircleIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="textSecondary">
                      No se encontraron proyectos
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box mt={2}>
          <Typography variant="body2" color="textSecondary">
            Total de proyectos: {projects?.length || 0}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TableProject;