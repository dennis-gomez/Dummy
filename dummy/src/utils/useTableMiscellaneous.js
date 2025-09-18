import { useState } from "react";
import { tableValidator } from "/src/utils/tableValidator"; // ✅ validador centralizado
import Swal from "sweetalert2"; // ✅ alertas bonitas

export default function useTableMiscellaneous(
  services,
  onAddItem,
  onEditService,
  onDeleteService
) {
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  // 🔹 Agregar servicio con validación
  const handleAdd = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;

    const error = tableValidator({
      value: trimmed,
      list: services.map((s) => s.service_name?.trim().toLowerCase()),
    });

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Validación",
        text: error,
        confirmButtonColor: "#1976d2",
      });
      return;
    }

    await onAddItem(trimmed);
    setName("");
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") handleAdd();
  };

  // 🔹 Editar inline con validación
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

    // Evitar guardar si no cambió
    if (trimmed.toLowerCase() === (srv.service_name || "").trim().toLowerCase()) {
      cancelEdit();
      return;
    }

    const error = tableValidator({
      value: trimmed,
      list: services
        .filter((s) => s.cod_service !== srv.cod_service)
        .map((s) => s.service_name?.trim().toLowerCase()),
    });

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Validación",
        text: error,
        confirmButtonColor: "#1976d2",
      });
      return;
    }

    await onEditService?.(srv.cod_service, trimmed);
    cancelEdit();
  };

  // 🔹 Eliminar servicio
  const remove = async (cod_service) => {
    await onDeleteService?.(cod_service);
  };

  return {
    name,
    setName,
    editingId,
    editValue,
    setEditValue,
    handleAdd,
    onKeyDown,
    startEdit,
    cancelEdit,
    saveEdit,
    remove,
  };
}
