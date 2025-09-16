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
  const {
    medic_kit_location,
    medic_kit_details,
    supplements
  } = formData || {};

  // Normalizar suplementos
  const suppliesToAdd = Array.isArray(supplements) && supplements.length > 0
    ? supplements.map(({ supply_quantity, supply_description, supply_expiration_date }) => ({
        supply_quantity,
        supply_description,
        supply_expiration_date,
      }))
    : [];

  try {
    let targetMedicKitId = null;

    if (medic_kit_location && medic_kit_details) {
      // Crear nuevo botiquín
      const kitPayload = { medic_kit_location, medic_kit_details };
      const newMedicKit = await addMedicKit(kitPayload);
      // Extraer ID del botiquín creado
      targetMedicKitId =
        newMedicKit?.cod_medic_kit ?? newMedicKit?.id ?? newMedicKit;

      // Si vinieron suplementos, agregarlos al botiquín creado
      if (suppliesToAdd.length > 0) {
        await addManySupplies(targetMedicKitId, suppliesToAdd);
      }
    } else if (suppliesToAdd.length > 0) {
      // Caso: solo suplementos
      if (medicKitSelectedId) {
        targetMedicKitId = medicKitSelectedId;
      } else if (medicKitsList.length > 0) {
        // Si no hay seleccionado, usar el último botiquín de la lista
        targetMedicKitId = medicKitsList[medicKitsList.length - 1].cod_medic_kit;
      }

      if (!targetMedicKitId) {
        throw new Error("No existe un botiquín al que agregar los suplementos.");
      }
      await addManySupplies(targetMedicKitId, suppliesToAdd);
    }

    // Actualizar la lista de botiquines
    const updatedMedicKits = await getMedicKits();
    setMedicKitsList(updatedMedicKits);
    setIsCreatingMedicKit(false);
    setIsCreatingSupply(false);
    getSuppliesByMedicKitId(targetMedicKitId);
  } catch (error) {
    console.error("Error al agregar el kit médico o suministros:", error);
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
        <FormWithDetails
          subfields={subfields}
          onSubmit={handleAddKitWithSupplies}
          titleBtn={"Añadir"}
          subTittle={"añadir suplemento"}
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
    onClick={() => {
      if (isCreatingMedicKit || isCreatingSupply) {
        // Si estoy creando algo -> cerrar ambos
        setIsCreatingMedicKit(false);
        setIsCreatingSupply(false);
      } else {
        // Si no estoy creando nada -> abrir formulario de botiquín
        setIsCreatingMedicKit(true);
      }
    }}
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