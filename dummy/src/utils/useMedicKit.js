import { useEffect, useState } from "react";
import { 
  getMedicKits, deleteMedicKit, updateMedicKit, addMedicKit 
} from "../services/medicKitService";
import { 
  getSuppliesById, deleteSupply, updateSupply, addManySupplies 
} from "../services/medicKitSuppliesService";
import ModalAlert from "../components/molecules/modalAlert";

export const useMedicKits = () => {
  const [medicKitsList, setMedicKitsList] = useState([]);
  const [medicKitSelectedId, setMedicKitSelectedId] = useState(null);
  const [suppliesList, setSuppliesList] = useState([]);
  const [isCreatingMedicKit, setIsCreatingMedicKit] = useState(false);
  const [isCreatingSupply, setIsCreatingSupply] = useState(false);
  const [error, setError] = useState(null);

 const fields = [
  {
    key: "cod_medic_kit",
    label: "Código de botiquín",
    type: "text",
    placeholder: "Código de botiquín",
    required: false
  },
  {
    key: "medic_kit_location",
    label: "Localización",
    type: "text",
    placeholder: "Localización",
    required: true
  },
  {
    key: "medic_kit_details",
    label: "Detalles",
    type: "text",
    placeholder: "Detalle",
    required: true
  }
];


const subfields = [
  { key: "cod_medic_kit", label: "Código de botiquín", type: "text", placeholder: "Código de botiquín", required: false },
  { key: "cod_supply", label: "Código de suplemento", type: "text", placeholder: "Código de suplemento", required: false },
  { key: "supply_quantity", label: "Cantidad", type: "number", placeholder: "Cantidad", required: false },
  { key: "supply_description", label: "Descripción", type: "text", placeholder: "Descripción", required: false },
  { key: "supply_expiration_date", label: "Fecha de Vencimiento", type: "date", placeholder: "Fecha de Vencimiento", required: false },
];


  

  const SubTittle = "Suplementos médicos";

  // Cargar lista de botiquines
  const fetchMedicKits = async () => {
    try {
      const medicKitsResp = await getMedicKits();
      setMedicKitsList(medicKitsResp);
    } catch (err) {
      setError("Error al obtener botiquines");
      console.error(err);
    }
  };

  const getSuppliesByMedicKitId = async (cod_medic_kit) => {
    setMedicKitSelectedId(cod_medic_kit);
    try {
      const allSuppliesById = await getSuppliesById(cod_medic_kit);
      setSuppliesList(allSuppliesById);
    } catch (err) {
      setError("Error al obtener suplementos médicos");
      console.error(err);
    }
  };

  const handleAddKitWithSupplies = async (formData) => {
    const { medic_kit_location, medic_kit_details, supplements } = formData || {};
    const suppliesToAdd = Array.isArray(supplements)
      ? supplements.map(({ supply_quantity, supply_description, supply_expiration_date }) => ({
          supply_quantity, supply_description, supply_expiration_date
        }))
      : [];

    try {
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
      console.error(err);
      ModalAlert("Error", err.message, "error");
    }
  };

  const handleEditMedicKit = async (formData) => {
    try {
      await updateMedicKit(formData);
      await fetchMedicKits();
      ModalAlert("Éxito", "Kit médico actualizado", "success");
    } catch (err) {
      setError("Error al actualizar el kit médico");
      console.error(err);
      ModalAlert("Error", err.message, "error");
    }
  };

  const handleEditSupply = async (formData) => {
    try {
      await updateSupply(formData);
      const updatedSupplies = await getSuppliesById(medicKitSelectedId);
      setSuppliesList(updatedSupplies);
      ModalAlert("Éxito", "Suplemento actualizado", "success");
    } catch (err) {
      setError("Error al actualizar suplemento");
      console.error(err);
      ModalAlert("Error", err.message, "error");
    }
  };

  const handleEliminateMedicKit = async (cod_MedicKit) => {
    try {
      await deleteMedicKit(cod_MedicKit);
      await fetchMedicKits();
      ModalAlert("Éxito", "Kit médico eliminado", "success");
    } catch (err) {
      setError("Error al eliminar kit médico");
      console.error(err);
      ModalAlert("Error", err.message, "error");
    }
  };

  const handleEliminateSupply = async (cod_supply) => {
    try {
      await deleteSupply(medicKitSelectedId, cod_supply);
      const updatedSupplies = await getSuppliesById(medicKitSelectedId);
      setSuppliesList(updatedSupplies);
      ModalAlert("Éxito", "Suplemento eliminado", "success");
    } catch (err) {
      setError("Error al eliminar suplemento");
      console.error(err);
      ModalAlert("Error", err.message, "error");
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
  };
};
