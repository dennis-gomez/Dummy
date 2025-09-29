import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import Seeker from "../molecules/seeker";
import { CircularProgress, Box } from "@mui/material";
import Button from "../atoms/button";
import ModalElimination from "../molecules/modalElimination";
import InputValidated from "../atoms/inputValidated";

const DinamicTable = ({
  fields,
  data,
  singularName = "Item",
  isLoading,
  onDelete,
  onEdit,
  handleSearch,
  searchFields,
  setIsCreatingBook,
  isCreatingBook,
  typesOfBooks = [],
  STATUS_OPTIONS,
}) => {

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [searchText, setSearchText] = useState("");
  const [searchFeature, setSearchFeature] = useState(() => searchFields?.[0]?.name || "");

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
    const statusOption = STATUS_OPTIONS.find(opt => opt.value === row.book_status);
    setEditingId(row[fields[0].name]);
    setEditData({
      ...row,
      book_status: statusOption ? statusOption.value : "",
    });
  };

  const handleSaveEdit = async () => {
    await onEdit(editData[fields[0].name], editData);
    setEditingId(null);
    setEditData({});
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const displayFields = fields.filter(f => f.name !== "book_service_code" && f.name !== "book_category_code");

  const getTypeName = (cod_item) => {
    const type = typesOfBooks.find((t) => t.cod_item === cod_item);
    return type ? type.item_name : "-";
  };

  return (
    <div className="dinamic-table-container p-6 mt-6 bg-white rounded-2xl">

      {/* Contenedor principal: buscador + botón */}
      <div className="flex flex-col lg:flex-row gap-4 w-full max-w-5xl mx-auto mb-4">

        {/* Columna 1: buscador */}
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
            onClick={() => handleSearch(searchFeature, searchText)}
          />
        </Box>

        {/* Columna 2: botón agregar/cancelar */}
        <div className="flex items-center justify-center lg:justify-start w-full sm:w-auto">
          <div className="p-4 h-fit">
            <Button
              text={isCreatingBook ? "Cancelar" : `Agregar ${singularName}`}
              onClick={() => setIsCreatingBook(!isCreatingBook)}
              className="h-12 w-full sm:w-48 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Contenido de la tabla */}
      {isLoading ? (
        <div className="flex flex-wrap items-center gap-3 bg-white shadow-md rounded-2xl px-4 py-3 w-full max-w-3xl mx-auto">
          <CircularProgress size={24} />
          <span>Cargando {singularName}s...</span>
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-8 text-gray-500 italic bg-gray-50 rounded-lg">
          No hay {singularName}s registrados
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-lg">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                <th className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider rounded-tl-xl w-12">#</th>
                {displayFields.filter((_, i) => i !== 0).map(f => (
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

                return (
                  <tr key={row[fields[0].name] || index} className={`hover:bg-blue-50 transition-all duration-200 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                    <td className="py-4 px-6 text-center">{index + 1}</td>

                    {displayFields.filter((_, i) => i !== 0).map(f => (
                      <td key={f.name} className="py-4 px-6 text-center text-gray-700">
                        {isEditing ? (
                          f.type === "textarea" ? (
                            <InputValidated
                              name={f.name}
                              type="textarea"
                              value={editData[f.name] || ""}
                              onChange={e => setEditData({ ...editData, [f.name]: e.target.value })}
                              multiline
                              rows={2}
                              sx={{ "& .MuiOutlinedInput-root": { width: "100%", minHeight: "4rem", resize: "vertical" }, ...whiteInputStyle }}
                            />
                          ) : f.name === "book_items_code" ? (
                            <InputValidated
                              name={f.name}
                              type="select"
                              value={editData[f.name]}
                              onChange={e => setEditData({ ...editData, [f.name]: Number(e.target.value) })}
                              options={typesOfBooks.map(type => ({ value: type.cod_item, label: type.item_name }))}
                              sx={{ "& .MuiOutlinedInput-root": { width: "100%", minHeight: "3rem" } }}
                            />
                          ) : f.name === "book_status" ? (
                            <InputValidated
                              name={f.name}
                              type="select"
                              value={editData[f.name]}
                              onChange={e => setEditData({ ...editData, [f.name]: Number(e.target.value) })}
                              options={STATUS_OPTIONS}
                              sx={{ "& .MuiOutlinedInput-root": { width: "100%", minHeight: "3rem" } }}
                            />
                          ) : (
                            <InputValidated
                              name={f.name}
                              type={f.type || "text"}
                              value={editData[f.name] || ""}
                              onChange={e => setEditData({ ...editData, [f.name]: e.target.value })}
                              sx={{ "& .MuiOutlinedInput-root": { width: "100%", minHeight: "3rem" } }}
                            />
                          )
                        ) : (
                          f.name === "book_items_code" ? getTypeName(row[f.name])
                          : f.name === "book_status" ? STATUS_OPTIONS.find(opt => opt.value === row[f.name])?.label || row[f.name]
                          : row[f.name]
                        )}
                      </td>
                    ))}

                    <td className="py-4 px-6 text-center">
                      {isEditing ? (
                        <div className="flex justify-center gap-2">
                          <button onClick={handleSaveEdit} className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 flex items-center">
                            <SaveIcon className="mr-1" fontSize="small" /> Guardar
                          </button>
                          <button onClick={handleCancelEdit} className="border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100 flex items-center">
                            <CancelIcon className="mr-1" fontSize="small" /> Cancelar
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-center gap-3">
                          <button onClick={() => handleEditClick(row)} className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50 transition">
                            <EditIcon />
                          </button>
                          <ModalElimination message={`Eliminar ${singularName}`} onClick={() => onDelete(row[fields[0].name])} />
                        </div>
                      )}
                    </td>

                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DinamicTable;
