import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Alert,
  Snackbar
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import projectService from '../../services/projectService';
import FormProject from '../organisms/formProject';
import TableProject from '../organisms/tableProject';

const ProjectPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const projectsData = await projectService.getAllProjects();
      setProjects(projectsData);
    } catch (error) {
      console.error('Error al cargar proyectos:', error);
      showSnackbar('Error al cargar los proyectos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleNewProject = () => {
    setEditingProject(null);
    setShowForm(true);
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleSaveProject = () => {
    setShowForm(false);
    setEditingProject(null);
    loadProjects();
    showSnackbar(
      editingProject ? 'Proyecto actualizado correctamente' : 'Proyecto creado correctamente'
    );
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProject(null);
  };

  const handleRefresh = (newProjects = null) => {
    if (newProjects) {
      setProjects(newProjects);
    } else {
      loadProjects();
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Gestión de Proyectos
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Administra y gestiona todos los proyectos del sistema
          </Typography>
        </Box>
        
        {!showForm && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNewProject}
            size="large"
          >
            Nuevo Proyecto
          </Button>
        )}
      </Box>

      {/* Contenido */}
      {showForm ? (
        <FormProject
          projectToEdit={editingProject}
          onSave={handleSaveProject}
          onCancel={handleCancelForm}
        />
      ) : (
        <TableProject
          projects={projects}
          onEdit={handleEditProject}
          onRefresh={handleRefresh}
        />
      )}

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProjectPage;