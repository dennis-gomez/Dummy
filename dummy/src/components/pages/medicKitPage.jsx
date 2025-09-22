import React from "react";
import CollapsibleTable from "../organisms/collapsibleTable";
import FormWithDetails from "../organisms/formWithDetails";
import { useMedicKits } from "../../utils/useMedicKit";
import Button from "../atoms/button"; // ✅ Importación del botón

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
    if (isCreatingMedicKit || isCreatingSupply) {
      setIsCreatingMedicKit(false);
      setIsCreatingSupply(false);
    } else {
      setIsCreatingMedicKit(true);
    }
  };

  const getButtonName = () => {
    if (isCreatingMedicKit) return "Cancelar";
    if (isCreatingSupply) return "Cancelar";
    return "Agregar Botiquín";
  };

  return (
    <div style={{ padding: 24 }}> {/* ✅ Mismo padding que VehiclePage */}
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Gestión de Botiquines
      </h1>

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

      {/* ✅ BOTÓN EN LA MISMA POSICIÓN QUE VEHICLEPAGE */}
      <div className="flex justify-end mt-2 mb-6"> {/* ✅ mismo mt-2 y mb-6 */}
        <Button 
          text={getButtonName()} 
          onClick={handleAddClick}
        />
      </div>

      {/* ✅ TABLA SIEMPRE VISIBLE (como VehiclePage) */}
      <CollapsibleTable
        list={medicKitsList || []}
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
        isCreatingMedicKit={isCreatingMedicKit}
        isCreatingSupply={isCreatingSupply}
        setIsCreatingMedicKit={setIsCreatingMedicKit}
        setIsCreatingSupply={setIsCreatingSupply}
        onAddClick={handleAddClick}
      />
    </div>
  );
}

export default MedicKitPage;