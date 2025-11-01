import axios from "axios";

const API_URL = "http://localhost:3000/project-association/";

//Obtener formaciones academicas
export const getAssociationProject = async (profile_cod, page = 1, limit = 10) => {
    try {
        const response = await axios.get(API_URL, { 
            params: { profile_cod: Number(profile_cod), page: page, limit: limit },
            headers: { "Content-Type": "application/json" } 
        });
        return response;
    } catch (error) {
        throw error;
    }
};

//Agregar nueva formacion academica 
export const addAssociationProject = async (formData) => {
    try {
        const response = await axios.post(API_URL + "add", formData, {
            headers: { "Content-Type": "application/json" } 
        });
        return response;
    } catch (error) {
        throw error;
    }
};

//Editar fromacion academica exsistente
export const updateAssociationProject = async (formData) => {
    try {
        const response = await axios.put(API_URL + "update", formData, {
            headers: { "Content-Type": "application/json" },
        });
        return response;
    } catch (error) {
        throw error;
    }
};

//Buscar asociaciones de proyectos
export const findAssociationProject = async (page = 1, limit = 10, feature, searchTerm, profile_cod) => {
    try {
        const response = await axios.get(API_URL + "find", {
            params: { feature, searchTerm, profile_cod: Number(profile_cod), page: page, limit: limit },
            headers: { "Content-Type": "application/json" },
        });
        return response;
    } catch (error) {
        throw error;
    }
};