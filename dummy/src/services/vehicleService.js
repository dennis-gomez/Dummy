import axios from "axios";

const API_URL = "http://localhost:3000/vehicles/";

// Obtener vehiculos
export const getVehicles = async () => {
    try {
        const response = await axios.get(
            API_URL + "active",
            {
                headers: {
                    "Content-Type": "application/json"
                },
            }
        );
        return response;
    } catch (error) {
        throw error;
    }
};

//Obtener vehiculos por caracteristica del vehiculo
export const getVehicleByFeature = async ( feature, text ) => {
    try{
        const response = await axios.get(
            API_URL + "find", 
            {
                params: { feature, text },
                headers: {
                    "Content-Type": "application/json"
                },
            }
        );
        return response;
    } catch (error) {
        throw error;
    }
}

// Agregar vehiculo
export const addVehicle = async (formData) => {
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
        return response;
    } catch (error) {
        throw error;
    }
};

// Eliminar vehiculo
export const deleteVehicle = async ( cod_vehicle ) => {
    try {
        const response = await axios.put(
            API_URL + "delete",
            {},
            {
                params: { cod_vehicle },
                headers: {
                    "Content-Type": "application/json"
                },
            }
        );
        return response;
    } catch (error) {
        throw error;
    }
};

// Actualizar vehiculo
export const updateVehicle = async ( formData ) => {
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
        return response;
    } catch (error) {
        throw error;
    }  
};
