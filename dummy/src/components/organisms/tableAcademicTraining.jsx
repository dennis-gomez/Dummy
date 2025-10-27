
import { useCallback, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import Swal from "sweetalert2";
import Button from "../atoms/button";
import { CircularProgress } from "@mui/material";
import InputValidated from "../atoms/inputValidated";

const TableAcademicTrainning = ({
    academicTrainings, 
    titlesTypes,

    fields: fieldsAcademicTraining, 
    editFields: editFieldsAcademicTraining, 

    showForm: showFormAcademicTraining, 
    onToggleForm, 

    isLoading: isLoadingAcademicTraining, 

    handleEdit: handleEditAcademicTraining, 
}) => {
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});
    const [editErrors, setEditErrors] = useState({});

    /*
    * cambiar inputs a modo edicion
    */
    const handleEditClick = (training) => {
        setEditingId(training.cod_academic_training);
        setEditData({ ...training });
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
        
        const isSaved = await handleEditAcademicTraining(editData);
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
                    Formaciones Académicas
                </h1>
                <div className="absolute right-0">
                    <Button
                    text={showFormAcademicTraining ? "Cancelar" : "Agregar Formación"}
                    onClick={onToggleForm}
                    />
                </div>
            </div>

            {isLoadingAcademicTraining ? (
                <div className="flex flex-wrap items-center gap-3 bg-white shadow-md rounded-2xl px-4 py-3 w-full max-w-3xl mx-auto">
                    <CircularProgress size={24} />
                    <span>Cargando formaciones académicas...</span>
                </div>
            ) : !academicTrainings || academicTrainings.length === 0 ? (   
                <div className="text-center py-8 text-gray-500 italic bg-gray-50 rounded-lg w-full max-w-3xl mx-auto mb-4">
                    No hay formaciones académicas registrados
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl shadow-lg">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                                <th className="py-4 px-6 text-center font-semibold text-md tracking-wider rounded-tl-xl w-12">#</th>
                                <th className="py-4 px-6 text-center font-semibold text-md tracking-wider">Título Obtenido</th>
                                <th className="py-4 px-6 text-center font-semibold text-md tracking-wider">Institución</th>
                                <th className="py-4 px-6 text-center font-semibold text-md tracking-wider">Carrera</th>
                                <th className="py-4 px-6 text-center font-semibold text-md tracking-wider">Fecha Inicio</th>
                                <th className="py-4 px-6 text-center font-semibold text-md tracking-wider">Fecha Fin</th>
                                <th className="py-4 px-6 text-center font-semibold text-md tracking-wider">Fecha de Obtención de Título</th>
                                <th className="py-4 px-6 text-center font-semibold text-md tracking-wider">PDF</th>
                                <th className="py-4 px-6 text-center font-semibold text-md tracking-wider rounded-tr-xl w-32"> Acciones </th>
                            </tr>
                        </thead>
                        <tbody>
                            {academicTrainings.map((per, index) => {
                                const isEditing = editingId === per.cod_academic_training;
                                return (
                                <tr
                                    key={per.cod_academic_training} 
                                    className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100`}
                                >
                                    <td className="py-4 px-6 text-center">{index + 1}</td>
                                    {fieldsAcademicTraining
                                    .map((f) => { 
                                    const fieldEdit = editFieldsAcademicTraining.find((ef) => ef.name === f.name);
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
                                            f.name === "academic_training_title_item_code" ? 
                                            titlesTypes.find(t => t.value === per.academic_training_title_item_code)?.label || per.academic_training_title_item_code 
                                            : per[f.name]
                                        )}
                                        </td>
                                    );
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
                                                onClick={() => handleEditClick(per)}
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
    )
}
export default TableAcademicTrainning;