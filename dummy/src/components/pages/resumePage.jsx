import React, { useEffect, useState } from "react";
import ResumeTable from "../organisms/resumeTable";
import { useGuarantees } from "../../utils/useGuarantees";
import { Box, CircularProgress } from "@mui/material";

function ResumePage() {
  const {
    guaranteesList,
    fields,
    loading,
    resumeData,
    resumeFields,
  } = useGuarantees();




  return (
    <div style={{ padding: 24 }}>
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Resumen de Garantías
      </h1>

      {loading ? (
        <Box className="flex flex-col items-center justify-center p-4">
          <CircularProgress />
          <span className="mt-2 text-gray-500">Cargando resumen...</span>
        </Box>
      ) : (
        <ResumeTable
          fields={resumeFields} // los campos que querés mostrar
          data={resumeData} // lista de garantías resumidas
          tableName="Garantías"
        />
      )}
    </div>
  );
}

export default ResumePage;
