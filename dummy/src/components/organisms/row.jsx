import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import ModalElimination from "../molecules/modalElimination";
import DetailsTable from "../organisms/detailTable";
import InputValidated from "../atoms/inputValidated";
import Button from "../atoms/button";
import { useState, useEffect } from "react";

export default function Row({
  item,
  tittles,
  subTitle,
  subfields,
  onExpand,
  isOpen,
  suppliesList,
  onDeleteMedicKit,
  onDeleteSupply,
  onEditMedicKit,
  onEditSupply,
  changeStateSupply,
  id,
}) {
  const [editingKit, setEditingKit] = useState(false);
  const [kitFormData, setKitFormData] = useState({ ...item });

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

  useEffect(() => {
    if (!isOpen) {
      setEditingKit(false);
      changeStateSupply(false);
    }
  }, [isOpen]);

  const handleSaveKit = () => {
    onEditMedicKit(kitFormData);
    setEditingKit(false);
  };

  return (
    <>
      {/* FILA PRINCIPAL */}
      <tr className="hover:bg-gray-50 transition-all duration-200 border-b border-gray-200">
        <td className="py-4 px-4 text-center">
          <button
            type="button"
            onClick={() => onExpand(id)}
            className="p-2 rounded-full hover:bg-gray-200 transition"
            aria-label={isOpen ? "Contraer" : "Expandir"}
          >
            {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </button>
        </td>

        {tittles.map((col, index) => (
          <td key={col.key} className="py-4 px-4 text-center text-gray-800">
            {editingKit ? (
              <InputValidated
                name={col.key}
                type={col.type || "text"}
                placeholder={col.placeholder}
                value={kitFormData[col.key]}
                onChange={(e) =>
                  setKitFormData({ ...kitFormData, [col.key]: e.target.value })
                }
                required={col.required ?? true}
                multiline={col.type === "textarea"}
                rows={col.type === "textarea" ? 2 : undefined}
                sx={{
                  ...whiteInputStyle,
                  "& .MuiOutlinedInput-root": {
                    ...whiteInputStyle["& .MuiOutlinedInput-root"],
                    minHeight: col.type === "textarea" ? "4rem" : "auto",
                    resize: col.type === "textarea" ? "vertical" : "none",
                    overflow: col.type === "textarea" ? "auto" : "visible",
                  },
                }}
              />
            ) : (
              <span className="font-normal">{  item[col.key]}</span>
            )}
          </td>
        ))}

        <td className="py-4 px-4 text-center">
          <div className="flex justify-center items-center space-x-3">
            {editingKit ? (
              <>
                <button
                  type="button"
                  onClick={handleSaveKit}
                  className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition flex items-center text-sm"
                >
                  <SaveIcon className="mr-2" fontSize="small" />
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => setEditingKit(false)}
                  className="border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100 transition flex items-center text-sm"
                >
                  <CancelIcon className="mr-2" fontSize="small" />
                  Cancelar
                </button>
              </>
            ) : (
              <>
                   <button
                  type="button"
                  onClick={() => {
                    setEditingKit(true);
                    setKitFormData({ ...item });
                  }}
                  className="text-blue-500 hover:text-blue-700 transition p-2 rounded-full hover:bg-blue-50"
                  aria-label="Editar kit médico"
                >
                  <EditIcon fontSize="small" />
                </button>
                <ModalElimination
                  message={"¿Quieres eliminar este kit médico?"}
                  onClick={() => onDeleteMedicKit(id)}
                />
              </>
            )}
          </div>
        </td>
      </tr>
      {/* FILA SECUNDARIA */}
      {isOpen && (
        <tr>
          <td colSpan={tittles.length + 2} className="px-8 py-6 bg-gray-50 text-center">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">{subTitle}</h3>
                <Button 
                  text="Agregar Suplemento" 
                  onClick={() => changeStateSupply(id)}
                />
              </div>
              <DetailsTable
                fields={subfields.filter(
                  (col) => col.key !== "cod_medic_kit" && col.key !== "cod_supply"
                )}
                items={suppliesList}
                onEdit={(idx, data) => onEditSupply(data)}
                renderDelete={(item) => (
                  <ModalElimination
                    message={"¿Quieres eliminar este suplemento?"}
                    onClick={() => onDeleteSupply(item.cod_supply)}
                  />
                )}
                centered
                inputStyle={whiteInputStyle}
              />
            </div>
          </td>
        </tr>
      )}
    </>
  );
}