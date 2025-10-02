import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import ModalElimination from "../molecules/modalElimination";
import InputValidatedDate from "../atoms/inputValidatedDate";
import InputValidated from "../atoms/inputValidated";
import Seeker from "../molecules/seeker";
import { CircularProgress, Box } from "@mui/material";
import Button from "../atoms/button";
import { formatDateDDMMYYYY } from "../../utils/generalUtilities";

const ExtinguisherTable = ({
  fields,
  extinguishers = [],
  agentItems = [],
  extinguisherTypes = [],
  extinguisherCapacityUnits = [],
  isLoading = false,
  onDelete,
  onEdit,
  onSearch,
  valueText,
  valueFeature,
  onChangeText,
  onChangeFeature,
  showForm,
  setShowForm,
  setError,

}) => {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [editErrors, setEditErrors] = useState({}); // Estado de errores
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

  const handleEditClick = (ext) => {
    setEditingId(ext.cod_extinguisher);
    setEditData({ ...ext });
    setEditErrors({});
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    const isSaved = await onEdit(editingId, editData);
    if (isSaved) {
      setEditingId(null);
      setEditData({});
      setEditErrors({});
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
    setEditErrors({});
  };
  return (
    <div className="p-6 mt-6 bg-white rounded-2xl">
      <div className="flex flex-col lg:flex-row gap-4 w-full max-w-5xl mx-auto mb-4">
        <Box className="flex flex-wrap gap-3 bg-white rounded-xl p-4 flex-1">
          <Seeker
            inputName="search"
            inputPlaceholder="Buscar..."
            btnName="Buscar"
            selectName="Características"
            fields={fields}
            onClick={() => onSearch(valueFeature, valueText)}
            valueText={valueText}
            valueFeature={valueFeature}
            onChangeText={onChangeText}
            onChangeFeature={onChangeFeature}
          />
        </Box>
        <div className="flex items-center justify-center lg:justify-start lg:ml-9 w-full sm:w-auto">
          <div className="p-5 h-fit">
            <Button
              text={showForm ? "Cancelar" : "Agregar Extintor"}
              onClick={() => {
                setShowForm(!showForm);
                if (setError) setError(null);
              }}
              className="h-12 w-full sm:w-48 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-wrap items-center gap-3 bg-white shadow-md rounded-2xl px-4 py-3 w-full max-w-3xl mx-auto">
          <CircularProgress size={24} />
          <span>Cargando extintores...</span>
        </div>
      ) : extinguishers.length === 0 ? (
        <div className="text-center py-8 text-gray-500 italic bg-gray-50 rounded-lg">
          No hay extintores registrados.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-lg">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                <th className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider rounded-tl-xl">#</th>
                {fields.map((f) => (
                  <th key={f.name} className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider">
                    {f.placeholder}
                  </th>
                ))}
                <th className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider rounded-tr-xl">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {extinguishers.map((ext, index) => {
                const isEditing = editingId === ext.cod_extinguisher;
                return (
                  <tr
                    key={ext.cod_extinguisher} className="hover:bg-blue-50 transition-all duration-200 even:bg-gray-50">
                    <td className="py-4 px-6 text-center">{index + 1}</td>

                    {fields.map((f) => (
                      <td key={f.name} className="py-4 px-6 text-center align-middle text-gray-700">

                        {isEditing ? (

                          f.type === "select" ? (
                            <InputValidated
                              type="select"
                              name={f.name}
                              placeholder={f.placeholder}
                              options={f.name === "extinguisher_agente_item_code" ? agentItems
                                : f.name === "extinguisher_type" ? extinguisherTypes
                                  : f.name === "extinguisher_capacity_unit" ? extinguisherCapacityUnits
                                    : []
                              }
                              sx={{
                                ...whiteInputStyle, "& .MuiOutlinedInput-root": {
                                  ...whiteInputStyle["& .MuiOutlinedInput-root"],
                                  minWidth: "200px", width: "100%", minHeight: "3rem"
                                },
                              }}
                              value={editData[f.name] || ""}
                              onChange={(e) => {
                                const value = e.target.value;
                                setEditData({ ...editData, [f.name]: value });
                                setEditErrors(prev => ({
                                  ...prev,
                                  [f.name]: !value.trim() ? "Campo obligatorio" : ""
                                }));
                              }}
                              required={f.required ?? true}
                            >
                              {f.options.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </InputValidated>


                          ) : f.type === "textarea" ? (
                            <InputValidated
                              name={f.name}
                              type="textarea"
                              value={editData[f.name] || ""}
                              onChange={(e) => {
                                const value = e.target.value;
                                setEditData({ ...editData, [f.name]: value });
                                setEditErrors(prev => ({
                                  ...prev,
                                  [f.name]: !value.trim() ? "Campo obligatorio" : ""
                                }));
                              }}
                              placeholder={f.placeholder}
                              restriction={f.restriction}
                              required={f.required ?? true}
                              multiline
                              rows={2}
                              sx={{
                                ...whiteInputStyle, "& .MuiOutlinedInput-root": {
                                  ...whiteInputStyle["& .MuiOutlinedInput-root"],
                                  minHeight: "2rem", width: '200px', resize: "vertical",
                                },
                              }}
                            />

                          ) : f.type === "date" ? (
                            <InputValidatedDate
                              name={f.name}
                              value={editData[f.name] ? editData[f.name].split("T")[0] : ""}
                              onChange={(e) => {
                                const value = e.target.value;
                                setEditData({ ...editData, [f.name]: value });
                                setEditErrors(prev => ({
                                  ...prev,
                                  [f.name]: !value.trim() ? "Seleccione una fecha" : ""
                                }));
                              }}
                              placeholder={f.placeholder}
                              restriction={f.restriction}
                              required={f.required ?? true}
                              sx={{
                                ...whiteInputStyle, "& .MuiOutlinedInput-root": {
                                  ...whiteInputStyle["& .MuiOutlinedInput-root"],
                                  minWidth: "200px", width: "100%", minHeight: "3rem"
                                },
                              }}
                            />
                          ) : (<InputValidated
                            type={f.type || "text"}
                            name={f.name}
                            value={editData[f.name] || ""}
                            placeholder={f.placeholder}
                            required={f.required ?? true}
                            restriction={f.restriction}
                            setIsUnique={setIsUnique}
                            currentId={editingId}
                            uniqueValues={extinguishers.map((ex) => ({
                              id: ex.cod_extinguisher,
                              value: ex[f.name],
                            }))} 
                            onChange={(e) => {
                              const value = e.target.value;
                              setEditData({ ...editData, [f.name]: value });
                              setEditErrors(prev => ({
                                ...prev,
                                [f.name]: !value.trim() ? "Campo obligatorio" : ""
                              }));
                            }}
                            sx={{
                              ...whiteInputStyle,
                              "& .MuiOutlinedInput-root": {
                                ...whiteInputStyle["& .MuiOutlinedInput-root"],
                                minWidth: "200px",
                                width: "100%",
                                minHeight: "3rem"
                              },
                            }}
                            className="min-w-[200px] w-full max-w-[280px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                          />

                          )
                        ) : f.type === "date" ? (formatDateDDMMYYYY(ext[f.name])
                        ) : f.name === "extinguisher_agente_item_code" ? (agentItems.find((i) => i.value === ext[f.name])?.label || ""
                        ) : f.name === "extinguisher_type" ? (extinguisherTypes.find((i) => i.value === ext[f.name])?.value || ""
                        ) : f.name === "extinguisher_capacity_unit" ? (extinguisherCapacityUnits.find((i) => i.value === ext[f.name])?.label || ""
                        ) : (ext[f.name] || "")
                        }
                      </td>
                    ))}

                    <td className="py-4 px-6 text-center align-middle">
                      <div className="flex justify-center space-x-3">
                        {isEditing ? (
                          <>
                            <button
                              onClick={handleSaveEdit}
                              disabled={Object.values(editErrors).some(err => err) || !isUnique}
                              className={`bg-blue-600 text-white rounded-lg px-4 py-2 flex items-center ${Object.values(editErrors).some(err => err) || !isUnique ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}
                            >
                              <SaveIcon className="mr-1" fontSize="small" /> Guardar
                            </button>


                            <button
                              onClick={handleCancelEdit}
                              className="border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-100 transition flex items-center text-sm">
                              <CancelIcon className="mr-1" fontSize="small" />Cancelar
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditClick(ext)}
                              aria-label="Editar extintor"
                              className="text-blue-500 hover:text-blue-700 transition p-2 rounded-full hover:bg-blue-50"> <EditIcon />
                            </button>
                            <ModalElimination
                              message={"Eliminar extintor"}
                              onClick={() => onDelete(ext.cod_extinguisher)}
                            />
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExtinguisherTable;
