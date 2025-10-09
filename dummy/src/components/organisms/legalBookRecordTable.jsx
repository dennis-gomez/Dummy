import { useState } from "react";
import {
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  Stack,
  Pagination,
  PaginationItem,
} from "@mui/material";
import Button from "../atoms/button";
import Swal from "sweetalert2";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import InputValidated from "../atoms/inputValidated";
import { formatDateDDMMYYYY } from "../../utils/generalUtilities";
import ReactivationModal from "../molecules/reactivationModal";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

function LegalBookRecordTable({
  books,
  booksItems,
  legalBookRecords,

  page,
  onPageChange,
  totalPages,

  isLoading,
  onDelete,
  onEdit,
  fields,
  editFields,
  onSearch,
  searchText,
  setSearchText,
  selectedBook,
  setSelectedBook,
  searchField,
  setSearchField,
  onToggleForm,
  onReactivate,
  showForm,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const dateFields = ["lb_record_date", "lb_record_return_date"];

  const getBookName = (bookCode) => {
    const book = books.find((book) => book.cod_book === bookCode);
    return book ? book.book_name : "Libro no encontrado";
  };

  const handleEditClick = (record) => {
    setEditingId(record.cod_registration_application);
    setEditData({ ...record });
  };

  const handleSaveEdit = async (record) => {
    const hasError = Object.values(fieldErrors).some((err) => err);
    if (hasError) {
      Swal.fire("Error", "Hay campos vacíos.", "error");
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
        setFieldErrors({});
        Swal.fire("Actualizado", "El registro fue modificado correctamente", "success");
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
    setFieldErrors({});
  };

  const handleValidatedDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Desactivar este registro?",
      text: "Podrás deshacer esta acción",
      icon: "error",
      showCancelButton: true,
      confirmButtonText: "Sí, desactivar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#9ca3af",
    });

    if (result.isConfirmed) {
      await onDelete(id);
      Swal.fire("Desactivado", "El registro fue desactivado", "success");
    }
  };

  const searchInputClass = "w-full sm:w-48 h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm";

  return (
    <>
      {/* Contenedor principal: buscador + botón */}
      <div className="flex flex-col lg:flex-row gap-4 w-full max-w-5xl mx-auto mb-4">
        <Box className="flex flex-wrap gap-3 bg-white shadow-md rounded-xl p-4 flex-1">
          <FormControl className={searchInputClass}>
            <InputLabel sx={{ backgroundColor: "white", px: 1 }}>Seleccione un libro</InputLabel>
            <Select value={selectedBook} onChange={(e) => setSelectedBook(e.target.value)}>
              <MenuItem value="Todos">Todos los libros</MenuItem>
              {books.map((book) => (
                <MenuItem key={book.cod_book} value={book.cod_book}>
                  {book.book_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl className={searchInputClass}>
            <InputLabel sx={{ backgroundColor: "white", px: 1 }}>Filtrar por</InputLabel>
            <Select 
              value={searchField} 
              onChange={(e) => { 
                setSearchField(e.target.value) 
                setSearchText("")
              }}
            >
              {fields
                .filter(field => field.name !== 'cod_book_catalog')
                .map(field => (
                  <MenuItem key={field.name} value={field.name}>
                    {field.placeholder}
                  </MenuItem>
                ))}
                <MenuItem value="estados">Estados</MenuItem>
            </Select>
          </FormControl>

          {searchField === "estados" ? (
            <FormControl className={searchInputClass}>
              <InputLabel sx={{ backgroundColor: "white", px: 1 }}>Estado</InputLabel>
                <Select
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                >
                  <MenuItem value="Activos">Activos</MenuItem>
                  <MenuItem value="Desactivados">Desactivados</MenuItem>
                </Select>
            </FormControl>
          ) : (
            <TextField
              label={dateFields.includes(searchField) ? "Seleccione fecha" : "Buscar"}
              type={dateFields.includes(searchField) ? "date" : "text"}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className={searchInputClass}
              InputLabelProps={{
                ...(dateFields.includes(searchField) ? { shrink: true } : {}),
                sx: { backgroundColor: "white", px: 1 },
              }}
              placeholder={dateFields.includes(searchField) ? "Seleccione fecha" : "Ingrese texto..."}
            />
          )}

          <div className="flex items-center justify-center lg:ml-9 w-full sm:w-auto">
            <Button
              text="Buscar"
              onClick={onSearch}
              className="h-12 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            />
          </div>
        </Box>

        <div className="flex items-center justify-center lg:justify-start lg:ml-9 w-full sm:w-auto">
          <div className="p-5 h-fit">
            <Button
              text={showForm ? "Cancelar" : "Agregar Registro"}
              onClick={onToggleForm}
              className="h-12 w-full sm:w-48 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Loader debajo del buscador */}
      {isLoading && (
        <div className="flex flex-wrap items-center gap-3 bg-white shadow-md rounded-2xl px-4 py-3 w-full max-w-3xl mx-auto mb-4">
          <CircularProgress size={24} />
          <span>Cargando registros...</span>
        </div>
      )}

      {/* Contenedor gris cuando no hay registros */}
      {!isLoading && legalBookRecords.length === 0 && (
        <div className="text-center py-8 text-gray-500 italic bg-gray-50 rounded-lg w-full max-w-3xl mx-auto mb-4">
          No se encontraron registros
        </div>
      )}

      {/* Tabla de registros */}
      {legalBookRecords.length > 0 && (
        <div className="overflow-x-auto rounded-xl shadow-lg mt-4 w-full">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                <th className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider rounded-tl-xl">#</th>
                <th className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider">Libro</th>
                <th className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider">Solicitado</th>
                <th className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider">Entregado</th>
                <th className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider">Regresado</th>
                <th className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider">Fecha registro</th>
                <th className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider">Fecha retorno</th>
                <th className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider">Observaciones</th>
                <th className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider rounded-tr-xl">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {legalBookRecords.map((record, index) => {
                const isEditing = editingId === record.cod_registration_application;
                return (
                  <tr key={record.cod_registration_application} className="hover:bg-blue-50 transition-all duration-200 even:bg-gray-50">
                    <td className="py-4 px-6 text-center font-medium text-gray-900">{index + 1}</td>

                    {isEditing ? (
                      <>
                        {editFields.map((field) => (
                          <td key={field.name} className="py-4 px-6 text-center">
                            <InputValidated
                              name={field.name}
                              type={field.type || "text"}
                              value={editData[field.name] || ""}
                              placeholder={field.placeholder}
                              options={field.options || []}
                              restriction={field.restriction}
                              validations={field.validations}
                              required={field.required}
                              onChange={(e) =>
                                setEditData({ ...editData, [field.name]: e.target.value })
                              }
                              onError={(name, errorMsg) =>
                                setFieldErrors((prev) => ({ ...prev, [name]: errorMsg }))
                              }
                              sx={{
                                "& .MuiInputBase-input": { backgroundColor: "#fff !important" },
                                ...(field.width ? { width: field.width } : {}),
                              }}
                              formValues={editData}
                            />
                          </td>
                        ))}

                        {/* Botones */}
                        <td className="py-4 px-6 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleSaveEdit(record)}
                              disabled={Object.values(fieldErrors).some((err) => err)}
                              className={`rounded-lg px-3 py-2 transition flex items-center text-sm ${
                                Object.values(fieldErrors).some((err) => err)
                                  ? "bg-gray-400 cursor-not-allowed text-white"
                                  : "bg-blue-600 hover:bg-blue-700 text-white"
                              }`}
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
                        {/* Filas en modo visualización */}
                        <td className="py-4 px-6 text-center text-gray-700">{getBookName(record.cod_book_catalog)}</td>
                        <td className="py-4 px-6 text-center text-gray-700">{record.lb_record_requested_by}</td>
                        <td className="py-4 px-6 text-center text-gray-700">{record.lb_record_delivered_to}</td>
                        <td className="py-4 px-6 text-center text-gray-700">{record.lb_record_return_by}</td>
                        <td className="py-4 px-6 text-center text-gray-700">{formatDateDDMMYYYY(record.lb_record_date)}</td>
                        <td className="py-4 px-6 text-center text-gray-700">{formatDateDDMMYYYY(record.lb_record_return_date)}</td>
                        <td className="py-4 px-6 text-center text-gray-700 max-w-xs truncate" title={record.lb_record_observation}>
                          {record.lb_record_observation}
                        </td>
                        <td className="py-4 px-6 text-center">
                         {record.lb_record_is_active ? (
                          <div className="flex justify-center space-x-3">
                            <button
                              onClick={() => handleEditClick(record)}
                              className="text-blue-500 hover:text-blue-700 transition p-2 rounded-full hover:bg-blue-50"
                            >
                              <EditIcon fontSize="small" />
                            </button>
                            <button
                              onClick={() => handleValidatedDelete(record.cod_registration_application)}
                              className="text-red-500 hover:text-red-700 transition p-2 rounded-full hover:bg-red-50"
                            >
                              <DeleteIcon fontSize="small" />
                            </button>
                          </div>
                          ):(
                            <ReactivationModal
                              message={"¿Quieres reactivar este registro?"}
                              onClick={() => onReactivate(record.cod_registration_application)}
                            />
                          )}
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <Stack spacing={30 } alignItems="center" marginY={2}>
            <Pagination
              count= {totalPages}
              page={page}
              color="primary"
              onChange={(e, value) => onPageChange(value)}
              renderItem={(item) => (
              <PaginationItem
                slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                {...item}
              />
              )}
            />
          </Stack>
        </div>
      )}
    </>
  );
}

export default LegalBookRecordTable;
