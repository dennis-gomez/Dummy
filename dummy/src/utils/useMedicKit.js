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


  const [searchAnSupply, setSearchAnSupply] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

 const fields = [
  {
    key: "cod_medic_kit",
    label: "C\u00F3digo de botiqu\u00EDn",
    type: "text",
    placeholder: "C\u00F3digo de botiqu\u00EDn",
    required: false
  },
  {
    key: "medic_kit_location",
    label: "Localizaci\u00F3n",
    type: "text",
    placeholder: "Localizaci\u00F3n",
    required: true
  },
  {
    key: "medic_kit_details",
    label: "Detalles",
    type: "textarea",
    placeholder: "Detalle",
    required: true
  }
];



const subfields = [
  { key: "cod_medic_kit", label: "C\u00F3digo de botiqu\u00EDn", type: "text", placeholder: "C\u00F3digo de botiqu\u00EDn", required: false },
  { key: "cod_supply", label: "C\u00F3digo de suplemento", type: "text", placeholder: "C\u00F3digo de suplemento", required: false },
  { key: "supply_quantity", label: "Cantidad", type: "number", placeholder: "Cantidad", required: true },
  { key: "supply_expiration_date", label: "Fecha de Vencimiento", type: "date", placeholder: "Fecha de Vencimiento", required: false },
   { key: "supply_description", label: "Descripci\u00F3n", type: "textarea", placeholder: "Descripci\u00F3n", required: true },
];


const searchFields = [
   
{name: "medic_kit_location", placeholder: "Localizaci\u00F3n de botiqu\u00EDn"},
{name: "medic_kit_details", placeholder: "Detalles de botiqu\u00EDn"},
{ name: "supply_description", placeholder: "Suplementos", },
]

  const handleSearch = async (feature, text) => {
  try { 
    if (feature === "supply_description") {
      // Devuelve una lista de kits con esos suplementos

      if(text.trim() === "") {
      setSearchAnSupply(false);
      setSearchTerm("");
      fetchMedicKits();
      return;
      }

      const kitsWithThatsSupplies = await searchSuppliesByTerm(text);

      setSearchTerm(text);
      

      if (!kitsWithThatsSupplies || kitsWithThatsSupplies.length === 0) {
        ModalAlert("Error", "No se encontró ningún botiquín con ese suplemento.", "error");
        return; // no refresca la lista
      }

      setMedicKitsList(kitsWithThatsSupplies);
      setSuppliesList([]); // Limpiar la lista de suplementos
      setMedicKitSelectedId(null); // Deseleccionar cualquier botiquín
      setSearchAnSupply(true);
      setError(null); // Limpiar errores previos
      return;

    } else {
      const medicKitsResp = await searchMedicKitsByFeature(text, feature);

      if (!medicKitsResp || medicKitsResp.length === 0) {
        ModalAlert("Error", "No se encontró ningún botiquín con esos criterios.", "error");
        return; // no refresca la lista
      }

      setMedicKitsList(medicKitsResp);
      setSuppliesList([]); // Limpiar suplementos
      setMedicKitSelectedId(null); // Deseleccionar cualquier botiquín
      setError(null); // Limpiar errores previos
      return;
    }

  } catch (error) {
    setError("Error al buscar botiquines o suplementos");
    ModalAlert("Error", "Error al buscar botiquines o suplementos.", "error");
  }
};


  const SubTittle = "Lista de suplementos médicos";

  // Cargar lista de botiquines
  const fetchMedicKits = async () => {
    try {
      const medicKitsResp = await getMedicKits();
      setMedicKitsList(medicKitsResp);
    } catch (err) {
      setError("Error al obtener botiquines");
    }
  };


 const getSuppliesByMedicKitId = async (cod_medic_kit) => {
  try {
    setMedicKitSelectedId(cod_medic_kit);

    let supplies = [];

    if(searchAnSupply && searchTerm.trim() !== "") {
      // asegurarse que sea async si hace llamadas al backend
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
    searchFields,
    handleSearch,
  };
};
