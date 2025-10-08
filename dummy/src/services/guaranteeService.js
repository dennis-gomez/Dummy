import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL + "/guarantees";

// 🔹 Listar todas las garantías (no vencidas)
export const getAllGuarantees = async (page = 1, limit = 2, sortOrder = "") => {

  console.log("Fetching guarantees for page:", page, "with limit:", limit);

  const res = await axios.get(`${API_URL}/`, {
    params: { page, limit, sortOrder }  // 👈 axios genera automáticamente ?page=1&limit=10
  });
  return res.data;
};


// 🔹 Obtener garantía por ID
export const getGuaranteeById = async (id) => {
  const res = await axios.get(`${API_URL}/getId`, { params: { cod_guarantee: id } });
  return res.data;
};

// 🔹 Buscar garantías por término
export const findGuarantees = async (feature, searchTerm, page = 1, limit = 10, sortOrder = "") => {
  const res = await axios.get(`${API_URL}/search`, {
    params: { feature, searchTerm, page, limit, sortOrder },
  });

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
export const deleteGuarantee = async (id,status) => {
  const res = await axios.delete(`${API_URL}/delete`, { params: { cod_guarantee: id,status } });
  return res.data;
};

// 🔹 Resumen de garantías
export const getGuaranteesResume = async () => {
  const res = await axios.get(`${API_URL}/resume`);
  return res.data;
};

export const getNotifiedGuarantees = async () => {
  const res = await axios.get(`${API_URL}/notified`);
  return res.data;
}

export const getExpiredGuarantees = async () => {
  const res = await axios.get(`${API_URL}/expired`);
  return res.data;
}