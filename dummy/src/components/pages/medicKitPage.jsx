import React from "react";
import CollapsibleTable from "../organisms/collapsibleTable";
import Button from "../atoms/button";
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

  return (
    <>
      <h2 style={{ textAlign: "center" }}>Registro de botiquines</h2>

      {isCreatingSupply && medicKitSelectedId && (
        <FormWithDetails
          subfields={subfields} // usamos solo el combinado
          onSubmit={handleAddKitWithSupplies}
          titleBtn={"Añadir"}
          subTittle={"Añadir suplemento"}
        />
      )}

      {isCreatingMedicKit && (
        <FormWithDetails
          fields={fields} // usamos solo el combinado
          subfields={subfields} // usamos solo el combinado
          title={"Registro de suministros"}
          onSubmit={handleAddKitWithSupplies}
          titleBtn={"Añadir"}
          subTittle={"Añadir suplemento"}
        />
      )}

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
        <Button
          text={isCreatingMedicKit || isCreatingSupply ? "Cancelar" : "Agregar botiquín"}
          onClick={() => {
            if (isCreatingMedicKit || isCreatingSupply) {
              setIsCreatingMedicKit(false);
              setIsCreatingSupply(false);
            } else {
              setIsCreatingMedicKit(true);
            }
          }}
        />
      </div>

      {medicKitsList && medicKitsList.length > 0 ? (
        <CollapsibleTable
          list={medicKitsList}
          tittles={fields} // usamos fields unificado para tabla
          subTitle={SubTittle}
          subfields={subfields} // usamos solo el combinado
          suppliesList={suppliesList}
          medicKitSelectedId={medicKitSelectedId}
          onSelect={getSuppliesByMedicKitId}
          onDeleteMedicKit={handleEliminateMedicKit}
          onDeleteSupply={handleEliminateSupply}
          onEditMedicKit={handleEditMedicKit}
          onEditSupply={handleEditSupply}
          changeStateSupply={setIsCreatingSupply} 
        />
      ) : (
        <h2 style={{ textAlign: "center" }}>No hay botiquines registrados</h2>
      )}
    </>
  );
}

export default MedicKitPage;
