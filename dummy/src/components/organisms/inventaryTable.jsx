import React, { useState } from "react";
import { Box } from "@mui/material";
import Seeker from "../molecules/seeker";
import Button from "../atoms/button";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import InputValidated from "../atoms/inputValidated";
import ModalElimination from "../molecules/modalElimination";
import { ValidateValues } from "../../utils/validateValues";

const InventaryTable = ({
  singularName,
  searchFields,
  isCreatingInventory,
  setIsCreatingInventory,
  isLoading,
  data,
  headers,
  onEdit, // 👈 función callback para guardar cambios (opcional)
  deleteGuaranteOrReactivated,
  seeSecker = true,
  onFind,
}) => {
  const [editingIdx, setEditingIdx] = useState(null);
  const [editData, setEditData] = useState({});
  const [searchText, setSearchText] = useState("");
  const [searchFeature, setSearchFeature] = useState("");
  const [editErrors, setEditErrors] = useState({}); // errores de validación

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

  const handleEditClick = (row, idx) => {
    setEditingIdx(idx);
    setEditData({ ...row });
  };

  const handleCancelEdit = () => {
    setEditingIdx(null);
    setEditData({});
  };

  const handleSaveEdit = () => {
    if (onEdit) onEdit(editData); // callback externo para guardar
    setEditingIdx(null);
    setEditData({});
  };

  return (
    <div
      className={`dinamic-table-container p-6 bg-white rounded-2xl ${seeSecker ? "mt-6" : "mt-0"
        }`}
    >   {/* Seeker y botón agregar */}
      {seeSecker ? (
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
              onClick={() => onFind(searchFeature, searchText)}
            />
          </Box>
          <div className="flex items-center justify-center lg:justify-start w-full sm:w-auto">
            <div className="p-4 h-fit">
              <Button
                text={isCreatingInventory ? "Cancelar" : `Agregar ${singularName}`}
                onClick={() => {
                  setIsCreatingInventory(!isCreatingInventory);
                }}

                className="h-12 w-full sm:w-48 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              />
            </div>
          </div>
        </div>
      ) : (
        //quiero centrar lo de abajo
        <div className="flex justify-center">
          <h3 className=" text-xl font-semibold mb-4 text-gray-700 "> Lista de Productos</h3>
        </div>
      )}

      {/* Contenido de la tabla */}
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
          <table className="min-w-full table-auto text-center">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                <th className="py-4 px-6 font-semibold text-md capitalize tracking-wider rounded-tl-xl w-12">
                  #
                </th>
                <th className="py-4 px-6 font-semibold text-md capitalize tracking-wider">
                  Producto
                </th>
                {headers.map((d, index) => (
                  <th
                    key={index}
                    className="py-4 px-6 font-semibold text-md capitalize tracking-wider min-w-[280px]"
                  >
                    {d.item_name}
                  </th>
                ))}
                <th className="py-4 px-6 font-semibold text-md capitalize tracking-wider min-w-[203px]">
                  Precio unitario
                </th>
                <th className="py-4 px-6 font-semibold text-md capitalize tracking-wider rounded-tr-xl">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((row, index) => (
                <tr
                  key={index}
                  className={`hover:bg-blue-50 transition-all duration-200 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                >
                  {/* Columna índice */}
                  <td className="px-4 py-2 font-medium text-gray-900">
                    {index + 1}
                  </td>

                  {/* Nombre del producto */}
                  <td className="px-4 py-2 font-medium text-gray-900">
                    {row.product_name}
                  </td>

                  {/* quantities por oficina */}
                  {(
                    editingIdx === index
                      ? (editData.quantities && editData.quantities.length > 0
                        ? editData.quantities
                        : new Array(headers.length).fill(0))
                      : (row.quantities && row.quantities.length > 0
                        ? row.quantities
                        : new Array(headers.length).fill(0))
                  ).map((cantidad, i) => (
                    <td key={i} className="px-4 py-2 text-center text-gray-700">
                      {editingIdx === index ? (
                        <InputValidated
                          name={`cantidad_${i}`}
                          type="number"
                          restriction="allowZero"
                          value={editData.quantities?.[i] ?? 0}
                          onChange={(e) => {
                            const value = e.target.value;
                            const newQuantities = Array.isArray(editData.quantities)
                              ? [...editData.quantities]
                              : new Array(headers.length).fill(0);
                            newQuantities[i] = (value);

                            // Actualizamos editData
                            const newData = { ...editData, quantities: newQuantities };
                            setEditData(newData);

                            // Validamos este campo específico
                            const err = ValidateValues({
                              type: "number",            // tipo de dato
                              value: value,               // valor ingresado
                              required: true,             // obligatorio
                              validations: [],            // si tienes validaciones extra, las pones aquí
                              restriction: "allowZero",   // igual que tu InputValidated
                              allValues: newData,
                            });

                            // Guardamos error en editErrors usando un nombre único
                            setEditErrors(prev => ({ ...prev, [`cantidad_${i}`]: err }));
                          }}

                          sx={whiteInputStyle}
                          required={false}
                        />
                      ) : (
                        cantidad ?? 0
                      )}
                    </td>
                  ))}


                  {/* Precio unitario */}
                  <td className="px-4 py-2 text-center text-gray-700">
                    {editingIdx === index ? (
                      <InputValidated
                        name="unit_prices"
                        type="number"
                        value={editData.unit_prices}
                        onChange={(e) => {
                          const value = e.target.value;

                          const newData = { ...editData, unit_prices: value };
                          setEditData(newData);

                          const err = ValidateValues({
                            type: "number",
                            value: value,
                            required: true,
                            validations: [],
                            restriction: "",
                            allValues: newData,
                          });

                          setEditErrors(prev => ({ ...prev, unit_prices: err }));
                        }}

                        sx={whiteInputStyle}
                        required
                      />
                    ) : (
                      row.unit_prices
                    )}
                  </td>

                  {/* Acciones */}
                  <td className="px-4 py-2 text-center">
                    {editingIdx === index ? (
                      <div className="flex justify-center space-x-2">
                        <button
                          className={`bg-blue-600 text-white px-3 py-1 rounded flex items-center 
              ${Object.values(editErrors).some(err => err) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                          onClick={handleSaveEdit}
                          type="button"
                          disabled={Object.values(editErrors).some(err => err)} // 🔹 desactiva si hay errores
                        >
                          <SaveIcon fontSize="small" className="mr-1" />
                          Guardar
                        </button>

                        <button
                          className="border border-gray-300 px-3 py-1 rounded hover:bg-gray-100 flex items-center"
                          onClick={handleCancelEdit}
                          type="button"
                        >
                          <CancelIcon fontSize="small" className="mr-1" />
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-center gap-3">
                        <button
                          className="text-blue-500 hover:text-blue-700 transition p-2 rounded-full hover:bg-blue-50"
                          type="button"
                          onClick={() => handleEditClick(row, index)}
                        >
                          <EditIcon />
                        </button>
                        <ModalElimination
                          message={`Eliminar ${singularName}`}
                          type="button"
                          onClick={() => deleteGuaranteOrReactivated(row.product_cod_item, row.product_cod_category)}
                        />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InventaryTable;