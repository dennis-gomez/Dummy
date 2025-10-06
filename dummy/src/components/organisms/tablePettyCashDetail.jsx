import { useState } from "react";
import {
  IconButton,
  Tooltip,
  TextField,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import ModalAlert from "../molecules/ModalAlert"; // Asegúrate de tener la ruta correcta
import ModalElimination from "../molecules/ModalElimination"; // Asegúrate de tener la ruta correcta

function PettyCashDetailTable({ details, onDelete, onEdit, isLoading }) {
  const [editRowId, setEditRowId] = useState(null);
  const [editData, setEditData] = useState({});

  // 🔒 Blindaje para evitar undefined/null
  const safeDetails = Array.isArray(details) ? details : [];

  const handleEditClick = (detail) => {
    setEditRowId(detail.cod_petty_cash_details);
    setEditData({ ...detail });
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
        text: '¿Estás seguro de que deseas actualizar este movimiento?',
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
          'El movimiento ha sido actualizado correctamente.', 
          'success', 
          2000
        );
      }
    } catch (error) {
      // Usar tu ModalAlert para error
      ModalAlert(
        'Error', 
        error.message || 'Error al actualizar el movimiento', 
        'error', 
        3000
      );
    }
  };

  const handleDeleteWithModal = (id, detailData) => {
    // Crear mensaje personalizado para el movimiento
    const deleteMessage = `
      <div class="text-left">
        <p><strong>Movimiento #${detailData.cod_petty_cash_details}</strong></p>
        <p><strong>Fecha:</strong> ${detailData.petty_cash_details_date}</p>
        <p><strong>Proveedor:</strong> ${detailData.petty_cash_details_provider}</p>
        <p><strong>Solicitante:</strong> ${detailData.petty_cash_details_requester}</p>
        <p><strong>Monto:</strong> ₡${parseFloat(detailData.petty_cash_details_amount).toFixed(2)}</p>
        <p><strong>Descripción:</strong> ${detailData.petty_cash_details_description}</p>
      </div>
    `;

    return (
      <ModalElimination
        message={deleteMessage}
        onClick={async () => {
          try {
            await onDelete(id);
            ModalAlert(
              '¡Eliminado!', 
              'El movimiento ha sido eliminado correctamente.', 
              'success', 
              2000
            );
          } catch (error) {
            ModalAlert(
              'Error', 
              error.message || 'Error al eliminar el movimiento', 
              'error', 
              3000
            );
          }
        }}
      />
    );
  };

  // 🟦 Estado cargando
  if (isLoading) {
    return (
      <div className="flex items-center gap-3 bg-white shadow-md rounded-2xl px-4 py-3 w-full max-w-4xl mx-auto">
        <CircularProgress size={24} />
        <span>Cargando movimientos...</span>
      </div>
    );
  }

  // 🟦 Estado vacío
  if (safeDetails.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 italic bg-gray-50 rounded-lg w-full max-w-4xl mx-auto mb-4">
        No hay movimientos registrados aún
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl shadow-lg">
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
            <th className="py-4 px-6 text-center font-semibold text-md w-12">#</th>
            <th className="py-4 px-6 text-center font-semibold text-md">Fecha</th>
            <th className="py-4 px-6 text-center font-semibold text-md">Proveedor</th>
            <th className="py-4 px-6 text-center font-semibold text-md">Solicitante</th>
            <th className="py-4 px-6 text-center font-semibold text-md">Detalle</th>
            <th className="py-4 px-6 text-center font-semibold text-md">Monto (₡)</th>
            <th className="py-4 px-6 text-center font-semibold text-md rounded-tr-xl">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {safeDetails.map((detail, index) => (
            <tr
              key={detail.cod_petty_cash_details ?? index}
              className={`${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:bg-gray-100`}
            >
              {/* Número */}
              <td className="py-4 px-6 text-center">{index + 1}</td>

              {/* Fecha */}
              <td className="py-4 px-6 text-center">
                {editRowId === detail.cod_petty_cash_details ? (
                  <TextField
                    type="date"
                    size="small"
                    value={editData.petty_cash_details_date || ""}
                    onChange={(e) =>
                      handleChange("petty_cash_details_date", e.target.value)
                    }
                    sx={{ backgroundColor: "white", borderRadius: 1 }}
                  />
                ) : (
                  detail.petty_cash_details_date
                )}
              </td>

              {/* Proveedor */}
              <td className="py-4 px-6 text-center">
                {editRowId === detail.cod_petty_cash_details ? (
                  <TextField
                    size="small"
                    value={editData.petty_cash_details_provider || ""}
                    onChange={(e) =>
                      handleChange("petty_cash_details_provider", e.target.value)
                    }
                    sx={{ backgroundColor: "white", borderRadius: 1 }}
                  />
                ) : (
                  detail.petty_cash_details_provider
                )}
              </td>

              {/* Solicitante */}
              <td className="py-4 px-6 text-center">
                {editRowId === detail.cod_petty_cash_details ? (
                  <TextField
                    size="small"
                    value={editData.petty_cash_details_requester || ""}
                    onChange={(e) =>
                      handleChange("petty_cash_details_requester", e.target.value)
                    }
                    sx={{ backgroundColor: "white", borderRadius: 1 }}
                  />
                ) : (
                  detail.petty_cash_details_requester
                )}
              </td>

              {/* Descripción */}
              <td className="py-4 px-6 text-center">
                {editRowId === detail.cod_petty_cash_details ? (
                  <TextField
                    size="small"
                    value={editData.petty_cash_details_description || ""}
                    onChange={(e) =>
                      handleChange("petty_cash_details_description", e.target.value)
                    }
                    sx={{ backgroundColor: "white", borderRadius: 1 }}
                  />
                ) : (
                  <span title={detail.petty_cash_details_description}>
                    {detail.petty_cash_details_description?.length > 50 
                      ? `${detail.petty_cash_details_description.substring(0, 50)}...` 
                      : detail.petty_cash_details_description}
                  </span>
                )}
              </td>

              {/* Monto */}
              <td className="py-4 px-6 text-center font-semibold text-gray-800">
                {editRowId === detail.cod_petty_cash_details ? (
                  <TextField
                    type="number"
                    size="small"
                    value={editData.petty_cash_details_amount || ""}
                    onChange={(e) =>
                      handleChange("petty_cash_details_amount", e.target.value)
                    }
                    sx={{ backgroundColor: "white", borderRadius: 1 }}
                  />
                ) : (
                  `₡${parseFloat(detail.petty_cash_details_amount).toFixed(2)}`
                )}
              </td>

              {/* Acciones */}
              <td className="py-4 px-6 text-center flex gap-2 justify-center">
                {editRowId === detail.cod_petty_cash_details ? (
                  <>
                    <Tooltip title="Guardar">
                      <IconButton
                        onClick={handleSave}
                        sx={{ color: "primary.main" }}
                      >
                        <SaveIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Cancelar">
                      <IconButton
                        onClick={handleCancel}
                        sx={{ color: "error.main" }}
                      >
                        <CloseIcon />
                      </IconButton>
                    </Tooltip>
                  </>
                ) : (
                  <>
                    <Tooltip title="Editar">
                      <IconButton
                        onClick={() => handleEditClick(detail)}
                        sx={{ color: "primary.main" }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    
                    {/* Usar tu ModalElimination personalizado */}
                    <Tooltip title="Eliminar">
                      {handleDeleteWithModal(detail.cod_petty_cash_details, detail)}
                    </Tooltip>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PettyCashDetailTable;