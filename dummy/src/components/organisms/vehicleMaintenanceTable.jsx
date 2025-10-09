import { useState } from "react";
import {
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
} from "@mui/material";
import Button from "../atoms/button";
import Swal from "sweetalert2";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import InputValidated from "../atoms/inputValidated";
import { formatDateDDMMYYYY } from "../../utils/generalUtilities";
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Stack from '@mui/material/Stack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ReactivationModal from "../molecules/reactivationModal";
import SortIcon from '@mui/icons-material/Sort';

function MaintenanceTable({
    logs,
    totalPages,
    currentPage,
    allVehiclesItems,
    isLoading,
    showForm,
    fields,
    editFields,
    maintenanceTypes,
    searchText,
    selectedVehicle, 
    setSelectedVehicle,
    searchField,
    setSearchField,
    setSearchText,
    onSortByDate, 
    onReactivate,
    onDelete,
    onEdit,
    onSearch,
    onToggleForm,
    onPageChange,
}){
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});
    const [fieldErrors, setFieldErrors] = useState({});
    const [sortOrder, setSortOrder] = useState("DESC");
    const dateFields = ["maintenance_date"];
    
    const getVehicleName = (cod_vehicle) => {
        const vehicle = allVehiclesItems.find((veh) => veh.value === cod_vehicle);
        return vehicle ? vehicle.label : "Vehículo no encontrado";
    };
    
    const handleEditClick = (record) => {
        setEditingId(record.cod_maintenance);
        setEditData({ ...record });
    };
    
    const getMaintenanceName = (typeCode) => {
        const type = maintenanceTypes.find((t) => t.value === typeCode);
        return type ? type.label : "Desconocido";
    };
    
    const handleSaveEdit = async () => {
        const hasError = Object.values(fieldErrors).some((err) => err);
        if (hasError) {
            Swal.fire("Error", "Hay campos vacíos o inválidos.", "error");
            return;
        }
    
        const result = await Swal.fire({
            title: "¿Guardar cambios?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, guardar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#2563eb",
            cancelButtonColor: "#9ca3af",
        });
    
        if (result.isConfirmed) {
            const isSaved = await onEdit(editData);
            if (isSaved) {
                setEditingId(null);
                setEditData({});
                setFieldErrors({});
                Swal.fire("Actualizado", "El registro fue modificado correctamente", "success");
            }
        }   
    };
    
    const handleCancelEdit = () => {
        setEditingId(null);
        setEditData({});
        setFieldErrors({});
    };
    
    const handleValidatedDelete = async (id) => {
        const result = await Swal.fire({
            title: "¿Desactivar este registro?",
            text: "Podrás deshacer esta acción",
            icon: "error",
            showCancelButton: true,
            confirmButtonText: "Sí, desactivar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#9ca3af",
        });
    
        if (result.isConfirmed) {
            await onDelete(id);
            Swal.fire("Desactivado", "El registro fue desactivado", "success");
        }
    };

    const toggleSort = () => {
        const newSortOrder = sortOrder === "ASC" ? "DESC" : "ASC";
        setSortOrder(newSortOrder);
        onSortByDate(newSortOrder); 
    };
    
    const searchInputClass = "w-full sm:w-48 h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm";
    
    return (
        <>
        {/* Buscador y botón agregar */}
        <div className="flex flex-col lg:flex-row gap-4 w-full max-w-5xl mx-auto mb-4">
            <Box className="flex flex-wrap gap-3 bg-white shadow-md rounded-xl p-4 flex-1">
            <FormControl 
                className={searchInputClass}
                sx={{ minWidth: 150, flex: 1 }} 
            >
                <InputLabel sx={{ backgroundColor: "white", px: 1 }}>Seleccione un vehículo</InputLabel>
                <Select
                    value={selectedVehicle}
                    onChange={(e) => setSelectedVehicle(e.target.value)}
                >
                    <MenuItem value="Todos">Todos</MenuItem>
                    {allVehiclesItems.map((veh) => (
                        <MenuItem key={veh.value} value={veh.value}>
                            {veh.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl className={searchInputClass}>
                <InputLabel sx={{ backgroundColor: "white", px: 1 }}>Filtrar por</InputLabel>
                <Select 
                    value={searchField} 
                    onChange={
                        (e) => {setSearchField(e.target.value)
                        setSearchText("")
                    }}
                >
                {fields
                    .filter((field) => field.name !== "cod_vehicle")
                    .map((field) => (
                        <MenuItem key={field.name} value={field.name}>
                        {field.placeholder}
                        </MenuItem>
                    ))}
                    <MenuItem value="estados">Estados</MenuItem>
                </Select>
            </FormControl>

            {/* Campo de valor dinámico */}
            {searchField === "maintenance_type_item_code" ? (
                <FormControl className={searchInputClass}>
                    <InputLabel sx={{ backgroundColor: "white", px: 1 }}>Tipo Mantenimiento</InputLabel>
                    <Select
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    >
                        <MenuItem value="">Todos</MenuItem>
                        {maintenanceTypes.map((type) => (
                            <MenuItem key={type.value} value={type.value}>
                                {type.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            ) : searchField === "estados" ? (
                <FormControl className={searchInputClass}>
                    <InputLabel sx={{ backgroundColor: "white", px: 1 }}>Estado</InputLabel>
                    <Select
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    >
                        <MenuItem value="Activos">Activos</MenuItem>
                        <MenuItem value="Desactivados">Desactivados</MenuItem>
                    </Select>
                </FormControl>
            ) : (
                <TextField
                    label={dateFields.includes(searchField) ? "Seleccione fecha" : "Buscar..."}
                    type={dateFields.includes(searchField) ? "date" : "text"}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className={searchInputClass}
                    InputLabelProps={{
                        ...(dateFields.includes(searchField) ? { shrink: true } : {}),
                        sx: { backgroundColor: "white", px: 1 },
                    }}
                />  
            )}  

            <div className="flex items-center justify-center lg:ml-9 w-full sm:w-auto">
                <Button
                text="Buscar"
                onClick={onSearch}
                className="h-12 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                />
            </div>
            </Box>

            <div className="flex items-center justify-center lg:justify-start lg:ml-9 w-full sm:w-auto">
            <div className="p-5 h-fit">
                <Button
                text={showForm ? "Cancelar" : "Agregar Registro"}
                onClick={onToggleForm}
                className="h-12 w-full sm:w-48 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                />
            </div>
            </div>
        </div>

        {/* Loader */}
        {isLoading && (
            <div className="flex flex-wrap items-center gap-3 bg-white shadow-md rounded-2xl px-4 py-3 w-full max-w-3xl mx-auto mb-4">
            <CircularProgress size={24} />
            <span>Cargando registros...</span>
            </div>
        )}

        {/* Sin registros */}
        {!isLoading && logs.length === 0 && (
            <div className="text-center py-8 text-gray-500 italic bg-gray-50 rounded-lg w-full max-w-3xl mx-auto mb-4">
            No se encontraron registros
            </div>
        )}

        {/* Tabla */}
        {logs.length > 0 && (
            <div className="overflow-x-auto rounded-xl shadow-lg mt-4 w-full">
            <table className="min-w-full">
                <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                    <th className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider rounded-tl-xl">#</th>
                    <th className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider">Vehículo</th>
                    <th className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider">Tipo Mantenimiento</th>
                    <th className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider">
                        Fecha de Mantenimiento
                         <button onClick={() => toggleSort()} title="Ordenar por fecha de vencimiento">
                            <SortIcon
                            fontSize="small"
                            sx={{
                                color: "white",
                                cursor: "pointer",
                                transition: "0.2s",
                                "&:hover": {
                                opacity: 0.7,
                                transform: "scale(1.1)"
                                }
                            }}
                            />
                        </button>
                    </th>
                    <th className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider">Kilometraje Acumulado</th>
                    <th className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider">Detalles</th>
                    <th className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider rounded-tr-xl">Acciones</th>
                </tr>
                </thead>
                <tbody>
                {logs.map((record, index) => {
                    const isEditing = editingId === record.cod_maintenance;
                    return (
                    <tr key={record.cod_maintenance} className="hover:bg-blue-50 even:bg-gray-50">
                        <td className="py-4 px-6 text-center">{index + 1}</td>

                        {isEditing ? (
                        <>
                            {editFields.map((field) => (
                            <td key={field.name} className="py-4 px-6 text-center">
                                <InputValidated
                                name={field.name}
                                type={field.type || "text"}
                                value={editData[field.name] || ""}
                                placeholder={field.placeholder}
                                options={field.options || []}
                                restriction={field.restriction}
                                required={field.required}
                                onChange={(e) =>
                                    setEditData({ ...editData, [field.name]: e.target.value })
                                }
                                onError={(name, errorMsg) =>
                                    setFieldErrors((prev) => ({ ...prev, [name]: errorMsg }))
                                }
                                sx={{
                                    "& .MuiInputBase-input": { backgroundColor: "#fff !important" },
                                    ...(field.width ? { width: field.width } : {}),
                                }}
                                formValues={editData}
                                />
                            </td>
                            ))}

                            <td className="py-4 px-6 text-center">
                            <div className="flex justify-center gap-2">
                                <button
                                onClick={handleSaveEdit}
                                disabled={Object.values(fieldErrors).some((err) => err)}
                                className={`rounded-lg px-3 py-2 flex items-center text-sm transition ${
                                    Object.values(fieldErrors).some((err) => err)
                                    ? "bg-gray-400 cursor-not-allowed text-white"
                                    : "bg-blue-600 hover:bg-blue-700 text-white"
                                }`}
                                >
                                <SaveIcon fontSize="small" className="mr-1" /> Guardar
                                </button>

                                <button
                                onClick={handleCancelEdit}
                                className="border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-100 flex items-center text-sm"
                                >
                                <CancelIcon fontSize="small" className="mr-1" /> Cancelar
                                </button>
                            </div>
                            </td>
                        </>
                        ) : (
                        <>
                            <td className="py-4 px-6 text-center">{getVehicleName(record.cod_vehicle)}</td>
                            <td className="py-4 px-6 text-center">{getMaintenanceName(record.maintenance_type_item_code)}</td>
                            <td className="py-4 px-6 text-center">{formatDateDDMMYYYY(record.maintenance_date)}</td>
                            <td className="py-4 px-6 text-center">{record.maintenance_km_acumulate} km</td>
                            <td className="py-4 px-6 text-center">{record.maintenance_detail}</td>                           
                            <td className="py-4 px-6 text-center">
                                <div className="flex justify-center space-x-3">
                                    {record.maintenance_log_is_active ? (
                                        <>
                                            <button
                                                onClick={() => handleEditClick(record)}
                                                className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50"
                                            >
                                                <EditIcon fontSize="small" />
                                            </button>

                                            <button
                                                onClick={() => handleValidatedDelete(record.cod_maintenance)}
                                                className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50"
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </button>
                                        </>
                                    ):(
                                        <ReactivationModal
                                            message={"¿Quieres reactivar este registro?"}
                                            onClick={() => onReactivate(record.cod_maintenance)}
                                        />
                                    )}
                                </div>
                            </td>
                        </>
                        )}
                    </tr>
                    );
                })}
                </tbody>
            </table>
            <Stack spacing={30 } alignItems="center" marginY={2}>
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    color="primary"
                    onChange={(e, value) => onPageChange(value, sortOrder)}
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
        </>
    );
    
}

export default MaintenanceTable;