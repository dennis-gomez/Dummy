import { useState, useCallback, Fragment } from "react";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import ModalElimination from "../molecules/modalElimination";
import InputValidated from "../atoms/inputValidated";
import InputValidatedDate from "../atoms/inputValidatedDate";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DoubleSeeker from "../molecules/doubleSeeker";
import { CircularProgress, Box } from "@mui/material";
import Button from "../atoms/button";
import { formatDateDDMMYYYY } from "../../utils/generalUtilities";


const RevisionActionTable = ({
  fields,
  fieldsRevision,
  fieldsActionPlan,
  data,
  subData,
  revisionAreaCategories,
  revisionTasksItem,
  revisionStatusOptions,
  onDeleteRevision,
  onDeleteActionPlan,
  onEditRevision,
  onEditActionPlan,
  onSearch,
  isLoading,

  valueText,
  valueFeature,
  onChangeText,
  onChangeFeature,
  selectedArea,
  setSelectedArea,

  showForm,
  setShowForm,
  setError,
  singularName,
  tableName,
  getSpecificOptions

}) => {
  const [editingRevisionId, setEditingRevisionId] = useState(null);
  const [editRevisionData, setEditRevisionData] = useState({});
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [editPlanData, setEditPlanData] = useState({});
  const [editErrors, setEditErrors] = useState({});
  const [openRows, setOpenRows] = useState({});

  const whiteInputStyle = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#fff",
      "&.Mui-error .MuiOutlinedInput-notchedOutline": { borderColor: "blue" },
    },
    "& .MuiFormHelperText-root.Mui-error": { color: "blue" },
  };

  // ====== REVISIÓN ======
  const handleEditRevisionClick = async (row) => {
    setEditingRevisionId(row.cod_revision);
    setEditRevisionData({ ...row });
    setEditErrors({});
  };

  const handleSaveRevision = async () => {
    await onEditRevision(editRevisionData.cod_revision, editRevisionData);
    setEditingRevisionId(null);
    setEditRevisionData({});
    setEditErrors({});
  };

  const handleCancelRevision = () => {
    setEditingRevisionId(null);
    setEditRevisionData({});
    setEditErrors({});
  };

  // ====== PLAN DE ACCIÓN ======
  const handleEditPlanClick = (plan) => {
    setEditingPlanId(plan.cod_accion_plan);
    setEditPlanData({ ...plan });
  };

  const handleSavePlan = async () => {
    await onEditActionPlan(editPlanData.cod_accion_plan, editPlanData);
    setEditingPlanId(null);
    setEditPlanData({});
  };

  const handleCancelPlan = () => {
    setEditingPlanId(null);
    setEditPlanData({});
  };


  // ====== OTROS ======
  const toggleRow = (id) => setOpenRows((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleError = useCallback((name, errorMessage) => {
    setEditErrors((prev) => {
      if (prev[name] === errorMessage) return prev;
      return { ...prev, [name]: errorMessage };
    });
  }, []);


  return (
    <div className="p-6 mt-6 bg-white rounded-2xl">
      <div className="flex flex-col lg:flex-row gap-4 w-full max-w-5xl mx-auto mb-4">
<Box className="flex flex-wrap gap-3 bg-white rounded-xl p-4 flex-1">
<DoubleSeeker
  primaryOptions={revisionAreaCategories} // Primer select: Áreas
  secondaryFields={fields.filter(f => f.name !== "revision_area_category_code")} // Campos menos área
  primaryLabel="Área"
  secondaryLabel="Filtrar por"
  dynamicLabel="Valor"
  primaryValue={valueFeature}
  setPrimaryValue={onChangeFeature}
  secondaryValue={valueFeature}
  setSecondaryValue={onChangeFeature}
  dynamicValue={valueText}
  setDynamicValue={onChangeText}
  onSearch={() => handleSearchRevisionsAndPlans(valueFeature, valueText)}
  // Filtrado dinámico según el segundo select
  dynamicOptions={(secondaryValue) => {
    const field = fields.find(f => f.name === secondaryValue);
    if (!field) return [];
    if (field.name === "revision_area_item_code") {
      // Filtrar por área seleccionada
      return field.options.filter(item => item.category_cod === valueFeature);
    }
    return field.options || [];
  }}
/>

</Box>

        <div className="flex items-center justify-center lg:justify-start lg:ml-9 w-full sm:w-auto">
          <div className="p-5 h-fit">
            <Button
              text={showForm ? "Cancelar" : "Agregar " + singularName}
              onClick={() => {
                setShowForm(!showForm);
                if (setError) setError(null);
              }}
              className="h-12 w-full sm:w-48 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            />
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center gap-3 bg-white shadow-md rounded-2xl px-4 py-3 w-full max-w-5xl mx-auto mb-4">
          <CircularProgress size={24} />
          <span className="text-gray-700 font-medium">Cargando {tableName}...</span>
        </div>
      )}
      {!isLoading && data.length === 0 && (
        <div className="text-center py-8 text-gray-500 italic bg-gray-50 rounded-lg w-full max-w-5xl mx-auto mb-4">
          No hay {tableName} registrados
        </div>
      )}

      {/* Tabla */}
      {!isLoading && data.length > 0 && (
        <div className="overflow-x-auto rounded-xl shadow-lg">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                <th className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider rounded-tl-xl">#</th>
                <th className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider">Expandir</th>
                {fieldsRevision.map((f) => (
                  <th key={f.name} className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider">{f.placeholder}</th>
                ))}
                <th className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider rounded-tr-xl">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {data.map((row, index) => {
                const isEditing = editingRevisionId === row.cod_revision;
                const isOpen = openRows[row.cod_revision];

                return (
                  <Fragment key={row.cod_revision}>
                    <tr className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 transition`}>
                      <td className="py-4 px-6 text-center">{index + 1}</td>
                      <td className="text-center">
                        {row.accion_plan?.length > 0 ? (
                          <button onClick={() => toggleRow(row.cod_revision)}>
                            {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                          </button>
                        ) : (
                          <button disabled className="opacity-40">
                            <KeyboardArrowDownIcon />
                          </button>
                        )}
                      </td>

                      {fieldsRevision.map((f) => {
                        const options =
                          f.name === "revision_area_category_code" ? revisionAreaCategories
                            : f.name === "revision_area_item_code" ? isEditing
                              ? getSpecificOptions(editRevisionData.revision_area_category_code)
                              : getSpecificOptions(row.revision_area_category_code)
                              : f.name === "revision_task_item_code" ? revisionTasksItem
                                : f.name === "revision_status" ? revisionStatusOptions
                                  : [];

                        //Para visualizacion de valores
                        let value = row[f.name];

                        if (f.type === "select" && !isEditing) {
                          const option = options.find(opt => String(opt.value) === String(row[f.name]));
                          value = option ? option.label : value;
                        } if (f.type === "date" && value) {
                          value = formatDateDDMMYYYY(value);
                        }

                        return (
                          <td key={f.name} className="py-4 px-6 text-center align-middle text-gray-700">
                            {isEditing ? (

                              f.type === "select" ? (
                                <InputValidated
                                  type="select"
                                  name={f.name}
                                  placeholder={f.placeholder}
                                  required={f.required ?? true}
                                  validations={f.validations || []}
                                  onError={handleError}
                                  restriction={f.restriction}
                                  options={options}
                                  value={String(editRevisionData[f.name] ?? "")}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    setEditRevisionData({ ...editRevisionData, [f.name]: value });
                                  }}
                                  sx={{
                                    ...whiteInputStyle, "& .MuiOutlinedInput-root": {
                                      ...whiteInputStyle["& .MuiOutlinedInput-root"],
                                      minWidth: "200px", width: "100%", minHeight: "3rem"
                                    },
                                  }}
                                />
                              ) : f.type === "textarea" ? (
                                <InputValidated
                                  name={f.name}
                                  type="textarea"
                                  value={editRevisionData[f.name] || ""}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    setEditRevisionData({ ...editRevisionData, [f.name]: value });
                                  }}
                                  placeholder={f.placeholder}
                                  validations={f.validations || []}
                                  onError={handleError}
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
                                  value={editRevisionData[f.name] ? editRevisionData[f.name].split("T")[0] : ""}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    setEditRevisionData({ ...editRevisionData, [f.name]: value })
                                  }}
                                  onError={handleError}
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
                              ) : (
                                <InputValidated
                                  type={f.type || "text"}
                                  name={f.name}
                                  value={editRevisionData[f.name] || ""}
                                  placeholder={f.placeholder}
                                  required={f.required ?? true}
                                  restriction={f.restriction}
                                  validations={f.validations || []}
                                  onError={handleError}
                                  currentId={editingRevisionId}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    setEditRevisionData({ ...editRevisionData, [f.name]: value })
                                  }}
                                  sx={{
                                    ...whiteInputStyle, "& .MuiOutlinedInput-root": {
                                      ...whiteInputStyle["& .MuiOutlinedInput-root"],
                                      minWidth: "200px", width: "100%", minHeight: "3rem"
                                    },
                                  }}
                                />
                              )
                            ) : (
                              value || f.value
                            )}
                          </td>
                        );
                      })}


                      <td className="py-4 px-6 text-center align-middle">
                        <div className="flex justify-center space-x-3">
                          {isEditing ? (
                            <>
                              <button
                                onClick={handleSaveRevision}
                                disabled={Object.values(editErrors).some(err => err)}
                                className={`bg-blue-600 text-white rounded-lg px-4 py-2 flex items-center ${Object.values(editErrors).some(err => err) ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`} >
                                <SaveIcon className="mr-1" fontSize="small" /> Guardar
                              </button>

                              <button
                                onClick={handleCancelRevision}
                                className="border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-100 transition flex items-center text-sm">
                                <CancelIcon className="mr-1" fontSize="small" />Cancelar
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEditRevisionClick(row)}
                                aria-label="Editar PM"
                                className="text-blue-500 hover:text-blue-700 transition p-2 rounded-full hover:bg-blue-50"> <EditIcon />
                              </button>
                              <ModalElimination
                                message={`Eliminar ${singularName}`}
                                onClick={() => onDeleteRevision(row.cod_revision)}
                              />
                            </>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* Planes de acción */}
                    {isOpen && row.accion_plan?.length > 0 && (

                      <tr>
                        <td colSpan={fieldsRevision.length + 3} className="px-8 py-6 bg-gray-50 text-center">
                          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                            <table className="min-w-full">
                              <thead>
                                <tr className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                                  {fieldsActionPlan.map((f) => (
                                    <th key={f.name} className="py-4 px-6 font-semibold text-md capitalize tracking-wider text-center">{f.placeholder}</th>
                                  ))}
                                  <th className="py-4 px-6 font-semibold text-md capitalize tracking-wider rounded-tr-xl text-center">Acciones</th>
                                </tr>
                              </thead>
                              <tbody>

                                {subData.filter(ap => ap.action_plan_cod_revision === row.cod_revision).map(ap => {
                                  const isEditingPlan = editingPlanId === ap.cod_accion_plan;

                                  return (
                                    <tr key={ap.cod_accion_plan} className="hover:bg-blue-50 transition-all duration-200 even:bg-gray-50 text-center" >

                                      {fieldsActionPlan.map(f => (
                                        <td key={f.name} className="py-4 px-6 align-middle text-center">

                                          {isEditingPlan ? (

                                            <InputValidated
                                              type={f.type || "text"}
                                              name={f.name}
                                              value={editPlanData[f.name] || ""}
                                              placeholder={f.placeholder}
                                              required={f.required ?? true}
                                              restriction={f.restriction}
                                              validations={f.validations || []}
                                              onError={handleError}
                                              currentId={editingRevisionId}
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                setEditPlanData({ ...editPlanData, [f.name]: value })
                                              }}
                                              sx={{
                                                ...whiteInputStyle,
                                                "& .MuiOutlinedInput-root": {
                                                  ...whiteInputStyle["& .MuiOutlinedInput-root"],
                                                  minHeight: f.type === "textarea" ? "4rem" : "auto",
                                                  resize: f.type === "textarea" ? "vertical" : "none",
                                                },
                                              }}
                                            />
                                          ) : (
                                            ap[f.name] || "—"
                                          )}
                                        </td>
                                      ))}
                                      <td className="py-4 px-6 text-center align-middle">
                                        <div className="flex justify-center space-x-3">
                                          {isEditingPlan ? (
                                            <>
                                              <button
                                                onClick={handleSavePlan}
                                                disabled={Object.values(editErrors).some(err => err)}
                                                className={`bg-blue-600 text-white rounded-lg px-4 py-2 flex items-center ${Object.values(editErrors).some(err => err) ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`} >
                                                <SaveIcon className="mr-1" fontSize="small" /> Guardar
                                              </button>

                                              <button
                                                onClick={handleCancelPlan}
                                                className="border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-100 transition flex items-center text-sm">
                                                <CancelIcon className="mr-1" fontSize="small" />Cancelar
                                              </button>
                                            </>
                                          ) : (
                                            <>
                                              <button
                                                onClick={() => handleEditPlanClick(ap)}
                                                aria-label="Editar Plan"
                                                className="text-blue-500 hover:text-blue-700 transition p-2 rounded-full hover:bg-blue-50"> <EditIcon />
                                              </button>
                                              <ModalElimination
                                                message={"Eliminar Plan"}
                                                onClick={() => onDeleteActionPlan(ap.cod_accion_plan)}
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
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RevisionActionTable;
