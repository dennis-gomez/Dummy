import axios from "axios";

const API_URL = "http://localhost:3000/academic-training/";

//Obtener formaciones academicas
export const getAcademicTrainings = async (personCod) => {
  try {
    const response = await axios.get(API_URL, {
      params: { personal_cod: Number(personCod) },
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

//Agregar nueva formacion academica
export const addAcademicTrainings = async (formData) => {
  try {
    const response = await axios.post(API_URL + "add", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

//Editar fromacion academica exsistente
export const updateAcademicTrainings = async (formData) => {
  try {
    const response = await axios.put(API_URL + "update", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

//Obtener pdf de titulo
export const getAcademicTrainingPDF = async (relativePath) => {
  try {
    const response = await axios.get(`${API_URL}document`, {
      params: { relativePath },
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching PDF:", error);
    throw error;
  }
};
