import axios from "axios";

const API_URL = "http://localhost:3000/inventory/";

// Obtener inventario por cod_service
export const getInventory = async () => {
  try {
    const response = await axios.get(
      API_URL,
      { headers: {
          "Content-Type": "application/json"
        }, }
    );
    return response.data.items;
  } catch (error) {
    throw error;
  }
   }

export const updateInventory = async (updateData) => {   
    try {
        const response = await axios.put(
            `${API_URL}update`,
            updateData,
            { headers: {
                "Content-Type": "application/json"
              }, }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
    }

    export const deleteInventory = async (deleteData) => {
        try {
            const response = await axios.put(
                `${API_URL}delete`,
                deleteData,
                { headers: {
                    "Content-Type": "application/json"
                  }, }
            );
            return response.data;
        } catch (error) {
            throw error;
        }
        }