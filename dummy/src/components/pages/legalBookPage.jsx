import React from 'react';
import DynamicTable from '../organisms/dinamicTable';
import { useBooks } from '../../utils/useLegalBook';
import Form from '../organisms/form';
import { Box, Typography } from "@mui/material";

function LegalBookPage() {
    const {
        booksList,
        fields,
        searchFields,
        loading,
        handleAddBook,
        handleEditBook,
        handleDeleteBook,
        handleSearchBooks,
        fetchBooks, // agregamos la función fetch si quieres llamarla explícitamente
        typesOfBooks,
    fetchTypesOfBooks,
    isCreatingBook,
    setIsCreatingBook,
    STATUS_OPTIONS,
    openPDF,
    
    } = useBooks();

  
    React.useEffect(() => {


    }, []);

    return (
        <div style={{ padding: 24 }}>
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Gestión de Libros Legales
            </h1>

          {isCreatingBook && (
  <Box
    sx={{
      maxWidth: 900,
      margin: "20px auto",
      p: 3,
      boxShadow: 3,
      borderRadius: 2,
      backgroundColor: "#d9d9d9",
    }}
  >
<h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
  Agregar Nuevo Libro Legal
</h3>

    <Form
  fields={fields.slice(1)} 
  formTitle="Agregar Nuevo Libro Legal"
  onSubmit={handleAddBook}
  titleBtn="Guardar Libro Legal"
/>
  </Box>
)}

            <DynamicTable
    fields={fields}
    tableName="Libros Legales"
    singularName="Libro Legal"
    data={booksList}
    onAdd={handleAddBook}
    onEdit={handleEditBook}
    onDelete={handleDeleteBook}
    searchFields={searchFields}
    handleSearch={handleSearchBooks}  // <-- solo esto
    isLoading={loading}
    textLoading="Cargando libros legales..."
    typesOfBooks={typesOfBooks}
    STATUS_OPTIONS={STATUS_OPTIONS}
    isCreatingBook={isCreatingBook}
    setIsCreatingBook={setIsCreatingBook}
    openPDF={openPDF}
/>
        </div>
    );
}

export default LegalBookPage;
