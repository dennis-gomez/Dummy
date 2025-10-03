import axios from "axios";

const API_URL = "http://localhost:3000/petty_cash_details"; // ajusta según tu backend

// Obtener todos los registros de una caja chica (detalle)
export const getAllPettyCashDetails = async (pettyCashId) => {
  try {
    const { data } = await axios.get(`${API_URL}/petty-cash/${pettyCashId}`);
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Error al obtener registros de caja chica" };
  }
};

// Obtener un registro específico por ID
export const getPettyCashDetailById = async (id) => {
  try {
    const { data } = await axios.get(`${API_URL}/${id}`);
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Error al obtener registro de caja chica" };
  }
};

// Crear un nuevo registro en la caja chica
export const createPettyCashDetail = async (detailData) => {
  try {
    const { data } = await axios.post(API_URL, detailData);
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Error al crear registro de caja chica" };
  }
};

// Actualizar un registro existente
export const updatePettyCashDetail = async (id, detailData) => {
  try {
    const { data } = await axios.put(`${API_URL}/${id}`, detailData);
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Error al actualizar registro de caja chica" };
  }
};

// Eliminar un registro
export const deletePettyCashDetail = async (id) => {
  try {
    const { data } = await axios.delete(`${API_URL}/${id}`);
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Error al eliminar registro de caja chica" };
  }
};
