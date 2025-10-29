import { useCallback, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import Swal from "sweetalert2";
import Button from "../atoms/button";
import { CircularProgress } from "@mui/material";
import InputValidated from "../atoms/inputValidated";
import { formatDateDDMMYYYY } from "../../utils/generalUtilities";

const TableAssociationProject = ({
    associations, 
    rolesTypes, 
    fieldsAssociation, 
    editFieldsAssociation, 
    showFormAssociations, 
    isLoadingAssociation, 
    handleEditAssociation, 
    onToggleForm, 
}) => {

    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});
    const [editErrors, setEditErrors] = useState({});

    /*
    * cambiar inputs a modo edicion
    */
    const handleEditClick = (asso) => {
        setEditingId(asso.cod_project_association);
        setEditData({ ...asso });
        setEditErrors({});
    };

    /*
    * guardar edicion
    */
    const handleSaveEdit = async () => {
        const hasError = Object.values(editErrors).some((err) => err);
        if (hasError) {
            Swal.fire("Error", "Hay campos vacíos.", "error");
            return;
        }

        if (!editingId) return;
        
        const isSaved = await handleEditAssociation(editData);
        if (isSaved) {
            setEditingId(null);
            setEditData({});
            setEditErrors({});
        }
    };

    /*
    * cancelar edicion 
    */
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
            <div className="relative flex items-center w-full max-w-5xl mx-auto mb-4">
                <h1 className="text-2xl font-bold text-gray-800 text-center flex-1">
                    Proyectos Asociados 
                </h1>
                <div className="absolute right-0">
                    <Button
                        text={showFormAssociations ? "Cancelar" : "Agregar Proyecto"}
                        onClick={onToggleForm}
                    />
                </div>
            </div>

            {isLoadingAssociation ? (
                <div className="flex flex-wrap items-center gap-3 bg-white shadow-md rounded-2xl px-4 py-3 w-full max-w-3xl mx-auto">
                    <CircularProgress size={24} />
                    <span>Cargando proyectos asociados...</span>
                </div>
            ) : !associations || associations.length === 0 ? (   
                <div className="text-center py-8 text-gray-500 italic bg-gray-50 rounded-lg w-full max-w-3xl mx-auto mb-4">
                    No hay proyectos asociados al perfil
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl shadow-lg">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                                <th className="py-4 px-6 text-center font-semibold text-md tracking-wider rounded-tl-xl w-12">#</th>
                                <th className="py-4 px-6 text-center font-semibold text-md tracking-wider">Proyecto</th>
                                <th className="py-4 px-6 text-center font-semibold text-md tracking-wider">Rol</th>
                                <th className="py-4 px-6 text-center font-semibold text-md tracking-wider">Fecha Inicio</th>
                                <th className="py-4 px-6 text-center font-semibold text-md tracking-wider">Fecha Final</th>
                                <th className="py-4 px-6 text-center font-semibold text-md tracking-wider">Tecnologías</th>
                                <th className="py-4 px-6 text-center font-semibold text-md tracking-wider rounded-tr-xl w-32"> Acciones </th>
                            </tr>
                        </thead>
                        <tbody>
                            {associations.map((asso, index) => {
                                const isEditing = editingId === asso.cod_project_association;
                                return (
                                <tr
                                    key={asso.cod_project_association} 
                                    className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100`}
                                >
                                    <td className="py-4 px-6 text-center">{index + 1}</td>

                                    {fieldsAssociation
                                        .map((f) => { 
                                        const fieldEdit = editFieldsAssociation.find((ef) => ef.name === f.name);
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
                                                currentId={editingId}
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
                                                f.name === "project_association_role_item_code" ? 
                                                    rolesTypes.find(t => t.value === asso.project_association_role_item_code)?.label || asso.project_association_role_item_code:
                                                f.name === "project_association_start_date_participation" ?
                                                    formatDateDDMMYYYY(asso[f.name]):
                                                f.name === "project_association_end_date_participation" ?
                                                    formatDateDDMMYYYY(asso[f.name]):
                                                asso[f.name]
                                            )}
                                            </td>
                                        )
                                    })}
                                    <td className="py-4 px-6 text-center flex gap-2 justify-center">
                                    {isEditing ? (
                                        <>
                                            <button
                                                onClick={handleSaveEdit}
                                                disabled={Object.values(editErrors).some(err => err)}
                                                className={`bg-blue-600 text-white rounded-lg px-4 py-2 flex items-center ${Object.values(editErrors).some(err => err) ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`} >
                                                <SaveIcon className="mr-1" fontSize="small" /> Guardar
                                            </button>
                                            <button
                                                onClick={handleCancelEdit}
                                                className="border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-100 transition flex items-center text-sm">
                                                <CancelIcon className="mr-1" fontSize="small" />Cancelar
                                            </button>
                                        </>
                                    ):(
                                        <>
                                            <button
                                                onClick={() => handleEditClick(asso)}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <EditIcon />
                                            </button>
                                        </>
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
}
export default TableAssociationProject;