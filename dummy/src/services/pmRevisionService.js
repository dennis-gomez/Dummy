import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL + "/revision";

export const getAllRevisions = async () => {
  const res = await axios.get(`${API_URL}/`);
  return res.data;
};

export const getRevisionById = async (cod_revision) => {
  const res = await axios.get(`${API_URL}/getId/${cod_revision}`);
  return res.data;
};

export const getFindRevisions = async (feature, text) => {
  const res = await axios.get(`${API_URL}/find`, { params: { feature, text } });
  return res.data;
};

export const getFindRevisionsAt = async (revision_area_category_code, feature, text) => {
  const revision_area_service_code = import.meta.env.VITE_PM_AREAS_SERVICE_CODE;

  console.log("Searching with:", revision_area_service_code, revision_area_category_code, feature, text);
  const res = await axios.get(`${API_URL}/find/composite`, { params: { revision_area_service_code, revision_area_category_code, feature, text } });
  return res.data;
};

export const addRevision = async (data) => {
  const res = await axios.post(`${API_URL}/add`, data);
  return res.data;
};

export const updateRevision = async (cod_revision, data) => {
  const res = await axios.put(`${API_URL}/update`, { cod_revision, ...data });
  return res.data;
};

export const deleteRevision = async (cod_revision) => {
  const res = await axios.delete(`${API_URL}/delete`, { data: { cod_revision } });
  return res.data;
};

export const getRevisionsByProject = async (cod_proyecto) => {
  const res = await axios.get(`${API_URL}/project/${cod_proyecto}`);
  return res.data;
};

export const addRevisionWithPlan = async (data) => {
  const res = await axios.post(`${API_URL}/addRevisionWithPlan`, data);
  return res.data;
};

export const getNotifiedRevisions = async () => {
  const res = await axios.get(`${API_URL}/notified`);
  return res.data;
};
