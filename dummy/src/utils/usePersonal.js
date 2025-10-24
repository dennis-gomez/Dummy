import { getPersonal } from "../services/personalService";
import { useState, useEffect } from "react";

export const usePersonal = () => {
    /*
    * Manejo de listado de personal
    */
    const [personal, setPersonal] = useState([]); 
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(5);

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
    const [appliedPersonal, setAppliedPersonal] = useState("Todos");
    const [appliedField, setAppliedField] = useState(fields[1]?.name || "");
    const [appliedText, setAppliedText] = useState("");

    const fetchPersonal = async () => {
        try {
            setLoading(true);
            const resp = await getPersonal();
            setPersonal(resp.data);
        } catch (err) {
            setError("Error al obtener personal");
            ModalAlert("Error", "Error al obtener personal", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPersonal();
    }, []);

    return {
        personal, 
    
        fields,
        editFields,

        loading,
        error,
        showForm,
        setShowForm,
    }
}