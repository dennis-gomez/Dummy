import { useState, useEffect } from "react";
import ModalAlert from "../components/molecules/modalAlert";

import {
  getProfilesByPersonId,
  getProfileSummary,
} from "../services/profileService";
import { getPersonal } from "../services/personalService";

import { getSpecializedTrainingPDF } from "../services/specializedTrainingService";

export const useResumeTableLicitation = () => {
  // 📋 Estado general
  const [personal, setPersonal] = useState([]);

  // 🧾 Resumen de perfil (resultado del SP)
  const [profileSummaries, setProfileSummaries] = useState({});

  // 🔄 Paginación
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(2);

  // 🧠 Selección actual
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);

  // ⚙️ Estado de UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Campos base de la persona (para generar cabeceras dinámicas si lo deseas)

  const optionsSignature = [
    { value: true, label: "Sí", name: true, placeholder: "Sí" },
    { value: false, label: "No", name: false, placeholder: "No" },
  ];

  const optionsStatus = [
    { value: true, label: "Activo", name: true, placeholder: "Activo" },
    { value: false, label: "Inactivo", name: false, placeholder: "Inactivo" },
  ];

  const personFields = [
    {
      name: "personal_identification",
      placeholder: "Identificacion/ID",
      required: true,
      width: 382,
    },
    {
      name: "personal_first_name",
      placeholder: "Nombre",
      required: true,
      width: 382,
    },
    {
      name: "personal_last_name_1",
      placeholder: "Primer Apellido",
      required: true,
      width: 382,
    },
    {
      name: "personal_last_name_2",
      placeholder: "Segundo Apellido",
      required: true,
      width: 382,
    },
    {
      name: "personal_birth_date",
      placeholder: "Fecha de Nacimiento",
      required: true,
      type: "date",
      width: 382,
    },
    {
      name: "personal_phone_number",
      placeholder: "Número de Teléfono",
      width: 382,
    },
    {
      name: "personal_country_of_residence",
      placeholder: "País de Residencia",
      width: 382,
    },
    {
      name: "personal_has_digital_signature",
      placeholder: "Firma Digital",
      width: 382,
      type: "select",
      options: optionsSignature,
    },
    {
      name: "personal_is_active",
      placeholder: "Estados",
      type: "select",
      options: optionsStatus,
    },
  ];

  // 📦 Cargar personal y sus perfiles
  const fetchPersonalWithProfiles = async (
    pageNum = page,
    limit = pageSize
  ) => {
    try {
      setLoading(true);

      // 1️⃣ Traer personal
      const resp = await getPersonal(pageNum, limit);
      const personalData = resp.data || [];

      // 2️⃣ Traer perfiles de cada persona en paralelo
      const personalWithProfiles = await Promise.all(
        personalData.map(async (person) => {
          try {
            const profiles = await getProfilesByPersonId(person.personal_cod);
            return { ...person, profiles: profiles || [] };
          } catch (err) {
            console.error(
              `Error cargando perfiles de ${person.personal_cod}`,
              err
            );
            return { ...person, profiles: [] };
          }
        })
      );

      // 3️⃣ Guardar resultados
      setPersonal(personalWithProfiles);
      setTotalPages(resp.totalPages || 1);
      setPage(resp.currentPage || 1);
    } catch (err) {
      console.error(err);
      setError("Error al obtener personal con perfiles");
      ModalAlert("Error", "Error al obtener personal con perfiles", "error");
    } finally {
      setLoading(false);
    }
  };

  // 🎯  Cargar resumen del perfil (llamando al SP)
  const fetchProfileSummary = async (personal_cod, profile_cod) => {
    if (!personal_cod || !profile_cod) return;
    try {
      setLoading(true);
      const data = await getProfileSummary(personal_cod, profile_cod);

      // Guardar por persona
      setProfileSummaries((prev) => ({
        ...prev,
        [personal_cod]: data || {},
      }));

      console.log("✅ Resumen del perfil cargado:", data);
    } catch (err) {
      console.error("Error obteniendo resumen del perfil:", err);
      ModalAlert("Error", "No se pudo obtener el resumen del perfil.", "error");
    } finally {
      setLoading(false);
    }
  };

  const openPDF = async (relativePath) => {
    try {
      console.log("Abriendo PDF desde ruta:", relativePath);
      const pdfBlob = await getSpecializedTrainingPDF(relativePath);
      const pdfUrl = URL.createObjectURL(pdfBlob); // ya es un blob válido
      window.open(pdfUrl, "_blank"); // abre en nueva pestaña
    } catch (error) {
      console.error("Error al abrir el PDF:", error);
    }
  };

  // 🧩 Efecto inicial + recarga cuando cambia la página
  useEffect(() => {
    fetchPersonalWithProfiles(page, pageSize);
  }, [page]);

  return {
    // datos
    personal,
    profileSummaries,

    // selección
    selectedPerson,
    selectedProfile,
    setSelectedPerson,
    setSelectedProfile,

    // paginación
    page,
    totalPages,
    pageSize,
    setPage,
    setPageSize,

    // UI
    loading,
    error,
    personFields,

    // funciones
    fetchPersonalWithProfiles,
    fetchProfileSummary,
    openPDF,
  };
};
