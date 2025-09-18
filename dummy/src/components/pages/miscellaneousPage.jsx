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
    <div style={{ padding: 24 }}>
      <style>{`
        .tables-flex {
          display: flex;
          flex-direction: column;
          gap: 24px;
          align-items: center;
          justify-content: center;
          min-height: 80vh;
        }
        .panel {
          width: 100%;
          max-width: 600px;
          min-width: 340px;
          margin: 0 auto;
        }
      `}</style>

      <div className="tables-flex">
        <div className="panel">
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
          <div className="panel">
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
          <div className="panel">
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
