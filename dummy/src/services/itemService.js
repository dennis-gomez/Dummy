import axios from "axios";

const API_URL = "http://localhost:3000/items/";

// Obtener items por cod_service y cod_category
export const getItems = async (cod_service, cod_category) => {
  try {
    const response = await axios.get(
      API_URL,
      {
        params: { cod_service, cod_category },
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

export const getAllFromServicesWithRelationships = async (cod_service) => {
  try {
    const response = await axios.get(
      API_URL + "allWithRelationships",
      {
        params: { cod_service },
        headers: {
          "Content-Type": "application/json"
        },
      }
    );
    return response.data;
  }catch (error) {
    console.error("Error fetching items with relationships:", error);
    throw error;
  }
   
    
}

export const getAllItemsByService = async (cod_service) => {
  try {
    const response = await axios.get(
      API_URL + "all",
      {
        params: { cod_service },
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
export const deleteItem = async (cod_category, cod_service, cod_item) => {
  try {
    const response = await axios.delete(
      API_URL + "delete",
      {
        params: { cod_category, cod_service, cod_item },
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
    const response = await axios.put(
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