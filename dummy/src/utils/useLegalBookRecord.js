import { useEffect, useState } from "react";
import { addRecord, getRecords, updateRecord, deleteRecord, getRecordByFeature } from "../services/legalBookRecordService";
import ModalAlert from "../components/molecules/modalAlert";

export const useLegalBookRecord = () => {
    const [legalBookRecords, setLegalBookRecords] = useState([]); //listado de registros
    const [showForm, setShowForm] = useState(false); // estado (true/false) para mostrar formulario
    const [error, setError] = useState(null); // manejo de errores por parte del backend

    const [loading, setLoading] = useState(false); // manejo de loading al encontrar registros

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

    const [searchText, setSearchText] = useState(""); //manejo de text para buscar registros
    const [searchFeature, setSearchFeature] = useState(fields[0]?.name || ""); //manejo de caracteristica para buscar registros

    // listado de registros
    const fetchRecords = async () => {
        try {
            //const response = 
            await getRecords();
            //setLegalBookRecords(response.data);
        } catch (error) {
            const message = error.response?.data?.message || "Error al obtener los registros.";
            setError(message);
        }
    }

    const handleSearchRecord = async (feature, text) => {
        try {
            setLoading(true);
            //const response = 
            await getRecordByFeature(feature, text);
            //setLegalBookRecords(response.data);
        } catch (error) {
            const message = error.response?.data?.message || "No se encuentra registro.";
            ModalAlert("Error", message, "error");
        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = async (formData) => {
        try {
            setError(null);
            //const response = 
            await addRecord(formData);
            //if (response.status === 201) {
            //    ModalAlert("Éxito", "Vehículo agregado exitosamente.", "success");
            //    fetchRecords();
            //    setShowForm(false);
            //}
        } catch (error) {
            const message = error.response?.data?.message || "Error al agregar vehículo.";
            ModalAlert("Error", message, "error");
            setError(message);
        }
    }

    const handleEdit = async (updatedData) => {
        try {
            setError(null);
            //const response = 
            await updateRecord(updatedData);
            //if (response.status === 200) {
            //    ModalAlert("Éxito", "Vehículo editado exitosamente.", "success");
            //    fetchRecords();
            //}
            return true;
        } catch (error) {
            const message = error.response?.data?.message || "Error al editar vehículo.";
            ModalAlert("Error", message, "error");
            setError(message);
            return false;
        }
    }

    const handleDelete = async (id) => {
        try {
            //const response = 
            await deleteRecord(id);
            //if (response.status === 200) {
            //    ModalAlert("Éxito", response.data.message, "success");
            //    fetchRecords();
            //}
        } catch (error) {
            const message = error.response?.data?.message || "Error al eliminar vehículo.";
            ModalAlert("Error", message, "error");
        }
    }

    useEffect(() => {
        fetchRecords();
    }, []);

    return {
        legalBookRecords,
        fields, 
        searchText,
        searchFeature, 
        setSearchText,
        setSearchFeature,
        showForm,
        setShowForm,
        error,
        setError,
        loading, 
        handleSubmit,
        handleEdit,
        handleDelete,
        handleSearchRecord,
    };
};