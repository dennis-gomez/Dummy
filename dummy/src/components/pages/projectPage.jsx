import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";

import projectService from "../../services/projectService";
import FormProject from "../organisms/formProject";
import TableProject from "../organisms/tableProject";
import Seeker from "../molecules/seeker";
import Button from "../atoms/button";

const ProjectPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Buscador
  const [searchText, setSearchText] = useState("");
  const [searchFeature, setSearchFeature] = useState("project_name");

  const fields = [
    { name: "project_name", placeholder: "Nombre del proyecto" },
    { name: "project_company", placeholder: "Empresa" },
    { name: "project_client_name", placeholder: "Cliente" },
    { name: "project_sector", placeholder: "Sector" },
    { name: "project_contact_full_name", placeholder: "Contacto" },
  ];

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const projectsData = await projectService.getAllProjects();
      setProjects(projectsData);
    } catch (error) {
      console.error(error);
      showSnackbar("Error al cargar los proyectos", "error");
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSearch = async () => {
    if (!searchText.trim()) {
      showSnackbar("Por favor, ingrese un texto para buscar", "warning");
      return;
    }
    try {
      const results = await projectService.findProjects(searchFeature, searchText);
      setProjects(results);
      showSnackbar("Búsqueda completada", "success");
    } catch (error) {
      console.error(error);
      showSnackbar("Error al realizar la búsqueda", "error");
    }
  };

  const handleClearSearch = () => {
    setSearchText("");
    loadProjects();
  };

  const handleNewProject = () => {
    setEditingProject(null);
    setShowForm(true);
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleSaveProject = async () => {
    setShowForm(false);
    setEditingProject(null);
    await loadProjects();
    showSnackbar(
      editingProject
        ? "Proyecto actualizado correctamente"
        : "Proyecto creado correctamente",
      "success"
    );
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProject(null);
  };

  const handleRefresh = () => loadProjects();

  return (
    <Container maxWidth="xl" className="py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Gestión de Proyectos
      </h1>

      {/* Formulario envuelto en Box gris */}
      {showForm && (
        <Box
          sx={{
            display: "flex-box",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              borderRadius: "20px",
              backgroundColor: "#d9d9d9",
              boxShadow: 4,
              width: "auto",
              mx: "auto",
            }}
          >
            <FormProject
              projectToEdit={editingProject}
              onSave={handleSaveProject}
              onCancel={handleCancelForm}
            />
          </Box>
        </Box>
      )}

      {/* Sección de buscador y botón */}
      <Box className="flex flex-col lg:flex-row gap-4 w-full max-w-6xl mx-auto mb-4 items-center p-2">
        <div className="flex-1 w-full">
          <Seeker
            inputName="search"
            inputPlaceholder="Buscar proyecto..."
            btnName="Buscar"
            selectName="Filtrar por"
            fields={fields}
            valueText={searchText}
            valueFeature={searchFeature}
            onChangeText={setSearchText}
            onChangeFeature={setSearchFeature}
            onClick={handleSearch}
            onClear={handleClearSearch}
          />
        </div>
        <div className="flex-shrink-0">
          <Button
            text={showForm ? "Cancelar" : "Agregar Proyecto"}
            onClick={showForm ? handleCancelForm : handleNewProject}
            className={`h-12 w-full sm:w-48 rounded-lg font-semibold text-white transition-colors duration-300 ${
              showForm ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
            }`}
          />
        </div>
      </Box>

      {/* Tabla */}
      <TableProject
        projects={projects}
        onEdit={handleEditProject}
        onRefresh={handleRefresh}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProjectPage;