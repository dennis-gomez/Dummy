// services/pettyCashDetailService.js (MANTENER ORIGINAL)
import axios from "axios";

const API_URL = "http://localhost:3000/petty_cash_details";

export const getAllPettyCashDetails = async (pettyCashId) => {
  try {
    const { data } = await axios.get(`${API_URL}/petty-cash/${pettyCashId}`);
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Error al obtener registros de caja chica" };
  }
};

export const getPettyCashDetailById = async (id) => {
  try {
    const { data } = await axios.get(`${API_URL}/${id}`);
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Error al obtener registro de caja chica" };
  }
};

export const createPettyCashDetail = async (detailData) => {
  try {
    const { data } = await axios.post(API_URL, detailData);
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Error al crear registro de caja chica" };
  }
};

export const updatePettyCashDetail = async (id, detailData) => {
  try {
    const { data } = await axios.put(`${API_URL}/${id}`, detailData);
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Error al actualizar registro de caja chica" };
  }
};

export const deletePettyCashDetail = async (id) => {
  try {
    const { data } = await axios.delete(`${API_URL}/${id}`);
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Error al eliminar registro de caja chica" };
  }
};

export const searchPettyCashDetails = async (field, value) => {
  try {
    const response = await axios.get(`${API_URL}/search`, {
      params: { field, value },
    });
    return response.data;
  } catch (error) {
    console.error("Error al buscar detalles de caja chica:", error);
    throw error;
  }
};