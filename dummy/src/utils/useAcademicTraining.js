import { useState, useEffect } from "react";
import { addAcademicTrainings, getAcademicTrainings, updateAcademicTrainings } from "../services/academicTrainingService"
import ModalAlert from "../components/molecules/modalAlert";
import Swal from "sweetalert2";
import { getItems } from "../services/itemService";

export const useAcademicTraining = ( personCod ) => {
    const [academicTrainings, setAcademicTrainings] = useState([]); //lista de fromaciones academicas
    const [titlesTypes, setTitlesTypes] = useState([]); //listado de titulo o grados academicas

    /*
    * Estados para manejo de formularios (muestra, errores y carga)
    */
    const [showFormAcademicTraining, setShowFormAcademicTraining] = useState(false);
    const [errorAcademicTraining, setErrorAcademicTraining] = useState(null);
    const [isLoadingAcademicTraining, setLoadingAcademicTraining] = useState(false);

    /*
    * Fields de manejo de formularios dinamicos
    */
    const fieldsAcademicTraining = [
        { name: "academic_training_title_item_code", placeholder: "Título Obtenido", required: true, type: "select", options: titlesTypes, width: 390},
        { name: "academic_training_carrer", placeholder: "Carrera", required: true, width: 390, validations: [(value) => value && value.length > 50 ? "La carrera no debe superar 50 caracteres." : null,]},
        { name: "academic_training_institution", placeholder: "Institución", required: true, width: 390, validations: [(value) => value && value.length > 50 ? "La institución no debe superar 50 caracteres." : null,]},

        { name: "academic_training_start_date", placeholder: "Fecha Inico", type: "date", restriction: "cantAfterToday", width: 390, 
            validations: [
                (value, allValues) => {
                    console.log("intento", allValues.academic_training_end_date)
                    if (value && allValues.academic_training_end_date && new Date(value) > new Date(allValues.academic_training_end_date)) {
                        
                        return "La fecha de inicio debe ser menor a la fecha final.";
                    }
                    if (value && allValues.academic_training_date_obtaining && new Date(value) > new Date(allValues.academic_training_date_obtaining)) {
                        return "La fecha de inicio debe ser menor a la fecha de obtención.";
                    }
                    return null;
                }
            ]
        }, 
        { name: "academic_training_end_date", placeholder: "Fecha Final", required: true, type: "date", width: 390, restriction: "cantAfterToday", 
            validations: [
                (value, allValues) => {
                    if (value && allValues.academic_training_start_date && new Date(value) < new Date(allValues.academic_training_start_date)) {
                    return "La fecha final debe ser mayor a la fecha de inicio.";
                    }
                    if (value && allValues.academic_training_date_obtaining && new Date(value) > new Date(allValues.academic_training_date_obtaining)) {
                    return "La fecha final debe ser menor a la fecha de obtención.";
                    }
                    return null;
                }
            ]
        },
        { name: "academic_training_date_obtaining", placeholder: "Fecha Obtención de Título", required: false, type: "date", width: 390, restriction: "cantAfterToday", 
            validations: [
                (value, allValues) => {
                    if (value && allValues.academic_training_start_date && new Date(value) < new Date(allValues.academic_training_start_date)) {
                    return "La fecha de obtención debe ser mayor a la fecha de inicio.";
                    }
                    if (value && allValues.academic_training_end_date && new Date(value) < new Date(allValues.academic_training_end_date)) {
                    return "La fecha de obtención debe ser mayor a la fecha final.";
                    }
                    return null;
                }
            ]
        },
        {
            name: "academic_training_pdf_path",
            label: "Título (PDF)",
            type: "file",
            grid: 6,
            placeholder: "Subir PDF",
            required: false,
            width: 796,
        },
    ];

    /*
    * Fields de manejo de formularios edicion
    */
    const editFieldsAcademicTraining = [
        { name: "academic_training_title_item_code", placeholder: "Título Obtenido", required: true, type: "select", options: titlesTypes, width: 190},
        { name: "academic_training_carrer", placeholder: "Carrera", required: true, width: 290, validations: [(value) => value && value.length > 50 ? "La carrera no debe superar 50 caracteres." : null,]},
        { name: "academic_training_institution", placeholder: "Institución", required: true, width: 290, validations: [(value) => value && value.length > 50 ? "La institución no debe superar 50 caracteres." : null,]},
        { name: "academic_training_start_date", placeholder: "Fecha Inico", type: "date", restriction: "cantAfterToday", width: 190, 
            validations: [
                (value, allValues) => {
                    console.log("intento", allValues.academic_training_end_date)
                    if (value && allValues.academic_training_end_date && new Date(value) > new Date(allValues.academic_training_end_date)) {
                        
                        return "La fecha de inicio debe ser menor a la fecha final.";
                    }
                    if (value && allValues.academic_training_date_obtaining && new Date(value) > new Date(allValues.academic_training_date_obtaining)) {
                        return "La fecha de inicio debe ser menor a la fecha de obtención.";
                    }
                    return null;
                }
            ]
        }, 
        { name: "academic_training_end_date", placeholder: "Fecha Final", required: true, type: "date", width: 190, restriction: "cantAfterToday", 
            validations: [
                (value, allValues) => {
                    if (value && allValues.academic_training_start_date && new Date(value) < new Date(allValues.academic_training_start_date)) {
                    return "La fecha final debe ser mayor a la fecha de inicio.";
                    }
                    if (value && allValues.academic_training_date_obtaining && new Date(value) > new Date(allValues.academic_training_date_obtaining)) {
                    return "La fecha final debe ser menor a la fecha de obtención.";
                    }
                    return null;
                }
            ]
        },
        { name: "academic_training_date_obtaining", placeholder: "Fecha Obtención de Título", required: false, type: "date", width: 190, restriction: "cantAfterToday", 
            validations: [
                (value, allValues) => {
                    if (value && allValues.academic_training_start_date && new Date(value) < new Date(allValues.academic_training_start_date)) {
                    return "La fecha de obtención debe ser mayor a la fecha de inicio.";
                    }
                    if (value && allValues.academic_training_end_date && new Date(value) < new Date(allValues.academic_training_end_date)) {
                    return "La fecha de obtención debe ser mayor a la fecha final.";
                    }
                    return null;
                }
            ]
        },
        {
            name: "academic_training_pdf_path",
            label: "Título (PDF)",
            type: "file",
            grid: 6,
            required: false,
            width: 250,
        },
    ];
    
    /*
     *  Obtener listado de formaciones academicas 
    */
    const fetchTitles = async () => {
        try {
            const typesResp = await getItems(
                Number(import.meta.env.VITE_ROLE_SERVICE_CODE), //cambiar
                Number(import.meta.env.VITE_ACADEMIC_GRADE_CATEGORY_CODE) //cambiar
            );
            setTitlesTypes(typesResp.map(type => ({ value: type.cod_item, label: type.item_name })));
        } catch (err) {
            setErrorAcademicTraining("Error al obtener titulos");
            ModalAlert("Error", "Error al obtener titulos", "error");
            return [];
        }
    };

    /*
     *  Obtener listado de formaciones academicas 
    */
    const fetchAcademicTrainings = async (personCod) => {
        try {
            setLoadingAcademicTraining(true);
            const resp = await getAcademicTrainings(personCod);
            setAcademicTrainings(resp);
        } catch (err) {
            setErrorAcademicTraining("Error al obtener formaciones académicas");
            ModalAlert("Error", "Error al obtener formaciones académicas", "error");
        } finally {
            setLoadingAcademicTraining(false);
        }
    };

    /*
     *  Agregar fromacion academica 
    */
    const handleSubmitAcademicTraining = async (formData) => {
        try {
            setLoadingAcademicTraining(true);

            const dataToSend = {
                ...formData,
                personal_cod: Number(personCod.personCod),
                academic_training_title_service_code: Number(import.meta.env.VITE_ROLE_SERVICE_CODE), 
                academic_training_title_category_code: Number(import.meta.env.VITE_ACADEMIC_GRADE_CATEGORY_CODE),
                academic_training_date_obtaining: formData.academic_training_date_obtaining === "" ? null : formData.academic_training_date_obtaining
            };

            const response = await addAcademicTrainings(dataToSend);

            if (response.status === 201) {
                Swal.fire("Éxito", "Formacion académica agregado exitosamente.", "success");
                await fetchAcademicTrainings(personCod.personCod);
                setShowFormAcademicTraining(false);
                setErrorAcademicTraining(null);
            }
        } catch (err) {
            const msg = err.response?.data?.message || "Error al agregar formacion académica.";
            Swal.fire("Error", msg, "error");
            setErrorAcademicTraining(msg);
        } finally {
            setLoadingAcademicTraining(false);
        }
    };

    /*
     * Edicion de formacion academica 
    */
    const handleEditAcademicTraining = async (updatedData) => {
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
            setLoadingAcademicTraining(true);
            const response = await updateAcademicTrainings(updatedData);
            if (response.status === 200) {
                Swal.fire("Actualizado", "Formacion académica editado exitosamente.", "success");
                await fetchAcademicTrainings(personCod.personCod);
                setErrorAcademicTraining(null);
            }
            return true;
        } catch (err) {
            const msg = err.response?.data?.message || "Error al editar.";
            Swal.fire("Error", msg, "error");
            setErrorAcademicTraining(msg);
            return false;
        } finally {
            setLoadingAcademicTraining(false);
        }
    };

    useEffect(() => {
        fetchTitles();
        fetchAcademicTrainings(personCod.personCod);
    }, []);

    return {
        academicTrainings, 
        titlesTypes,

        fieldsAcademicTraining, 
        editFieldsAcademicTraining, 
        errorAcademicTraining,
        setErrorAcademicTraining,

        showFormAcademicTraining, 
        setShowFormAcademicTraining, 

        isLoadingAcademicTraining, 

        handleSubmitAcademicTraining, 
        handleEditAcademicTraining, 
    }
}