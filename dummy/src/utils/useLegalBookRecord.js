import { useEffect, useState } from "react";
import { addRecord, getRecords, updateRecord, deleteRecord, getRecordByFeature, getBooksNames } from "../services/legalBookRecordService";
import ModalAlert from "../components/molecules/modalAlert";

export const useLegalBookRecord = () => {
    const [books, setBooks] = useState([]);
    const [legalBookRecords, setLegalBookRecords] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const fields = [
        { 
            name: "lb_record_requested_by", 
            placeholder: "Solicitado", 
            width: 250
        },
        { 
            name: "lb_record_delivered_to", 
            placeholder: "Entregado", 
            width: 250
        },
        { 
            name: "lb_record_return_by", 
            placeholder: "Regresado", 
            width: 250
        },
        { 
            name: "lb_record_date", 
            placeholder: "Fecha de registro", 
            type: "date", 
            width: 250
        },
        { 
            name: "lb_record_return_date", 
            placeholder: "Fecha de regreso", 
            type: "date", 
            width: 250
        },
        { 
            name: "lb_record_observation", 
            placeholder: "Observaciones", 
            type: "textarea",
            width: 250
        },
    ]

    // Estados para filtrado - más claros
    const [searchText, setSearchText] = useState(""); // Texto a buscar
    const [selectedBook, setSelectedBook] = useState(""); // Libro seleccionado
    const [searchField, setSearchField] = useState(fields[0]?.name || ""); // Campo del registro a buscar

    // Listado de registros (con o sin filtros)
    const fetchRecords = async (bookId = "", field = "", text = "") => {
    try {
        setLoading(true);
        let response;
        
        if (bookId || (field && text)) {
            // Búsqueda con filtros (ahora funciona con 1, 2 o 3 filtros)
            response = await getRecordByFeature(bookId, field, text);
        } else {
            // Todos los registros
            response = await getRecords();
        }
        setLegalBookRecords(response.data);
    } catch (error) {
        const message = error.response?.data?.message || "Error al obtener los registros.";
        setError(message);
    } finally {
        setLoading(false);
    }
}

    // Búsqueda específica
    const handleSearch = async () => {
        await fetchRecords(selectedBook, searchField, searchText);
    }

    // Resetear filtros y cargar todos los registros
    const handleResetSearch = async () => {
        setSelectedBook("");
        setSearchField(fields[0]?.name || "");
        setSearchText("");
        await fetchRecords();
    }

    const handleSubmit = async (formData) => {
        try {
            setError(null);
            const dataToSend = {
                ...formData,
                cod_book_catalog: selectedBook,
            };
            const response = await addRecord(dataToSend);
            if (response.status === 201) {
                ModalAlert("Éxito", "Registro agregado exitosamente.", "success");
                await fetchRecords(); // Recargar registros
                setShowForm(false);
            }
        } catch (error) {
            const message = error.response?.data?.message || "Error al agregar registro.";
            ModalAlert("Error", message, "error");
            setError(message);
        }
    }

    const handleEdit = async (updatedData) => {
        try {
            setError(null);
            const response = await updateRecord(updatedData);
            if (response.status === 200) {
                ModalAlert("Éxito", "Registro editado exitosamente.", "success");
                await fetchRecords(); // Recargar registros
            }
            return true;
        } catch (error) {
            const message = error.response?.data?.message || "Error al editar registro.";
            ModalAlert("Error", message, "error");
            setError(message);
            return false;
        }
    }

    const handleDelete = async (cod_registration_application) => {
        try {
            const response = await deleteRecord(cod_registration_application);
            if (response.status === 200) {
                ModalAlert("Éxito", response.data.message, "success");
                await fetchRecords(); // Recargar registros
            }
        } catch (error) {
            const message = error.response?.data?.message || "Error al eliminar registro.";
            ModalAlert("Error", message, "error");
        }
    }

    useEffect(() => {
        fetchRecords();
        const loadBooks = async () => {
            try {
                const response = await getBooksNames();
                setBooks(response.data);
            } catch (error) {
                const message = error.response?.data?.message || "Error al obtener los catálogos de libros.";
                setError(message);
            }
        };
        loadBooks();
    }, []);

    return {
        books,
        legalBookRecords,
        fields, 
        searchText,
        setSearchText,
        selectedBook,
        setSelectedBook,
        searchField,
        setSearchField,
        showForm,
        setShowForm,
        error,
        setError,
        loading, 
        handleSubmit,
        handleEdit,
        handleDelete,
        handleSearch,
        handleResetSearch,
    };
};