import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";
import ModalElimination from "../molecules/modalElimination";
import InputValidated from "../atoms/inputValidated";
import ModalAlert from "../molecules/modalAlert";
import { formatDateDDMMYYYY } from "../../utils/generalUtilities";
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
  changeStateSupply
}) {
  const idKey = tittles[0]?.key;
  const [editingKit, setEditingKit] = useState(false);
  const [kitFormData, setKitFormData] = useState({ ...item });
  const [editingSupplyId, setEditingSupplyId] = useState(null);
  const [supplyFormData, setSupplyFormData] = useState({});
  const [supplyErrors, setSupplyErrors] = useState({});

  useEffect(() => {
    if (!isOpen) {
      setEditingKit(false);
      setEditingSupplyId(null);
      setSupplyFormData({});
      setSupplyErrors({});
      changeStateSupply(false);
    }
  }, [isOpen]);

  const handleSaveKit = () => {
    onEditMedicKit(kitFormData);
    setEditingKit(false);
  };

  const handleSaveSupply = () => {
    if (Object.values(supplyErrors).some((e) => e)) {
      ModalAlert("Errores en el formulario", "Corrige los errores antes de guardar", "error");
      return;
    }
    onEditSupply(supplyFormData);
    setEditingSupplyId(null);
  };

  return (
    <>
      <tr className="hover:bg-gray-50 transition-all duration-200 border-b border-gray-200">
        <td className="py-4 px-4 text-center">
          <button
            onClick={() => onExpand(item[idKey])}
            className="p-2 rounded-full hover:bg-gray-200 transition"
            aria-label={isOpen ? "Contraer" : "Expandir"}
          >
            {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </button>
        </td>

        {tittles.map((col, index) => (
          <td key={col.key} className="py-4 px-4 text-center text-gray-800">
            {editingKit && index !== 0 ? (
              <div className="flex justify-center">
                <InputValidated
                  name={col.key}
                  type={col.type || "text"}
                  value={kitFormData[col.key]}
                  placeholder={col.placeholder || col.label}
                  onChange={(e) => setKitFormData({ ...kitFormData, [col.key]: e.target.value })}
                />
              </div>
            ) : (
              <span className="font-medium">{item[col.key]}</span>
            )}
          </td>
        ))}

        <td className="py-4 px-4 text-center">
          <div className="flex justify-center space-x-3">
            {editingKit ? (
              <>
                <button
                  onClick={handleSaveKit}
                  className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition flex items-center text-sm"
                >
                  <SaveIcon className="mr-2" fontSize="small" />
                  Guardar
                </button>
                <button
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
                  onClick={() => onDeleteMedicKit(item[idKey])}
                />
              </>
            )}
          </div>
        </td>
      </tr>
      {isOpen && (
        <tr>
          <td colSpan={tittles.length + 2} className="px-8 py-6 bg-gray-50">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">{subTitle}</h3>
                <button
                  onClick={() => changeStateSupply(item[idKey])}
                  className="bg-blue-600 text-white rounded-lg px-5 py-3 hover:bg-blue-700 transition flex items-center"
                >
                  <AddIcon className="mr-2" fontSize="small" />
                  Agregar Suplemento
                </button>
              </div>

              {suppliesList && suppliesList.length > 0 ? (
                <div className="overflow-x-auto rounded-lg">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                        {subfields.map((col) =>
                          col.key === "cod_medic_kit" || col.key === "cod_supply" ? null : (
                            <th
                              key={col.key}
                              className="py-4 px-6 text-left font-semibold text-sm uppercase tracking-wider"
                            >
                              {col.label}
                            </th>
                          )
                        )}
                        <th className="py-4 px-6 text-center font-semibold text-sm uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {suppliesList.map((supply) => (
                        <tr key={supply[subfields[1].key]} className="border-b border-gray-200 hover:bg-gray-50 even:bg-gray-50">
                          {subfields.map((col) =>
                            col.key === "cod_medic_kit" || col.key === "cod_supply" ? null : (
                              <td key={col.key} className="py-4 px-6">
                                {editingSupplyId === supply[subfields[1].key] ? (
                                  <InputValidated
                                    name={col.key}
                                    type={col.type || "text"}
                                    value={supplyFormData[col.key]}
                                    placeholder={col.placeholder || col.label}
                                    validations={[]}
                                    required={col.required || false}
                                    onChange={(e) =>
                                      setSupplyFormData({ ...supplyFormData, [col.key]: e.target.value })
                                    }
                                    onError={(name, err) =>
                                      setSupplyErrors((prev) => ({ ...prev, [name]: err }))
                                    }
                                  />
                                ) : col.key === "supply_expiration_date" ? (
                                  supply[col.key] && String(supply[col.key]).trim() !== ""
                                    ? formatDateDDMMYYYY(supply[col.key])
                                    : "Sin fecha"
                                ) : (
                                  supply[col.key] ?? ""
                                )}
                              </td>
                            )
                          )}
                          <td className="py-4 px-6">
                            <div className="flex justify-center space-x-3">
                              {editingSupplyId === supply[subfields[1].key] ? (
                                <>
                                  <button
                                    onClick={handleSaveSupply}
                                    className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition flex items-center text-sm"
                                  >
                                    <SaveIcon className="mr-2" fontSize="small" />
                                    Guardar
                                  </button>
                                  <button
                                    onClick={() => setEditingSupplyId(null)}
                                    className="border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100 transition flex items-center text-sm"
                                  >
                                    <CancelIcon className="mr-2" fontSize="small" />
                                    Cancelar
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => {
                                      setEditingSupplyId(supply[subfields[1].key]);
                                      setSupplyFormData({ ...supply });
                                    }}
                                    className="text-blue-500 hover:text-blue-700 transition p-2 rounded-full hover:bg-blue-50"
                                    aria-label="Editar suplemento"
                                  >
                                    <EditIcon />
                                  </button>
                                  <ModalElimination
                                    message={"¿Quieres eliminar este suplemento médico?"}
                                    onClick={() => onDeleteSupply(supply[subfields[1].key])}
                                  />
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No hay suplementos registrados</p>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}