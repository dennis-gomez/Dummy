import axios from "axios";

const API_URL = "http://localhost:3000/supplies/";

// Obtener kitMedico
export const getSuppliesById = async (cod_medic_kit,searchActive) => {
    try {
        const response = await axios.get(
            API_URL,
            {
                 params: { cod_medic_kit,searchActive },
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

export const addManySupplies = async (cod_medic_kit, formDataArray) => {
  try {

    const response = await axios.post(
      API_URL + "addMany",
      {
        cod_medic_kit: cod_medic_kit,
        supplies: formDataArray
      },
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

// Agregar kitMedico
export const addSupply = async (formData) => {
    try {
        const response = await axios.post(
            API_URL + "add",
            formData,
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


// Eliminar kitMedico
export const deleteSupply = async ( cod_medic_kit,cod_supply ) => {
    try {
        const response = await axios.delete(
            API_URL + "delete",
            {
                params: { cod_medic_kit,cod_supply },
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

export const searchSuppliesByTerm = async ( searchTerm  ) => {
    try {
        const response = await axios.get(
            API_URL + "kits-with-supply",
            {
                params: { searchTerm },
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

export const orderSuppliesByRelevance = async ( cod_medic_kit, searchTerm ) => {
    try {
        const response = await axios.get(
            API_URL + "search-by-name",
            {
                params: {  searchTerm,cod_medic_kit },
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


// Actualizar kitMedico
export const updateSupply = async (formData) => {
    try {
        const response = await axios.put(
            API_URL + "update",
            formData,
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
