import TableMiscellaneousPage from "../organisms/tableMiscellaneousPage";
import TableOptionServices from "../organisms/tableOptionService";
import TableSubcategorie from "../organisms/tableSubCategorie";
import useMiscellaneousPage from "/src/utils/useMiscellaneousPage";

function MiscellaneousPage() {
  const {
    services,
    categories,
    items,
    selectedServCod,
    selectedCatCod,
    setSelectedServiceId,
    setSelectedCategoryId,
    handleAddService,
    handleEditService,
    handleDeleteService,
    handleAddCategory,
    handleEditCategory,
    handleDeleteCategory,
    handleAddItem,
    handleEditItem,
    handleDeleteItem,
    serviciosRef,
    categoriasRef,
    itemsRef,
    setSelectedServCod,
    setSelectedSubCod,
    setItems,
  } = useMiscellaneousPage();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Contenido principal con scroll */}
      <main className="flex-grow p-6 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Tabla de Servicios */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <TableMiscellaneousPage
              services={services}
              selectedId={selectedServCod}
              onSelect={setSelectedServiceId}
              tableRef={serviciosRef}
              onAddItem={handleAddService}
              onEditService={handleEditService}
              onDeleteService={handleDeleteService}
            />
          </div>

          {selectedServCod && (
            /* Tabla de Categorías */
            <div className="bg-white rounded-xl shadow-lg p-6">
              <TableOptionServices
                categoria={categories}
                onClose={() => {
                  setSelectedServCod(null);
                  setSelectedSubCod(null);
                  setItems([]);
                }}
                onSelectSub={setSelectedCategoryId}
                selectedService={selectedServCod}
                selectedCatCod={selectedCatCod}
                tableRef={categoriasRef}
                addCategory={handleAddCategory}
                updateCategory={handleEditCategory}
                deleteCategory={handleDeleteCategory}
              />
            </div>
          )}

          {selectedCatCod && (
            /* Tabla de Items */
            <div className="bg-white rounded-xl shadow-lg p-6">
              <TableSubcategorie
                items={items}
                onClose={() => setSelectedSubCod(null)}
                onDeleteItem={handleDeleteItem}
                onEditItem={handleEditItem}
                onAddItem={handleAddItem}
                tableRef={itemsRef}
              />
            </div>
          )}
          
        </div>
      </main>

      {/* Espacio para el footer */}
      <div className="h-20 flex-shrink-0 bg-gray-50"></div>
    </div>
  );
}

export default MiscellaneousPage;