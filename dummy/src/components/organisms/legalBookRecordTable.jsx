import { useState } from "react";
import {
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
} from "@mui/material";
import Button from "../atoms/button";
import Swal from "sweetalert2";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";

function LegalBookRecordTable({
  books,
  legalBookRecords,
  isLoading,
  onDelete,
  onEdit,
  fields,
  onSearch,
  onResetSearch,
  searchText,
  setSearchText,
  selectedBook,
  setSelectedBook,
  searchField,
  setSearchField,
  onToggleForm,
  showForm,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const getBookName = (bookCode) => {
    const book = books.find((book) => book.cod_book === bookCode);
    return book ? book.book_name : "Libro no encontrado";
  };

  const handleEditClick = (record) => {
    setEditingId(record.cod_registration_application);
    setEditData({ ...record });
  };

  const handleSaveEdit = async (record) => {
    if (!editData.lb_record_requested_by?.trim()) {
      Swal.fire("Error", "El campo 'Solicitado' no puede estar vacío", "error");
      return;
    }

    const result = await Swal.fire({
      title: "¿Guardar cambios?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, guardar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#9ca3af",
    });

    if (result.isConfirmed) {
      const isSaved = await onEdit(editData);
      if (isSaved) {
        setEditingId(null);
        setEditData({});
        Swal.fire("Actualizado", "El registro fue modificado correctamente", "success");
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleValidatedDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar este registro?",
      text: "No podrás deshacer esta acción",
      icon: "error",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#9ca3af",
    });

    if (result.isConfirmed) {
      await onDelete(id);
      Swal.fire("Eliminado", "El registro fue borrado", "success");
    }
  };

  return (
    <>
    {/* Botón agregar separado a la derecha */}
<div className="gird w-full max-w-5xl mx-auto mb-4 text-right">
  <Button
    text={showForm ? "Cancelar" : "Agregar Registro"}
    onClick={onToggleForm}
  />
</div>
      {isLoading ? (
        <div className="flex flex-wrap items-center gap-3 bg-white shadow-md rounded-2xl px-4 py-3 w-full max-w-3xl mx-auto">
          <p className="text-gray-700 font-medium mb-2">Cargando registros...</p>
          <CircularProgress />
        </div>
        
      ) : (
        <>
          {/* Filtros */}
          <Box className="flex flex-col gap-4 bg-white  shadow-md rounded-2xl p-4 w-full max-w-5xl mx-auto mb-4">
  <div className="flex flex-wrap gap-3 items-end">
    <FormControl className="w-full max-w-[250px] h-12">
      <InputLabel>Filtrar por libro</InputLabel>
      <Select
        value={selectedBook}
        onChange={(e) => setSelectedBook(e.target.value)}
        label="Filtrar por libro"
        className="h-12 px-4 text-sm"
      >
        <MenuItem value="">Todos los libros</MenuItem>
        {books.map((book) => (
          <MenuItem key={book.cod_book} value={book.cod_book}>
            {book.book_name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    <FormControl className="w-full max-w-[250px] h-12">
      <InputLabel>Buscar por campo</InputLabel>
      <Select
        value={searchField}
        onChange={(e) => setSearchField(e.target.value)}
        label="Buscar por campo"
        className="h-12 px-4 text-sm"
      >
        {fields.map((field) => (
          <MenuItem key={field.name} value={field.name}>
            {field.placeholder}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    <TextField
      label="Texto a buscar"
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
      className="w-full max-w-[250px] h-12 px-4 text-sm"
      placeholder="Ingrese texto a buscar..."
      InputProps={{ className: "h-12 px-4 text-sm" }}
    />

    <div className="flex gap-2 mt-1">
      <Button text="Buscar" onClick={onSearch} />
      <Button text="Limpiar" onClick={onResetSearch} variant="outlined" />
    </div>
  </div>
</Box>
</>
      )}
      {/* Tabla */}
      <div className="overflow-x-auto rounded-xl shadow-lg mt-4 w-full">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
              <th className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider rounded-tl-xl">
                #
              </th>
              <th className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider">
                Libro
              </th>
              <th className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider">
                Solicitado
              </th>
              <th className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider">
                Entregado
              </th>
              <th className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider">
                Regresado
              </th>
              <th className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider">
                Fecha registro
              </th>
              <th className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider">
                Fecha retorno
              </th>
              <th className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider">
                Observaciones
              </th>
              <th className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider rounded-tr-xl">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {legalBookRecords.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="py-8 px-6 text-center text-gray-500 italic bg-gray-50 rounded-lg"
                >
                  No se encontraron registros
                </td>
              </tr>
            ) : (
              legalBookRecords.map((record, index) => {
                const isEditing = editingId === record.cod_registration_application;

                return (
                  <tr
                    key={record.cod_registration_application}
                    className="hover:bg-blue-50 transition-all duration-200 even:bg-gray-50"
                  >
                    <td className="py-4 px-6 text-center align-middle font-medium text-gray-900">
                      {index + 1}
                    </td>

                    {isEditing ? (
                      <>
                        <td className="py-4 px-6 text-center align-middle text-gray-700">
                          <FormControl fullWidth size="small">
                            <Select
                              value={editData.cod_book_catalog || ""}
                              onChange={(e) =>
                                setEditData({ ...editData, cod_book_catalog: e.target.value })
                              }
                            >
                              {books.map((book) => (
                                <MenuItem key={book.cod_book} value={book.cod_book}>
                                  {book.book_name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </td>
                        <td className="py-4 px-6 text-center align-middle">
                          <input
                            className="min-w-[100px] w-full max-w-[280px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                            value={editData.lb_record_requested_by || ""}
                            onChange={(e) =>
                              setEditData({ ...editData, lb_record_requested_by: e.target.value })
                            }
                          />
                        </td>
                        <td className="py-4 px-6 text-center align-middle">
                          <input
                            className="min-w-[100px] w-full max-w-[280px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                            value={editData.lb_record_delivered_to || ""}
                            onChange={(e) =>
                              setEditData({ ...editData, lb_record_delivered_to: e.target.value })
                            }
                          />
                        </td>
                        <td className="py-4 px-6 text-center align-middle">
                          <input
                            className="min-w-[100px] w-full max-w-[280px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                            value={editData.lb_record_return_by || ""}
                            onChange={(e) =>
                              setEditData({ ...editData, lb_record_return_by: e.target.value })
                            }
                          />
                        </td>
                        <td className="py-4 px-6 text-center align-middle">
                          <input
                            type="date"
                            className="min-w-[100px] w-full max-w-[280px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                            value={editData.lb_record_date || ""}
                            onChange={(e) =>
                              setEditData({ ...editData, lb_record_date: e.target.value })
                            }
                          />
                        </td>
                        <td className="py-4 px-6 text-center align-middle">
                          <input
                            type="date"
                            className="min-w-[100px] w-full max-w-[280px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                            value={editData.lb_record_return_date || ""}
                            onChange={(e) =>
                              setEditData({ ...editData, lb_record_return_date: e.target.value })
                            }
                          />
                        </td>
                        <td className="py-4 px-6 text-center align-middle">
                          <textarea
                            className="min-w-[100px] w-full max-w-[280px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                            value={editData.lb_record_observation || ""}
                            onChange={(e) =>
                              setEditData({ ...editData, lb_record_observation: e.target.value })
                            }
                            rows={2}
                          />
                        </td>
                        <td className="py-4 px-6 text-center align-middle">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleSaveEdit(record)}
                              className="bg-blue-600 text-white rounded-lg px-3 py-2 hover:bg-blue-700 transition flex items-center text-sm"
                            >
                              <SaveIcon className="mr-1" fontSize="small" /> Guardar
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-100 transition flex items-center text-sm"
                            >
                              <CancelIcon className="mr-1" fontSize="small" /> Cancelar
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-4 px-6 text-center align-middle text-gray-700">
                          {getBookName(record.cod_book_catalog)}
                        </td>
                        <td className="py-4 px-6 text-center align-middle text-gray-700">
                          {record.lb_record_requested_by}
                        </td>
                        <td className="py-4 px-6 text-center align-middle text-gray-700">
                          {record.lb_record_delivered_to}
                        </td>
                        <td className="py-4 px-6 text-center align-middle text-gray-700">
                          {record.lb_record_return_by}
                        </td>
                        <td className="py-4 px-6 text-center align-middle text-gray-700">
                          {record.lb_record_date}
                        </td>
                        <td className="py-4 px-6 text-center align-middle text-gray-700">
                          {record.lb_record_return_date}
                        </td>
                        <td
                          className="py-4 px-6 text-center align-middle text-gray-700 max-w-xs truncate"
                          title={record.lb_record_observation}
                        >
                          {record.lb_record_observation}
                        </td>
                        <td className="py-4 px-6 text-center align-middle">
                          <div className="flex justify-center space-x-3">
                            <button
                              onClick={() => handleEditClick(record)}
                              className="text-blue-500 hover:text-blue-700 transition p-2 rounded-full hover:bg-blue-50"
                            >
                              <EditIcon fontSize="small" />
                            </button>
                            <button
                              onClick={() =>
                                handleValidatedDelete(record.cod_registration_application)
                              }
                              className="text-red-500 hover:text-red-700 transition p-2 rounded-full hover:bg-red-50"
                            >
                              <DeleteIcon fontSize="small" />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default LegalBookRecordTable;
