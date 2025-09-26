import { useEffect, useState } from "react";
import {
  getBooks,
  addBook,
  updateBook,
  deleteBook,
  searchBooksByTerm,
} from "../services/legalBookService";
import ModalAlert from "../components/molecules/modalAlert";
import { getItems } from "../services/itemService";

export const useBooks = () => {
  const [booksList, setBooksList] = useState([]);
  const [bookSelectedId, setBookSelectedId] = useState(null);
  const [isCreatingBook, setIsCreatingBook] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [typesOfBooks, setTypesOfBooks] = useState([]);
  const [bookOptions, setBookOptions] = useState([]);

  const STATUS_OPTIONS = [
    {value : 1, label: "Activo"},
    {value : 2, label: "En uso"},
    {value : 3, label: "Archivado"},
    {value : 4, label: "Dado de baja"}
  ];

  const fields = [
    
    { name: "cod_book", label: "Código", type: "text", placeholder: "Código", editable: false },
    { name: "book_items_code", label: "Tipo de libro", type: "select", placeholder: "Tipo de libro", options:bookOptions, editable: false },
    {name: "book_code", label: "Código de libro", type: "text", placeholder: "Código de libro", editable: true },
    { name: "book_name", label: "Nombre", type: "textarea", placeholder: "Nombre", editable: true },
    { name: "book_location", label: "Ubicación", type: "textarea", placeholder: "Ubicación", editable: true },
    { name: "book_status", label: "Estado", type: "select", placeholder: "Estado", options: STATUS_OPTIONS, editable: true },
  ];



// Transformar bookOptions para Seeker / CustomSelect
const bookOptionsForSelect = bookOptions.map(opt => ({
  name: opt.value,        // lo que antes era value
  placeholder: opt.label  // lo que antes era label
}));

const searchFields = fields
  .filter(f => f.name !== "cod_book" && f.name !== "book_service_code" && f.name !== "book_category_code")
  .map(f => ({ 
    name: f.name, 
    placeholder: f.label, 
    type: f.type, 
    options: f.name === "book_items_code" ? bookOptionsForSelect : f.options?.map(o => ({
      name: o.value,
      placeholder: o.label
    })) || []
  }));


 const fetchBooks = async () => {
    try {
        setLoading(true);
        const resp = await getBooks();
        setBooksList(resp.data); // <- aquí accedes al array real
        console.log("Books fetched:", resp.data);
    } catch (err) {
        setError("Error al obtener libros");
        ModalAlert("Error", "Error al obtener libros", "error");
    } finally {
        setLoading(false);
    }
};

const fetchTypesOfBooks = async () => {
    try {
    const typesResp = await getItems(
  Number(import.meta.env.VITE_BOOK_SERVICE_CODE),
  Number(import.meta.env.VITE_BOOK_CATEGORY_CODE)
);

    setTypesOfBooks(typesResp);

setBookOptions(typesResp.map(type => ({ value: type.cod_item, label: type.item_name })));

console.log("Types of books fetched:", typesResp);

console.log("estado de libros:", STATUS_OPTIONS)

    } catch (err) {
        setError("Error al obtener tipos de libros");
        ModalAlert("Error", "Error al obtener tipos de libros", "error");
        return [];
    }
};


  const handleSearchBooks = async (feature, text) => {

    text= String(text); // Asegura que text es una cadena
    
  try {
    setLoading(true);

    if (!text.trim()) {
      fetchBooks();
      return;
    }
console.log("Buscando libros con:", feature, text);

    const resp = await searchBooksByTerm(feature, text);

    if (!resp || !resp.data || resp.data.length === 0) {  // <- resp.data
      ModalAlert("Error", "No se encontró ningún libro con esos criterios.", "error");
      return;
    }

    setBooksList(resp.data);  // <- resp.data
    setBookSelectedId(null);
  } catch (err) {
    setError("Error al buscar libros");
    ModalAlert("Error", "Error al buscar libros", "error");
  } finally {
    setLoading(false);
  }
};

const handleAddBook = async (formData) => {
  console.log("Datos del formulario para agregar libro (antes de enviar):", formData);

  // Agregamos los valores fijos desde .env
  const dataToSend = {
    ...formData,
    book_service_code: Number(import.meta.env.VITE_BOOK_SERVICE_CODE),
    book_category_code: Number(import.meta.env.VITE_BOOK_CATEGORY_CODE),
  };

  console.log("Datos que se enviarán a la API:", dataToSend);

  try {
    const resp = await addBook(dataToSend);
    if (resp.status === 201) {
      ModalAlert("Éxito", "Libro agregado exitosamente.", "success");
      fetchBooks();
      setIsCreatingBook(false);
    }
  } catch (err) {
    setError("Error al agregar libro");
    ModalAlert("Error", "Error al agregar libro", "error");
  }
};


  const handleEditBook = async (cod_book, formData) => {
    try {
      const resp = await updateBook(cod_book, formData);
      if (resp.status === 200) {
        ModalAlert("Éxito", "Libro editado exitosamente.", "success");
        fetchBooks();
      }
    } catch (err) {
      setError("Error al editar libro");
      ModalAlert("Error", "Error al editar libro", "error");
    }
  };

   

  const handleDeleteBook = async (cod_book) => {
    try {
      const resp = await deleteBook(cod_book);
      if (resp.status === 200) {
        ModalAlert("Éxito", resp.data.message || "Libro eliminado.", "success");
        fetchBooks();
      }
    } catch (err) {
      setError("Error al eliminar libro");
      ModalAlert("Error", "Error al eliminar libro", "error");
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchTypesOfBooks();
  }, []);

  return {
    booksList,
    bookSelectedId,
    setBookSelectedId,
    isCreatingBook,
    setIsCreatingBook,
    error,
    setError,
    loading,
    fields,
    searchFields,
    fetchBooks,
    handleAddBook,
    handleEditBook,
    handleDeleteBook,
    handleSearchBooks,
    typesOfBooks,
    fetchTypesOfBooks,
    STATUS_OPTIONS,
  };
};
