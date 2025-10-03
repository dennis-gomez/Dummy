import React from "react";
import { useGuarantees } from "../../utils/useGuarantees";
import GuaranteesTable from "../organisms/guaranteeTable";
import Form from "../organisms/form";
import { Box } from "@mui/material";

const GuaranteePage = () => {
  const {
    guaranteesList,
    fields,
    STATUS_OPTIONS,
    CURRENCY_OPTIONS,
    CATEGORY_OPTIONS,
    loading,
    handleEditGuarantee,
    handleDeleteGuarantee,
    handleSearchGuarantees,
    searchFields,
    handleAddGuarantee,
    isCreatingGuarantee,
    setIsCreatingGuarantee,
  } = useGuarantees();

  return (
       <div style={{ padding: 24 }}>
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Gestión de Garantías
      </h1>

  {isCreatingGuarantee && (
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
            Agregar Nueva Garantía
          </h3>

          <Form
  fields={fields.filter(f => f.name !== "cod_guarantee" && f.name !== "guarantee_status")}
  formTitle="Agregar Nueva Garantía"
  onSubmit={handleAddGuarantee}
  titleBtn="Guardar Garantía"
/>

        </Box>
      )}

      <GuaranteesTable
        data={guaranteesList}
        fields={fields}
        STATUS_OPTIONS={STATUS_OPTIONS}
        CURRENCY_OPTIONS={CURRENCY_OPTIONS}
        CATEGORY_OPTIONS={CATEGORY_OPTIONS}
        singularName="Garantía"
        isLoading={loading}
        onEdit={handleEditGuarantee}
        onDelete={handleDeleteGuarantee}
        handleSearch={handleSearchGuarantees}
        searchFields={searchFields}
        isCreatingGuarantee={isCreatingGuarantee}
        setIsCreatingGuarantee={setIsCreatingGuarantee}
      />
    </div>
  );
};

export default GuaranteePage;