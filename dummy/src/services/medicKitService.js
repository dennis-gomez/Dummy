import axios from "axios";

const API_URL = "http://localhost:3000/medic_kits/";

// Obtener kitMedico
export const getMedicKits = async () => {
    try {
        const response = await axios.get(
            API_URL,
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
export const addMedicKit = async (formData) => {
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
export const deleteMedicKit = async ( cod_medic_kit ) => {
    try {
        const response = await axios.delete(
            API_URL + "delete",
            {
                params: { cod_medic_kit },
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


//buscar kit medico por localizacion 

export const searchMedicKitsByFeature = async ( searchTerm, feature  ) => {
    try {
        const response = await axios.get(
            API_URL + "search-by-supply",
            { 
                params: { searchTerm, feature },
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
export const updateMedicKit = async (formData) => {
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
