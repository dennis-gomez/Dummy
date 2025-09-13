import { useState } from "react";

export default function useTableSubcategorie(items, onAddItem, onEditItem) {
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  const handleAdd = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    await onAddItem(trimmed);
    setName("");
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") handleAdd();
  };

  const handleEditClick = (item) => {
    setEditingId(item.cod_item);
    setEditValue(item.item_name);
  };

  const handleSaveEdit = async (cod_category, cod_service, cod_item) => {
    await onEditItem(cod_category, cod_service, cod_item, editValue);
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
    setEditValue, // ✅ agregado
    handleAdd,
    onKeyDown,
    handleEditClick,
    handleSaveEdit,
    handleCancel,
  };
}
