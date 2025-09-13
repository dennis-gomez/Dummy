import ModalElimination from "../molecules/modalElimination";
import Button from "../atoms/button";
import "/src/styles/table.css";
import useTableOptionServices from "/src/utils/useTableOptionServices";

function TableOptionServices({
  categoria,
  onClose,
  onSelectSub,
  selectedService,
  selectedCatCod,
  addCategory,
  updateCategory,
  deleteCategory,
  tableRef,
}) {
  const {
    name,
    setName,
    editingId,
    editValue,
    setEditValue,
    handleValidatedAdd,  // ✅ ya viene del hook con validación + Swal
    startEdit,
    cancelEdit,
    saveEdit,
    remove,
  } = useTableOptionServices(
    categoria,
    selectedService,
    addCategory,
    updateCategory,
    deleteCategory
  );

  if (!categoria) return null;

  return (
    <>
      <div className="toolbar">
        <div className="input-group">
          <label>Nueva categoría:</label>
          <input
            type="text"
            placeholder="Escribe una categoría"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleValidatedAdd()}
          />
          <button
            className="btn"
            onClick={handleValidatedAdd}
            disabled={!name.trim()}
          >
            Agregar
          </button>
          <button className="btn" onClick={onClose}>Cerrar</button>
        </div>
      </div>

      <table ref={tableRef} className="tablas" aria-label="Tabla de Categorías">
        <thead>
          <tr>
            <th style={{ width: 110 }}>codigo servicio</th>
            <th style={{ width: 110 }}>codigo categoría</th>
            <th>categoría</th>
            <th style={{ width: 180 }}>acciones</th>
          </tr>
        </thead>
        <tbody>
          {categoria.length === 0 ? (
            <tr><td colSpan={4}>Sin categorías</td></tr>
          ) : (
            categoria.map((sub) => {
              const isEditing = editingId === sub.cod_category;
              return (
                <tr key={sub.cod_category} className={selectedCatCod === sub.cod_category ? "selected" : ""}>
                  <td>{sub.cod_service}</td>
                  <td>{sub.cod_category}</td>
                  <td
                    onClick={() => !isEditing && onSelectSub(sub.cod_category, sub.cod_service)}
                  >
                    {isEditing ? (
                      <input
                        className="inline-input"
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                      />
                    ) : sub.category_name}
                  </td>
                  <td>
                    {isEditing ? (
                      <div className="acciones">
                        <Button text="Guardar" onClick={() => saveEdit(sub)} />
                        <Button text="Cancelar" onClick={cancelEdit} />
                      </div>
                    ) : (
                      <div className="acciones">
                        <ModalElimination
                          message="¿Quieres eliminar esta categoría?"
                          onClick={() => remove(sub.cod_category, sub.cod_service)}
                        />
                        <Button text="Editar" onClick={() => startEdit(sub)} />
                      </div>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </>
  );
}

export default TableOptionServices;
