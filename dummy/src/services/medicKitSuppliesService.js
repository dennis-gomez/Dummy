import axios from "axios";

const API_URL = "http://localhost:3000/supplies/";

// Obtener kitMedico
export const getSuppliesById = async (cod_medic_kit) => {
    try {
        const response = await axios.get(
            API_URL,
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

    console.log("cod_medic_kit en el servicio:", cod_medic_kit);
    console.log("cod_Supply en el servicio:", cod_supply);


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
