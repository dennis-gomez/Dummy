import axios from "axios";

const API_URL = "http://localhost:3000/book/record";

// Obtener registros
export const getRecords = async () => {
    try {
        /*
        const response = await axios.get(
            API_URL + "active",
            {
                headers: {
                    "Content-Type": "application/json"
                },
            }
        );
        */
        //return response;
        console.log("Simulacion obtener registros")
    } catch (error) {
        throw error;
    }
};

//Obtener registros por caracteristica del registro
export const getRecordByFeature = async ( feature, text ) => {
    try{/*
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
        */
       console.log("Simulacion obtener registro", feature, text)
    } catch (error) {
        throw error;
    }
}

// Agregar registro
export const addRecord = async (formData) => {
    try {
        /*
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
        */
       console.log("Simulacion agregar registro", formData)
    } catch (error) {
        throw error;
    }
};

// Eliminar vehiculo
export const deleteRecord = async ( cod_vehicle ) => {
    try {
        /*
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
        */
         console.log("Simulacion agregar registro", cod_vehicle)
    } catch (error) {
        throw error;
    }
};

// Actualizar vehiculo
export const updateRecord = async ( formData ) => {
    try {
        /*
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
        */
        console.log("Simulacion editar registro", formData)
    } catch (error) {
        throw error;
    }  
};
