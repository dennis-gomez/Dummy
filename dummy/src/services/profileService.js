import axios from "axios";

const API_URL = "http://localhost:3000/profiles/";

// Obtener perfiles segun el id de la persona enviado por query

export const getProfilesByPersonId = async (personal_cod) => {
  try {
    console.log("Llamando a la API para obtener perfiles...");

    const response = await axios.get(API_URL, {
      params: { personal_cod },
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAvailableRoles = async (personal_cod) => {
  try {
    const response = await axios.get(`${API_URL}available-roles`, {
      params: { personal_cod },
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const createProfile = async (personal_cod, profileData) => {
  try {
    const response = await axios.post(
      `${API_URL}add?personal_cod=${personal_cod}`, // personal_cod en query
      profileData, // resto de datos en body
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteProfile = async (profile_cod) => {
  try {
    const response = await axios.delete(`${API_URL}delete`, {
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

export const getProfileSummary = async (personal_cod, profile_cod) => {
  try {
    console.log("📡 Obteniendo resumen del perfil...");

    const response = await axios.post(`${API_URL}summary`, {
      personal_cod,
      profile_cod,
    }, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener el resumen del perfil:", error);
    throw error;
  }
};

