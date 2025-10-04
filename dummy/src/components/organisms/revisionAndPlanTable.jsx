import { useState, useEffect, Fragment } from "react";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ModalElimination from "../molecules/modalElimination";
import InputValidated from "../atoms/inputValidated";
import Button from "../atoms/button";
import Seeker from "../molecules/seeker";

const RevisionActionTable = ({
  data,
  fields,
  fieldsRevision,
  fieldsActionPlan,
  searchFields,
  isLoading,
  singularName = "Revisión",
  tableName,
  onDeleteRevision,
  onEditRevision,
  onStartEdit,
  setIsCreatingRevision,
  isCreatingRevision,
  handleError,
  setIsUnique,
  showForm,
  setShowForm,
  revisionAreaCategories,
  revisionTasksItem,
  revisionStatusOptions,
  fetchAreaItems,
  setError,
}) => {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [editErrors, setEditErrors] = useState({});
  const [searchText, setSearchText] = useState("");
  const [searchFeature, setSearchFeature] = useState(() => searchFields?.[0]?.name || "");
  const [openRows, setOpenRows] = useState({});
  const [areaItemsMap, setAreaItemsMap] = useState({}); // <--- mapa dinámico por categoría

  const whiteInputStyle = {
    "& .MuiOutlinedInput-root": { backgroundColor: "#fff", "&.Mui-error .MuiOutlinedInput-notchedOutline": { borderColor: "blue" } },
    "& .MuiFormHelperText-root.Mui-error": { color: "blue" },
  };

  const handleEditClick = async (row) => {
    if (onStartEdit) onStartEdit();
    setEditingId(row.cod_revision);
    setEditData({ ...row });
    setEditErrors({});

    // cargar items de la categoría si no están
    if (row.revision_area_category_code && !areaItemsMap[row.revision_area_category_code]) {
      const items = await fetchAreaItems(row.revision_area_category_code);
      setAreaItemsMap((prev) => ({ ...prev, [row.revision_area_category_code]: items }));
    }
  };

  const handleSaveEdit = async () => {
    await onEditRevision(editData.cod_revision, editData);
    setEditingId(null);
    setEditData({});
    setEditErrors({});
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
    setEditErrors({});
  };

  const toggleRow = (id) => setOpenRows((prev) => ({ ...prev, [id]: !prev[id] }));

  const hasErrors = Object.values(editErrors).some((err) => err);

  const handleCategoryChange = async (value) => {
    setEditData({ ...editData, revision_area_category_code: value, revision_area_item_code: "" });

    if (!areaItemsMap[value]) {
      try {
        const items = await fetchAreaItems(value);
        setAreaItemsMap((prev) => ({ ...prev, [value]: items }));
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="dinamic-table-container p-6 mt-6 bg-white rounded-2xl">
      {/* Buscador + botón agregar */}
      <div className="flex flex-col lg:flex-row gap-4 w-full max-w-5xl mx-auto mb-4">
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
          onClick={() => {}}
        />
        <Button
          text={isCreatingRevision ? "Cancelar" : `Agregar ${singularName}`}
          onClick={() => setIsCreatingRevision(!isCreatingRevision)}
          className="h-12 w-full sm:w-48 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        />
      </div>

      {/* Tabla */}
      {isLoading ? (
        <div className="flex items-center gap-3 justify-center py-4">
          <span>Cargando {tableName}...</span>
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-8 text-gray-500 italic bg-gray-50 rounded-lg">
          No hay {tableName} registrados
        </div>
      ) : (
        <table className="min-w-full table-auto overflow-x-auto">
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
              <th className="py-4 px-4 w-12 text-center rounded-tl-xl">#</th>
              <th className="py-4 px-4 text-center">Expandir</th>
              {fieldsRevision.map((f) => (
                <th key={f.name} className="py-4 px-4 text-center">{f.placeholder}</th>
              ))}
              <th className="py-4 px-4 text-center rounded-tr-xl">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => {
              const isEditing = editingId === row.cod_revision;
              const isOpen = openRows[row.cod_revision];

              return (
                <Fragment key={row.cod_revision}>
                  {/* FILA PRINCIPAL */}
                  <tr className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 transition`}>
                    <td className="py-4 px-4 text-center">{index + 1}</td>
                    <td className="py-4 px-4 text-center">
                      {row.accion_plan?.length > 0 ? (
                        <button onClick={() => toggleRow(row.cod_revision)}>
                          {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </button>
                      ) : (
                        <button disabled className="opacity-40 cursor-not-allowed">
                          <KeyboardArrowDownIcon />
                        </button>
                      )}
                    </td>

                    {fieldsRevision.map((f) => {
                      let value = row[f.name];
                      if (!value) {
                        if (f.name === "revision_area_category_code") value = row.areaCategory?.category_name;
                        if (f.name === "revision_area_item_code") value = row.areaItem?.item_name;
                        if (f.name === "revision_task_item_code") value = row.taskItem?.item_name;
                      }

                      if (isEditing) {
                        if (f.type === "select") {
                          const options =
                            f.name === "revision_area_category_code"
                              ? revisionAreaCategories
                              : f.name === "revision_area_item_code"
                              ? areaItemsMap[editData.revision_area_category_code] || []
                              : f.name === "revision_task_item_code"
                              ? revisionTasksItem
                              : f.name === "revision_status"
                              ? revisionStatusOptions
                              : [];

                          return (
                            <td key={f.name}>
                              <InputValidated
                                type="select"
                                name={f.name}
                                value={editData[f.name] || ""}
                                options={options}
                                onChange={(e) =>
                                  f.name === "revision_area_category_code"
                                    ? handleCategoryChange(e.target.value)
                                    : setEditData({ ...editData, [f.name]: e.target.value })
                                }
                              >
                                {options.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </InputValidated>
                            </td>
                          );
                        }

                        return (
                          <td key={f.name}>
                            <InputValidated
                              type={f.type || "text"}
                              name={f.name}
                              value={editData[f.name] || ""}
                              onChange={(e) => setEditData({ ...editData, [f.name]: e.target.value })}
                            />
                          </td>
                        );
                      }

                      // modo lectura: mostrar label de la lista en lugar de código
                      if (f.type === "select") {
                        const options =
                          f.name === "revision_area_category_code"
                            ? revisionAreaCategories
                            : f.name === "revision_area_item_code"
                            ? areaItemsMap[row.revision_area_category_code] || []
                            : f.name === "revision_task_item_code"
                            ? revisionTasksItem
                            : f.name === "revision_status"
                            ? revisionStatusOptions
                            : [];

                        value = options.find((opt) => opt.value === row[f.name])?.label || value;
                      }

                      return <td key={f.name}>{value}</td>;
                    })}

                    <td className="py-4 px-4 text-center">
                      {isEditing ? (
                        <>
                          <button onClick={handleSaveEdit} disabled={hasErrors}>
                            <SaveIcon />
                          </button>
                          <button onClick={handleCancelEdit}>
                            <CancelIcon />
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleEditClick(row)}>
                            <EditIcon />
                          </button>
                          <ModalElimination
                            message={`Eliminar ${singularName}`}
                            onClick={() => onDeleteRevision(row.cod_revision)}
                          />
                        </>
                      )}
                    </td>
                  </tr>

                  {/* FILA EXPANDIDA: Plan de Acción */}
                  {isOpen && row.accion_plan?.length > 0 && (
                    <tr>
                      <td colSpan={fields.length + 3} className="bg-gray-50 p-4">
                        <div className="bg-white shadow-md rounded-lg p-4">
                          <table className="min-w-full table-auto">
                            <thead>
                              <tr>
                                {fieldsActionPlan.map((f) => (
                                  <th key={f.name} className="py-4 px-4 text-center">
                                    {f.placeholder}
                                  </th>
                                ))}
                                <th className="py-4 px-4 text-center rounded-tr-xl">Acciones</th>
                              </tr>
                            </thead>
                            <tbody>
                              {row.accion_plan.map((ap, idx) => (
                                <tr key={ap.cod_accion_plan} className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                                  <td className="py-2 px-2 text-center">{ap.action_plan_rev_quantity_failed}</td>
                                  <td className="py-2 px-2 text-center">{ap.action_plan_details}</td>
                                  <td className="py-2 px-2 text-center">{ap.action_plan_responsible_name}</td>

                                  <td className="py-4 px-4 text-center">
                                    {isEditing ? (
                                      <>
                                        <button onClick={handleSaveEdit} disabled={hasErrors}>
                                          <SaveIcon />
                                        </button>
                                        <button onClick={handleCancelEdit}>
                                          <CancelIcon />
                                        </button>
                                      </>
                                    ) : (
                                      <>
                                        <button onClick={() => handleEditClick(row)}>
                                          <EditIcon />
                                        </button>
                                        <ModalElimination
                                          message={`Eliminar ${singularName}`}
                                          onClick={() => onDeleteRevision(row.cod_revision)}
                                        />
                                      </>
                                    )}
                                  </td>
                                </tr>
                              ))}
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
      )}
    </div>
  );
};

export default RevisionActionTable;
