import { useState } from "react";
import { CircularProgress, FormControl, InputLabel, Select, MenuItem, TextField, Box } from "@mui/material";
import Button from "../atoms/button";
import ModalElimination from "../molecules/modalElimination";

const LegalBookRecordTable = ({ 
    books, 
    legalBookRecords, 
    isLoading, 
    onDelete, 
    onEdit, 
    fields,
    onSearch, 
    onResetSearch,
    searchText, 
    setSearchText,
    selectedBook, 
    setSelectedBook,
    searchField, 
    setSearchField,
    onToggleForm, 
    showForm,
}) => {
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});

    // Función para obtener el nombre del libro basado en el código
    const getBookName = (bookCode) => {
        const book = books.find(book => book.cod_book === bookCode);
        return book ? book.book_name : "Libro no encontrado";
    };

    const handleEditClick = (legalBookRecord) => {
        setEditingId(legalBookRecord.cod_registration_application);
        setEditData({ ...legalBookRecord });
    };

    const handleSaveEdit = async () => {
        const isSaved = await onEdit(editData);
        if (isSaved) {
            setEditingId(null);
            setEditData({});
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditData({});
    };

    return (
        <>
            {isLoading ? (
                <div className="flex flex-wrap items-center gap-3 bg-white shadow-md rounded-2xl px-4 py-3 w-full max-w-3xl mx-auto">
                    <p className="text-gray-700 font-medium mb-2">Cargando registros...</p>
                    <CircularProgress />
                </div>
            ) : (
                <>
                    {/* Contenedor de filtros */}
                    <Box className="flex flex-col gap-4 bg-white shadow-md rounded-2xl p-4 w-full max-w-4xl mx-auto mb-4">
                        <div className="flex flex-wrap gap-3 items-end">
                            
                            {/* Select de Libros */}
                            <FormControl className="min-w-[200px]">
                                <InputLabel>Filtrar por libro</InputLabel>
                                <Select
                                    value={selectedBook}
                                    onChange={(e) => setSelectedBook(e.target.value)}
                                    label="Filtrar por libro"
                                >
                                    <MenuItem value="">Todos los libros</MenuItem>
                                    {books.map((book) => (
                                        <MenuItem key={book.cod_book} value={book.cod_book}>
                                            {book.book_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {/* Select de Campos */}
                            <FormControl className="min-w-[200px]">
                                <InputLabel>Buscar por campo</InputLabel>
                                <Select
                                    value={searchField}
                                    onChange={(e) => setSearchField(e.target.value)}
                                    label="Buscar por campo"
                                >
                                    {fields.map((field) => (
                                        <MenuItem key={field.name} value={field.name}>
                                            {field.placeholder}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {/* Input de Búsqueda */}
                            <TextField
                                label="Texto a buscar"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                className="min-w-[250px]"
                                placeholder="Ingrese texto a buscar..."
                            />

                            {/* Botones de acción */}
                            <div className="flex gap-2">
                                <Button 
                                    text="Buscar" 
                                    onClick={onSearch}
                                    disabled={!searchText && !selectedBook}
                                />
                                <Button 
                                    text="Limpiar" 
                                    onClick={onResetSearch}
                                    variant="outlined"
                                />
                            </div>
                        </div>
                    </Box>

                    {/* Botón Agregar Registro */}
                    <div className="mb-4">
                        <Button 
                            text={showForm ? "Cancelar" : "Agregar Registro"} 
                            onClick={onToggleForm} 
                        />
                    </div>
                </>
            )}

            {/* Tabla de registros */}
            <div className="overflow-x-auto rounded-xl mt-4">
                <table className="min-w-full border">
                    <thead>
                        <tr className="bg-gray-200">
                            <th>#</th>
                            <th>Libro</th>
                            <th>Solicitado</th>
                            <th>Entregado</th>
                            <th>Regresado</th>
                            <th>Fecha registro</th>
                            <th>Fecha retorno</th>
                            <th>Observaciones</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {legalBookRecords.map((record, index) => (
                            <tr key={record.cod_registration_application} className="border-b hover:bg-gray-50">
                                <td className="p-2 text-center">{index + 1}</td>

                                {editingId === record.cod_registration_application ? (
                                    // Modo edición
                                    <>
                                        <td className="p-2">
                                            <FormControl fullWidth size="small">
                                                <Select
                                                    value={editData.cod_book_catalog || ""}
                                                    onChange={(e) =>
                                                        setEditData({ ...editData, cod_book_catalog: e.target.value })
                                                    }
                                                >
                                                    {books.map((book) => (
                                                        <MenuItem key={book.cod_book} value={book.cod_book}>
                                                            {book.book_name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </td>
                                        <td className="p-2">
                                            <input
                                                className="w-full p-1 border rounded"
                                                value={editData.lb_record_requested_by || ""}
                                                onChange={(e) =>
                                                    setEditData({ ...editData, lb_record_requested_by: e.target.value })
                                                }
                                            />
                                        </td>
                                        <td className="p-2">
                                            <input
                                                className="w-full p-1 border rounded"
                                                value={editData.lb_record_delivered_to || ""}
                                                onChange={(e) =>
                                                    setEditData({ ...editData, lb_record_delivered_to: e.target.value })
                                                }
                                            />
                                        </td>
                                        <td className="p-2">
                                            <input
                                                className="w-full p-1 border rounded"
                                                value={editData.lb_record_return_by || ""}
                                                onChange={(e) =>
                                                    setEditData({ ...editData, lb_record_return_by: e.target.value })
                                                }
                                            />
                                        </td>
                                        <td className="p-2">
                                            <input
                                                type="date"
                                                className="w-full p-1 border rounded"
                                                value={editData.lb_record_date || ""}
                                                onChange={(e) =>
                                                    setEditData({ ...editData, lb_record_date: e.target.value })
                                                }
                                            />
                                        </td>
                                        <td className="p-2">
                                            <input
                                                type="date"
                                                className="w-full p-1 border rounded"
                                                value={editData.lb_record_return_date || ""}
                                                onChange={(e) =>
                                                    setEditData({ ...editData, lb_record_return_date: e.target.value })
                                                }
                                            />
                                        </td>
                                        <td className="p-2">
                                            <textarea
                                                className="w-full p-1 border rounded"
                                                value={editData.lb_record_observation || ""}
                                                onChange={(e) =>
                                                    setEditData({ ...editData, lb_record_observation: e.target.value })
                                                }
                                                rows={2}
                                            />
                                        </td>
                                        <td className="p-2">
                                            <div className="flex gap-2">
                                                <button 
                                                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                                    onClick={handleSaveEdit}
                                                >
                                                    Guardar
                                                </button>
                                                <button 
                                                    className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                                                    onClick={handleCancelEdit}
                                                >
                                                    Cancelar
                                                </button>
                                            </div>
                                        </td>
                                    </>
                                ) : (
                                    // Modo visualización
                                    <>
                                        <td className="p-2 font-medium text-blue-600">
                                            {getBookName(record.cod_book_catalog)}
                                        </td>
                                        <td className="p-2">{record.lb_record_requested_by}</td>
                                        <td className="p-2">{record.lb_record_delivered_to}</td>
                                        <td className="p-2">{record.lb_record_return_by}</td>
                                        <td className="p-2">{record.lb_record_date}</td>
                                        <td className="p-2">{record.lb_record_return_date}</td>
                                        <td className="p-2 max-w-xs truncate" title={record.lb_record_observation}>
                                            {record.lb_record_observation}
                                        </td>
                                        
                                        <td className="p-2">
                                            <div className="flex gap-2">
                                                <button 
                                                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                                    onClick={() => handleEditClick(record)}
                                                >
                                                    Editar
                                                </button>
                                                <ModalElimination
                                                    message="¿Eliminar registro?"
                                                    onClick={() => onDelete(record.cod_registration_application)}
                                                />
                                            </div>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {/* Mensaje cuando no hay registros */}
                {legalBookRecords.length === 0 && !isLoading && (
                    <div className="text-center p-8 bg-gray-100 rounded-b">
                        <p className="text-gray-500">No se encontraron registros</p>
                    </div>
                )}
            </div>
        </>        
    );
};

export default LegalBookRecordTable;