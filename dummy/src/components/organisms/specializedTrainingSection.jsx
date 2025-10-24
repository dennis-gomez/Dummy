import Button from "../atoms/button";
import { Box } from "@mui/material";
import React from "react";
import Form from "../organisms/form";
import SpecializedTrainingTable from "./specializedTrainingTable";

const SpecializedTrainingSection = ({
  profileCod,
  specializedTrainingData,
  isCreatingSpecializedTraining,
  setIsCreatingSpecializedTraining,
  specializedTrainingFields,
  handleAddSpecializedTraining,
}) => {
  console.log(
    "Rendering SpecializedTrainingSection for profileCod:",
    profileCod
  );

  return (
    <div style={{ padding: 24 }}>
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Gestión de Libros Legales
      </h1>

      {isCreatingSpecializedTraining && (
        <Box
          sx={{
            maxWidth: 1150,
            margin: "20px auto",
            p: 3,
            boxShadow: 3,
            borderRadius: 2,
            backgroundColor: "#d9d9d9",
          }}
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            Agregar Formación
          </h3>

          <Form
            fields={specializedTrainingFields}
            formTitle="Agregar Formación"
            onSubmit={handleAddSpecializedTraining}
            titleBtn="Guardar Formación"
            maxWidth={1200}
          />
        </Box>
      )}
      {/*
        <DynamicTable
          fields={fields}
          tableName="Libros Legales"
          singularName="Libro Legal"
          data={booksList}
          onEdit={handleEditBook}
          onDelete={handleDeleteBook}
          searchFields={searchFields}
          handleSearch={handleSearchBooks}
          isLoading={loading}
          typesOfBooks={typesOfBooks}
          STATUS_OPTIONS={STATUS_OPTIONS}
          isCreatingBook={isCreatingBook}
          setIsCreatingBook={setIsCreatingBook}
          openPDF={openPDF}
          onStartEdit={() => {
            if (isCreatingBook) setIsCreatingBook(false); // cierra creación al editar
          }}
          editingIdProp={editingId}
          setEditingIdProp={setEditingId} // levantar edición al padre
        />
      */}
    </div>
  );
};

export default SpecializedTrainingSection;
