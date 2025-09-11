import { useEffect, useState } from "react";
import CollapsibleTable from "../organisms/collapsibleTable";
import { getMedicKits,deleteMedicKit } from "../../services/medicKitService";
import { getSuppliesById, deleteSupply } from "../../services/medicKitSuppliesService";

function MedicKitPage() {
  const [medicKitsList, setMedicKitsList] = useState([]);
  const [medicKitSelectedId, setMedicKitSelectedId] = useState(null);
  const [suppliesList, setSuppliesList] = useState([]);

  // columnas principales
  const tittles = [
    { key: "cod_medic_kit", label: "Codigo de botiquin" },
    { key: "medic_kit_location", label: "Localización" },
    { key: "medic_kit_details", label: "Detalles" },
  ];

  // columnas de suplementos
  const subTittles = [
    { key: "cod_medic_kit", label: "Codigo de botiquin" },
    { key: "cod_supply", label: "Codigo de suplemento" },
    { key: "supply_quantity", label: "Cantidad" },
    { key: "supply_description", label: "Descripción" },
    { key: "supply_expiration_date", label: "Fecha de Vencimiento" },
  ];

  const SubTittle = "Suplementos médicos";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const medicKitsResp = await getMedicKits();
        setMedicKitsList(medicKitsResp);
        console.log("medicKits:", medicKitsResp);
      } catch (error) {
        console.error("Error al obtener botiquines:", error);
      }
    };
    fetchData();
  }, []);

  const getSuppliesByMedicKitId = async (cod_medic_kit) => {
    setMedicKitSelectedId(cod_medic_kit);
    try {
      const allSuppliesById = await getSuppliesById(cod_medic_kit);
      setSuppliesList(allSuppliesById);
      console.log("suppliesList:", allSuppliesById);
      return allSuppliesById;
    } catch (error) {
      console.error("Error al obtener suplementos médicos:", error);
      return [];
    }
  };

  const handleEliminateMedicKit = async (cod_MedicKit) => {

    try {
        await deleteMedicKit(cod_MedicKit);
        // Actualizar la lista de kits médicos después de la eliminación
        const updatedMedicKits = await getMedicKits();
        setMedicKitsList(updatedMedicKits);
    } catch (error) {
        console.error("Error al eliminar el kit médico:", error);
    }
  }

  const handleEliminateSupply = async (medicKitSelectedId,cod_supply) => {
    try {
        await deleteSupply(medicKitSelectedId,cod_supply);
        // Actualizar la lista de suplementos después de la eliminación
        const updatedSupplies = await getSuppliesById(medicKitSelectedId);
        setSuppliesList(updatedSupplies);
    }
    catch (error) {
        console.error("Error al eliminar el suplemento médico:", error);
    }
  };

  return (
    <>
      <h2 style={{ textAlign: "center" }}>Registro de botiquines</h2>

      {medicKitsList && medicKitsList.length > 0 && (
        <CollapsibleTable
          list={medicKitsList}
          tittles={tittles}
          subTitle={SubTittle}
          subTittles={subTittles}
          suppliesList={suppliesList}
          medicKitSelectedId={medicKitSelectedId}
          onSelect={(id) => getSuppliesByMedicKitId(id)}
        onDeleteMedicKit={(id) => handleEliminateMedicKit(id)}
        onDeleteSupply={(id) => handleEliminateSupply(medicKitSelectedId,id)}
        />
      )}
    </>
  );
}

export default MedicKitPage;
