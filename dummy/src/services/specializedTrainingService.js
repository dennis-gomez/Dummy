import axios from "axios";

const API_URL = "http://localhost:3000/specialized-training/";

//obtener formacion especializada por el codigo de perfil
export const getSpecializedTrainingByProfileId = async (profile_cod) => {
  try {
    console.log("Llamando a la API para obtener formación especializada...");

    const response = await axios.get(API_URL, {
      params: { profile_cod },
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
