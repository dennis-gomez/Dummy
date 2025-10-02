import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL + "/guarantees";

// 🔹 Listar todas las garantías (no vencidas)
export const getAllGuarantees = async () => {
  const res = await axios.get(`${API_URL}/`);
  return res.data;
};

// 🔹 Obtener garantía por ID
export const getGuaranteeById = async (id) => {
  const res = await axios.get(`${API_URL}/getId`, { params: { cod_guarantee: id } });
  return res.data;
};

// 🔹 Buscar garantías por término
export const findGuarantees = async (feature, searchTerm) => {
  console.log("Buscando garantías por en el servicio", feature, "con texto:", searchTerm);
  const res = await axios.get(`${API_URL}/search`, { params: { feature, searchTerm } });
  return res.data;
};

// 🔹 Agregar garantía
export const addGuarantee = async (data) => {
  const res = await axios.post(`${API_URL}/add`, data);
  return res.data;
};

// 🔹 Actualizar garantía
export const updateGuarantee = async (id, data) => {
  console.log("data a enviar:", data);
  const res = await axios.put(`${API_URL}/update`, data, { params: { cod_guarantee: id } });
  return res.data;
};


// 🔹 Eliminar garantía (cambia status a vencida)
export const deleteGuarantee = async (id) => {
  const res = await axios.delete(`${API_URL}/delete`, { params: { cod_guarantee: id } });
  return res.data;
};

// 🔹 Resumen de garantías
export const getGuaranteesResume = async () => {
  const res = await axios.get(`${API_URL}/resume`);
  return res.data;
};
