import axios from "axios";

const API_URL = "http://localhost:3000/personal/";

//Obtener personal activo
export const getPersonal = async (page = 1, limit = 10) => {
    try {
        const response = await axios.get(API_URL, {
            params: { page, limit },
            headers: { "Content-Type": "application/json" },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

//Buscar personal por campo
export const findPersonal = async (page = 1, limit = 10, field, value) => {
    try {
        const response = await axios.get(API_URL + "find", {
            params: { page, limit, field, value },
            headers: { "Content-Type": "application/json" },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

//Agregar nuevo personal
export const addPersonal = async (formData) => {
    try {
        const response = await axios.post(API_URL + "add", formData, {
            headers: { "Content-Type": "application/json" },
        });
        return response;
    } catch (error) {
        throw error;
    }
};

//Desactivar personal
export const deletePersonal = async (personal_cod) => {
    try {
        const response = await axios.put(
            API_URL + "delete",
            {},
            {
                params: { personal_cod },
                headers: { "Content-Type": "application/json" },
            }
        );
        return response;
    } catch (error) {
        throw error;
    }
};

//Reactivar personal
export const reactivatePersonal = async (personal_cod) => {
    try {
        const response = await axios.put(
            API_URL + "reactivate",
            {},
            {
                params: { personal_cod },
                headers: { "Content-Type": "application/json" },
            }
        );
        return response;
    } catch (error) {
        throw error;
    }
};

//Actualizar informacion de personal
export const updatePersonal = async (formData) => {
    try {
        const response = await axios.put(API_URL + "update", formData, {
            headers: { "Content-Type": "application/json" },
        });
        return response;
    } catch (error) {
        throw error;
    }
};
