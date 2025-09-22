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
          isCreatingMedicKit={isCreatingMedicKit}      //  pasa el estado
          isCreatingSupply={isCreatingSupply}          //  pasa el estado
          setIsCreatingMedicKit={setIsCreatingMedicKit} //  pasa el setter
          setIsCreatingSupply={setIsCreatingSupply}     //  pasa el setter
          onAddClick={handleAddClick}
          searchFields={searchFields}
          handleSearch={handleSearch}
        />
      ) : (
        <>
          <h2 style={{ textAlign: "center" }}>No hay botiquines registrados</h2>
          <button
            onClick={handleAddClick}
            style={{
              display: "block",
              margin: "0 auto",
              marginTop: "16px",   // margen superior
              marginBottom: "16px" // margen inferior
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            {isCreatingMedicKit ? "Cancelar" : "Agregar Botiquín"}
          </button>
        </>
      )}
    </div>
  );
}

export default MedicKitPage;