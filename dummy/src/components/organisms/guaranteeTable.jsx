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
import Button from "../atoms/button";
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Stack from '@mui/material/Stack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SortIcon from '@mui/icons-material/Sort';
import ReactivationModal from "../molecules/reactivationModal";

const GuaranteesTable = ({
  data,
  fields,
  STATUS_OPTIONS,
  CURRENCY_OPTIONS,
  CATEGORY_OPTIONS,
  singularName = "Garantía",
  isLoading,
  onEdit,
  onDelete,
  handleSearch,
  searchFields,
  isCreatingGuarantee,
  setIsCreatingGuarantee,
  totalPages = 1,        // 🟢 total de páginas (del backend)
  currentPage = 1,       // 🟢 página actual
  onPageChange,
  handleSortByExpirationDate
  

}) => {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [editErrors, setEditErrors] = useState({});
  const [searchText, setSearchText] = useState("");
  const [searchFeature, setSearchFeature] = useState(() => searchFields?.[0]?.name || "");
  const [valueOrder, setSortOrder] = useState(true); // Estado para orden de clasificación
  const [trueSearchText, setTrueSearchText] = useState("");
  let value = ""

const deleteGuaranteOrReactivated = (id,status) => {
  setSearchFeature("");
  setSearchText("");
  onDelete(id,status)
}

  const change=()=>{
    setSortOrder(!valueOrder)
    
    handleSortByExpirationDate(searchFeature,searchText,currentPage,2,1,valueOrder ? "ASC" : "")
  }

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
    setIsCreatingGuarantee(false); // cierra formulario si se abre edición
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
      else options = field.options || [];

      return (
        <InputValidated
          name={field.name}
          type="select"
          value={value}
          onChange={(e) => handleFieldChange(field.name, e.target.value, fieldType)}
          options={options}
           sx={{
                                ...whiteInputStyle, "& .MuiOutlinedInput-root": {
                                ...whiteInputStyle["& .MuiOutlinedInput-root"],
                                 width: "100%", minHeight: "3rem"
                                },
                              }}
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
                                "& .MuiOutlinedInput-root": {
                                  ...whiteInputStyle["& .MuiOutlinedInput-root"],
                                  minHeight: "4rem",
                                  width: "12rem",
                                  resize: "vertical",
                                },
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
              setTrueSearchText(searchText);
              value=searchText
              handleSortByExpirationDate(searchFeature,value,1,5,2,!valueOrder ? "ASC" : "")
            
            }
            } // 🟢 al buscar, mantiene orden actual
          />
        </Box>
        <div className="flex items-center justify-center lg:justify-start w-full sm:w-auto">
          <div className="p-4 h-fit">
            <Button
              text={isCreatingGuarantee ? "Cancelar" : `Agregar ${singularName}`}
              onClick={() => {
                if (!isCreatingGuarantee && editingId) handleCancelEdit(); // cancela edición si se abre formulario
                setIsCreatingGuarantee(!isCreatingGuarantee);
              }}
              className="h-12 w-full sm:w-48 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            />
          </div>
        </div>
      </div>

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
                <th 
  key={f.name} 
  className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider"
>
  <span className="inline-flex items-center justify-center gap-1">
    {f.label}
    {f.name === "guarantee_expiration_date" && (
      <button onClick={() => change()} title="Ordenar por fecha de vencimiento">
        <SortIcon
          fontSize="small"
          sx={{
            color: valueOrder ? "white" : "#18d046ff",
            cursor: "pointer",
            transition: "0.2s",
            "&:hover": {
              opacity: 0.7,
              transform: "scale(1.1)"
            }
          }}
        />
      </button>
    )}
  </span>
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
                       {isEditing ? (
  renderInput(f)
) : f.type === "select" ? (
  (f.options || []).find(opt => opt.value == row[f.name])?.label || "-"
) : f.type === "checkbox" ? (
  row[f.name] ? "Sí" : "No"
) : f.type === "date" ? (
  row[f.name] ? formatDateDDMMYYYY(row[f.name]) : "-"
) : typeof row[f.name] === "number" ? (
  new Intl.NumberFormat("de-DE").format(row[f.name])
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
                          row.guarantee_status!=4 ? (
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => handleEditClick(row)}
                            className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50 transition"
                          >
                            <EditIcon />
                          </button>
                          <ModalElimination
                            message={`Desactivar ${singularName}`}
                            onClick={() => deleteGuaranteOrReactivated(row.cod_guarantee,4)}
                            confirmText="Desactivar"
                          />
                        </div>
                        ):(
                          <ReactivationModal
                            message={"¿Quieres reactivar esta garantía?"}
                            onClick={() => deleteGuaranteOrReactivated(row.cod_guarantee,1)}
                          />
                        )
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            
          </table>
          {/* paginado */}
          <Stack spacing={30 } alignItems="center" marginY={2}>
      <Pagination
        count={totalPages}
        page={currentPage}
        color="primary"
        onChange={(e, value) =>  handleSortByExpirationDate(searchFeature,trueSearchText,value,2,1,!valueOrder ? "ASC" : "")} // ← callback al cambiar
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

export default GuaranteesTable;