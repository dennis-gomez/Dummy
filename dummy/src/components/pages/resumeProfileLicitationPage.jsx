import React, { useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useResumeTableLicitation } from "../../utils/useResumeTableLicitation";
import ResumeTableLicitationTable from "../organisms/tableResumeProfileLicitation";

const ResumeTableLicitationPage = () => {
  const {
    personal,
    profiles,
    loading,
    page,
    totalPages,
    personFields,

        selectedPerson,
        selectedProfile,
        setSelectedPerson,
        setSelectedProfile,

  } = useResumeTableLicitation();

  // Estado para expandir filas (mostrar perfiles, por ejemplo)
  const [expandedRows, setExpandedRows] = useState({});
  const [profilesByPerson, setProfilesByPerson] = useState({});

  // 🔽 Manejo de expandir/cerrar fila
  const handleExpand = (personCod) => {
    setExpandedRows((prev) => ({
      ...prev,
      [personCod]: !prev[personCod],
    }));
  };

  // 🧠 Selección de perfil en combobox dentro de fila expandida
  const handleProfileSelect = (personCod, profileCod) => {
    setProfilesByPerson((prev) => ({
      ...prev,
      [personCod]: profileCod,
    }));
  };

console.log(`info de personas: ${JSON.stringify(personal, null, 2)}`);


  return (
    <Box sx={{ p: 4 }}>
      <Typography
        variant="h5"
        sx={{ fontWeight: "bold", textAlign: "center", mb: 3 }}
      >
        Resumen de Perfiles por Persona
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <ResumeTableLicitationTable
          fields={personFields}
          data={personal}
          isLoading={loading}
          profiles={profiles}
          expandedRows={expandedRows}
          onExpand={handleExpand}
          onProfileSelect={handleProfileSelect}

          selectedProfile={selectedProfile}
          selectedPerson={selectedPerson}
          setSelectedPerson={setSelectedPerson}
          setSelectedProfile={setSelectedProfile}

        />
      )}

      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Typography variant="body2">
          Página {page} de {totalPages}
        </Typography>
      </Box>
    </Box>
  );
};

export default ResumeTableLicitationPage;
