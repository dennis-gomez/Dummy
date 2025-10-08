import axios from "axios";

const API_URL = "http://localhost:3000/books/";

// 🔹 Obtener todos los libros
export const getBooks = async () => {
    try {
        const response = await axios.get(API_URL, {
            headers: { "Content-Type": "application/json" },
        });

        return response;
    } catch (error) {
        throw error;
    }
};


// 🔹 Buscar libros por característica y término
export const searchBooksByTerm = async (feature, searchTerm) => {
    try {
        const response = await axios.get(API_URL + "search", {
            params: { feature, searchTerm },
            headers: { "Content-Type": "application/json" },
        });
        return response;
    } catch (error) {
        throw error;
    }
};

// 🔹 Obtener nombres e IDs de libros
export const getBookNamesAndIds = async () => {
    try {
        const response = await axios.get(API_URL + "names_ids", {
            headers: { "Content-Type": "application/json" },
        });
        return response;
    } catch (error) {
        throw error;
    }
};

// 🔹 Agregar un libro
export const addBook = async (formData) => {

console.log("addBook - formData:", formData);

  try {
    const response = await axios.post(API_URL + "add", formData);
    return response;
  } catch (error) {
    throw error;
  }
};

// 🔹 Actualizar un libro
export const updateBook = async (cod_book, formData) => {
    try {
        const response = await axios.put(API_URL + "update", formData, {
            params: { cod_book }, // se envía por query
            headers: { "Content-Type": "application/json" },
        });
        return response;
    } catch (error) {
        throw error;
    }
};

// 🔹 Eliminar un libro (cambiar estado a eliminado)
export const deleteBook = async (cod_book,status) => {
    try {
        const response = await axios.delete(API_URL + "delete", {
            params: { cod_book,status }, // se envía por query
            headers: { "Content-Type": "application/json" },
        });
        return response;
    } catch (error) {
        throw error;
    }
};
