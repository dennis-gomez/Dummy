// src/modules/it_movements/services/movementTIService.js
import axios from "axios";

const API_URL = "http://localhost:3000/it-movements"; // Ajusta la URL base

export const getActiveMovements = async (page = 1, limit = 10) => {
  const res = await axios.get(`${API_URL}/active?page=${page}&limit=${limit}`);
  return res.data;
};

export const getInactiveMovements = async (page = 1, limit = 10) => {
  const res = await axios.get(`${API_URL}/inactive?page=${page}&limit=${limit}`);
  return res.data;
};

export const getMovementById = async (cod_movement) => {
  const res = await axios.get(`${API_URL}/getId/${cod_movement}`);
  return res.data;
};

export const searchMovements = async (field, text, page = 1, limit = 10) => {
  const res = await axios.get(`${API_URL}/search?field=${field}&text=${text}&page=${page}&limit=${limit}`);
  return res.data;
};

export const createMovement = async (data) => {
  const res = await axios.post(`${API_URL}/add`, data);
  return res.data;
};

export const updateMovement = async (data) => {
  const res = await axios.put(`${API_URL}/update`, data);
  return res.data;
};


export const deleteMovement = async (cod_movement) => {
  const res = await axios.delete(`${API_URL}/delete`, { data: { cod_movement } });
  return res.data;
};
