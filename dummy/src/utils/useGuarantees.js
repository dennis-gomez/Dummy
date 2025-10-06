import { useState, useEffect } from "react";
import ModalAlert from "../components/molecules/modalAlert";
import { getItems } from "../services/itemService";
import {
  addGuarantee,
  deleteGuarantee,
  findGuarantees,
  getAllGuarantees,
  getGuaranteeById,
  getGuaranteesResume,
  updateGuarantee
} from "../services/guaranteeService";

export const useGuarantees = () => {

  const STATUS_OPTIONS = [
    { label: "Activa", value: 1 },
    { label: "Vencida", value: 2 },
    { label: "Próxima a vencer", value: 3 },
  ];

  const CURRENCY_OPTIONS = [
    { label: "USD", value: 1 },
    { label: "CRC", value: 2 },
  ];

  const CATEGORY_OPTIONS = [
    { label: "Bancaria", value: "Bancaria" },
    { label: "Efectivo", value: "Efectivo" },
  ];

  const [guaranteesList, setGuaranteesList] = useState([]);
  const [selectedGuaranteeId, setSelectedGuaranteeId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [entityItems, setEntityItems] = useState([]);
  const [applicantItems, setApplicantItems] = useState([]);
  const [alertItems, setAlertItems] = useState([]);
  const [resumeData, setResumeData] = useState([]);
  const [isCreatingGuarantee, setIsCreatingGuarantee] = useState(false);

  const resumeFields = [
    { name: "entidad", label: "Entidad" },
    { name: "activas", label: "Activas" },
    { name: "vencidas", label: "Vencidas" },
    { name: "proximas_a_vencer", label: "Próximas a vencer" },
    { name: "dinero_activo", label: "Dinero Activo" },
    { name: "dinero_pendiente", label: "Dinero Pendiente" },
    { name: "dinero_activo_usd", label: "Dinero Activo USD" },
    { name: "dinero_pendiente_usd", label: "Dinero Pendiente USD" },
  ];

  const fields = [
    { name: "cod_guarantee", label: "Código", type: "text", editable: false, grid: 4, width: 200 },

{ name: "guarantee_entity_item_code", placeholder: "Entidad", label: "Entidad", type: "select", editable: true, grid: 4, width: 150, options: entityItems },
{ name: "guarantee_applicant_item_code", placeholder: "Solicitante", label: "Solicitante", type: "select", editable: true, grid: 4, width: 150, options: applicantItems },
{ name: "guarantee_number", placeholder: "Número", label: "Número", type: "text", editable: true, grid: 4, width: 225 },
{ name: "guarantee_type", placeholder: "Tipo", label: "Tipo", type: "text", editable: true, grid: 4, width: 225 },



{ name: "guarantee_issue_date", placeholder: "Fecha de Emisión", label: "Fecha de Emisión", type: "date", editable: true, restriction:"cantAfterToday", grid: 4, width: 150 },
{ name: "guarantee_expiration_date", placeholder: "Fecha de Expiración", label: "Fecha de Expiración", type: "date", editable: true, grid: 4, width: 150 },
{ name: "guarantee_procedure", placeholder: "Procedimiento", label: "Procedimiento", type: "text", editable: true, grid: 4, width: 225 },
{ name: "guarantee_email_contact_alert", placeholder: "Email de alerta", label: "Email de alerta", type: "email", editable: true, grid: 4, width: 225 },


{ name: "guarantee_currency", placeholder: "Moneda", label: "Moneda", type: "select", editable: true, grid: 4, width: 150, options: CURRENCY_OPTIONS },
{ name: "guarantee_alert_time_item_code", placeholder: "Alerta", label: "Alerta", type: "select", editable: true, grid: 4, width: 150, options: alertItems },
{ name: "guarantee_amount", placeholder: "Monto", label: "Monto", type: "number", editable: true, grid: 4, width: 225 },
{ name: "guarantee_status", placeholder: "Estado", label: "Estado", type: "select", editable: true, grid: 4, width: 225, options: STATUS_OPTIONS },
{ name: "guarantee_category", placeholder: "Categoría", label: "Categoría", type: "select", editable: true, grid: 4, width: 225, options: CATEGORY_OPTIONS },


{ name: "guarantee_beneficiary", placeholder: "Beneficiario", label: "Beneficiario", type: "textarea", editable: true, grid: 4, width: 800 }, // 49rem ≈ 784px
 
  ];

  // Campos buscables dinámicos
  const entityOptionsForSelect = entityItems.map(opt => ({ name: opt.value, placeholder: opt.label }));
  const applicantOptionsForSelect = applicantItems.map(opt => ({ name: opt.value, placeholder: opt.label }));
  const alertOptionsForSelect = alertItems.map(opt => ({ name: opt.value, placeholder: opt.label }));

  const searchFields = fields
    .filter(f => f.name !== "cod_guarantee" && f.name !== "guarantee_entity_service_code" && f.name !== "guarantee_entity_category_code"
      && f.name !== "guarantee_applicant_service_code" && f.name !== "guarantee_applicant_category_code"
      && f.name !== "guarantee_alert_time_service_code" && f.name !== "guarantee_alert_time_category_code")
    .map(f => ({
      name: f.name,
      placeholder: f.label,
      type: f.type,
      options: f.name === "guarantee_entity_item_code" ? entityOptionsForSelect :
               f.name === "guarantee_applicant_item_code" ? applicantOptionsForSelect :
               f.name === "guarantee_alert_time_item_code" ? alertOptionsForSelect :
               f.options?.map(o => ({ name: o.value, placeholder: o.label })) || []
    }));

  // Funciones fetch, add, edit, delete, search (igual que tu código original)
  const fetchGuarantees = async () => {
    try {
      setLoading(true);
      const resp = await getAllGuarantees();
      setGuaranteesList(resp.data || resp || []);
    } catch (err) {
      setError("Error al obtener garantías");
      ModalAlert("Error", "Error al obtener garantías", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchItems = async () => {
    try {
      const entity = await getItems(7, 1);
      const applicant = await getItems(7, 2);
      const alert = await getItems(7, 3);

      setEntityItems(entity.map(e => ({ label: e.item_name, value: e.cod_item })));
      setApplicantItems(applicant.map(a => ({ label: a.item_name, value: a.cod_item })));
      setAlertItems(alert.map(a => ({ label: a.item_name, value: a.cod_item })));
    } catch (err) {
      ModalAlert("Error", "Error al obtener items", "error");
    }
  };

const handleSearchGuarantees = async (feature, text) => {
  try {
    setLoading(true);

    // Convierte a string para evitar errores
    const searchText = String(text || "").trim();

    if (!searchText) {
      fetchGuarantees();
      return;
    }

    const resp = await findGuarantees(feature, searchText);

    if (!resp || resp.length === 0) {
      // No se encontraron garantías
      ModalAlert("Información", "No se encontraron garantías con ese término", "info");
      return; // No actualiza la lista
    }

    // Solo actualiza si hay resultados
    setGuaranteesList(resp);

  } catch (err) {
    ModalAlert("Error", "Error al buscar garantías", "error");
  } finally {
    setLoading(false);
  }
};

const handleAddGuarantee = async (formData) => {
  const { cod_guarantee, guarantee_status, ...rest } = formData; // quitamos si acaso vienen del formulario
  const dataToSend = {
    ...rest,

    // Garantías → todos los service_code = 7
    guarantee_entity_service_code: Number(import.meta.env.VITE_GUARANTEE_SERVICE_CODE),
    guarantee_applicant_service_code: Number(import.meta.env.VITE_GUARANTEE_SERVICE_CODE),
    guarantee_alert_time_service_code: Number(import.meta.env.VITE_GUARANTEE_SERVICE_CODE),

    // Categorías
    guarantee_entity_category_code: Number(import.meta.env.VITE_GUARANTEE_ENTITY_CATEGORY_CODE),
    guarantee_applicant_category_code: Number(import.meta.env.VITE_GUARANTEE_APPLICANT_CATEGORY_CODE),
    guarantee_alert_time_category_code: Number(import.meta.env.VITE_GUARANTEE_ALERT_TIME_CATEGORY_CODE),

    // Flags
    guarantee_is_notified: 0,
  };

  try {
    await addGuarantee(dataToSend);
    ModalAlert("Éxito", "Garantía agregada exitosamente", "success");
    setIsCreatingGuarantee(false);
    fetchGuarantees();
  } catch (err) {
    ModalAlert("Error", "Error al agregar garantía", "error");
  }
};


  const handleEditGuarantee = async (id, formData) => {
    try {

    formData = { ...formData, guarantee_is_notified: 0 }; // reset notificación al editar


      const resp = await updateGuarantee(id, formData);
      ModalAlert("Éxito", "Garantía actualizada exitosamente", "success");
      fetchGuarantees();
    } catch (err) {
      const message = err.response?.data?.message || "Error al actualizar garantía";
      ModalAlert("Error", message, "error");
    }
  };

  const handleDeleteGuarantee = async (id) => {
    try {
      const resp = await deleteGuarantee(id);
      ModalAlert("Éxito", "Garantía eliminada exitosamente", "success");
      fetchGuarantees();
    } catch (err) {
      const message = err.response?.data?.message || "Error al eliminar garantía";
      ModalAlert("Error", message, "error");
    }
  };

  const fetchGuaranteesResumeData = async () => {
    try {
      const resp = await getGuaranteesResume();
      const data = resp || [];
      setResumeData(data);
      return data;
    } catch (err) {
      ModalAlert("Error", "Error al obtener resumen de garantías", "error");
      return [];
    }
  };

  useEffect(() => {
    fetchGuarantees();
    fetchItems();
    fetchGuaranteesResumeData();
  }, []);

  return {
    guaranteesList,
    selectedGuaranteeId,
    setSelectedGuaranteeId,
    loading,
    error,
    fields,
    searchFields,          // <- exportamos campos buscables
    fetchGuarantees,
    handleAddGuarantee,
    handleEditGuarantee,
    handleDeleteGuarantee,
    handleSearchGuarantees,
    fetchGuaranteesResume: fetchGuaranteesResumeData,
    entityItems,
    applicantItems,
    alertItems,
    resumeData,
    STATUS_OPTIONS,
    CURRENCY_OPTIONS,
    CATEGORY_OPTIONS,
    resumeFields,
    entityOptionsForSelect,
    applicantOptionsForSelect,
    alertOptionsForSelect,
    isCreatingGuarantee,
    setIsCreatingGuarantee,
  };
};
