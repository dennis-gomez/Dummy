import { useState, useEffect } from "react";
import {
    getAllPersonnel,
    getFindPersonnel,
    addPersonnel,
    updatePersonnel,
    deletePersonnel,
} from "../services/ohPersonnelServices";
import { getItems } from "../services/itemService";
import ModalAlert from "../components/molecules/modalAlert";

export function useOH_Personnel() {
    const [personnel, setPersonnel] = useState([]);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);

    // 🔹 opciones dinámicas de items (brigadas)
    const [brigadeItems, setBrigadeItems] = useState([]);

    // Campos que puedes usar en formularios y búsquedas
    const fields = [
        { name: "oh_personnel_UID", placeholder: "Cédula", width: 125 },
        { name: "oh_personnel_full_name", placeholder: "Nombre completo", width: 300 },
        { name: "oh_personnel_brigade_item_code", name: "oh_personnel_brigade_item_code", placeholder: "Brigada",  type: "select",  width: 325, options: brigadeItems, },
    ];

    const [searchText, setSearchText] = useState("");
    const [searchFeature, setSearchFeature] = useState(fields[0]?.name || "");

    const fetchData = async () => {
        try {
            const data = await getAllPersonnel();
            setPersonnel(data);
        } catch (err) {
            const message = err.response?.data?.message || "Error al obtener personal.";
            setError(message);
            ModalAlert("Error", message, "error");
        }
    };

    // 🔹 Obtener items por defecto (puedes pasar valores reales de servicio/categoría)
    const fetchItems = async () => {
        try {
            const items = await getItems(5, 1);
            setBrigadeItems(
                items.map((i) => ({
                    name: i.cod_item,
                    placeholder: i.item_name,
                    value: i.cod_item,
                    label: i.item_name,
                    service_cod: i.cod_service,
                    category_cod: i.cod_category,
                }))
            );

        } catch (err) {
            const message = err.response?.data?.message || "Error al obtener items.";
            setError(message);
            ModalAlert("Error", message, "error");
        }
    };


    const handleSearchPersonnel = async (feature, text) => {
        try {
            setLoading(true);
            const data = await getFindPersonnel(feature, text);
            setPersonnel(data);
        } catch (err) {
            const message = err.response?.data?.message || "No se encuentra personal.";
            setError(message);
            ModalAlert("Error", message, "error");
        } finally {
            setLoading(false);
        }
    };


    const handleAdd = async (formData) => {
        try {
            setError(null);

            // 👉 Buscar item completo según el código seleccionado en el combo
            const selectedItem = brigadeItems.find(
                (i) => i.value === formData.oh_personnel_brigade_item_code
            );

            // 👇 Crear un nuevo objeto con todos los campos
            const payload = {
                ...formData,
                ...(selectedItem && {
                    oh_personnel_brigade_service_cod: selectedItem.service_cod,
                    oh_personnel_brigade_category_code: selectedItem.category_cod,
                }),
            };

            await addPersonnel(payload);
            ModalAlert("Éxito", "Personal agregado exitosamente.", "success");
            fetchData();
            setShowForm(false);
        } catch (err) {
            const message = err.response?.data?.message || "Error al agregar personal.";
            setError(message);
            ModalAlert("Error", message, "error");
        }
    };



    const handleEdit = async (cod_personnel, updatedData) => {
        try {
            setError(null);
            await updatePersonnel(cod_personnel, updatedData);
            ModalAlert("Éxito", "Personal actualizado exitosamente.", "success");
            fetchData();
            return true;
        } catch (err) {
            const message = err.response?.data?.message || "Error al actualizar personal.";
            setError(message);
            ModalAlert("Error", message, "error");
            return false;
        }
    };

    const handleDelete = async (cod_personnel) => {
        try {
            await deletePersonnel(cod_personnel);
            ModalAlert("Éxito", "Personal eliminado exitosamente.", "success");
            setPersonnel((prev) => prev.filter((p) => p.cod_personnel !== cod_personnel));
        } catch (err) {
            const message = err.response?.data?.message || "Error al eliminar personal.";
            setError(message);
            ModalAlert("Error", message, "error");
        }
    };

    useEffect(() => {
        fetchData();
        fetchItems(); // 🔹 cargamos las opciones de brigada al montar
    }, []);

    return {
        personnel,
        error,
        showForm,
        setShowForm,
        fields,
        handleAdd,
        handleEdit,
        handleDelete,
        searchText,
        searchFeature,
        setSearchText,
        setSearchFeature,
        setError,
        loading,
        handleSearchPersonnel,
    };
}
