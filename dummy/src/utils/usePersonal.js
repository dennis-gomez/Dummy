import { addPersonal, deletePersonal, findPersonal, getPersonal, reactivatePersonal, updatePersonal, getPersonalToValidate } from "../services/personalService";
import { useState, useEffect } from "react";
import ModalAlert from "../components/molecules/modalAlert";
import Swal from "sweetalert2";

export const usePersonal = () => {
    /*
    * Manejo de listado de personal
    */
    const [personal, setPersonal] = useState([]); 
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(2);

    /*
    * Manejo de listado de personal completo, para manejo de validacion de indentificacion
    */
    const [allPersonal, setAllPersonal] = useState([]); 

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
        { name: "personal_identification", placeholder: "Identificacion/ID", required: true, width: 382, restriction: "unique"},
        { name: "personal_first_name", placeholder: "Primer Nombre", required: true, width: 382, validations: [(value) => value && value.length > 50 ? "El nombre no debe superar 50 caracteres." : null,]},
        { name: "personal_last_name_1", placeholder: "Primer Apellido", required: true, width: 382, validations: [(value) => value && value.length > 50 ? "El primer apellido no debe superar 50 caracteres." : null,]},
        { name: "personal_last_name_2", placeholder: "Segundo Apellido", required: true, width: 382, validations: [(value) => value && value.length > 50 ? "El segundo apellido no debe superar 50 caracteres." : null,]},
        { name: "personal_birth_date", placeholder: "Fecha de Nacimiento", required: true, type: "date", width: 382, restriction:"cantAfterToday"},
        { name: "personal_country_of_residence", placeholder: "País de Origen", width: 382, validations: [(value) => value && value.length > 15 ? "El país de origen no debe superar 15 caracteres." : null,]},
        { name: "personal_has_digital_signature", placeholder: "Firma Digital", width: 382, type: "select",
            options: [
                { name: 1, placeholder: "Si" , value: 1, label: "Si"},
                { name: 0, placeholder: "No", value: 0, label: "No" }
            ]
        },
        { name: "personal_phone_number", placeholder: "Número de Teléfono", width: 382, validations: [(value) => value && value.length > 20 ? "El número de teléfono de te no debe superar 20 caracteres." : null,] },
        { name: "personal_is_active", placeholder: "Estados",  type: "select",
            options: [
                { name: 1, placeholder: "Activos" , value: 1, label: "Activos"},
                { name: 0, placeholder: "Desactivados", value: 0, label: "Desactivados" }
            ]
        }, 
    ];

    /*
    * Fields de manejo de formularios edicion
    */
    const editFields = [
        { name: "personal_identification", placeholder: "Identificacion/ID", required: true, width: 170, restriction: "unique"},
        { name: "personal_first_name", placeholder: "Primer Nombre", required: true, width: 170, validations: [(value) => value && value.length > 50 ? "El nombre no debe superar 50 caracteres." : null,]},
        { name: "personal_last_name_1", placeholder: "Primer Apellido", required: true, width: 170, validations: [(value) => value && value.length > 50 ? "El primer apellido no debe superar 50 caracteres." : null,]},
        { name: "personal_last_name_2", placeholder: "Segundo Apellido", required: true, width: 170, validations: [(value) => value && value.length > 50 ? "El segundo apellido no debe superar 50 caracteres." : null,]},
        { name: "personal_birth_date", placeholder: "Fecha de Nacimiento", required: true, type: "date", width: 170, restriction:"cantAfterToday"},
        { name: "personal_country_of_residence", placeholder: "País de Origen", width: 170, validations: [(value) => value && value.length > 15 ? "El país de origen no debe superar 15 caracteres." : null,]},
        { name: "personal_has_digital_signature", placeholder: "Firma Digital", width: 170, type: "select",
            options: [
                { name: 1, placeholder: "Si" , value: 1, label: "Si"},
                { name: 0, placeholder: "No", value: 0, label: "No" }
            ]
        },
        { name: "personal_phone_number", placeholder: "Número de Teléfono", width: 170, validations: [(value) => value && value.length > 20 ? "El número de teléfono de te no debe superar 20 caracteres." : null,]},  
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
            await fetchAllPersonal();
        } catch (err) {
            setError("Error al obtener personal");
            ModalAlert("Error", "Error al obtener personal", "error");
        } finally {
            setLoading(false);
        }
    };

    const fetchAllPersonal = async () => {
        try {
            setLoading(true);
            const resp = await getPersonalToValidate();
            setAllPersonal(resp);
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

    const handleDelete = async (id) => {
        try {
            setLoading(true);
            const response = await deletePersonal(id);
            if (response.status === 200) {
                ModalAlert("Éxito", response.data.message || "Persona desactivado exitosamente.", "success");
                await fetchPersonal(1, pageSize);
                setError(null);
            }
        } catch (err) {
            const msg = err.response?.data?.message || "Error al desactivar personal.";
            ModalAlert("Error", msg, "error");
        } finally {
            setLoading(false);
        }
    };

    const handleReactivate = async (id) => {
        try {
            setLoading(true);
            const response = await reactivatePersonal(id);
            if (response.status === 200) {
                ModalAlert("Éxito", response.data.message || "Persona reactivada exitosamente.", "success");
                await fetchPersonal(1, pageSize);
                setIsFiltering(false);
                setAppliedText(true); // cambiar esto, hay que poner en blanco
                setError(null);
            }
        } catch (error) {
            const message = error.response?.data?.message || "Error al reactivar persona.";
            ModalAlert("Error", message, "error");
            setError(message);
        }
    };

    /*
    *
    */
    const handleEdit = async (updatedData) => {
        const confirm = await Swal.fire({
            title: "¿Guardar cambios?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, guardar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#2563eb",
            cancelButtonColor: "#9ca3af",
        });
    
        if (!confirm.isConfirmed) return false;
    
        try {
            setLoading(true);
            const response = await updatePersonal(updatedData);
            if (response.status === 200) {
                Swal.fire("Actualizado", "Personal editado exitosamente.", "success");
                await fetchPersonal(1, pageSize);
                setError(null);
            }
            return true;
        } catch (err) {
            const msg = err.response?.data?.message || "Error al editar.";
            Swal.fire("Error", msg, "error");
            setError(msg);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (formData) => {
        try {
            setLoading(true);
            const response = await addPersonal(formData);
            if (response.status === 201) {
                Swal.fire("Éxito", "Personal agregado exitosamente.", "success");
                await fetchPersonal();
                setShowForm(false);
                setError(null);
            }
        } catch (err) {
            const msg = err.response?.data?.message || "Error al agregar personal.";
            Swal.fire("Error", msg, "error");
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPersonal(1, pageSize);
    }, []);

    return {
        personal, 
        allPersonal, 
    
        fields,
        editFields,

        loading,
        error,
        setError,
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

        handleDelete, 
        handleReactivate, 
        handleEdit, 
        handleSubmit, 
    }
}