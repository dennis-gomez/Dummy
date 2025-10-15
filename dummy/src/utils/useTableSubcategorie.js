import { useState } from "react";
import { tableValidator } from "/src/utils/tableValidator";
import Swal from "sweetalert2";

export default function useTableSubcategorie(items, onAddItem, onEditItem) {
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  // Agregar con validación
  const handleAdd = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;

    const error = tableValidator({
      value: trimmed,
      list: items.map((i) => i.item_name?.trim().toLowerCase()),
    });

    if (error) {
      Swal.fire({ icon: "error", title: "Validación", text: error });
      return;
    }

    await onAddItem(trimmed);
    setName("");
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") handleAdd();
  };

  // Iniciar edición
  const handleEditClick = (item) => {
    setEditingId(item.cod_item);
    setEditValue(item.item_name || "");
  };

  // Guardar edición con validación
  const handleSaveEdit = async (cod_category, cod_service, cod_item) => {
    const trimmed = editValue.trim();
    if (!trimmed) return;

    // evitar guardar si no hubo cambios
    if (trimmed.toLowerCase() === (items.find(i => i.cod_item === cod_item)?.item_name || "").toLowerCase()) {
      handleCancel();
      return;
    }

    const error = tableValidator({
      value: trimmed,
      list: items
        .filter((i) => i.cod_item !== cod_item)
        .map((i) => i.item_name?.trim().toLowerCase()),
    });

    if (error) {
      Swal.fire({ icon: "error", title: "Validación", text: error });
      return;
    }

console.log("Editing item:", { cod_category, cod_service, cod_item, trimmed });

    await onEditItem(cod_category, cod_service, cod_item, trimmed);
    setEditingId(null);
    setEditValue("");
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValue("");
  };

  return {
    name,
    setName,
    editingId,
    editValue,
    setEditValue,
    handleAdd,
    onKeyDown,
    handleEditClick,
    handleSaveEdit,
    handleCancel,
  };
}
