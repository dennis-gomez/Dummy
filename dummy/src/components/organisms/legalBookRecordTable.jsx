import Seeker from "../molecules/seeker";
import ModalElimination from "../molecules/modalElimination";
import { CircularProgress } from "@mui/material";
import Button from "../atoms/button";
import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

const LegalBookRecordTable = ({ 
    legalBookRecords, 
    fields, 
    isLoading, 
    onDelete, 
    onEdit, 
    onSearch, 
    valueText, 
    valueFeature, 
    onChangeText, 
    onChangeFeature, 
    onToggleForm, 
    showForm 
}) => {

    const [editingId, setEditingId] = useState(null); 
    const [editData, setEditData] = useState({});

    //habilitar edicion
    const handleEditClick = (legalBookRecord) => {
        setEditingId(legalBookRecord.cod_registration_application);
        setEditData({ ...legalBookRecord });
    };

    //guardar edicion
    const handleSaveEdit = async () => {
        const isSaved = await onEdit(editData);
        if (isSaved) {
            setEditingId(null);
            setEditData({});
        }
    };

    //cancelar edicion
    const handleCancelEdit = () => {
        setEditingId(null);
        setEditData({});
    };

    return (
        <>
            {isLoading ? (
                <div 
                  className="flex flex-wrap items-center gap-3 bg-white shadow-md rounded-2xl px-4 py-3 w-full max-w-3xl mx-auto"
                >
                    <p className="text-gray-700 font-medium mb-2">Cargando registros...</p>
                    <CircularProgress />
                </div>
            ) : (
              <>
                <Seeker
                  inputName={'search'}
                  inputPlaceholder={'Buscar por caracter\u00EDstica'}
                  btnName={'Buscar'}
                  selectName={'Filtrar por'}
                  fields={fields}
                  onClick={onSearch}
                  valueText={valueText}
                  valueFeature={valueFeature}
                  onChangeText={onChangeText}
                  onChangeFeature={onChangeFeature}
                />

                <div>
                  <Button 
                    text={showForm ? "Cancelar" : "Agregar Registro"} 
                    onClick={onToggleForm} 
                  />
                </div>
              </>
            )}
            {/*legalBookRecords.length === 0  < --- esto despues de pone Diego jeje*/}
            { false ? (
                <div className="text-center py-8 text-gray-500 italic bg-gray-50 rounded-lg">
                    No hay registros disponibles.
                </div>
            ) : (
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Solicitado</th>
                                <th>Entregado</th>
                                <th>Regresado</th>
                                <th>Fecha de registro</th>
                                <th>Fecha de retorno</th>
                                <th>Observaciones</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>Persona #1</td>
                                <td>Persona #2</td>
                                <td>Persona #3</td>
                                <td>26/09/2025</td>
                                <td>30/09/2025</td>
                                <td>Esta prestado</td>
                                <td>
                                    <button
                                    onClick={() => onEdit(null)}
                                    aria-label="Editar registro"
                                    >
                                    <EditIcon />
                                    </button>
                                    <ModalElimination
                                    message={'Eliminar registro'}
                                    onClick={() => onDelete(1)}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>1</td>
                                <td>Persona #1</td>
                                <td>Persona #2</td>
                                <td>Persona #3</td>
                                <td>26/09/2025</td>
                                <td>30/09/2025</td>
                                <td>
                                    <button
                                    onClick={() => onEdit(null)}
                                    aria-label="Editar registro"
                                    >
                                    <EditIcon />
                                    </button>
                                    <ModalElimination
                                    message={'Eliminar registro'}
                                    onClick={() => onDelete(1)}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </>        
    );
}


export default LegalBookRecordTable;