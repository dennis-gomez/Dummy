import axios from "axios";

const API_URL = "http://localhost:3000/categories/";

// Get all categories by cod_service
export const getCategorys = async (cod_service) => {
  try {
    const response = await axios.get(API_URL, {
      params: { cod_service },
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};