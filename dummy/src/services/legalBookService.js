import axios from "axios";

const API_URL = "http://localhost:3000/books/";

// 🔹 Obtener todos los libros
export const getBooks = async () => {
    try {
        const response = await axios.get(API_URL, {
            headers: { "Content-Type": "application/json" },
        });

        // Aquí mostramos los datos de los libros en consola
        // response.data debería ser un array de objetos
        console.log("getBooks data:", response.data);

        // Opcional: mostrar info de cada archivo
        response.data.forEach(book => {
            console.log(`Libro: ${book.book_name} (${book.cod_book})`);
            console.log(`- Tiene archivo: ${!!book.book_file}`);
            if (book.book_file) {
                console.log(`- Tamaño (bytes): ${book.book_file.length}`);
                // si querés base64 parcial para ver que no está vacío
                console.log(`- Base64 parcial: ${book.book_file.slice(0, 50)}...`);
            }
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
export const deleteBook = async (cod_book) => {
    try {
        const response = await axios.delete(API_URL + "delete", {
            params: { cod_book }, // se envía por query
            headers: { "Content-Type": "application/json" },
        });
        return response;
    } catch (error) {
        throw error;
    }
};
