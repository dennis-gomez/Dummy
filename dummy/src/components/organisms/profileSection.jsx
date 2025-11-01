import { React, useState } from "react";
import Button from "../atoms/button";
import InputValidated from "../atoms/inputValidated";
import { Box } from "@mui/material";
import { ValidateValues } from "../../utils/validateValues";
import SpecializedTrainingSection from "./specializedTrainingSection";
import ModalElimination from "../molecules/modalElimination";
import Form from "../organisms/form";
import AssociationProjectPage from "../pages/associationProjectPage"

const profileSection = ({
  profiles,
  fields,
  seeOptions,
  handleProfileSelect,
  isAddingProfile,
  setIsAddingProfile,
  optionsRoles,
  handleSaveProfile,
  handleDeleteProfile,
  seeSpecializedTraining,
  seeProjectExperience,
  setSeeSpecializedTraining,
  setSeeProjectExperience,
  selectedProfile,
  personCod,
  getProfiles,

  //props de specialized training
  specializedTrainingData,
  isCreatingSpecializedTraining,
  setIsCreatingSpecializedTraining,
  specializedTrainingFields,
  handleAddSpecializedTraining,
  loading,
  setEditingId,
  editingId,
  openPDF,
  handleEdit,
  handleSearch,
  pageChange,
  currentPage,
  totalPages,
  specializedTrainingSearchFields,
}) => {

  const add = async (data) => {
    await handleSaveProfile(data, personCod);
    setIsAddingProfile(false);
  }

  const [role, setRole] = useState("");

  const getRoleLabel = (prof) => {
    const role = optionsRoles.find(
      (opt) => opt.cod_item === prof.profile_role_cod_item
    );

    return role ? `${role.item_name}` : "Rol desconocido";
  };

  const saveRollName = (prof) => {
    const role = getRoleLabel(prof);
    setRole(role);
    handleProfileSelect(prof, !seeOptions);
    return;
  };

  return (
    <div style={{ padding: 24 }}>
      {isAddingProfile && (
        <Box
          sx={{
            maxWidth: 300,
            margin: "20px auto",
            p: 3,
            boxShadow: 3,
            borderRadius: 2,
            backgroundColor: "#d9d9d9",
          }}
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            Agregar Nuevo Perfil
          </h3>

          {fields[0].options.length === 0 ? (
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              No hay roles disponibles para asignar.
            </h3>
          ) : (
            <Form
              titleBtn="Agregar"
              fields={fields}
              validateValues={ValidateValues.profile}
              onClose={() => setIsAddingProfile(false)}
              onSubmit={add}
            />
          )}
        </Box>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "center", // centra todo el bloque
          alignItems: "center",
          gap: "12px", // espacio entre el texto y el botón
          marginBottom: "16px",
          marginLeft: "140px",
        }}
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-0">Perfiles</h1>
        <Button
          text={isAddingProfile ? "Cancelar" : "Agregar"}
          onClick={() => setIsAddingProfile(!isAddingProfile)}
          sx={{ marginLeft: "50px" }}
          type={"button"}
        />
      </div>

      {profiles.length === 0 ? (
        <div className="flex justify-center items-center h-32">
          <h1 className="text-2xl font-bold text-gray-800 mb-0">
            No hay perfiles disponibles.
          </h1>
        </div>
      ) : (
        profiles.map((prof) => (
          <div key={prof.profile_cod} className="mb-4 flex justify-center">
            <Button
              key={prof.profile_cod}
              text={
                getRoleLabel(prof) +
                " (Experiencia: " +
                (
                  (prof.profile_years_of_experience > 0 || prof.profile_months_of_experience > 0)
                    ? (
                      (prof.profile_years_of_experience > 0
                        ? prof.profile_years_of_experience +
                        " " +
                        (prof.profile_years_of_experience === 1 ? "año" : "años")
                        : ""
                      ) +
                      (prof.profile_months_of_experience > 0
                        ? (prof.profile_years_of_experience > 0 ? " y " : "") +
                        prof.profile_months_of_experience +
                        " " +
                        (prof.profile_months_of_experience === 1 ? "mes" : "meses")
                        : "")
                    )
                    : "Sin experiencia"
                ) +
                ")"
              }

              sx={{ minWidth: 450 }}
              onClick={() => saveRollName(prof)}
            />
            <ModalElimination
              message={`¿Estás seguro de que deseas eliminar el perfil: ${getRoleLabel(
                prof
              )}?`}
              onClick={() => handleDeleteProfile(prof.profile_cod, personCod)}
            />
          </div>
        ))
      )}

      {seeOptions && (
        <div className="mb-4 flex flex-col items-center gap-5 mr-9">
          <h3 className="text-2xl font-bold text-gray-800 mb-0">
            Perfil seleccionado "{role}"
          </h3>

          <Button
            text={"Formación Especializada"}
            onClick={() => setSeeSpecializedTraining(!seeSpecializedTraining)}
            sx={{ minWidth: 450 }}
          />
          {seeSpecializedTraining && (
            <Box
              sx={{
                width: "100%", // ocupa todo el ancho disponible
                maxWidth: 1500, // opcional: límite superior
                margin: "3px auto", // centrado horizontal
                borderRadius: 2,
              }}
            >
              <SpecializedTrainingSection
                profileCod={selectedProfile.profile_cod}
                specializedTrainingData={specializedTrainingData}
                isCreatingSpecializedTraining={isCreatingSpecializedTraining}
                setIsCreatingSpecializedTraining={setIsCreatingSpecializedTraining}
                specializedTrainingFields={specializedTrainingFields}
                handleAddSpecializedTraining={handleAddSpecializedTraining}
                loading={loading}
                editingId={editingId}
                setEditingId={setEditingId}
                openPDF={openPDF}
                handleEdit={handleEdit}
                handleSearch={handleSearch}
                pageChange={pageChange}
                currentPage={currentPage}
                totalPages={totalPages}
                searchFields={specializedTrainingSearchFields}
              />
            </Box>
          )}

          <Button
            text={"Experiencia en Proyectos"}
            onClick={() => setSeeProjectExperience(!seeProjectExperience)}
            sx={{ minWidth: 450 }}
          />

          {seeProjectExperience && (
            <div className="w-full">
              <AssociationProjectPage perfilCod={selectedProfile.profile_cod}
                getProfiles={getProfiles}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default profileSection;
