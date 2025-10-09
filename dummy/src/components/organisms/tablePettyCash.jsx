import { useState } from "react";
import { IconButton, Tooltip, TextField, CircularProgress } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import Button from "../atoms/button";
import ModalAlert from "../molecules/ModalAlert"; // Asegúrate de tener la ruta correcta
import ModalElimination from "../molecules/ModalElimination"; // Asegúrate de tener la ruta correcta

function PettyCashTable({ cashBoxes, onDelete, onEdit, onViewRecords, isLoading }) {
  const [editRowId, setEditRowId] = useState(null);
  const [editData, setEditData] = useState({});

  const handleEditClick = (box) => {
    setEditRowId(box.cod_petty_cash);
    setEditData({ ...box });
  };

  const handleCancel = () => {
    setEditRowId(null);
    setEditData({});
  };

  const handleChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      // Mostrar confirmación antes de guardar usando Swal directamente
      const Swal = (await import('sweetalert2')).default;
      const result = await Swal.fire({
        title: '¿Guardar cambios?',
        text: '¿Estás seguro de que deseas actualizar esta caja chica?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, guardar',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        await onEdit(editRowId, editData);
        setEditRowId(null);
        setEditData({});

        // Usar tu ModalAlert para éxito
        ModalAlert(
          '¡Guardado!',
          'La caja chica ha sido actualizada correctamente.',
          'success',
          2000
        );
      }
    } catch (error) {
      // Usar tu ModalAlert para error
      ModalAlert(
        'Error',
        error.message || 'Error al actualizar la caja chica',
        'error',
        3000
      );
    }
  };

  const handleDeleteWithModal = (id, boxData) => {
    // Crear mensaje personalizado para la caja chica
    const deleteMessage = `
      <div class="text-left">
        <p><strong>Caja Chica #${boxData.cod_petty_cash}</strong></p>
        <p><strong>Fecha:</strong> ${boxData.petty_cash_creation_date}</p>
        <p><strong>Monto original:</strong> ₡${parseFloat(boxData.petty_cash_original_amount).toFixed(2)}</p>
        <p><strong>Saldo actual:</strong> ₡${parseFloat(boxData.petty_cash_actual_amount || boxData.petty_cash_original_amount).toFixed(2)}</p>
      </div>
    `;

    return (
      <ModalElimination
        message={deleteMessage}
        onClick={async () => {
          try {
            await onDelete(id);
            ModalAlert(
              '¡Eliminada!',
              'La caja chica ha sido eliminada correctamente.',
              'success',
              2000
            );
          } catch (error) {
            ModalAlert(
              'Error',
              error.message || 'Error al eliminar la caja chica',
              'error',
              3000
            );
          }
        }}
      />
    );
  };

  const handleViewRecordsWithAlert = (box) => {
    // Usar ModalAlert para mostrar info y luego navegar
    ModalAlert(
      'Información de Caja Chica',
      `Caja #${box.cod_petty_cash} - Saldo: ₡${parseFloat(box.petty_cash_actual_amount || box.petty_cash_original_amount).toFixed(2)}`,
      'info',
      2000
    );

    // Navegar después de un breve delay
    setTimeout(() => {
      onViewRecords(box.cod_petty_cash);
    }, 2100);
  };

  // 🟦 Manejo de estados: cargando, vacío o tabla
  if (isLoading) {
    return (
      <div className="flex flex-wrap items-center gap-3 bg-white shadow-md rounded-2xl px-4 py-3 w-full max-w-3xl mx-auto">
        <CircularProgress size={24} />
        <span>Cargando cajas chicas...</span>
      </div>
    );
  }

  if (cashBoxes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 italic bg-gray-50 rounded-lg w-full max-w-3xl mx-auto mb-4">
        No hay cajas chicas registradas
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl shadow-lg">
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
            <th className="py-4 px-6 text-center font-semibold text-md w-12">#</th>
            <th className="py-4 px-6 text-center font-semibold text-md">Fecha creación</th>
            <th className="py-4 px-6 text-center font-semibold text-md">Monto original</th>
            <th className="py-4 px-6 text-center font-semibold text-md">Monto actual</th>
            <th className="py-4 px-6 text-center font-semibold text-md">Activo</th>
            <th className="py-4 px-6 text-center font-semibold text-md">Acciones</th>
            <th className="py-4 px-6 text-center font-semibold text-md rounded-tr-xl">
              Registros
            </th>
          </tr>
        </thead>
        <tbody>
          {cashBoxes.map((box, index) => (
            <tr
              key={box.cod_petty_cash}
              className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100`}
            >
              <td className="py-4 px-6 text-center">{box.cod_petty_cash}</td>
              {/* Fecha creación */}
              <td className="py-4 px-6 text-center">
                {editRowId === box.cod_petty_cash ? (
                  <TextField
                    type="date"
                    size="small"
                    value={editData.petty_cash_creation_date || ""}
                    onChange={(e) => handleChange("petty_cash_creation_date", e.target.value)}
                    sx={{ backgroundColor: "white", borderRadius: 1 }}
                  />
                ) : (
            new Date(box.petty_cash_creation_date + "T00:00:00Z")
  .toLocaleDateString('es-CR', {
    day: '2-digit',
    month: '2-digit',
     year: "numeric",
    timeZone: 'UTC' // fuerza que no se aplique la zona local
  })
  .replace(/\//g, '-')
                )}
              </td>

              {/* Monto original */}
              <td className="py-4 px-6 text-center">
                {editRowId === box.cod_petty_cash ? (
                  <TextField
                    type="number"
                    size="small"
                    value={editData.petty_cash_original_amount || ""}
                    onChange={(e) => handleChange("petty_cash_original_amount", e.target.value)}
                    sx={{ backgroundColor: "white", borderRadius: 1 }}
                  />
                ) : (
                  `₡${parseFloat(box.petty_cash_original_amount).toFixed(2)}`
                )}
              </td>

              {/* Monto actual */}
              <td className="py-4 px-6 text-center">
                {editRowId === box.cod_petty_cash ? (
                  <TextField
                    type="number"
                    size="small"
                    value={editData.petty_cash_actual_amount || ""}
                    onChange={(e) => handleChange("petty_cash_actual_amount", e.target.value)}
                    sx={{ backgroundColor: "white", borderRadius: 1 }}
                  />
                ) : (
                  `₡${parseFloat(box.petty_cash_actual_amount || box.petty_cash_original_amount).toFixed(2)}`
                )}
              </td>

              {/* Activo */}
              <td className="py-4 px-6 text-center">
                {editRowId === box.cod_petty_cash ? (
                  <select
                    value={editData.petty_cash_is_active ? 1 : 0}
                    onChange={(e) =>
                      handleChange("petty_cash_is_active", e.target.value === "1")
                    }
                    className="border rounded-md p-1"
                  >
                    <option value="1">Sí</option>
                    <option value="0">No</option>
                  </select>
                ) : box.petty_cash_is_active ? (
                  <span className="text-green-600 font-semibold">Sí</span>
                ) : (
                  <span className="text-red-600 font-semibold">No</span>
                )}
              </td>

              {/* Acciones */}
              <td className="py-4 px-6 text-center flex gap-2 justify-center">
                {editRowId === box.cod_petty_cash ? (
                  <>
                    <Tooltip title="Guardar">
                      <IconButton onClick={handleSave} sx={{ color: "primary.main" }}>
                        <SaveIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Cancelar">
                      <IconButton onClick={handleCancel} sx={{ color: "error.main" }}>
                        <CloseIcon />
                      </IconButton>
                    </Tooltip>
                  </>
                ) : (
                  <>
                    <Tooltip title="Editar">
                      <IconButton
                        onClick={() => handleEditClick(box)}
                        sx={{ color: "primary.main" }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>

                    {/* Usar tu ModalElimination personalizado */}
                    <Tooltip title="Eliminar">
                      {handleDeleteWithModal(box.cod_petty_cash, box)}
                    </Tooltip>
                  </>
                )}
              </td>

              {/* Botón Ver Registros */}
              <td className="py-4 px-6 text-center">
                <Button
                  text="Ver Registros"
                  onClick={() => handleViewRecordsWithAlert(box)}
                  className="h-12 w-full sm:w-48 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PettyCashTable;