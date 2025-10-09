import axios from "axios";

const API_URL = "http://localhost:3000/book-record/";
const API_URL_BOOK = "http://localhost:3000/books/";

// Obtener registros
export const getInactivesRecords = async (page = 1, limit = 10) => {
    try {
        const response = await axios.get(
            API_URL,
            {
                params: { page, limit },
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

// Obtener registros
export const getRecords = async (page = 1, limit = 10) => {
    try {
        const response = await axios.get(
            API_URL + "active",
            {
                params: { page, limit },
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

//Obtener registros por caracteristica del registro
export const getRecordByFeature = async ( bookId, field, text, page = 1, limit = 10 ) => {
    try{       
        const response = await axios.get(
            API_URL + "find", 
            {
                params: { bookId, field, text, page, limit },
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

// Agregar registro
export const addRecord = async (dataToSend) => {
    try {
        const response = await axios.post(
            API_URL + "add",
            dataToSend,
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

// Eliminar registro (logico)
export const deleteRecord = async ( cod_registration_application ) => {
    try {
        const response = await axios.put(
            API_URL + "delete",
            {},
            {
                params: { cod_registration_application },
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

//Reactivar registro
export const reactivateRecord = async (cod_registration_application) => {
    try {
        const response = await axios.put(
            API_URL + "reactivate",
            {},
            {
                params: { cod_registration_application },
                headers: { "Content-Type": "application/json" },
            }
        );
        return response;
    } catch (error) {
        throw error;
    }
};

// Actualizar registro
export const updateRecord = async ( formData ) => {
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

//obtener nombres de libros
export const getBooksNames = async () => {
    try{
        const response = await axios.get(
            API_URL_BOOK + "names_ids",
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

//obtener nombres de libros activos
export const getActiveBooksNames = async () => {
    try{
        const response = await axios.get(
            API_URL_BOOK + "active/names_ids",
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
