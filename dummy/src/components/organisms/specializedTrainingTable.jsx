import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import Seeker from "../molecules/seeker";
import { CircularProgress, Box } from "@mui/material";
import Button from "../atoms/button";
import InputValidated from "../atoms/inputValidated";
import InputValidatedFile from "../atoms/inputValidatedFile";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import { formatDateDDMMYYYY } from "../../utils/generalUtilities";

const SpecializedTrainingTable = ({
  fields,
  data,
  singularName = "Item",
  isLoading,
  onEdit,
  handleSearch,
  searchFields,
  setisCreatingSpecializedTraining,
  isCreatingSpecializedTraining,
  openPDF,
  tableName,
  onStartEdit,
  setEditingIdProp,
  pageChange,
  currentPage,
  totalPages,
}) => {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [editErrors, setEditErrors] = useState({});
  const [searchText, setSearchText] = useState("");
  const [searchFeature, setSearchFeature] = useState(() => searchFields?.[0]?.name || "");
  const [isUnique, setIsUnique] = useState(true);

  const whiteInputStyle = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#ffffff",
      overflow: "auto",
      "&.Mui-error .MuiOutlinedInput-notchedOutline": {
        borderColor: "blue",
      },
    },
    "& .MuiFormHelperText-root.Mui-error": {
      color: "blue",
    },
    "& .MuiInputLabel-root.Mui-error": {
      color: "inherit",
    },
  };

  const handleEditClick = (row) => {
    // aviso al padre para cerrar formulario de creación
    if (onStartEdit) onStartEdit();


    console.log("SpecializedTrainingTable: handleEditClick called with row:", row
    );

    const id = row[fields[0].name];
    setEditingId(id);
    if (setEditingIdProp) setEditingIdProp(id); // levantar al padre si es necesario

    setEditData(row
    );
    setEditErrors({});
  };

  const handleSaveEdit = async () => {
    await onEdit(editData, currentPage);
    setEditingId(null);
    if (setEditingIdProp) setEditingIdProp(null);
    setEditData({});
    setEditErrors({});
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    if (setEditingIdProp) setEditingIdProp(null);
    setEditData({});
    setEditErrors({});
  };


  return (
    <div className="dinamic-table-container p-6 mt-6 bg-white rounded-2xl">
      {/* Buscador + botón agregar */}
      <div className="flex flex-col lg:flex-row gap-4 w-full max-w-5xl mx-auto mb-4">
        <Box className="flex flex-wrap gap-3 bg-white rounded-xl p-4 flex-1">
          <Seeker
            inputName="searchText"
            inputPlaceholder={`Buscar ${singularName}`}
            btnName="Buscar"
            selectName="Filtrar por"
            fields={searchFields}
            valueText={searchText}
            valueFeature={searchFeature}
            onChangeText={setSearchText}
            onChangeFeature={setSearchFeature}
            onClick={() => {
              handleSearch(searchFeature, searchText, 1)

            }}
          />
        </Box>
        <div className="flex items-center justify-center lg:justify-start w-full sm:w-auto">
          <div className="p-4 h-fit">
            <Button
              text={isCreatingSpecializedTraining ? "Cancelar" : `Agregar ${singularName}`}
              onClick={() => {
                if (!isCreatingSpecializedTraining && editingId) handleCancelEdit(); // cancela edición si se abre formulario
                setisCreatingSpecializedTraining(!isCreatingSpecializedTraining);
              }}
              className="h-12 w-full sm:w-48 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Tabla */}
      {isLoading ? (
        <div className="flex flex-wrap items-center gap-3 bg-white shadow-md rounded-2xl px-4 py-3 w-full max-w-3xl mx-auto">
          <CircularProgress size={24} />
          <span>Cargando {tableName}...</span>
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-8 text-gray-500 italic bg-gray-50 rounded-lg">
          No hay {tableName} registrados
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-lg">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                <th className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider rounded-tl-xl w-12">#</th>
                {fields.slice(1).map(f => (
                  <th key={f.name} className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider" style={{ minWidth: "150px" }}>
                    {f.label}
                  </th>
                ))}
                <th className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider rounded-tr-xl w-32">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {data.map((row, index) => {
                const isEditing = editingId === row[fields[0].name];
                console.log("isEditing:", row[fields[0].name]);
                return (
                  <tr key={row[fields[0].name] || index} className={`hover:bg-blue-50 transition-all duration-200 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                    <td className="py-4 px-6 text-center">{index + 1}</td>

                    {fields.slice(1).map(f => (
                      <td key={f.name} className="py-4 px-6 text-center text-gray-700">
                        {isEditing ? (
                          f.type === "textarea" ? (
                            <InputValidated
                              name={f.name}
                              type="textarea"
                              value={editData[f.name] || ""}
                              onChange={e => {
                                const value = e.target.value;
                                setEditData({ ...editData, [f.name]: value });
                                setEditErrors(prev => ({ ...prev, [f.name]: !value.trim() ? "Campo obligatorio" : "" }));
                              }}
                              multiline
                              rows={2}
                              sx={{
                                ...whiteInputStyle,
                                "& .MuiOutlinedInput-root": {
                                  ...whiteInputStyle["& .MuiOutlinedInput-root"],
                                  minHeight: "4rem",
                                  resize: "vertical",
                                  width: 420,
                                },
                              }}
                            />
                          ) : (f.type === "file" ? (
                            <InputValidatedFile
                              name={f.name}
                              value={editData["training_pdf_path"] || null}
                              setIsUnique={setIsUnique}
                              restriction={f.restriction}
                              currentId={editingId}
                              onChange={file => {
                                setEditData({ ...editData, [f.name]: file.target.files[0] });
                                setEditErrors(prev => ({ ...prev, [f.name]: !file ? "Campo obligatorio" : "" }));
                              }}
                              sx={{
                                ...whiteInputStyle,

                                "& .MuiOutlinedInput-root": {
                                  ...whiteInputStyle["& .MuiOutlinedInput-root"],
                                  width: f.width ? f.width : "1200px",
                                }
                              }}
                            />
                          ) : (

                            <InputValidated
                              name={f.name}
                              type={f.type || "text"}
                              value={editData[f.name] || ""}
                              setIsUnique={setIsUnique}
                              restriction={f.restriction}
                              currentId={editingId}
                              onChange={e => {
                                const value = e.target.value;
                                setEditData({ ...editData, [f.name]: value });
                                setEditErrors(prev => ({ ...prev, [f.name]: !value.trim() ? "Campo obligatorio" : "" }));
                              }}
                              sx={{
                                ...whiteInputStyle,

                                "& .MuiOutlinedInput-root": {
                                  ...whiteInputStyle["& .MuiOutlinedInput-root"],
                                  width: f.width ? f.width : "auto",
                                }
                              }}
                            />
                          ))
                        ) : (
                          f.name === "training_pdf" ? (
                            row.training_pdf_path && (
                              <button
                                onClick={() => openPDF(row.training_pdf_path)}
                                className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50 transition"
                                title="Ver PDF"
                              >
                                <LibraryBooksIcon />
                              </button>
                            )
                          ) : (
                            f.type === "date" ? (formatDateDDMMYYYY(row[f.name])) :
                              row[f.name]
                          )
                        )}
                      </td>
                    ))}



                    {/* Acciones */}
                    <td className="py-4 px-6 text-center">
                      {isEditing ? (
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={handleSaveEdit}
                            disabled={Object.values(editErrors).some(err => err) || !isUnique}
                            className={`bg-blue-600 text-white rounded-lg px-4 py-2 flex items-center ${Object.values(editErrors).some(err => err) || !isUnique ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}
                          >
                            <SaveIcon className="mr-1" fontSize="small" /> Guardar
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100 flex items-center"
                          >
                            <CancelIcon className="mr-1" fontSize="small" /> Cancelar
                          </button>
                        </div>
                      ) : (

                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => handleEditClick(row)}
                            className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50 transition"
                          >
                            <EditIcon />
                          </button>

                        </div>


                      )
                      }
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <Stack spacing={30} alignItems="center" marginY={2}>
            <Pagination
              count={totalPages}
              page={currentPage}
              color="primary"
              onChange={(e, value) => pageChange(value, searchFeature, searchText)} // ← callback al cambiar
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
    </div>
  );
};

export default SpecializedTrainingTable;
