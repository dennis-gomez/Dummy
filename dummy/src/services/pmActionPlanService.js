import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL + "/action_plan";

export const getAllActionPlans = async () => {
  const res = await axios.get(`${API_URL}/`);
  return res.data;
};

export const getActionPlanById = async (cod_accion_plan) => {
  const res = await axios.get(`${API_URL}/getId/${cod_accion_plan}`);
  return res.data;
};

export const findActionPlans = async (feature, text) => {
  const res = await axios.get(`${API_URL}/find`, { params: { feature, text } });
  return res.data;
};

export const addActionPlan = async (data) => {
  const res = await axios.post(`${API_URL}/add`, data);
  return res.data;
};

export const updateActionPlan = async (cod_accion_plan, data) => {
  const res = await axios.put(`${API_URL}/update`, { cod_accion_plan, ...data });
  return res.data;
};

export const deleteActionPlan = async (cod_accion_plan) => {
  const res = await axios.delete(`${API_URL}/delete`, { data: { cod_accion_plan } });
  return res.data;
};
