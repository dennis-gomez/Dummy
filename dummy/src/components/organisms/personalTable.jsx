import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import ModalElimination from "../molecules/modalElimination";
import { CircularProgress } from "@mui/material";
import InputValidated from "../atoms/inputValidated"
import ReactivationModal from "../molecules/reactivationModal";
import { useState, useCallback } from "react";
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Stack from '@mui/material/Stack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Seeker from "../molecules/seeker";
import Button from "../atoms/button";

const PersonalTable = ({
    personal, 
    
    fields,
    editFields,

    isLoading,

    totalPages, 
    currentPage, 
    onPageChange, 

    showForm,

    searchText, 
    searchField,
    setSearchText, 
    setSearchField,
    handleSearch, 

    handleDelete, 
    handleReactivate, 
    handleEdit,

    onToggleForm,

    handleOpenFormation
}) => {

    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});

    const [editErrors, setEditErrors] = useState({});
    const [isUnique, setIsUnique] = useState(true);

    const handleEditClick = (person) => {
        setEditingId(person.personal_cod);
        setEditData({ ...person });
        setEditErrors({});
    };

    const handleSaveEdit = async () => {
        const hasError = Object.values(editErrors).some((err) => err);
        if (hasError) {
            Swal.fire("Error", "Hay campos vacíos.", "error");
            return;
        }

        if (!editingId) return;
        
        const isSaved = await handleEdit(editData);
        if (isSaved) {
            setEditingId(null);
            setEditData({});
            setEditErrors({});
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditData({});
        setEditErrors({});
    };

    const handleError = useCallback((name, errorMessage) => {
        setEditErrors((prev) => {
            if (prev[name] === errorMessage) return prev;
            return { ...prev, [name]: errorMessage };
        });
    }, []);

    return (
        <div className="p-6 mt-6 bg-white rounded-2xl">
            <div className="flex flex-col lg:flex-row gap-4 w-full max-w-5xl mx-auto mb-4">
                <Seeker
                    inputName="search"
                    inputPlaceholder="Buscar..."
                    btnName="Buscar"
                    selectName="Filtrar por"
                    fields={fields}
                    valueText={searchText}
                    valueFeature={searchField}
                    onChangeText={setSearchText}
                    onChangeFeature={setSearchField}
                    onClick={handleSearch}
                />

                {/* Botón Agregar/Cancelar */}
                <div className="flex items-center justify-center lg:justify-start w-full sm:w-auto">
                <div className="p-4 h-fit">
                    <Button
                        text={showForm ? "Cancelar" : "Agregar Personal"}
                        onClick={onToggleForm}
                        className="h-12 w-full sm:w-48 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    />
                </div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-wrap items-center gap-3 bg-white shadow-md rounded-2xl px-4 py-3 w-full max-w-3xl mx-auto">
                    <CircularProgress size={24} />
                    <span>Cargando Personal...</span>
                </div>
            ) : personal.length === 0 ? (   
                <div className="text-center py-8 text-gray-500 italic bg-gray-50 rounded-lg w-full max-w-3xl mx-auto mb-4">
                    No hay personal registrados
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl shadow-lg">
                    <table className="min-w-full table-auto">

                        <thead>
                            <tr className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                                <th className="py-4 px-6 text-center font-semibold text-md tracking-wider rounded-tl-xl w-12">#</th>
                                <th className="py-4 px-6 text-center font-semibold text-md tracking-wider">Ver Más</th>
                                <th className="py-4 px-6 text-center font-semibold text-md tracking-wider">Identificacion/ID</th>
                                <th className="py-4 px-6 text-center font-semibold text-md tracking-wider">Primer Nombre</th>
                                <th className="py-4 px-6 text-center font-semibold text-md tracking-wider">Primer Apellido</th>
                                <th className="py-4 px-6 text-center font-semibold text-md tracking-wider">Segundo Apellido</th>
                                <th className="py-4 px-6 text-center font-semibold text-md tracking-wider">Fecha de Nacimiento</th>
                                <th className="py-4 px-6 text-center font-semibold text-md tracking-wider">País de Residencia</th>
                                <th className="py-4 px-6 text-center font-semibold text-md tracking-wider">Firma Digital</th>
                                <th className="py-4 px-6 text-center font-semibold text-md tracking-wider">Número de Teléfono</th>
                                <th className="py-4 px-6 text-center font-semibold text-md tracking-wider rounded-tr-xl w-32"> Acciones </th>
                            </tr>
                        </thead>

                        <tbody>
                            {personal.map((per, index) => {
                                const isEditing = editingId === per.personal_cod;
                                return (
                                <tr
                                    key={per.personal_cod} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100`}>
                                    <td className="py-4 px-6 text-center">{index + 1}</td>

                                    <td className="py-4 px-6 text-center">
                                        <Button
                                            text={"Ver Más"}
                                            onClick={() => handleOpenFormation(per)}
                                            className="h-12 w-full sm:w-48 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                                        />
                                    </td>

                                    {fields
                                    .filter((f) => f.name !== "personal_is_active")
                                    .map((f) => { 
                                    const fieldEdit = editFields.find((ef) => ef.name === f.name);
                                    return (
                                        <td key={f.name} className="py-4 px-6 text-center">
                                        {isEditing && fieldEdit ? (
                                            <InputValidated
                                            name={fieldEdit.name}
                                            type={fieldEdit.type || "text"}
                                            value={editData[fieldEdit.name] || ""}
                                            placeholder={fieldEdit.placeholder}
                                            options={fieldEdit.options || []}
                                            restriction={fieldEdit.restriction}
                                            validations={fieldEdit.validations}
                                            required={fieldEdit.required}
                                            onError={handleError}
                                            setIsUnique={setIsUnique}
                                            currentId={editingId}
                                            uniqueValues={personal.map((p) => ({
                                                id: p.personal_cod,
                                                value: p[fieldEdit.name],
                                            }))}
                                            onChange={(e) =>
                                                setEditData({ ...editData, [fieldEdit.name]: e.target.value })
                                            }
                                            sx={{
                                                "& .MuiInputBase-input": { backgroundColor: "#fff !important" },
                                                ...(fieldEdit.width ? { width: fieldEdit.width } : {}),
                                            }}
                                            formValues={editData}
                                            />
                                        ) : (
                                            f.name === "personal_has_digital_signature" ? (per[f.name] ? "Sí" : "No") : per[f.name]
                                        )}
                                        </td>
                                    );
                                    })}
                                    <td className="py-4 px-6 text-center flex gap-2 justify-center">
                                    {isEditing ? (
                                        <>
                                        <button
                                            onClick={handleSaveEdit}
                                            disabled={Object.values(editErrors).some(err => err) || !isUnique}
                                            className={`bg-blue-600 text-white rounded-lg px-4 py-2 flex items-center ${Object.values(editErrors).some(err => err) || !isUnique ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`} >
                                            <SaveIcon className="mr-1" fontSize="small" /> Guardar
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            className="border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-100 transition flex items-center text-sm">
                                            <CancelIcon className="mr-1" fontSize="small" />Cancelar
                                        </button>
                                        </>
                                    ) : (
                                        per.personal_is_active ? (
                                            <>
                                                <button
                                                    onClick={() => handleEditClick(per)}
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    <EditIcon />
                                                </button>

                                                <ModalElimination
                                                    message={"¿Estás seguro de desactivarlo?"}
                                                    onClick={() => handleDelete(per.personal_cod)}
                                                />
                                            </>
                                        ) : (
                                            <ReactivationModal
                                                message={"¿Quieres reactivarlo?"}
                                                onClick={() => handleReactivate(per.personal_cod)}
                                            />
                                        )
                                    )}
                                    </td>
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
                            onChange={(e, value) => onPageChange(value)}
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
}

export default PersonalTable;