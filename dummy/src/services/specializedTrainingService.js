import axios from "axios";

const API_URL = "http://localhost:3000/specialized-training/";

//obtener formacion especializada por el codigo de perfil
export const getSpecializedTrainingByProfileId = async (profile_cod, page) => {
  try {
    console.log("Llamando a la API para obtener formación especializada...");

    const response = await axios.get(API_URL, {
      params: { profile_cod, page },
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addSpecializedTraining = async (profile_cod, trainingData) => {
  try {
    const response = await axios.post(
      `${API_URL}add?profile_cod=${profile_cod}`, // código en query
      trainingData, // FormData con campos + archivo
      {
        headers: {
          "Content-Type": "multipart/form-data", // ⚠️ importante
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error enviando formación especializada:", error);
    throw error;
  }
};

export const updateSpecializedTraining = async (updateData) => {
  try {
    const response = await axios.put(
      `${API_URL}update`, // endpoint de actualización
      updateData, // FormData con campos + archivo
      {
        headers: {
          "Content-Type": "multipart/form-data", // ⚠️ importante
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error actualizando formación especializada:", error);
    throw error;
  }
};

//metodo para obtener un pdf
export const getSpecializedTrainingPDF = async (relativePath) => {
  try {
    const response = await axios.get(`${API_URL}document`, {
      params: { relativePath }, // 👈 igual que en el back
      responseType: "blob", // 👈 necesario para PDF
    });

    return response.data; // el blob del PDF
  } catch (error) {
    console.error("Error fetching PDF:", error);
    throw error;
  }
};

export const searchSpecializedTraining = async (
  profile_cod,
  page,
  feature,
  searchTerm
) => {
  try {
    const response = await axios.get(`${API_URL}search`, {
      params: { profile_cod, page, feature, searchTerm },
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
