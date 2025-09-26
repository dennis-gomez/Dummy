import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL + "/occupational_health_personnel";

// 🔹 Listar todo el personal activo
export const getAllPersonnel = async () => {
  const res = await axios.get(`${API_URL}/`);
  return res.data;
};

// 🔹 Obtener personal por ID
export const getPersonnelById = async (cod_personnel) => {
  const res = await axios.get(`${API_URL}/getId/${cod_personnel}`);
  return res.data;
};

// 🔹 Buscar personal por campo/texto
export const getFindPersonnel = async (feature, text) => {
  const res = await axios.get(`${API_URL}/find`, { params: { feature, text } });
  return res.data;
};

// 🔹 Agregar nuevo personal
export const addPersonnel = async (data) => {
  const res = await axios.post(`${API_URL}/add`, data);
  return res.data;
};

// 🔹 Actualizar personal
export const updatePersonnel = async (cod_personnel, data) => {
  const res = await axios.put(`${API_URL}/update`, { cod_personnel, ...data });
  return res.data;
};

// 🔹 Eliminar personal (soft delete)
export const deletePersonnel = async (cod_personnel) => {
  const res = await axios.delete(`${API_URL}/delete`, { data: { cod_personnel } });
  return res.data;
};
