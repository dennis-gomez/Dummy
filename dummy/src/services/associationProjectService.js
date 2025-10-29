import axios from "axios";

const API_URL = "http://localhost:3000/project-association/";

//Obtener formaciones academicas
export const getAssociationProject = async (profile_cod) => {
    try {
        const response = await axios.get(API_URL, { 
            params: { profile_cod: Number(profile_cod) },
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