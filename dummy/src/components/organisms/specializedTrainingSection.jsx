import Button from "../atoms/button";
import { Box } from "@mui/material";
import React from "react";
import Form from "../organisms/form";
import SpecializedTrainingTable from "./specializedTrainingTable";

const SpecializedTrainingSection = ({
  profileCod,
  isCreatingSpecializedTraining,
  setIsCreatingSpecializedTraining,
  specializedTrainingFields,
  handleAddSpecializedTraining,
  specializedTrainingData,
  loading,
  editingId,
  setEditingId,
  openPDF,
  handleEdit,
  handleSearch,
  pageChange,
  currentPage,
  totalPages,
  searchFields,
}) => {


  return (
    <div style={{ padding: 24 }}>
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Gestión de Formación Especializada
      </h1>

      {isCreatingSpecializedTraining && (
        <Box
          sx={{
            maxWidth: 1550,
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
            fields={specializedTrainingFields.slice(1)}
            formTitle="Agregar Formación"
            onSubmit={handleAddSpecializedTraining}
            titleBtn="Guardar Formación"
            maxWidth={1500}
          />
        </Box>
      )}

      <SpecializedTrainingTable
        fields={specializedTrainingFields}
        tableName="Formaciones Especializadas"
        singularName="Formación Especializada"
        data={specializedTrainingData}
        onEdit={handleEdit}
        searchFields={searchFields}
        handleSearch={handleSearch}
        isLoading={loading}
        isCreatingSpecializedTraining={isCreatingSpecializedTraining}
        setisCreatingSpecializedTraining={setIsCreatingSpecializedTraining}
        openPDF={openPDF}
        onStartEdit={() => {
          if (isCreatingSpecializedTraining) setIsCreatingSpecializedTraining(false);
        }}
        editingIdProp={editingId}
        setEditingIdProp={setEditingId} // levantar edición al padre
        pageChange={pageChange}
        currentPage={currentPage}
        totalPages={totalPages}
      />

    </div>
  );
};

export default SpecializedTrainingSection;
