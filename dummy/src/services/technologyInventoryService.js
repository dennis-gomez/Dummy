import axios from "axios";

const API_URL = "http://localhost:3000/it-inventory/";

// Obtener activos de TI
export const getTechnologyInventory = async () => {
    try {
        const response = await axios.get(API_URL, {
            headers: { "Content-Type": "application/json" },
        });
        console.log(response)

        return response;
    } catch (error) {
        throw error;
    }
};


// Buscar activos de TI por característica y término
export const searchTechnologyInventory = async (feature, searchTerm) => {
    try {
        const response = await axios.get(API_URL + "find", {
            params: { feature, searchTerm },
            headers: { "Content-Type": "application/json" },
        });
        return response;
    } catch (error) {
        throw error;
    }
};

// Agregar un equipo de TI
export const addTechnologyInventory = async (formData) => {
  try {
    const response = await axios.post(API_URL + "add", formData);
    return response;
  } catch (error) {
    throw error;
  }
};

// Actualizar un equipo de TI
export const updateTechnologyInventory = async (cod_it_inventory, formData) => {
    try {
        const response = await axios.put(API_URL + "update", formData, {
            params: { cod_it_inventory }, // se envía por query
            headers: { "Content-Type": "application/json" },
        });
        return response;
    } catch (error) {
        throw error;
    }
};

// Desactivar un equipo de TI
export const deleteTechnologyInventory = async (cod_it_inventory) => {
    try {
        const response = await axios.put(API_URL + "delete", {}, {
            params: { cod_it_inventory }, 
            headers: { "Content-Type": "application/json" },
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const reactivateTechnologyInventory = async (cod_it_inventory) => {
    try {
        const response = await axios.put(API_URL + "reactivate", {}, {
            params: { cod_it_inventory }, 
            headers: { "Content-Type": "application/json" },
        });
        return response;
    } catch (error) {
        throw error;
    }
};