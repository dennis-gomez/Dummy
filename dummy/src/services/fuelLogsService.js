import axios from "axios";

const API_URL = "http://localhost:3000/fuel-logs/";

/**
 * Obtener todos los registros de combustible inactivos
 */
export const getAllFuelLogs = async (page = 1, limit = 10) => {
    try {
        const response = await axios.get(API_URL, {
            params: { page, limit },
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
export const getActiveFuelLogs = async (page = 1, limit = 10) => {
    try {
        const response = await axios.get(API_URL + "active", {
            params: { page, limit },
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
export const findFuelLogs = async (vehicleId, feature, text, page = 1, limit = 10) => {
    try {
        const response = await axios.get(API_URL + "find", {
            params: { vehicleId, feature, text, page, limit },
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
 * Reactivar un registro de combustible inactivo
 */
export const reactivateFuelLogs = async (cod_fuel_log) => {
    try {
        const response = await axios.put(
            API_URL + "reactivate",
            {},
            {
                params: { cod_fuel_log },
                headers: { "Content-Type": "application/json" },
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
