import React from "react";
import CollapsibleTable from "../organisms/collapsibleTable";
import FormWithDetails from "../organisms/formWithDetails";
import { useMedicKits } from "../../utils/useMedicKit";

function MedicKitPage() {
  const {
    medicKitsList,
    medicKitSelectedId,
    suppliesList,
    isCreatingMedicKit,
    setIsCreatingMedicKit,
    isCreatingSupply,
    setIsCreatingSupply,
    fields,
    subfields,
    SubTittle,
    getSuppliesByMedicKitId,
    handleAddKitWithSupplies,
    handleEditMedicKit,
    handleEditSupply,
    handleEliminateMedicKit,
    handleEliminateSupply
  } = useMedicKits();

  const handleAddClick = () => {
    // Si ya estamos creando, cancelar; si no, iniciar creación de botiquín
    if (isCreatingMedicKit || isCreatingSupply) {
      setIsCreatingMedicKit(false);
      setIsCreatingSupply(false);
    } else {
      setIsCreatingMedicKit(true);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Gestión de botiquines
      </h2>

      {isCreatingSupply && medicKitSelectedId && (
        <FormWithDetails
          subfields={subfields}
          onSubmit={handleAddKitWithSupplies}
          titleBtn={"Añadir al botiquín"}
          subTittle={"Añadir suplemento"}
        />
      )}

      {isCreatingMedicKit && (
        <FormWithDetails
          fields={fields}
          subfields={subfields}
          title={"Registro de botiquín"}
          onSubmit={handleAddKitWithSupplies}
          titleBtn={"Añadir Botiquín"}
          subTittle={"Añadir suplemento"}
        />
      )}

      {medicKitsList && medicKitsList.length > 0 ? (
        <CollapsibleTable
          list={medicKitsList}
          tittles={fields}
          subTitle={SubTittle}
          subfields={subfields}
          suppliesList={suppliesList}
          medicKitSelectedId={medicKitSelectedId}
          onSelect={getSuppliesByMedicKitId}
          onDeleteMedicKit={handleEliminateMedicKit}
          onDeleteSupply={handleEliminateSupply}
          onEditMedicKit={handleEditMedicKit}
          onEditSupply={handleEditSupply}
          changeStateSupply={setIsCreatingSupply}
          isCreatingMedicKit={isCreatingMedicKit}      // ✅ pasa el estado
          isCreatingSupply={isCreatingSupply}          // ✅ pasa el estado
          setIsCreatingMedicKit={setIsCreatingMedicKit} // ✅ pasa el setter
          setIsCreatingSupply={setIsCreatingSupply}     // ✅ pasa el setter
          onAddClick={handleAddClick}
        />

      ) : (
        <h2 style={{ textAlign: "center" }}>No hay botiquines registrados</h2>
      )}
    </>
  );
}

export default MedicKitPage;
