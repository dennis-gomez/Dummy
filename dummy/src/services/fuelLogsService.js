import axios from "axios";

const API_URL = "http://localhost:3000/fuel-logs/";

/**
 * Obtener todos los registros de combustible (activos e inactivos)
 */
export const getAllFuelLogs = async () => {
    try {
        const response = await axios.get(API_URL + "all", {
            headers: {
                "Content-Type": "application/json"
            },
        });
        return response;
    } catch (error) {
        throw error;
    }
};

/**
 * Obtener solo registros de combustible activos
 */
export const getActiveFuelLogs = async () => {
    try {
        const response = await axios.get(API_URL + "active", {
            headers: {
                "Content-Type": "application/json"
            },
        });
        return response;
    } catch (error) {
        throw error;
    }
};

/**
 * Buscar registros por caracteristica
 */
export const findFuelLogs = async (vehicleId, feature, text) => {
    try {
        const response = await axios.get(API_URL + "find", {
            params: { vehicleId, feature, text },
            headers: {
                "Content-Type": "application/json"
            },
        });
        return response;
    } catch (error) {
        throw error;
    }
};

/**
 * Agregar un nuevo registro de combustible
 */
export const addFuelLog = async (formData) => {
    try {
        const response = await axios.post(API_URL + "add", formData, {
            headers: {
                "Content-Type": "application/json"
            },
        });
        return response;
    } catch (error) {
        throw error;
    }
};

/**
 * Eliminar logicamente un registro de combustible
 */
export const deleteFuelLog = async (cod_fuel_log) => {
    try {
        const response = await axios.put(
            API_URL + "delete",
            {},
            {
                params: { cod_fuel_log },
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

/**
 * Actualizar un registro de combustible
 */
export const updateFuelLog = async (formData) => {
    try {
        const response = await axios.put(API_URL + "update", formData, {
            headers: {
                "Content-Type": "application/json"
            },
        });
        return response;
    } catch (error) {
        throw error;
    }
};
