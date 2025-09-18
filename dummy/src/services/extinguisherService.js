import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL + "/extinguishers";

export const getAllExtinguishers = async () => {
  const res = await axios.get(`${API_URL}/`);
  return res.data;
};

export const getExtinguisherById = async (id) => {
  const res = await axios.get(`${API_URL}/getId/${id}`);
  return res.data;
};

export const addExtinguisher = async (data) => {
  const res = await axios.post(`${API_URL}/add`, data);
  return res.data;
};

export const updateExtinguisher = async (id, data) => {
  const res = await axios.put(`${API_URL}/update`, { cod_extinguisher: id, ...data });
  return res.data;
};

export const deleteExtinguisher = async (id) => {
  const res = await axios.delete(`${API_URL}/delete`, { data: { cod_extinguisher: id } });
  return res.data;
};
