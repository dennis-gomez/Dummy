import axios from "axios";

const API_URL = "http://localhost:3000/languages/";

// 🔹 Agregar un lenguaje a una persona

export const addLanguageToPerson = async (formData, personal_cod) => {
  try {
    const response = await axios.post(API_URL + "add", formData, {
      params: { personal_cod }, // se envía por query
      headers: { "Content-Type": "application/json" },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// 🔹 Eliminar un lenguaje de una persona

export const deleteLanguageFromPerson = async (language_cod, personal_cod) => {
  try {
    const response = await axios.delete(API_URL + "delete", {
      params: { language_cod, personal_cod }, // se envía por query
      headers: { "Content-Type": "application/json" },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// obtener lenguajes de una persona

export const getLanguagesOfPerson = async (personal_cod) => {
  try {
    const response = await axios.get(API_URL, {
      params: { personal_cod }, // se envía por query
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAvailableLanguages = async (personal_cod) => {
  try {
    const response = await axios.get(API_URL + "available", {
      params: { personal_cod }, // se envía por query
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

//actualizar un lenguaje de una persona
export const updateLanguageOfPerson = async (language_cod, formData) => {
  try {
    const response = await axios.put(API_URL + "update", formData, {
      params: { language_cod }, // se envía por query
      headers: { "Content-Type": "application/json" },
    });
    return response;
  } catch (error) {
    throw error;
  }
};
