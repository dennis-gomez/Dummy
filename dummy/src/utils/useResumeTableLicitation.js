import { useState, useEffect } from "react";
import ModalAlert from "../components/molecules/modalAlert";


import { getProfilesByPersonId } from "../services/profileService";
import { getSpecializedTrainingByProfileId } from "../services/specializedTrainingService";
import { findPersonal, getPersonal} from "../services/personalService";
import { getItems } from "../services/itemService";



export const useResumeTableLicitation = () => {

    //  Manejo de listado de personal en resumen de licitacion
    const [personal, setPersonal] = useState([]); 
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(2);

    // Manejo de perfiles
    const [profiles, setProfiles] = useState([]);
    const [selectedProfile, setSelectedProfile] = useState(null);

    // Estados para manejo de formularios (muestra, errores y carga)
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const personFields = [
        { name: "personal_identification", placeholder: "Identificacion/ID", required: true, width: 382},
        { name: "personal_first_name", placeholder: "Primer Nombre", required: true, width: 382},
        { name: "personal_last_name_1", placeholder: "Primer Apellido", required: true, width: 382},
        { name: "personal_last_name_2", placeholder: "Segundo Apellido", required: true, width: 382},
        { name: "personal_birth_date", placeholder: "Fecha de Nacimiento", required: true, type: "date", width: 382, restriction:"cantAfterToday"},
        { name: "personal_country_of_residence", placeholder: "País de Residencia", width: 382},
        { name: "personal_has_digital_signature", placeholder: "Firma Digital", width: 382, type: "select",
            options: [
                { name: 1, placeholder: "Si" , value: 1, label: "Si"},
                { name: 0, placeholder: "No", value: 0, label: "No" }
            ]
        },
        { name: "personal_phone_number", placeholder: "Número de Teléfono", width: 382},
        { name: "personal_is_active", placeholder: "Estados",  type: "select",
            options: [
                { name: 1, placeholder: "Activos" , value: 1, label: "Activos"},
                { name: 0, placeholder: "Desactivados", value: 0, label: "Desactivados" }
            ]
        }, 
    ];

    


}