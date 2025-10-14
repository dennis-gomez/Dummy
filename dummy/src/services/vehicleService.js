import axios from "axios";

const API_URL = "http://localhost:3000/vehicles/";

// Obtener vehiculos inactivos
export const getVehiclesInactive = async () => {
    try {
        const response = await axios.get(
            API_URL + "",
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

// Obtener nombre de vehiculos activos
export const getActiveVehiclesNames = async () => {
    try {
        const response = await axios.get(
            API_URL + "active/names",
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

// Obtener nombre de vehiculos activos e inactivos
export const getAllVehiclesNames = async () => {
    try {
        const response = await axios.get(
            API_URL + "all/names",
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

export const reactivateVehicle = async (cod_vehicle) => {
    try {
        const response = await axios.put(
            API_URL + "reactivate",
            {},
            {
                params: { cod_vehicle },
                headers: { "Content-Type": "application/json" },
            }
        );
        return response;
    } catch (error) {
        throw error;
    }
};

//Obtener notificaciones de mantenimientos de vehiculos
export const getMaintenanceNotifications = async () => {
    try{
        const response = await axios.get(
            API_URL + "notifications", 
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
}

//actualizar el visto a las notificaciones
export const updateVehicleNotification = async (cod_vehicle, updateData) => {
    try {
        const response = await axios.put(
            API_URL + "update-notification",
            updateData,
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