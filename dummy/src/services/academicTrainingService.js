import axios from "axios";

const API_URL = "http://localhost:3000/academic-training/";

//Obtener formaciones academicas
export const getAcademicTrainings = async (personCod) => {
    try {
        const response = await axios.get(API_URL, { 
            params: { personal_cod: Number(personCod) },
            headers: { "Content-Type": "application/json" } 
        });
        console.log("SORRRYYY", response.datas)
        return response.data;
    } catch (error) {
        throw error;
    }
};

//Agregar nueva formacion academica 
export const addAcademicTrainings = async (formData) => {
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
export const updateAcademicTrainings = async (formData) => {
    try {
        const response = await axios.put(API_URL + "update", formData, {
            headers: { "Content-Type": "application/json" },
        });
        return response;
    } catch (error) {
        throw error;
    }
};