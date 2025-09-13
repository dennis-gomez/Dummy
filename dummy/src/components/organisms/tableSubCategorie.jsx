import ModalElimination from "../molecules/modalElimination";
import Button from "../atoms/button";
import "/src/styles/table.css";
import useTableSubcategorie from "/src/utils/useTableSubcategorie";
import { tableValidator } from "/src/utils/tableValidator";
import Swal from "sweetalert2";

function TableSubcategorie({
  items,
  onClose,
  onDeleteItem,
  onAddItem,
  onEditItem,
  tableRef,
}) {
  const {
    name,
    setName,
    editingId,
    editValue,
    setEditValue,
    handleAdd,
    handleEditClick,
    handleSaveEdit,
    handleCancel,
  } = useTableSubcategorie(items, onAddItem, onEditItem);

  if (!items) return null;

  // 🔹 Validación al agregar
  const handleValidatedAdd = async () => {
    const error = tableValidator({
      value: name,
      list: items.map((i) => i.item_name.toLowerCase()),
    });

    if (error) {
      Swal.fire({ icon: "error", title: "Validación", text: error });
      return;
    }
    await handleAdd();
  };

  // 🔹 Validación al editar
  const handleValidatedSave = async (det) => {
    const error = tableValidator({
      value: editValue,
      list: items
        .filter((i) => i.cod_item !== det.cod_item)
        .map((i) => i.item_name.toLowerCase()),
    });

    if (error) {
      Swal.fire({ icon: "error", title: "Validación", text: error });
      return;
    }
    await handleSaveEdit(det.cod_category, det.cod_service, det.cod_item);
  };

  return (
    <>
      <div className="toolbar">
        <div className="input-group">
          <label>Nombre de item:</label>
          <input
            type="text"
            placeholder="Escribe un item"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleValidatedAdd()}
          />
          <button className="btn" onClick={handleValidatedAdd} disabled={!name.trim()}>
            Agregar
          </button>
          <button className="btn" onClick={onClose}>Cerrar</button>
        </div>
      </div>

      <table ref={tableRef} className="tablas" aria-label="Tabla de Items">
        <thead>
          <tr>
            <th style={{ width: 120 }}>codigo servicio</th>
            <th style={{ width: 120 }}>codigo categoria</th>
            <th style={{ width: 120 }}>codigo item</th>
            <th>items</th>
            <th style={{ width: 120 }}>acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr><td colSpan={5}>Sin detalles</td></tr>
          ) : (
            items.map((det) => {
              const isEditing = editingId === det.cod_item;
              return (
                <tr key={det.cod_item}>
                  <td>{det.cod_service}</td>
                  <td>{det.cod_category}</td>
                  <td>{det.cod_item}</td>
                  <td>
                    {isEditing ? (
                      <input
                        className="inline-input"
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                      />
                    ) : det.item_name}
                  </td>
                  <td>
                    {isEditing ? (
                      <div className="acciones">
                        <Button text="Guardar" onClick={() => handleValidatedSave(det)} />
                        <Button text="Cancelar" onClick={handleCancel} />
                      </div>
                    ) : (
                      <div className="acciones">
                        <ModalElimination message="¿Quieres eliminar este item?" onClick={() => onDeleteItem(det.cod_category, det.cod_service, det.cod_item)} />
                        <Button text="Editar" onClick={() => handleEditClick(det)} />
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
export default TableSubcategorie;
