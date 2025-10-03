import axios from "axios";

const API_URL = "http://localhost:3000/pettycash"; // ajusta tu ruta base

// Obtener todas las cajas chicas
export const getAllPettyCash = async () => {
  try {
    const { data } = await axios.get(API_URL);
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Error al obtener cajas chicas" };
  }                         
};

// Obtener una caja chica por ID
export const getPettyCashById = async (id) => {
  try {
    const { data } = await axios.get(`${API_URL}/${id}`);
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Error al obtener caja chica" };
  }
};

// Crear una nueva caja chica
export const createPettyCash = async (pettyCashData) => {
  try {
    const { data } = await axios.post(API_URL, pettyCashData);
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Error al crear caja chica" };
  }
};

// Actualizar una caja chica
export const updatePettyCash = async (id, pettyCashData) => {
  try {
    const { data } = await axios.put(`${API_URL}/${id}`, pettyCashData);
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Error al actualizar caja chica" };
  }
};

// Eliminar una caja chica
export const deletePettyCash = async (id) => {
  try {
    const { data } = await axios.delete(`${API_URL}/${id}`);
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Error al eliminar caja chica" };
  }
};
