import { useEffect, useState } from "react";
import { 
    addRecord, 
    getRecords, 
    updateRecord, 
    deleteRecord, 
    getRecordByFeature, 
    getBooksNames, 
    getActiveBooksNames
} from "../services/legalBookRecordService";
import Swal from "sweetalert2";

// Modal genérico con SweetAlert2
const ModalAlert = (title, text, icon = "info") => {
    Swal.fire({
        title,
        text,
        icon,
        confirmButtonColor: icon === "error" ? "#dc2626" : "#2563eb",
    });
};

export const useLegalBookRecord = () => {
    const [books, setBooks] = useState([]);
    const [legalBookRecords, setLegalBookRecords] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);

    const [booksItems, setBooksItems] = useState([]); //opciones de libros legales
    const [formattedBook, setFormattedBook] = useState([])

    const [error, setError] = useState(null); //manejo de errores

    const fields = [
        { name: "cod_book_catalog", placeholder: "Libro legal", required: true, type: "select", options: booksItems, width: 780},
        { name: "lb_record_requested_by", placeholder: "Solicitado", required: true, validations: [ (value) =>value && value.length > 100 ? "El solicitante del libro debe tener máximo 100 caracteres." : null,], width: 250 },
        { name: "lb_record_delivered_to", placeholder: "Entregado", required: true, validations: [ (value) => value && value.length > 100 ? "El responsable de recepción del libro debe tener máximo 100 caracteres." : null,], width: 250},
        { name: "lb_record_date", placeholder: "Fecha de registro", required: true, type: "date", width: 250, restriction: "cantAfterToday" },
        { name: "lb_record_observation", placeholder: "Observaciones", required: true, type: "textarea", width: 783, required: false,},
    ];

    // Campos para editar
    const editFields = [
        { name: "cod_book_catalog", placeholder: "Libro legal", type: "select", options: formattedBook, width: 200, required: true },
        { name: "lb_record_requested_by", placeholder: "Solicitado", required: true, width: 220 },
        { name: "lb_record_delivered_to", placeholder: "Entregado", required: true, width: 220 },
        { name: "lb_record_return_by", placeholder: "Regresado por", required: false, width: 220 },  
        { name: "lb_record_date", placeholder: "Fecha de registro", type: "date", restriction: "cantAfterToday", required: true, width: 150 },
        { name: "lb_record_return_date", placeholder: "Fecha de retorno", type: "date", restriction: "cantAfterToday", 
            validations: [
                (value, allValues) => {
                    if (!value) return null;
                    const recordReturnDate = new Date(value);
                    const recordDate = new Date(allValues.lb_record_date);
                    if (recordDate && recordReturnDate < recordDate) {
                        return "La fecha de retorno no puede ser anterior a la fecha de registro.";
                    }
                    return null;
                },
            ],
            required: false, width: 150 },
        { name: "lb_record_observation", placeholder: "Observaciones", type: "textarea", required: false, width: 200 },
    ];

    // Estados para filtrado
    const [searchText, setSearchText] = useState("");
    const [selectedBook, setSelectedBook] = useState("Todos");
    const [searchField, setSearchField] = useState(fields.find(field => field.name !== 'cod_book_catalog')?.name || '');

    // Listado de registros
    const fetchRecords = async (bookId = "", field = "", text = "") => {
        try {
            setLoading(true);
            let response;
            if (bookId === "Todos" && !text.trim()) {
                response = await getRecords();
                setError(null);
            } else {
                response = await getRecordByFeature(bookId, field, text);
                setError(null);
            }
            setLegalBookRecords(response.data);
        } catch (error) {
            const message = error.response?.data?.message || "Error al obtener los registros.";
            ModalAlert("Error", message, "error");
        } finally {
            setLoading(false);
        }
    };

    // Búsqueda específica
    const handleSearch = async () => {
        await fetchRecords(selectedBook, searchField, searchText);
    };

    // Resetear filtros y cargar todos los registros
    const handleResetSearch = async () => {
        setSelectedBook("Todos");
        setSearchField(fields[0]?.name || "");
        setSearchText("");
        await fetchRecords();
    };

    // Agregar registro
    const handleSubmit = async (formData) => {
        try {
            const dataToSend = {
                ...formData,
                lb_record_return_date: null, 
                lb_record_return_by: null,
            };

            const response = await addRecord(dataToSend);

            if (response.status === 201) {
                ModalAlert("Éxito", "Registro agregado exitosamente.", "success");
                await fetchRecords();
                setShowForm(false);
                setError(null);
            }

        } catch (error) {
            const message = error.response?.data?.message || "Error al agregar registro.";
            ModalAlert("Error", message, "error");
            setError(message);
        }
    };

    // Editar registro
    const handleEdit = async (updatedData) => {
        try {
            const response = await updateRecord(updatedData);
            if (response.status === 200) {
                ModalAlert("Éxito", "Registro editado exitosamente.", "success");
                await fetchRecords();
                setError(null);
            }
            return true;
        } catch (error) {
            const message = error.response?.data?.message || "Error al editar registro.";
            ModalAlert("Error", message, "error");
            setError(message);
            return false;
        }
    };

    // Eliminar registro
    const handleDelete = async (cod_registration_application) => {
        try {
            const response = await deleteRecord(cod_registration_application);
            if (response.status === 200) {
                ModalAlert("Éxito", response.data.message || "Registro eliminado.", "success");
                await fetchRecords();
                setError(null);
            }
        } catch (error) {
            const message = error.response?.data?.message || "Error al eliminar registro.";
            ModalAlert("Error", message, "error");
            setError(message);
        }
    };

    // Cargar registros y libros al iniciar
    useEffect(() => {
        fetchRecords();
        const loadBooks = async () => {
            try {
                const activeBooks = await getActiveBooksNames();
                const allBooks = await getBooksNames();

                setBooksItems(
                    activeBooks.data.map((i) => ({
                        name: i.cod_book,
                        placeholder: i.book_name,
                        value: i.cod_book,
                        label: i.book_name
                    }))
                );

                setBooks(allBooks.data);

                setFormattedBook(
                    allBooks.data.map((i) => ({
                        name: i.cod_book,
                        placeholder: i.book_name,
                        value: i.cod_book,
                        label: i.book_name
                    }))
                )
                setError(null);
            } catch (error) {
                const message = error.response?.data?.message || "Error al obtener los catálogos de libros.";
                ModalAlert("Error", message, "error");
                setError(message);
            }
        };
        loadBooks();
    }, []);

    return {
        books,
        booksItems,
        legalBookRecords,
        fields,
        editFields, 
        searchText,
        setSearchText,
        selectedBook,
        setSelectedBook,
        searchField,
        setSearchField,
        showForm,
        setShowForm,
        loading, 
        error,      
        setError,
        handleSubmit,
        handleEdit,
        handleDelete,
        handleSearch,
        handleResetSearch,
    };
};
