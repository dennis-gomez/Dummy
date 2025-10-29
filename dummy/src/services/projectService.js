import axios from 'axios';

const API_URL = 'http://localhost:3000/projects';

const projectService = {
  getAllProjects: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Error al obtener proyectos:', error);
      throw error;
    }
  },

  getActiveProjects: async () => {
    try {
      const response = await axios.get(`${API_URL}/active`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener proyectos activos:', error);
      throw error;
    }
  },

  findProjects: async (feature, text) => {
    try {
      const response = await axios.get(`${API_URL}/find`, {
        params: { feature, text }
      });
      return response.data;
    } catch (error) {
      console.error('Error al buscar proyectos:', error);
      throw error;
    }
  },

  getProjectById: async (cod_project) => {
    try {
      const response = await axios.get(`${API_URL}/getId/${cod_project}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener proyecto:', error);
      throw error;
    }
  },

  addProject: async (projectData) => {
    try {
      const response = await axios.post(`${API_URL}/add`, projectData);
      return response.data;
    } catch (error) {
      console.error('Error al agregar proyecto:', error);
      throw error;
    }
  },

  updateProject: async (cod_project, projectData) => {
    try {
      const response = await axios.put(`${API_URL}/update`, {
        cod_project,
        ...projectData
      });
      return response.data;
    } catch (error) {
      console.error('Error al actualizar proyecto:', error);
      throw error;
    }
  },

  deleteProject: async (cod_project) => {
    try {
      const response = await axios.delete(`${API_URL}/delete`, {
        data: { cod_project }
      });
      return response.data;
    } catch (error) {
      console.error('Error al desactivar proyecto:', error);
      throw error;
    }
  },

  reactiveProject: async (cod_project) => {
    try {
      const response = await axios.put(`${API_URL}/reactive`, {
        cod_project
      });
      return response.data;
    } catch (error) {
      console.error('Error al reactivar proyecto:', error);
      throw error;
    }
  }
};

export default projectService;