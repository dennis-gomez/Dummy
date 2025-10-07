import axios from "axios";

const API_URL = "http://localhost:3000/vehicle-maintenance/";

/**
 * Obtener todos los registros de mantenimiento activos e inactivos
 */
export const getAllMaintenanceLogs = async (page = 1, limit = 10) => {
    try {
        const response = await axios.get(API_URL + "all", {
            params: { page, limit },
            headers: { "Content-Type": "application/json" },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Obtener solo registros de mantenimiento activos
 */
export const getActiveMaintenanceLogs = async (page = 1, limit = 10) => {
    try {
        const response = await axios.get(API_URL + "active", {
            params: { page, limit },
            headers: { "Content-Type": "application/json" },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Buscar registros de mantenimiento por vehiculo, campo y texto
 */
export const findMaintenanceLogs = async (vehicleId, feature, text, page = 1, limit = 10) => {
    try {
        const response = await axios.get(API_URL + "find", {
            params: { vehicleId, feature, text, page, limit },
            headers: { "Content-Type": "application/json" },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Agregar un nuevo registro de mantenimiento
 */
export const addMaintenanceLog = async (formData) => {
    try {
        const response = await axios.post(API_URL + "add", formData, {
            headers: { "Content-Type": "application/json" },
        });
        return response;
    } catch (error) {
        throw error;
    }
};

/**
 * Eliminacion logica de un registro de mantenimiento
 */
export const deleteMaintenanceLog = async (cod_maintenance) => {
    try {
        const response = await axios.put(
            API_URL + "delete",
            {},
            {
                params: { cod_maintenance },
                headers: { "Content-Type": "application/json" },
            }
        );
        return response;
    } catch (error) {
        throw error;
    }
};

/**
 * Actualizar un registro de mantenimiento
 */
export const updateMaintenanceLog = async (formData) => {
    try {
        const response = await axios.put(API_URL + "update", formData, {
            headers: { "Content-Type": "application/json" },
        });
        return response;
    } catch (error) {
        throw error;
    }
};
