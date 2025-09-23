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
    handleEliminateSupply,
    searchFields,
    handleSearch,
    isLoading,
  } = useMedicKits();

  const handleAddClick = () => {
    console.log("Botón clickeado - isCreatingMedicKit actual:", isCreatingMedicKit);
    
    if (isCreatingMedicKit || isCreatingSupply) {
      setIsCreatingMedicKit(false);
      setIsCreatingSupply(false);
      console.log("Modo creación cancelado");
    } else {
      setIsCreatingMedicKit(true);
      console.log("Modo creación activado");
    }
  };

  const getButtonName = () => {
    if (isCreatingMedicKit) return "Cancelar";
    if (isCreatingSupply) return "Cancelar";
    return "Agregar Botiquín";
  };

  return (
    <div style={{ padding: 24 }}>
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
        searchFields={searchFields}
        handleSearch={handleSearch}
        isLoading={isLoading}
      />
    </div>
  );
}

export default MedicKitPage;