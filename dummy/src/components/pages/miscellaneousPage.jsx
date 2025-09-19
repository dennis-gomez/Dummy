import React from "react";
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
    <div className="p-6">
      <div className="flex flex-col gap-6 items-center justify-center min-h-screen">
        {/* Tabla de Servicios */}
        <div className="w-full max-w-7xl min-w-[340px] mx-auto">
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
          <div className="w-full max-w-7xl min-w-[340px] mx-auto">
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
          <div className="w-full max-w-7xl min-w-[340px] mx-auto">
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
    </div>
  );
}

export default MiscellaneousPage;