import { useEffect, useState } from "react";
import { 
  getMedicKits, deleteMedicKit, updateMedicKit, addMedicKit, searchMedicKitsByFeature
} from "../services/medicKitService";
import { 
  getSuppliesById, deleteSupply, updateSupply, addManySupplies, searchSuppliesByTerm, orderSuppliesByRelevance
} from "../services/medicKitSuppliesService";
import ModalAlert from "../components/molecules/modalAlert";

export const useMedicKits = () => {
  const [medicKitsList, setMedicKitsList] = useState([]);
  const [medicKitSelectedId, setMedicKitSelectedId] = useState(null);
  const [suppliesList, setSuppliesList] = useState([]);
  const [isCreatingMedicKit, setIsCreatingMedicKit] = useState(false);
  const [isCreatingSupply, setIsCreatingSupply] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const [searchAnSupply, setSearchAnSupply] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fields = [
    { key: "cod_medic_kit", label: "Código de botiquín", type: "text", placeholder: "Código de botiquín", required: false },
    { key: "medic_kit_location", label: "Localización", type: "text", placeholder: "Localización", required: true },
    { key: "medic_kit_details", label: "Detalles", type: "textarea", placeholder: "Detalle", required: true },
  ];

  const subfields = [
    { key: "cod_medic_kit", label: "Código de botiquín", type: "text", required: false },
    { key: "cod_supply", label: "Código de suplemento", type: "text", required: false },
    { key: "supply_quantity", label: "Cantidad", placeholder: "Cantidad", type: "number", required: true },
    { key: "supply_expiration_date", label: "Fecha de Vencimiento", placeholder: "Fecha de Vencimiento", type: "date", required: false },
    { key: "supply_description", label: "Descripción", placeholder:"Descripción", type: "textarea", required: true },
  ];

  const searchFields = [
    { name: "medic_kit_location", placeholder: "Localización de botiquín" },
    { name: "medic_kit_details", placeholder: "Detalles de botiquín" },
    { name: "supply_description", placeholder: "Suplementos" },
  ];

  const handleSearch = async (feature, text) => {
    try {
      setLoading(true);

      if (feature === "supply_description") {
        if (text.trim() === "") {
          setSearchAnSupply(false);
          setSearchTerm("");
          await fetchMedicKits();
          return;
        }

        const kitsWithThatsSupplies = await searchSuppliesByTerm(text);
        setSearchTerm(text);

        if (!kitsWithThatsSupplies || kitsWithThatsSupplies.length === 0) {
          ModalAlert("Error", "No se encontró ningún botiquín con ese suplemento.", "error");
          return;
        }

        setMedicKitsList(kitsWithThatsSupplies);
        setSuppliesList([]);
        setMedicKitSelectedId(null);
        setSearchAnSupply(true);
        setError(null);
        return;
      } else {
        const medicKitsResp = await searchMedicKitsByFeature(text, feature);
        if (!medicKitsResp || medicKitsResp.length === 0) {
          ModalAlert("Error", "No se encontró ningún botiquín con esos criterios.", "error");
          return;
        }

        setMedicKitsList(medicKitsResp);
        setSuppliesList([]);
        setMedicKitSelectedId(null);
        setError(null);
        return;
      }
    } catch (error) {
      setError("Error al buscar botiquines o suplementos");
      ModalAlert("Error", "Error al buscar botiquines o suplementos.", "error");
    } finally {
      setLoading(false);
    }
  };

  const SubTittle = "Lista de suplementos médicos";

  const fetchMedicKits = async () => {
    try {
      setLoading(true);
      const medicKitsResp = await getMedicKits();
      setMedicKitsList(medicKitsResp);
    } catch (err) {
      setError("Error al obtener botiquines");
    } finally {
      setLoading(false);
    }
  };

  const getSuppliesByMedicKitId = async (cod_medic_kit) => {
    try {
      setMedicKitSelectedId(cod_medic_kit);

      let supplies = [];
      if (searchAnSupply && searchTerm.trim() !== "") {
        supplies = await orderSuppliesByRelevance(cod_medic_kit, searchTerm);
      } else {
        supplies = await getSuppliesById(cod_medic_kit);
      }
      setSuppliesList(supplies);
    } catch (err) {
      setError("Error al obtener suplementos médicos");
    }
    
  };

  const handleAddKitWithSupplies = async (formData) => {
    setLoading(true);
    try {
      const { medic_kit_location, medic_kit_details, supplements } = formData || {};
      const suppliesToAdd = Array.isArray(supplements)
        ? supplements.map(({ supply_quantity, supply_description, supply_expiration_date }) => ({
            supply_quantity, supply_description, supply_expiration_date
          }))
        : [];

      let targetMedicKitId = null;

      if (medic_kit_location && medic_kit_details) {
        const newMedicKit = await addMedicKit({ medic_kit_location, medic_kit_details });
        targetMedicKitId = newMedicKit?.cod_medic_kit ?? newMedicKit?.id ?? newMedicKit;
        if (suppliesToAdd.length > 0) await addManySupplies(targetMedicKitId, suppliesToAdd);
      } else if (suppliesToAdd.length > 0) {
        targetMedicKitId = medicKitSelectedId || medicKitsList?.[medicKitsList.length - 1]?.cod_medic_kit;
        if (!targetMedicKitId) throw new Error("No existe un botiquín al que agregar los suplementos.");
        await addManySupplies(targetMedicKitId, suppliesToAdd);
      }

      await fetchMedicKits();
      setIsCreatingMedicKit(false);
      setIsCreatingSupply(false);
      getSuppliesByMedicKitId(targetMedicKitId);
      ModalAlert("Éxito", "Se agregó correctamente", "success");
    } catch (err) {
      setError("Error al agregar el kit médico o suplementos");
      ModalAlert("Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditMedicKit = async (formData) => {
    setLoading(true);
    try {
      await updateMedicKit(formData);
      await fetchMedicKits();
      ModalAlert("Éxito", "Kit médico actualizado", "success");
    } catch (err) {
      setError("Error al actualizar el kit médico");
      ModalAlert("Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditSupply = async (formData) => {
    setLoading(true);
    try {
      await updateSupply(formData);
      const updatedSupplies = await getSuppliesById(medicKitSelectedId);
      setSuppliesList(updatedSupplies);
      ModalAlert("Éxito", "Suplemento actualizado", "success");
    } catch (err) {
      setError("Error al actualizar suplemento");
      ModalAlert("Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEliminateMedicKit = async (cod_MedicKit) => {
    setLoading(true);
    try {
      await deleteMedicKit(cod_MedicKit);
      await fetchMedicKits();
      ModalAlert("Éxito", "Kit médico eliminado", "success");
    } catch (err) {
      setError("Error al eliminar kit médico");
      ModalAlert("Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEliminateSupply = async (cod_supply) => {
    setLoading(true);
    try {
      await deleteSupply(medicKitSelectedId, cod_supply);
      const updatedSupplies = await getSuppliesById(medicKitSelectedId);
      setSuppliesList(updatedSupplies);
      ModalAlert("Éxito", "Suplemento eliminado", "success");
    } catch (err) {
      setError("Error al eliminar suplemento");
      ModalAlert("Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicKits();
  }, []);

  return {
    medicKitsList,
    medicKitSelectedId,
    suppliesList,
    isCreatingMedicKit,
    setIsCreatingMedicKit,
    isCreatingSupply,
    setIsCreatingSupply,
    error,
    setError,
    fields,
    subfields,
    SubTittle,
    getSuppliesByMedicKitId,
    handleAddKitWithSupplies,
    handleEditMedicKit,
    handleEditSupply,
    handleEliminateMedicKit,
    handleEliminateSupply,
    searchFields,
    handleSearch,
    isLoading,
  };
};
