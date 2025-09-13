import { useState } from "react";

export default function useTableMiscellaneous(services, onAddItem, onEditService, onDeleteService) {
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  // Agregar servicio
  const handleAdd = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;

    const exists = services.some(
      (s) => s.service_name?.trim().toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) {
      alert("Ya existe un servicio con ese nombre.");
      return;
    }
    await onAddItem(trimmed);
    setName("");
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") handleAdd();
  };

  // Editar inline
  const startEdit = (srv) => {
    setEditingId(srv.cod_service);
    setEditValue(srv.service_name || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  const saveEdit = async (srv) => {
    const trimmed = editValue.trim();
    if (!trimmed) return;
    if (trimmed === (srv.service_name || "").trim()) {
      cancelEdit();
      return;
    }

    const exists = services.some(
      (s) =>
        s.cod_service !== srv.cod_service &&
        s.service_name?.trim().toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) {
      alert("Ya existe un servicio con ese nombre.");
      return;
    }

    await onEditService?.(srv.cod_service, trimmed);
    cancelEdit();
  };

  // Eliminar
  const remove = async (cod_service) => {
    await onDeleteService?.(cod_service);
  };

  return {
    name,
    setName,
    editingId,
    editValue,
    setEditValue, // ✅ agregado para que el input funcione
    handleAdd,
    onKeyDown,
    startEdit,
    cancelEdit,
    saveEdit,
    remove,
  };
}

