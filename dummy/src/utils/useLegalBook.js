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
    { value: 1, label: "Activo" },
    { value: 2, label: "En uso" },
    { value: 3, label: "Archivado" },
    { value: 4, label: "Dado de baja" },
    { value: 5, label: "Desactivados" },
  ];

  const fields = [

    { name: "cod_book", label: "Código", type: "text", placeholder: "Código", editable: false, grid: 4,   width: 250 },
    { name: "book_items_code", label: "Tipo de libro", type: "select", placeholder: "Tipo de libro", options: bookOptions, editable: false, grid: 4,   width: 384, },
        { name: "book_status", label: "Estado", type: "select", placeholder: "Estado", options: STATUS_OPTIONS, editable: true, grid: 4,   width: 250 },
    { name: "book_code", label: "Código de libro", type: "text", placeholder: "Código de libro", editable: true, grid: 4,   width: 384, restriction: "unique"},
    { name: "book_name", label: "Nombre", type: "textarea", placeholder: "Nombre", editable: true, grid: 4,   width: '49rem' },
    { name: "book_location", label: "Ubicación", type: "textarea", placeholder: "Ubicación", editable: true, grid: 4 ,  width: '49rem'},
    { name: "book_file", label: "Archivo", type: "file", required:false, placeholder: "Archivo", editable: true, grid: 4 ,  width: '49rem', accept: ".pdf"},
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

    

    } catch (err) {
      setError("Error al obtener tipos de libros");
      ModalAlert("Error", "Error al obtener tipos de libros", "error");
      return [];
    }
  };


  const handleSearchBooks = async (feature, text) => {

    text = String(text); // Asegura que text es una cadena

    try {
      setLoading(true);

      if (!text.trim()) {
        await fetchBooks();
        return;
      }
   

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

  const openPDF = (base64) => {
  const byteCharacters = atob(base64); // decodificar Base64
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: "application/pdf" });
  const blobUrl = URL.createObjectURL(blob);
  window.open(blobUrl, "_blank");
};

const handleAddBook = async (formData) => {
  try {

    // Clonamos los datos obligatorios
    const dataToSend = {
      ...formData,
      book_service_code: Number(import.meta.env.VITE_BOOK_SERVICE_CODE),
      book_category_code: Number(import.meta.env.VITE_BOOK_CATEGORY_CODE),
    };

    // Solo agregar book_file si hay un archivo real
    if (formData.book_file instanceof File) {
      const fileBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(formData.book_file);
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = error => reject(error);
      });
      dataToSend.book_file = fileBase64;
    } else {
      // Eliminar la propiedad si no hay archivo
      delete dataToSend.book_file;
    }


    const resp = await addBook(dataToSend);

    if (resp.status === 201) {
      ModalAlert("Éxito", "Libro agregado exitosamente.", "success");
      fetchBooks();
      setIsCreatingBook(false);
    }
  } catch (err) {
    console.error(err);
    ModalAlert("Error", "Error al agregar libro", "error");
  }
};



const handleEditBook = async (cod_book, formData) => {
  try {
    
    // Convertimos el archivo a Base64 si es un File
    let fileBase64 = null;
    if (formData.book_file instanceof File) {
      fileBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(formData.book_file);
        reader.onload = () => resolve(reader.result.split(",")[1]); // solo contenido
        reader.onerror = error => reject(error);
      });
    } else {
      delete formData.book_file;
    }

    const dataToSend = {
      ...formData,
      book_file: fileBase64 || formData.book_file,
      book_service_code: Number(import.meta.env.VITE_BOOK_SERVICE_CODE),
      book_category_code: Number(import.meta.env.VITE_BOOK_CATEGORY_CODE),
    };


    const resp = await updateBook(cod_book, dataToSend);

    if (resp.status === 200) {
      ModalAlert("Éxito", "Libro editado exitosamente.", "success");
      fetchBooks();
      setError(null);
    }
  } catch (err) {
    // Captura el mensaje real desde el backend
    const message = err.response?.data?.message || "Error al editar libro.";
    ModalAlert("Error", message, "error");
    setError(message);
  }
};


 const handleDeleteBook = async (cod_book,status) => {
  try {
    const resp = await deleteBook(cod_book,status);
    if (resp.status === 200) {
      if(status === 5){
        ModalAlert("Éxito", "Libro desactivado.", "success");
      }else{
        ModalAlert("Éxito", "Libro reactivado.", "success");
      }
     
      fetchBooks();
      setError(null);
    }
  } catch (err) {
    // Captura el mensaje real desde el backend
    const message = err.response?.data?.message || "Error al eliminar libro.";
    ModalAlert("Error", message, "error");
    setError(message);
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
    openPDF
  };
};
