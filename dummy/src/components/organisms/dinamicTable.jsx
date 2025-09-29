import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import Seeker from "../molecules/seeker";
import { CircularProgress } from "@mui/material";
import Button from "../atoms/button";
import ModalElimination from "../molecules/modalElimination";
import InputValidated from "../atoms/inputValidated"; // <-- Importamos

const DinamicTable = ({
  fields,
  data,
  singularName = "Item",
  isLoading,
  onDelete,
  onEdit,
  handleSearch, // <-- recibe handleSearch
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
      book_status: statusOption ? statusOption.value : "", // guarda el value, no el label
    });
  };

  const handleSaveEdit = async () => {
    const dataToSend = {
      ...editData,
      book_status: editData.book_status, // ya es el número correcto
    };

    const success = await onEdit(editData[fields[0].name], dataToSend);

    setEditingId(null);
    setEditData({});
  };


  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const displayFields = fields.filter(
    (f) => f.name !== "book_service_code" && f.name !== "book_category_code"
  );

  const getTypeName = (cod_item) => {
    const type = typesOfBooks.find((t) => t.cod_item === cod_item);
    return type ? type.item_name : "-";
  };

  return (
    <div className="dinamic-table-container p-6 mt-6 bg-white rounded-2xl">
      <div className="dinamic-table-header flex justify-between items-center mb-4">
        {isLoading ? (
          <div className="dinamic-table-loading flex items-center gap-3 p-4 bg-gray-100 rounded-xl">
            <CircularProgress size={24} />
            <span>Cargando {singularName}s...</span>
          </div>
        ) : (
          <>
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
              onClick={() => handleSearch(searchFeature, searchText)} // <-- usa handleSearch
            />

            <Button
              text={isCreatingBook
                ? "Cancelar" : `Agregar ${singularName}`}
              onClick={() => setIsCreatingBook(!isCreatingBook)} // <-- Cambia el estado
            />
          </>
        )}
      </div>

      {data.length === 0 ? (
        <div className="dinamic-table-empty text-center py-8 text-gray-500 italic bg-gray-50 rounded-lg">
          No hay {singularName}s registrados
        </div>
      ) : (
        <div className="dinamic-table-wrapper overflow-x-auto rounded-xl shadow-lg">
          <table className="dinamic-table min-w-full table-auto">
            <thead>
              <tr className="dinamic-table-header-row bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                <th className="dinamic-table-th py-4 px-6 text-center font-semibold text-md capitalize tracking-wider rounded-tl-xl w-12">
                  #
                </th>
                {displayFields
                  .filter((_, i) => i !== 0) // 👈 oculta el primer campo
                  .map((f) => (
                    <th
                      key={f.name}
                      name={f.name}
                      className="dinamic-table-th py-4 px-6 text-center font-semibold text-md capitalize  tracking-wider"
                      style={{ minWidth: "150px" }}
                    >
                      {f.label}
                    </th>
                  ))}

                <th
                  className="dinamic-table-th py-4 px-6 text-center font-semibold text-md  capitalize tracking-wider rounded-tr-xl w-32"
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr
                  name={row[fields[0].name] || index}
                  className={`dinamic-table-row hover:bg-blue-50 transition-all duration-200 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                >
                  <td className="dinamic-table-td py-4 px-6 text-center">{index + 1}</td>

                  {editingId === row[fields[0].name] ? (
                    <>
                      {displayFields
      .filter((_, i) => i !== 0) // ❌ quita el primer campo visualmente
      .map((f) => (
        <td key={f.name} className="dinamic-table-td py-4 px-6 text-center">
                          {f.name === "book_items_code" ? (
                            <InputValidated
                              name={f.name}
                              type="select"
                              value={editData[f.name]}
                              onChange={(e) =>
                                setEditData({ ...editData, [f.name]: Number(e.target.value) })
                              }
                              options={typesOfBooks.map((type) => ({
                                value: type.cod_item,
                                label: type.item_name,
                              }))}
                              sx={{ "& .MuiOutlinedInput-root": { width: "100%", minHeight: "3rem" } }}
                            />
                          ) : f.name === "book_status" ? (
                            <InputValidated
                              name={f.name}
                              type="select"
                              value={editData[f.name]}
                              onChange={(e) =>
                                setEditData({ ...editData, [f.name]: Number(e.target.value) })
                              }
                              options={STATUS_OPTIONS}
                              sx={{ "& .MuiOutlinedInput-root": { width: "100%", minHeight: "3rem" } }}
                            />
                          ) : f.type === "textarea" ? (
                            <InputValidated
                              name={f.name}
                              type="textarea"
                              value={editData[f.name] || ""}
                              onChange={(e) =>
                                setEditData({ ...editData, [f.name]: e.target.value })
                              }
                              multiline
                              rows={2}
                              sx={{
                                ...whiteInputStyle,
                                "& .MuiOutlinedInput-root": {
                                  ...whiteInputStyle["& .MuiOutlinedInput-root"],
                                  width: "100%",
                                  minHeight: "4rem",
                                  resize: "vertical",
                                },
                              }}
                            />
                          ) : f.editable ? (
                            <InputValidated
                              name={f.name}
                              type={f.type || "text"}
                              value={editData[f.name] || ""}
                              onChange={(e) =>
                                setEditData({ ...editData, [f.name]: e.target.value })
                              }
                              sx={{ "& .MuiOutlinedInput-root": { width: "100%", minHeight: "3rem" } }}
                            />
                          ) : (
                            <span>{row[f.name]}</span>
                          )}
                        </td>
                      ))}
                      <td className="dinamic-table-td py-4 px-6 text-center">
                        <div className="dinamic-table-actions flex justify-center gap-2">
                          <button
                            onClick={handleSaveEdit}
                            className="dinamic-table-btn-save bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 flex items-center"
                          >
                            <SaveIcon className="mr-1" fontSize="small" />
                            Guardar
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="dinamic-table-btn-cancel border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100 flex items-center"
                          >
                            <CancelIcon className="mr-1" fontSize="small" />
                            Cancelar
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      {displayFields
                        .filter((_, i) => i !== 0) // 👈 quita el primer campo visualmente
                        .map((f) => (
                          <td
                            key={f.name}
                            className="dinamic-table-td py-4 px-6 text-center text-gray-700"
                          >
                            {f.name === "book_items_code"
                              ? getTypeName(row[f.name])
                              : f.name === "book_status"
                                ? STATUS_OPTIONS.find((opt) => opt.value === row[f.name])?.label || row[f.name]
                                : row[f.name]}
                          </td>
                        ))}

                      <td className="dinamic-table-td py-4 px-6 text-center">
                        <div className="dinamic-table-actions flex justify-center gap-3">
                          <button
                            onClick={() => handleEditClick(row)}
                            className="dinamic-table-btn-edit text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50 transition"
                          >
                            <EditIcon />
                          </button>
                          <ModalElimination
                            message={`Eliminar ${singularName}`}
                            onClick={() => onDelete(row[fields[0].name])}
                          />
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      )}
    </div>
  );
};

export default DinamicTable;
