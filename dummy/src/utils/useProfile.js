import { useState, useEffect } from "react";
import {
  getProfilesByPersonId,
  getAvailableRoles,
  createProfile,
  deleteProfile,
} from "../services/profileService";
import ModalAlert from "../components/molecules/modalAlert";
import { getItems } from "../services/itemService";
import {
  getSpecializedTrainingByProfileId,
  addSpecializedTraining,
  getSpecializedTrainingPDF,
  updateSpecializedTraining,
  searchSpecializedTraining,
} from "../services/specializedTrainingService";

export const useProfile = () => {
  const [optionsRoles, setOptionsRoles] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [seeOptions, setSeeOptions] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isAddingProfile, setIsAddingProfile] = useState(false);
  const [avaliableRoles, setAvailableRoles] = useState([]);
  const [seeSpecializedTraining, setSeeSpecializedTraining] = useState(false);
  const [seeProjectExperience, setSeeProjectExperience] = useState(false);

  const handleProfileSelect = (profile, value) => {
    setSeeOptions(value);

    if (value) {
      setSelectedProfile(profile);
      fetchedProfileSpecializedTraining(profile.profile_cod, 1);
      console.log("Perfil seleccionado:", profile);
    } else {
      setSelectedProfile(null);
    }
  };

  const refreshProfile = (codPerson) => {
    getProfiles(codPerson);
    fetchAvailableRoles(codPerson);
  };

  const refreshAll = (codPerson) => {
    getProfiles(codPerson);
    getAllRoles();
    fetchAvailableRoles(codPerson);
  };

  const fetchAvailableRoles = async (codPerson) => {
    try {
      const roles = await getAvailableRoles(codPerson);
      const formattedRoles = roles.map((role) => ({
        ...role,
        name: role.cod_item,
        placeholder: role.item_name,
        value: role.cod_item,
        label: role.item_name,
      }));

      setAvailableRoles(formattedRoles);
      console.log("Roles disponibles obtenidos:", formattedRoles);
    } catch (error) {
      ModalAlert(
        "Error",
        "No se pudieron cargar los roles disponibles.",
        "error"
      );
    }
  };

  const handleDeleteProfile = async (profileId, codPerson) => {
    try {
      await deleteProfile(profileId);
      ModalAlert("Éxito", "Perfil eliminado correctamente.", "success");
      refreshAll(codPerson); // Refrescar la lista de perfiles y roles disponibles
    } catch (error) {
      ModalAlert("Error", "No se pudo eliminar el perfil.", "error");
    }
  };

  const handleSaveProfile = async (profileData, codePerson) => {
    try {
      const data = {
        profile_role_cod_service: Number(
          import.meta.env.VITE_ROLE_SERVICE_CODE
        ),
        profile_role_cod_category: Number(
          import.meta.env.VITE_ROLE_CATEGORY_CODE
        ),
        profile_role_cod_item: profileData.role,
      };
      await createProfile(codePerson, data);
      ModalAlert("Éxito", "Perfil creado correctamente.", "success");
      refreshAll(codePerson); // Refrescar la lista de perfiles y roles disponibles
    } catch (error) {
      ModalAlert("Error", "No se pudo crear el perfil.", "error");
    }
  };

  const getProfiles = async (codPerson) => {
    try {
      const data = await getProfilesByPersonId(codPerson);
      setProfiles(data);
      console.log("los datos son", data);
    } catch (error) {
      ModalAlert("Error", "No se pudieron cargar los perfiles.", "error");
    }
  };

  const getAllRoles = async () => {
    try {
      const items = await getItems(14, 1);
      console.log("Roles obtenidos:", items);
      setOptionsRoles(items);
    } catch (error) {
      ModalAlert("Error", "No se pudieron cargar los roles.", "error");
      return [];
    }
  };

  const fields = [
    {
      name: "role",
      label: "Rol",
      type: "select",
      options: avaliableRoles,
      grid: 6,
      placeholder: "Seleccione un rol",
      required: true,
      width: 200,
    },
  ];

  //seccion de specialized training

  const [specializedTrainingData, setSpecializedTrainingData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [isCreatingSpecializedTraining, setIsCreatingSpecializedTraining] =
    useState(false);

  const handleAddSpecializedTraining = async (trainingData) => {
    try {
      //codigo de perfil
      const profileId = selectedProfile.profile_cod;

      const data = await addSpecializedTraining(profileId, trainingData);
      ModalAlert(
        "Éxito",
        "Formación especializada agregada correctamente.",
        "success"
      );
      //refrescar la lista
      fetchedProfileSpecializedTraining(profileId);
      return data;
    } catch (error) {
      console.error("Error adding specialized training:", error);
      ModalAlert(
        "Error",
        "No se pudo agregar la formación especializada.",
        "error"
      );
      return null;
    }
  };

  const fetchedProfileSpecializedTraining = async (profileId, page = 1) => {
    try {
      console.log(
        "Fetching specialized training for profile ID:",
        profileId,
        "page:",
        page
      );
      const data = await getSpecializedTrainingByProfileId(profileId, page);
      setCurrentPage(page);
      setTotalPages(data.totalPages);
      setSpecializedTrainingData(data.specializedTrainings);
      return data;
    } catch (error) {
      console.error("Error fetching specialized training:", error);
      return [];
    }
  };

  const handleEdit = async (data, page) => {
    try {
      const updatedData = await updateSpecializedTraining(data);
      ModalAlert(
        "Éxito",
        "Formación especializada actualizada correctamente.",
        "success"
      );
      //refrescar la lista
      fetchedProfileSpecializedTraining(selectedProfile.profile_cod, page);
      pageChange(page);
      return updatedData;
    } catch (error) {
      console.error("Error updating specialized training:", error);
      ModalAlert(
        "Error",
        "No se pudo actualizar la formación especializada.",
        "error"
      );
      return null;
    }
  };

  const openPDF = async (relativePath) => {
    try {
      const pdfBlob = await getSpecializedTrainingPDF(relativePath);
      const pdfUrl = URL.createObjectURL(pdfBlob); // ya es un blob válido
      window.open(pdfUrl, "_blank"); // abre en nueva pestaña
    } catch (error) {
      console.error("Error al abrir el PDF:", error);
    }
  };

  const handleSearch = async (feature, searchText = "", currentPage = 1) => {
    try {
      const data = await searchSpecializedTraining(
        selectedProfile.profile_cod,
        currentPage,
        feature,
        searchText
      );

      if (
        !data.specializedTrainings ||
        data.specializedTrainings.length === 0
      ) {
        ModalAlert(
          "Información",
          "No se encontraron resultados para la búsqueda realizada.",
          "info"
        );
      } else {
        setCurrentPage(currentPage);
        setTotalPages(data.totalPages);
        setSpecializedTrainingData(data.specializedTrainings);
        return data;
      }
    } catch (error) {
      console.error("Error searching specialized training:", error);
      return [];
    }
  };

  const pageChange = async (page, feature, searchText = "") => {
    if (selectedProfile) {
      setCurrentPage(page);
      return handleSearch(feature, searchText, page);
    }
  };

  const specializedTrainingSearchFields = [
    {
      name: "training_name",
      placeholder: "Nombre de la Formación",
      type: "text",
    },
    {
      name: "training_number",
      placeholder: "Número de Certificación",
      type: "text",
    },
    {
      name: "training_institution",
      placeholder: "Institución",
      type: "text",
    },
    {
      name: "training_start_date",
      placeholder: "Fecha de Inicio",
      type: "date",
    },
    {
      name: "training_end_date",
      placeholder: "Fecha de Finalización",
      type: "date",
    },
    {
      name: "training_validity",
      placeholder: "Validez",
      type: "date",
    },
  ];

  const specializedTrainingFields = [
    {
      name: "cod_training",
      label: "Código de Formación",
      type: "hidden",
      grid: 0,
      placeholder: "",
      required: false,
      width: 0,
    },
    {
      name: "training_name",
      label: "Nombre de la Formación",
      type: "text",
      grid: 6,
      placeholder: "Nombre",
      required: true,
      width: 250,
    },
    {
      name: "training_number",
      label: "Número de Certificación",
      type: "text",
      grid: 6,
      placeholder: "Número",
      required: false,
      width: 250,
    },
    {
      name: "training_institution",
      label: "Institución",
      type: "text",
      grid: 6,
      placeholder: "Institución",
      required: false,
      width: 250,
    },
    {
      name: "training_pdf",
      label: "Certificado (PDF)",
      type: "file",
      grid: 6,
      placeholder: "Subir PDF",
      required: false,
      width: 250,
      restriction: "filePath",
    },
    {
      name: "training_start_date",
      label: "Fecha de Inicio",
      type: "date",
      grid: 6,
      placeholder: "Fecha de Inicio",
      required: true,
      width: 250,
    },
    {
      name: "training_end_date",
      label: "Fecha de Finalización",
      type: "date",
      grid: 6,
      placeholder: "Fecha de Finalización",
      required: true,
      width: 250,
    },
    {
      name: "training_hours",
      label: "Horas",
      type: "number",
      grid: 6,
      placeholder: "Horas",
      required: true,
      width: 250,
    },
    {
      name: "training_validity",
      label: "Validez (meses)",
      type: "date",
      grid: 6,
      placeholder: "Validez",
      required: false,
      width: 250,
    },
    {
      name: "training_description",
      label: "Descripción",
      type: "textarea",
      grid: 12,
      placeholder: "Descripción",
      required: false,
      width: 1050,
    },
  ];

  useEffect(() => {
    getAllRoles();
  }, []);

  return {
    //esto es de perfiles

    profiles,
    getProfiles,
    fields,
    seeOptions,
    handleProfileSelect,
    isAddingProfile,
    setIsAddingProfile,
    optionsRoles,
    handleSaveProfile,
    handleDeleteProfile,
    seeSpecializedTraining,
    seeProjectExperience,
    setSeeSpecializedTraining,
    setSeeProjectExperience,
    selectedProfile,
    refreshProfile,

    //de aqui para abajo es de specialized training
    specializedTrainingData,
    isCreatingSpecializedTraining,
    setIsCreatingSpecializedTraining,
    specializedTrainingFields,
    handleAddSpecializedTraining,
    loading,
    editingId,
    setEditingId,
    openPDF,
    handleEdit,
    handleSearch,
    pageChange,
    currentPage,
    totalPages,
    specializedTrainingSearchFields,
  };
};
