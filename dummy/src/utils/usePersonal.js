import { findPersonal, getPersonal } from "../services/personalService";
import { useState, useEffect } from "react";
import ModalAlert from "../components/molecules/modalAlert";

export const usePersonal = () => {
    /*
    * Manejo de listado de personal
    */
    const [personal, setPersonal] = useState([]); 
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(2);

    /*
    * Estados para manejo de formularios (muestra, errores y carga)
    */
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    /*
    * Fields de manejo de formularios dinamicos
    */
    const fields = [
        { name: "personal_identification", placeholder: "Identificacion/ID", required: true, width: 780},
        { name: "personal_first_name", placeholder: "Primer Nombre", required: true, width: 780},
        { name: "personal_last_name_1", placeholder: "Primer Apellido", required: true, width: 382},
        { name: "personal_last_name_2", placeholder: "Segundo Apellido", required: true, width: 382},
        { name: "personal_birth_date", placeholder: "Fecha de Nacimiento", required: true, type: "date", width: 382},
        { name: "personal_country_of_residence", placeholder: "País de Residencia", width: 250},
        { name: "personal_has_digital_signature", placeholder: "Firma Digital", width: 250},
        { name: "personal_phone_number", placeholder: "Número de Teléfono", width: 250}, 
    ];

    const editFields = [
        { name: "personal_identification", placeholder: "Identificacion/ID", required: true, width: 780},
        { name: "personal_first_name", placeholder: "Primer Nombre", required: true, width: 780},
        { name: "personal_last_name_1", placeholder: "Primer Apellido", required: true, width: 382},
        { name: "personal_last_name_2", placeholder: "Segundo Apellido", required: true, width: 382},
        { name: "personal_birth_date", placeholder: "Fecha de Nacimiento", required: true, type: "date", width: 382},
        { name: "personal_country_of_residence", placeholder: "País de Residencia", width: 250},
        { name: "personal_has_digital_signature", placeholder: "Firma Digital", width: 250},
        { name: "personal_phone_number", placeholder: "Número de Teléfono", width: 250}, 
    ];

    /*
    * Manejo de historial para evitar busqueda con la paginacion
    */
    const [appliedField, setAppliedField] = useState(fields[1]?.name || "");
    const [appliedText, setAppliedText] = useState("");
    const [isFiltering, setIsFiltering] = useState(false);

    /*
    * Constantes para el manejo de filtrado
    */
    const [searchText, setSearchText] = useState("");
    const [searchField, setSearchField] = useState(fields[0]?.name || "");

    const fetchPersonal = async (pageNum = page, limit = pageSize) => {
        try {
            setLoading(true);
            const resp = await getPersonal(pageNum, limit);
            setPersonal(resp.data);
            setTotalPages(resp.totalPages || 1);
            setPage(resp.currentPage || 1);
        } catch (err) {
            setError("Error al obtener personal");
            ModalAlert("Error", "Error al obtener personal", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        try {
            setLoading(true);
            setAppliedField(searchField);
            setAppliedText(searchText);
            setIsFiltering(true);

            const resp = await findPersonal(1, pageSize, searchField, searchText);

            setPersonal(resp.data || []);
            setTotalPages(resp.totalPages || 1);
            setPage(resp.currentPage || 1);
            setError(null);
        } catch (err) {
            const msg = err.response?.data?.message || "Error al buscar personal.";
            ModalAlert("Error", msg, "error");
        } finally {
            setLoading(false);
        }
    };

    const findAndSetFiltered = async (pageNum = 1) => {
        try {
            setLoading(true);
            const resp = await findPersonal(pageNum, pageSize, appliedField, appliedText);
            setPersonal(resp.data || []);
            setTotalPages(resp.totalPages || 1);
            setPage(resp.currentPage || 1);
        } catch (err) {
            ModalAlert("Error", "Error al buscar personal", "error");
        } finally {
            setLoading(false);
        }
    };

    const onPageChange = async (newPage) => {
        if (isFiltering) {
            await findAndSetFiltered(newPage);
        } else {
            await fetchPersonal(newPage, pageSize);
        }
    };

    useEffect(() => {
        fetchPersonal(1, 2);
    }, []);

    return {
        personal, 
    
        fields,
        editFields,

        loading,
        error,
        showForm,
        setShowForm,

        totalPages, 
        page, 
        onPageChange, 

        searchText, 
        searchField,
        setSearchText, 
        setSearchField,
        handleSearch, 
    }
}