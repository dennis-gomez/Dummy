import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL + "/extinguishers";

export const getAllExtinguishers = async () => {
  const res = await axios.get(`${API_URL}/`);
  return res.data;
};

export const getExtinguisherById = async (cod_extinguisher) => {
  const res = await axios.get(`${API_URL}/getId/${cod_extinguisher}`);
  return res.data;
};

export const getFindExtinguishers = async (feature, text) => {
  const res = await axios.get(`${API_URL}/find`, { params: { feature, text } });
  return res.data;
};

export const addExtinguisher = async (data) => {
  const res = await axios.post(`${API_URL}/add`, data);
  return res.data;
};

export const updateExtinguisher = async (cod_extinguisher, data) => {
  const res = await axios.put(`${API_URL}/update`, { cod_extinguisher: cod_extinguisher, ...data });
  return res.data;
};

export const deleteExtinguisher = async (cod_extinguisher) => {
  const res = await axios.delete(`${API_URL}/delete`, { data: { cod_extinguisher: cod_extinguisher } });
  return res.data;
};
