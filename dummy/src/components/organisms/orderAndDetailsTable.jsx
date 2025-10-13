import React, { useCallback, useState, Fragment } from "react";
import { Box } from "@mui/material";
import Seeker from "../molecules/seeker";
import Button from "../atoms/button";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import InputValidated from "../atoms/inputValidated";
import InputValidatedDate from "../atoms/inputValidatedDate";
import ModalElimination from "../molecules/modalElimination";
import { ValidateValues } from "../../utils/validateValues";
import { formatDateDDMMYYYY } from "../../utils/generalUtilities";

/**
 * OrderAndDetailsTable
 *
 * Props expected (recomendado):
 * - singularName
 * - searchFields
 * - isCreatingInventory, setIsCreatingInventory
 * - isLoading
 * - data: array de órdenes (cada orden con `order_cod`, `order_date`, `order_status`, `order_supplier_code`, `order_total_amount`, etc.)
 * - subData: array de detalles (cada detalle con: product_name, quantities (array), unit_prices, and a field referencing the order - e.g. order_cod or order_detail_order_code)
 * - headers: oficinas (usadas como columnas en detalle)
 * - order_fields: definicion de columnas de la orden (como en tu hook)
 * - orderStatus: opciones de estado [{value,label}]
 * - suppliers: opciones de proveedores [{value,label}]
 * - onEditOrder(orderId, updatedData)
 * - onEditDetail(detailId, updatedData)
 * - onDeleteOrder(orderId)
 * - onDeleteDetail(detailId)
 * - onFind(feature, text)
 */
