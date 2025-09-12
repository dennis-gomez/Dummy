import { React, useEffect, useState } from "react";
import CollapsibleTable from "../organisms/collapsibleTable";
import { getMedicKits, deleteMedicKit, updateMedicKit, addMedicKit } from "../../services/medicKitService";
import { getSuppliesById, deleteSupply, updateSupply, addManySupplies, addSupply } from "../../services/medicKitSuppliesService";
import Button from "../atoms/button";
import FormWithDetails from "../organisms/formWithDetails";
import Form from "../organisms/form";

function MedicKitPage() {
  const [medicKitsList, setMedicKitsList] = useState([]);
  const [medicKitSelectedId, setMedicKitSelectedId] = useState(null);
  const [suppliesList, setSuppliesList] = useState([]);
  const [isCreatingMedicKit, setIsCreatingMedicKit] = useState(false);
  const [isCreatingSupply, setIsCreatingSupply] = useState(false);

  // columnas principales
  const tittles = [
    { key: "cod_medic_kit", label: "Código de botiquín" },
    { key: "medic_kit_location", label: "Localización" },
    { key: "medic_kit_details", label: "Detalles" },
  ];

  const fields = [
    { name: "medic_kit_location", placeholder: "Localización" },
    { name: "medic_kit_details", placeholder: "Detalle" },
  ];

  const subfields = [
    { name: "supply_quantity", placeholder: "Cantidad", type: "number" },
    { name: "supply_description", placeholder: "Descripción" },
    { name: "supply_expiration_date", placeholder: "Fecha de Vencimiento", type: "date" },
  ];

  // columnas de suplementos
  const subTittles = [
    { key: "cod_medic_kit", label: "Código de botiquín" },
    { key: "cod_supply", label: "Código de suplemento" },
    { key: "supply_quantity", label: "Cantidad" },
    { key: "supply_description", label: "Descripción" },
    { key: "supply_expiration_date", label: "Fecha de Vencimiento" },
  ];

  const SubTittle = "Suplementos médicos";

  // Cargar lista de botiquines
  useEffect(() => {
    const fetchData = async () => {
      try {
        const medicKitsResp = await getMedicKits();
        setMedicKitsList(medicKitsResp);
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
    } catch (error) {
      console.error("Error al obtener suplementos médicos:", error);
    }
  };

  // Cambiar estado de formularios
  const changeStateMedicKit = () => {
    if (isCreatingSupply) setIsCreatingSupply(false);
    setIsCreatingMedicKit(!isCreatingMedicKit);
  };

  const changeStateSupply = () => {
    if (isCreatingMedicKit) setIsCreatingMedicKit(false);
    setIsCreatingSupply(true);
  };

  // Agregar kit con sus suplementos
  const handleAddKitWithSupplies = async (formData) => {
    const kitData = {
      medic_kit_location: formData.medic_kit_location,
      medic_kit_details: formData.medic_kit_details,
    };

    const suppliesToAdd = formData.supplements.map((supply) => ({
      supply_quantity: supply.supply_quantity,
      supply_description: supply.supply_description,
      supply_expiration_date: supply.supply_expiration_date,
    }));

    try {
      const newMedicKit = await addMedicKit(kitData);
      const newMedicKitId = newMedicKit.cod_medic_kit;
      await addManySupplies(newMedicKitId, suppliesToAdd);
      const updatedMedicKits = await getMedicKits();
      setMedicKitsList(updatedMedicKits);
      setIsCreatingMedicKit(false);
    } catch (error) {
      console.error("Error al agregar el kit médico:", error);
    }
  };

  const handleAddSupply = async (formData) => {
    const supplyData = {
      cod_medic_kit: medicKitSelectedId,
      supply_quantity: formData.supply_quantity,
      supply_description: formData.supply_description,
      supply_expiration_date: formData.supply_expiration_date,
    };

    try {
      await addSupply(supplyData);
      const updatedSupplies = await getSuppliesById(medicKitSelectedId);
      setSuppliesList(updatedSupplies);
      setIsCreatingSupply(false);
    } catch (error) {
      console.error("Error al agregar el suplemento médico:", error);
    }
  };

  const handleEditMedicKit = async (formData) => {
    try {
      await updateMedicKit(formData);
      const updatedMedicKits = await getMedicKits();
      setMedicKitsList(updatedMedicKits);
    } catch (error) {
      console.error("Error al actualizar el kit médico:", error);
    }
  };

  const handleEditSupply = async (formData) => {
    try {
      await updateSupply(formData);
      const updatedSupplies = await getSuppliesById(medicKitSelectedId);
      setSuppliesList(updatedSupplies);
    } catch (error) {
      console.error("Error al actualizar el suplemento médico:", error);
    }
  };

  const handleEliminateMedicKit = async (cod_MedicKit) => {
    try {
      await deleteMedicKit(cod_MedicKit);
      const updatedMedicKits = await getMedicKits();
      setMedicKitsList(updatedMedicKits);
    } catch (error) {
      console.error("Error al eliminar el kit médico:", error);
    }
  };

  const handleEliminateSupply = async (medicKitSelectedId, cod_supply) => {
    try {
      await deleteSupply(medicKitSelectedId, cod_supply);
      const updatedSupplies = await getSuppliesById(medicKitSelectedId);
      setSuppliesList(updatedSupplies);
    } catch (error) {
      console.error("Error al eliminar el suplemento médico:", error);
    }
  };

  return (
    <>
      <h2 style={{ textAlign: "center" }}>Registro de botiquines</h2>

      {isCreatingSupply && medicKitSelectedId && (
        <Form
          fields={subfields}
          onSubmit={handleAddSupply}
          titleBtn={"Añadir"}
        />
      )}

      {isCreatingMedicKit && (
        <FormWithDetails
          fields={fields}
          subfields={subfields}
          title={"Registro de suministros"}
          onSubmit={handleAddKitWithSupplies}
          titleBtn={"Añadir"}
          subTittle={"añadir suplemento"}
        />
      )}

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
        <Button
          text={isCreatingMedicKit || isCreatingSupply ? "Cancelar" : "Agregar botiquín"}
          onClick={changeStateMedicKit}
        />
      </div>

      {medicKitsList && medicKitsList.length > 0 ? (
        <CollapsibleTable
          list={medicKitsList}
          tittles={tittles}
          subTitle={SubTittle}
          subTittles={subTittles}
          suppliesList={suppliesList}
          medicKitSelectedId={medicKitSelectedId}
          onSelect={getSuppliesByMedicKitId}
          onDeleteMedicKit={handleEliminateMedicKit}
          onDeleteSupply={(id) => handleEliminateSupply(medicKitSelectedId, id)}
          onEditMedicKit={handleEditMedicKit}
          onEditSupply={handleEditSupply}
          changeStateSupply={setIsCreatingSupply} // <-- clave para cerrar form al cerrar fila
        />
      ): (
       <h2 style={{ textAlign: "center" }}>No hay botiquines registrados</h2>
      )
      }
    </>
  );
}

export default MedicKitPage;

      