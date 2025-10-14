import { useEffect, useState } from "react";
import { 
    addRecord, 
    getRecords, 
    updateRecord, 
    deleteRecord, 
    getRecordByFeature, 
    getBooksNames, 
    getInactivesRecords,
    getActiveBooksNames, 
    reactivateRecord,
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
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(5);

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
        { name: "cod_book_catalog", placeholder: "Libro legal", type: "select", options: booksItems, width: 200, required: true },
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

    //Estados para busqueda aplicada anteriormente, evita una mala paginacion
    const [appliedRecord, setAppliedRecord] = useState("Todos");
    const [appliedField, setAppliedField] = useState(fields[1]?.name || "");
    const [appliedText, setAppliedText] = useState("");

    const getActivesRecords = async (newPage) => {
        try {
            const response = await getRecords(newPage, pageSize);
            setLegalBookRecords(response.data.data);
            setTotalPages(response.data.totalPages || 1);
        } catch (error) {
            const message = error.response?.data?.message || "Error al obtener los registros.";
            ModalAlert("Error", message, "error");
        } finally {
            setLoading(false);
        }
    }

    const getInactiveLogs = async (newPage) => {
        try {
            const response = await getInactivesRecords(newPage, pageSize);
            setLegalBookRecords(response.data.data);
            setTotalPages(response.data.totalPages || 1);
        } catch (error) {
            const message = error.response?.data?.message || "Error al obtener los registros.";
            ModalAlert("Error", message, "error");
        } finally {
            setLoading(false);
        }
    }

    const fetchRecords = async (pageNum = page, filters = {}) => {
        try {
            setLoading(true);
            let response;

            const { book = appliedBook, field = appliedField, text = appliedText } = filters;

            if (text === "Desactivados") {
                response = await getInactivesRecords(pageNum, pageSize);
            } else if ((book === "Todos" && !String(text).trim()) || text === "Activos") {
                response = await getRecords(pageNum, pageSize);
            } else {
                response = await getRecordByFeature(book, field, text, pageNum, pageSize);
            }

            setLegalBookRecords(response.data.data || []);
            setTotalPages(response.data.totalPages || 1);
            setPage(pageNum);
            setError(null);
        } catch (error) {
            setLegalBookRecords([]);
            const message = error.response?.data?.message || "Error al obtener los registros.";
            ModalAlert("Error", message, "error");
        } finally {
            setLoading(false);
        }
    }; 

    // Búsqueda específica
    const handleSearch = async () => {
        //guardar estados antiguos
        setAppliedRecord(selectedBook);
        setAppliedField(searchField);
        setAppliedText(searchText);
        await fetchRecords(1, { book: selectedBook, field: searchField, text: searchText });
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
                await fetchRecords(1, { book: appliedRecord, field: appliedField, text: appliedText });
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
                await fetchRecords(page, { book: appliedRecord, field: appliedField, text: appliedText });
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
                ModalAlert("Éxito", response.data.message || "Registro desactivado.", "success");
                await fetchRecords(1, { book: appliedRecord, field: appliedField, text: appliedText });
                setError(null);
            }
        } catch (error) {
            const message = error.response?.data?.message || "Error al desactivar registro.";
            ModalAlert("Error", message, "error");
            setError(message);
        }
    };

    // Reactivar registros inhabilitados
    const handleReactivate = async (cod_registration_application) => {
        try {
            const response = await reactivateRecord(cod_registration_application);
            if (response.status === 200) {
                ModalAlert("Éxito", response.data.message || "Registro reactivado exitosamente.", "success");
                await fetchRecords(1, { book: appliedRecord, field: appliedField, text: appliedText });
                setError(null);
            }
        } catch (error) {
            const message = error.response?.data?.message || "Error al reactivar registro.";
            ModalAlert("Error", message, "error");
            setError(message);
        }
    };

    // Cargar registros y libros al iniciar
    useEffect(() => {
        getActivesRecords(page)
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

    const handlePageChange = async (newPage) => {
        setPage(newPage);

        //quitar
        if (searchText === "Desactivados") {
            await getInactiveLogs(newPage);
            setError(null);
        }else if( (selectedBook === "Todos" && !String(searchText).trim()) || searchText === "Activos"){
            await getActivesRecords(newPage);
        }else{
            try {
                const response = await getRecordByFeature(appliedRecord, appliedField, appliedText, newPage, pageSize);
                setLegalBookRecords(response.data.data)
            } catch (error) {
                const msg = error.response?.data?.message || "Error al encontrar registro.";
                Swal.fire("Error", msg, "error");
            }
        }
    };

    return {
        books,
        booksItems,
        legalBookRecords,

        page,
        totalPages,
        handlePageChange,

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
        handleReactivate
    };
};
