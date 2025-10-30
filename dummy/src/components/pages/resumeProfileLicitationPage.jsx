import React, { useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useResumeTableLicitation } from "../../utils/useResumeTableLicitation";
import ResumeTableLicitationTable from "../organisms/tableResumeProfileLicitation";

const ResumeTableLicitationPage = () => {
  const {
    personal,
    profileSummaries,

    fetchProfileSummary,

    loading,
    page,
    totalPages,
    setPage,
    personFields,

    selectedPerson,
    selectedProfile,
    setSelectedPerson,
    setSelectedProfile,
    openPDF,

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
  const handleProfileSelect = async (personCod, profileCod) => {
    setSelectedProfile((prev) => ({ ...prev, [personCod]: profileCod }));
    await fetchProfileSummary(personCod, profileCod); // 🔹 aquí llamamos al SP
  };


  return (
    <ResumeTableLicitationTable
      fields={personFields}
      data={personal}
      isLoading={loading}
      profileSummaries={profileSummaries}
      expandedRows={expandedRows}
      onExpand={handleExpand}
      onProfileSelect={handleProfileSelect}

      selectedProfile={selectedProfile}
      selectedPerson={selectedPerson}
      setSelectedPerson={setSelectedPerson}
      setSelectedProfile={setSelectedProfile}

      fetchProfileSummary={fetchProfileSummary}

      page={page}
      totalPages={totalPages}
      onPageChange={(newPage) => setPage(newPage)}
      openPDF={openPDF}

    />
  );
};

export default ResumeTableLicitationPage;
