import { useState } from "react";
import { tableValidator } from "/src/utils/tableValidator"; // ✅ validador centralizado
import Swal from "sweetalert2"; // ✅ mensajes bonitos

export default function useTableOptionServices(
  categoria,
  selectedService,
  addCategory,
  updateCategory,
  deleteCategory
) {
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  // 🔹 Agregar categoría con validación
  const handleValidatedAdd = async () => {
    const error = tableValidator({
      value: name,
      list: categoria.map((c) => c.category_name?.trim().toLowerCase()),
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

    await addCategory(selectedService, name.trim());
    setName("");
  };

  const startEdit = (cat) => {
    setEditingId(cat.cod_category);
    setEditValue(cat.category_name || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  // 🔹 Guardar edición con validación
  const saveEdit = async (cat) => {
    const trimmed = editValue.trim();
    if (!trimmed) return;

    // Evitar cambios sin modificaciones
    if (trimmed.toLowerCase() === (cat.category_name || "").trim().toLowerCase()) {
      cancelEdit();
      return;
    }

    const error = tableValidator({
      value: trimmed,
      list: categoria
        .filter((c) => c.cod_category !== cat.cod_category) // excluir el que se edita
        .map((c) => c.category_name?.trim().toLowerCase()),
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

    await updateCategory(cat.cod_category, cat.cod_service, trimmed);
    cancelEdit();
  };

  const remove = async (cod_category, cod_service) => {
    await deleteCategory(cod_category, cod_service);
  };

  return {
    name,
    setName,
    editingId,
    editValue,
    setEditValue,
    handleValidatedAdd, // ✅ reemplaza a handleAdd
    startEdit,
    cancelEdit,
    saveEdit,
    remove,
  };
}