const OrderAndDetailsTable = ({
  singularName = "Orden",
  searchFields = [],
  isCreatingInventory,
  setIsCreatingInventory,
  isLoading = false,
  data = [],
  subData = [],
  headers = [],
  orderFields = [],
  orderStatus = [],
  suppliers = [],
  onEditOrder,
  onEditDetail,
  onDeleteOrder,
  onDeleteDetail,
  seeSecker = true,
  onFind,
  setAddDetailToOrder,
}) => {
  // Estados para edición de órdenes (padre)
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editOrderData, setEditOrderData] = useState({});

  // Estados para edición de detalles (hijo)
  const [editingDetailId, setEditingDetailId] = useState(null);
  const [editDetailData, setEditDetailData] = useState({});

  // Estados compartidos / UI
  const [editErrors, setEditErrors] = useState({});
  const [openRows, setOpenRows] = useState({}); // controlar expansión por order_cod
  const [searchText, setSearchText] = useState("");
  const [searchFeature, setSearchFeature] = useState("");

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

  // Helpers
  const toggleRow = (id) => setOpenRows((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleError = useCallback((name, errorMessage) => {
    setEditErrors((prev) => {
      if (prev[name] === errorMessage) return prev;
      return { ...prev, [name]: errorMessage };
    });
  }, []);

  const getDetailOrderCode = (detail) => {
    // intenta distintas propiedades para enlace detalle -> orden
    return detail.order_cod ?? detail.order_detail_order_code ?? detail.order_id ?? detail.orderId ?? null;
  };

  // ======= EDICION ORDEN (PADRE) =======
  const handleEditOrderClick = (order) => {
    setEditingOrderId(order.order_cod);
    // clonamos (asegurarnos de no mutar original)
    setEditOrderData({ ...order });
    setEditErrors({});
  };

  const handleCancelOrder = () => {
    setEditingOrderId(null);
    setEditOrderData({});
    setEditErrors({});
  };

  const handleSaveOrder = async () => {
    if (onEditOrder) await onEditOrder(editingOrderId, editOrderData);
    setEditingOrderId(null);
    setEditOrderData({});
    setEditErrors({});
  };

  // ======= EDICION DETAIL (HIJO) =======
  const handleEditDetailClick = (detail) => {
    const id = detail.detail_cod ?? detail.id ?? detail.order_ids ?? detail.product_cod_item ?? JSON.stringify(detail); // fallback
    setEditingDetailId(id);
    // clonamos para editar: quantities (array) y unit_prices
    setEditDetailData({ ...detail, quantities: Array.isArray(detail.quantities) ? [...detail.quantities] : (detail.quantities ?? []) });
    setEditErrors({});
  };

  const handleCancelDetail = () => {
    setEditingDetailId(null);
    setEditDetailData({});
    setEditErrors({});
  };

  const handleSaveDetail = async () => {
    // intentar id coherente
    const id = editDetailData.detail_cod ?? editDetailData.id ?? editDetailData.order_ids ?? editDetailData.product_cod_item ?? null;
    if (onEditDetail) await onEditDetail(id, editDetailData);
    setEditingDetailId(null);
    setEditDetailData({});
    setEditErrors({});
  };

  return (
    <div className={`dinamic-table-container p-6 bg-white rounded-2xl ${seeSecker ? "mt-6" : "mt-0"}`}>
      {/* Seeker y botón agregar */}
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
              onClick={() => onFind && onFind(searchFeature, searchText)}
            />
          </Box>
          <div className="flex items-center justify-center lg:justify-start w-full sm:w-auto">
            <div className="p-4 h-fit">
              <Button
                text={isCreatingInventory ? "Cancelar" : `Agregar ${singularName}`}
                onClick={() => setAddDetailToOrder(!isCreatingInventory)}
                className="h-12 w-full sm:w-48 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <h3 className=" text-xl font-semibold mb-4 text-gray-700 "> Lista de {singularName}</h3>
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
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                <th className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider rounded-tl-xl">#</th>
                <th className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider">Expandir</th>
                {/* encabezados de orden (padre) */}
                {orderFields.map((f) => (
                  <th key={f.name} className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider">{f.placeholder}</th>
                ))}
                <th className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider rounded-tr-xl">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {data.map((order, index) => {
                const isEditingOrder = editingOrderId === order.order_cod;
                const isOpen = !!openRows[order.order_cod];

                return (
                  <Fragment key={order.order_cod ?? index}>
                    {/* fila padre (orden) */}
                    <tr className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 transition`}>
                      <td className="py-4 px-6 text-center">{index + 1}</td>

                      <td className="text-center">
                        { (subData || []).some(d => getDetailOrderCode(d) === order.order_cod) ? (
                          <button onClick={() => toggleRow(order.order_cod)}>
                            {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                          </button>
                        ) : (
                          <button disabled className="opacity-40">
                            <KeyboardArrowDownIcon />
                          </button>
                        )}
                      </td>

                      {/* mostrar columnas definidas en orderFields */}
                      {orderFields.map((f) => {
                        const options =
                          f.name === "order_status" ? orderStatus
                            : f.name === "order_supplier_code" ? suppliers
                              : [];

                        let value = order[f.name];

                        if (f.type === "select" && !isEditingOrder) {
                          const option = options.find(opt => String(opt.value) === String(order[f.name]));
                          value = option ? option.label : value;
                        }
                        if (f.type === "date" && value) {
                          value = formatDateDDMMYYYY(value);
                        }

                        return (
                          <td key={f.name} className="py-4 px-6 text-center align-middle text-gray-700">
                            {isEditingOrder ? (
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
                                  value={String(editOrderData[f.name] ?? "")}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    setEditOrderData({ ...editOrderData, [f.name]: value });
                                  }}
                                  sx={{
                                    ...whiteInputStyle, "& .MuiOutlinedInput-root": {
                                      ...whiteInputStyle["& .MuiOutlinedInput-root"],
                                      minWidth: "200px", width: "100%", minHeight: "3rem"
                                    },
                                  }}
                                />
                              ) : f.type === "date" ? (
                                <InputValidatedDate
                                  name={f.name}
                                  value={editOrderData[f.name] ? String(editOrderData[f.name]).split("T")[0] : ""}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    setEditOrderData({ ...editOrderData, [f.name]: value })
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
                                  value={editOrderData[f.name] ?? ""}
                                  placeholder={f.placeholder}
                                  required={f.required ?? true}
                                  restriction={f.restriction}
                                  validations={f.validations || []}
                                  onError={handleError}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    setEditOrderData({ ...editOrderData, [f.name]: value });
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
                              value ?? f.value ?? "—"
                            )}
                          </td>
                        );
                      })}

                      <td className="py-4 px-6 text-center align-middle">
                        <div className="flex justify-center space-x-3">
                          {isEditingOrder ? (
                            <>
                              <button
                                onClick={handleSaveOrder}
                                disabled={Object.values(editErrors).some(err => err)}
                                className={`bg-blue-600 text-white rounded-lg px-4 py-2 flex items-center ${Object.values(editErrors).some(err => err) ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}>
                                <SaveIcon className="mr-1" fontSize="small" /> Guardar
                              </button>

                              <button
                                onClick={handleCancelOrder}
                                className="border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-100 transition flex items-center text-sm">
                                <CancelIcon className="mr-1" fontSize="small" />Cancelar
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEditOrderClick(order)}
                                aria-label="Editar Orden"
                                className="text-blue-500 hover:text-blue-700 transition p-2 rounded-full hover:bg-blue-50">
                                <EditIcon />
                              </button>

                              <ModalElimination
                                message={`Eliminar ${singularName}`}
                                onClick={() => onDeleteOrder && onDeleteOrder(order.order_cod)}
                              />
                            </>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* SUBTABLA: detalles de esta orden */}
                    {isOpen && (
                      <tr key={`details-${order.order_cod}`}>
                        <td colSpan={orderFields.length + 3} className="px-8 py-6 bg-gray-50 text-center">
                          <div className="overflow-x-auto rounded-xl shadow-md p-4 bg-white">
                            <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-lg font-semibold text-gray-800">Lista de detalles</h3>
                                             
                                            <Button
                                              text="Agregar detalle"
                                              onClick={() => setAddDetailToOrder(!isCreatingInventory,order.order_cod)} // pasar el código de la orden para agregar detalle
                                            />
                                            
                                          </div>
                            <table className="min-w-full table-auto text-center">
                              <thead>
                                <tr className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                                  <th className="py-4 px-6 font-semibold text-md capitalize tracking-wider rounded-tl-xl w-12">#</th>
                                  <th className="py-4 px-6 font-semibold text-md capitalize tracking-wider">Producto</th>
                                  {headers.map((d, i) => (
                                    <th key={i} className="py-4 px-6 font-semibold text-md capitalize tracking-wider min-w-[200px]">{d.item_name}</th>
                                  ))}
                                  <th className="py-4 px-6 font-semibold text-md capitalize tracking-wider min-w-[203px]">Precio unitario</th>
                                  <th className="py-4 px-6 font-semibold text-md capitalize tracking-wider rounded-tr-xl">Acciones</th>
                                </tr>
                              </thead>

                              <tbody className="bg-white divide-y divide-gray-200">
                                { (subData || []).filter(detail => getDetailOrderCode(detail) === order.order_cod).map((detail, idxDetail) => {
                                  const detailId = detail.detail_cod ?? detail.id ?? detail.order_ids ?? detail.product_cod_item ?? idxDetail;
                                  const isEditingDetail = editingDetailId === detailId;

                                  // quantities: prefer editDetailData when editing, otherwise detail.quantities or zero-array
                                  const quantities = isEditingDetail
                                    ? (editDetailData.quantities ?? (Array.isArray(detail.quantities) ? [...detail.quantities] : new Array(headers.length).fill(0)))
                                    : (Array.isArray(detail.quantities) ? detail.quantities : new Array(headers.length).fill(0));

                                  return (
                                    <tr key={detailId} className={`hover:bg-blue-50 transition-all duration-200 ${idxDetail % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                                      <td className="px-4 py-2 font-medium text-gray-900">{idxDetail + 1}</td>
                                      <td className="px-4 py-2 font-medium text-gray-900">{detail.product_name ?? detail.product_description ?? "—"}</td>

                                      {quantities.map((cantidad, qIdx) => (
                                        <td key={qIdx} className="px-4 py-2 text-center text-gray-700">
                                          {isEditingDetail ? (
                                            <InputValidated
                                              name={`cantidad_${detailId}_${qIdx}`}
                                              type="number"
                                              restriction="allowZero"
                                              value={editDetailData.quantities?.[qIdx] ?? 0}
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                const newQuantities = Array.isArray(editDetailData.quantities)
                                                  ? [...editDetailData.quantities]
                                                  : (Array.isArray(detail.quantities) ? [...detail.quantities] : new Array(headers.length).fill(0));
                                                newQuantities[qIdx] = value;
                                                const newData = { ...editDetailData, quantities: newQuantities };
                                                setEditDetailData(newData);

                                                // validación
                                                const err = ValidateValues({
                                                  type: "number",
                                                  value,
                                                  required: true,
                                                  validations: [],
                                                  restriction: "allowZero",
                                                  allValues: newData,
                                                });
                                                setEditErrors(prev => ({ ...prev, [`cantidad_${detailId}_${qIdx}`]: err }));
                                              }}
                                              sx={whiteInputStyle}
                                              required={false}
                                            />
                                          ) : (
                                            cantidad ?? 0
                                          )}
                                        </td>
                                      ))}

                                      <td className="px-4 py-2 text-center text-gray-700">
                                        {isEditingDetail ? (
                                          <InputValidated
                                            name={`unit_price_${detailId}`}
                                            type="number"
                                            value={editDetailData.unit_prices ?? detail.unit_prices ?? 0}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              const newData = { ...editDetailData, unit_prices: value };
                                              setEditDetailData(newData);

                                              const err = ValidateValues({
                                                type: "number",
                                                value,
                                                required: true,
                                                validations: [],
                                                restriction: "",
                                                allValues: newData,
                                              });
                                              setEditErrors(prev => ({ ...prev, [`unit_price_${detailId}`]: err }));
                                            }}
                                            sx={whiteInputStyle}
                                            required
                                          />
                                        ) : (
                                          detail.unit_prices ?? "—"
                                        )}
                                      </td>

                                      <td className="px-4 py-2 text-center">
                                        {isEditingDetail ? (
                                          <div className="flex justify-center space-x-2">
                                            <button
                                              className={`bg-blue-600 text-white px-3 py-1 rounded flex items-center ${Object.values(editErrors).some(err => err) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                                              onClick={handleSaveDetail}
                                              disabled={Object.values(editErrors).some(err => err)}
                                            >
                                              <SaveIcon fontSize="small" className="mr-1" /> Guardar
                                            </button>

                                            <button
                                              className="border border-gray-300 px-3 py-1 rounded hover:bg-gray-100 flex items-center"
                                              onClick={handleCancelDetail}
                                            >
                                              <CancelIcon fontSize="small" className="mr-1" />Cancelar
                                            </button>
                                          </div>
                                        ) : (
                                          <div className="flex justify-center gap-3">
                                            <button
                                              className="text-blue-500 hover:text-blue-700 transition p-2 rounded-full hover:bg-blue-50"
                                              onClick={() => handleEditDetailClick(detail)}
                                            >
                                              <EditIcon />
                                            </button>

                                            <ModalElimination
                                              message={`Eliminar detalle`}
                                              onClick={() => onDeleteDetail && onDeleteDetail(detailId)}
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

export default OrderAndDetailsTable;
