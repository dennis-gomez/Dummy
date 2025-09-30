import { useEffect, useState } from "react";
import { 
    addRecord, 
    getRecords, 
    updateRecord, 
    deleteRecord, 
    getRecordByFeature, 
    getBooksNames 
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

    const fields = [
        { 
            name: "lb_record_requested_by", 
            placeholder: "Solicitado", 
            validations: [
                (value) =>
                    value && value.length > 100 ? "El solicitante del libro debe tener máximo 100 caracteres." : null,
            ],
            width: 250
        },
        { 
            name: "lb_record_delivered_to", 
            placeholder: "Entregado",
            validations: [
                (value) =>
                    value && value.length > 100 ? "El responsable de recepción del libro debe tener máximo 100 caracteres." : null,
            ], 
            width: 250
        },
        { 
            name: "lb_record_date", 
            placeholder: "Fecha de registro", 
            type: "date", 
            width: 250, 
            restriction: "cantAfterToday"
        },
        { 
            name: "lb_record_observation", 
            placeholder: "Observaciones", 
            type: "textarea",
            width: 783, 
            required: false,
        },
    ];

    // Estados para filtrado
    const [searchText, setSearchText] = useState("");
    const [selectedBook, setSelectedBook] = useState("Todos");
    const [searchField, setSearchField] = useState(fields[0]?.name || "");

    // Listado de registros
    const fetchRecords = async (bookId = "", field = "", text = "") => {
        try {
            setLoading(true);
            let response;
            if (bookId === "Todos" && !text.trim()) {
                response = await getRecords();
            } else {
                response = await getRecordByFeature(bookId, field, text);
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
                cod_book_catalog: selectedBook,
                lb_record_return_date: null, 
                lb_record_return_by: null,
            };
            const response = await addRecord(dataToSend);
            if (response.status === 201) {
                ModalAlert("Éxito", "Registro agregado exitosamente.", "success");
                await fetchRecords();
                setShowForm(false);
            }
        } catch (error) {
            const message = error.response?.data?.message || "Error al agregar registro.";
            ModalAlert("Error", message, "error");
        }
    };

    // Editar registro
    const handleEdit = async (updatedData) => {
        try {
            const response = await updateRecord(updatedData);
            if (response.status === 200) {
                ModalAlert("Éxito", "Registro editado exitosamente.", "success");
                await fetchRecords();
            }
            return true;
        } catch (error) {
            const message = error.response?.data?.message || "Error al editar registro.";
            ModalAlert("Error", message, "error");
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
            }
        } catch (error) {
            const message = error.response?.data?.message || "Error al eliminar registro.";
            ModalAlert("Error", message, "error");
        }
    };

    // Cargar registros y libros al iniciar
    useEffect(() => {
        fetchRecords();
        const loadBooks = async () => {
            try {
                const response = await getBooksNames();
                setBooks(response.data);
            } catch (error) {
                const message = error.response?.data?.message || "Error al obtener los catálogos de libros.";
                ModalAlert("Error", message, "error");
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
        loading, 
        handleSubmit,
        handleEdit,
        handleDelete,
        handleSearch,
        handleResetSearch,
    };
};
