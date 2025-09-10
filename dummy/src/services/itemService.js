import axios from "axios";

const API_URL = "http://localhost:3000/items/";

// Obtener items por cod_service y cod_category
export const getItems = async (cod_service, cod_category) => {
  try {
    const response = await axios.post(
      API_URL + "get",
      { cod_service, cod_category },
      {
        headers: {
          "Content-Type": "application/json"
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Agregar item
export const addItem = async (cod_service, cod_category, item_name) => {
  try {
    const response = await axios.post(
      API_URL + "add",
      { cod_service, cod_category, item_name },
      {
        headers: {
          "Content-Type": "application/json"
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Eliminar item
export const deleteItem = async (cod_service, cod_category, cod_item) => {
  try {
    const response = await axios.post(
      API_URL + "delete",
      { cod_service, cod_category, cod_item },
      {
        headers: {
          "Content-Type": "application/json"
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Actualizar item
export const updateItem = async (cod_service, cod_category, cod_item, item_name) => {
  try {
    const response = await axios.post(
      API_URL + "update",
      { cod_service, cod_category, cod_item, item_name },
      {
        headers: {
          "Content-Type": "application/json"
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};