import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { formatDateDDMMYYYY } from "../../utils/generalUtilities";
import InputValidated from "../atoms/inputValidated";
import ModalElimination from "../molecules/modalElimination";
import Seeker from "../molecules/seeker";
import { Box } from "@mui/material";
import { ValidateValues } from "../../utils/validateValues";

const GuaranteesTable = ({
  data,
  fields,
  STATUS_OPTIONS,
  CURRENCY_OPTIONS,
  CATEGORY_OPTIONS,
  NOTIFIED_OPTIONS,
  singularName = "Garantía",
  isLoading,
  onEdit,
  onDelete,
  handleSearch,
  searchFields,
}) => {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [editErrors, setEditErrors] = useState({});
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
    setEditingId(row.cod_guarantee);
    setEditData({ ...row });
    setEditErrors({});
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
    setEditErrors({});
  };

  const handleFieldChange = (fieldName, val, fieldType, fieldValidations = [], fieldRestriction = "") => {
    const newData = { ...editData, [fieldName]: val };
    setEditData(newData);

    const err = ValidateValues({
      type: fieldType,
      value: val,
      required: true,
      validations: fieldValidations,
      restriction: fieldRestriction,
      allValues: newData,
    });

    setEditErrors(prev => ({ ...prev, [fieldName]: err }));
  };

  const handleSaveEdit = async () => {
    await onEdit(editData.cod_guarantee, editData);
    setEditingId(null);
    setEditData({});
    setEditErrors({});
  };

  const renderInput = (field) => {
    const value = editData[field.name] ?? "";
    const fieldType = field.type || "text";

    // Select
    if (fieldType === "select") {
      let options = [];
      if (field.name === "guarantee_status") options = STATUS_OPTIONS;
      else if (field.name === "guarantee_currency") options = CURRENCY_OPTIONS;
      else if (field.name === "guarantee_category") options = CATEGORY_OPTIONS;
      else if (field.name === "guarantee_is_notified") options = NOTIFIED_OPTIONS;
      else options = field.options || [];

      return (
        <InputValidated
          name={field.name}
          type="select"
          value={value}
          onChange={(e) => handleFieldChange(field.name, e.target.value, fieldType)}
          options={options}
          sx={{ "& .MuiOutlinedInput-root": { width: "100%", minHeight: "3rem" } }}
        />
      );
    }

    // Textarea
    if (fieldType === "textarea") {
      return (
        <InputValidated
          name={field.name}
          type="textarea"
          value={value}
          multiline
          rows={2}
          onChange={(e) => handleFieldChange(field.name, e.target.value, fieldType)}
          sx={{
            ...whiteInputStyle,
            "& .MuiOutlinedInput-root": { minHeight: "4rem", resize: "vertical" },
          }}
        />
      );
    }

    // Text, Number, Date
    let inputWidth = "14rem"; // default
    if (fieldType === "date" || fieldType === "number") inputWidth = "9rem";

    return (
      <InputValidated
        name={field.name}
        type={fieldType}
        value={value}
        onChange={(e) => handleFieldChange(field.name, e.target.value, fieldType)}
        sx={{ ...whiteInputStyle, width: inputWidth }}
      />
    );
  };

  // Filtrar campos a mostrar
  const displayFields = fields.filter(f => 
    ![
      "cod_guarantee",
      "guarantee_entity_service_code",
      "guarantee_entity_category_code",
      "guarantee_applicant_service_code",
      "guarantee_applicant_category_code",
      "guarantee_alert_time_service_code",
      "guarantee_alert_time_category_code"
    ].includes(f.name)
  );

  return (
    <div className="p-6 mt-6 bg-white rounded-2xl">
      {/* Seeker */}
      <Box className="mb-4">
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

      {isLoading ? (
        <div className="text-center py-8 text-gray-500 italic bg-gray-50 rounded-lg">
          Cargando {singularName}...
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-8 text-gray-500 italic bg-gray-50 rounded-lg">
          No hay {singularName} registrados
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-lg">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                <th className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider rounded-tl-xl w-12">#</th>
                {displayFields.map(f => (
                  <th key={f.name} className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider">
                    {f.label}
                  </th>
                ))}
                <th className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider rounded-tr-xl w-32">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => {
                const isEditing = editingId === row.cod_guarantee;
                return (
                  <tr key={row.cod_guarantee} className={`hover:bg-blue-50 transition-all duration-200 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                    <td className="py-4 px-6 text-center">{index + 1}</td>
                    {displayFields.map(f => (
                      <td key={f.name} className="py-4 px-6 text-center text-gray-700">
                        {isEditing ? renderInput(f) : f.type === "select" ? (
                          (f.options || []).find(opt => opt.value == row[f.name])?.label || "-"
                        ) : f.type === "checkbox" ? (
                          row[f.name] ? "Sí" : "No"
                        ) : f.type === "date" ? (
                          row[f.name] ? formatDateDDMMYYYY(row[f.name]) : "-"
                        ) : (
                          row[f.name] || "-"
                        )}
                      </td>
                    ))}
                    <td className="py-4 px-6 text-center">
                      {isEditing ? (
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={handleSaveEdit}
                            disabled={Object.values(editErrors).some(err => !!err)}
                            className={`bg-blue-600 text-white rounded-lg px-4 py-2 flex items-center ${Object.values(editErrors).some(err => !!err) ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}
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
                          <ModalElimination
                            message={`Eliminar ${singularName}`}
                            onClick={() => onDelete(row.cod_guarantee)}
                          />
                        </div>
                      )}
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

export default GuaranteesTable;
