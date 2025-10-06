import { useState, Fragment } from "react";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ModalElimination from "../molecules/modalElimination";
import InputValidated from "../atoms/inputValidated";
import Button from "../atoms/button";
import Seeker from "../molecules/seeker";
import InputValidatedDate from "../atoms/inputValidatedDate";
import { CircularProgress, Box } from "@mui/material";

const RevisionActionTable = ({
  fields,
  fieldsRevision,
  fieldsActionPlan,
  data,
  subData,
  revisionAreaCategories,
  revisionAreaItem,
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
  showForm,
  setShowForm,
  setError,
  fetchAreaItems,
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
  const hasErrors = Object.values(editErrors).some((err) => err);

  // ====== Render ======
  return (
    <div className="p-6 mt-6 bg-white rounded-2xl">
      {/* Búsqueda y agregar */}
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

      {/* Loading */}
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
                      <td className="text-center py-3">{index + 1}</td>
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
                          f.name === "revision_area_category_code"
                            ? revisionAreaCategories
                            : f.name === "revision_area_item_code"
                              ? isEditing ? revisionAreaItem.filter(item => item.category_cod === editRevisionData.revision_area_category_code) : revisionAreaItem
                              : f.name === "revision_task_item_code"
                                ? revisionTasksItem
                                : f.name === "revision_status"
                                  ? revisionStatusOptions
                                  : [];

                        let value = row[f.name];
                        if (f.type === "select") {
                          value = options.find(opt => String(opt.value) === String(row[f.name]))?.label || "";
                        }

                        return (
                          <td key={f.name} className="text-center py-3 px-2">
                            {isEditing ? (
                              f.type === "select" ? (
                                <InputValidated
                                  type="select"
                                  name={f.name}
                                  value={String(editRevisionData[f.name] ?? "")}
                                  options={options}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                      setEditRevisionData({
                                        ...editRevisionData,
                                        [f.name]: value,
                                      });
                                  }}
                                  sx={whiteInputStyle}
                                />
                              ) : f.type === "textarea" ? (
                                <InputValidated
                                  type="textarea"
                                  name={f.name}
                                  value={editRevisionData[f.name] || ""}
                                  onChange={(e) =>
                                    setEditRevisionData({ ...editRevisionData, [f.name]: e.target.value })
                                  }
                                  sx={whiteInputStyle}
                                  rows={2}
                                />
                              ) : f.type === "date" ? (
                                <InputValidatedDate
                                  name={f.name}
                                  value={editRevisionData[f.name]?.split("T")[0] || ""}
                                  onChange={(e) =>
                                    setEditRevisionData({ ...editRevisionData, [f.name]: e.target.value })
                                  }
                                  sx={whiteInputStyle}
                                />
                              ) : (
                                <InputValidated
                                  type="text"
                                  name={f.name}
                                  value={editRevisionData[f.name] || ""}
                                  onChange={(e) =>
                                    setEditRevisionData({ ...editRevisionData, [f.name]: e.target.value })
                                  }
                                  sx={whiteInputStyle}
                                />
                              )
                            ) : (
                              value || f.value
                            )}
                          </td>
                        );
                      })}

                      <td className="text-center">
                        {isEditing ? (
                          <>
                            <button onClick={handleSaveRevision} disabled={hasErrors}><SaveIcon /></button>
                            <button onClick={handleCancelRevision}><CancelIcon /></button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => handleEditRevisionClick(row)}><EditIcon /></button>
                            <ModalElimination
                              message={`Eliminar ${singularName}`}
                              onClick={() => onDeleteRevision(row.cod_revision)}
                            />
                          </>
                        )}
                      </td>
                    </tr>

                    {/* Planes de acción */}
                    {isOpen && row.accion_plan?.length > 0 && (
                      <tr>
                        <td colSpan={fieldsRevision.length + 3} className="bg-gray-50 p-4">
                          <div className="bg-white shadow-md rounded-lg p-4">
                            <table className="min-w-full">
                              <thead>
                                <tr>
                                  {fieldsActionPlan.map((f) => (
                                    <th key={f.name} className="py-3 px-2 text-center">{f.placeholder}</th>
                                  ))}
                                  <th className="py-3 px-2 text-center">Acciones</th>
                                </tr>
                              </thead>
                              <tbody>
                                {subData.filter(ap => ap.action_plan_cod_revision === row.cod_revision)
                                  .map(ap => {
                                    const isEditingPlan = editingPlanId === ap.cod_accion_plan;
                                    return (
                                      <tr key={ap.cod_accion_plan}>
                                        {fieldsActionPlan.map(f => (
                                          <td key={f.name} className="text-center py-2 px-2">
                                            {isEditingPlan ? (
                                              <InputValidated
                                                type={f.type || "text"}
                                                name={f.name}
                                                value={editPlanData[f.name] || ""}
                                                onChange={(e) =>
                                                  setEditPlanData({ ...editPlanData, [f.name]: e.target.value })
                                                }
                                                sx={whiteInputStyle}
                                              />
                                            ) : (
                                              ap[f.name] || "—"
                                            )}
                                          </td>
                                        ))}
                                        <td className="text-center">
                                          {isEditingPlan ? (
                                            <>
                                              <button onClick={handleSavePlan}><SaveIcon /></button>
                                              <button onClick={handleCancelPlan}><CancelIcon /></button>
                                            </>
                                          ) : (
                                            <>
                                              <button onClick={() => handleEditPlanClick(ap)}><EditIcon /></button>
                                              <ModalElimination
                                                message="Eliminar Plan"
                                                onClick={() => onDeleteActionPlan(ap.cod_accion_plan)}
                                              />
                                            </>
                                          )}
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
