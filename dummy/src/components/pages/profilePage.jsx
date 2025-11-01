import { React, useEffect } from "react";
import { useProfile } from "../../utils/useProfile";
import ProfileSection from "../organisms/profileSection";

const ProfilePage = ({ personCod }) => {
  const {
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
    profiles,
    getProfileByProfileCode,

    //para specialized training
    specializedTrainingData,
    isCreatingSpecializedTraining,
    setIsCreatingSpecializedTraining,
    specializedTrainingFields,
    handleAddSpecializedTraining,
    refreshProfile,
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
  } = useProfile(); // <-- desestructurar aquí

  useEffect(() => {
    // Llamar a refreshProfile cuando personCod cambie
    if (personCod) {
      refreshProfile(personCod);
    }
  }, [personCod]);

  return (
    <div>
      <ProfileSection
        personCod={personCod}
        profiles={profiles}
        fields={fields}
        seeOptions={seeOptions}
        handleProfileSelect={handleProfileSelect}
        isAddingProfile={isAddingProfile}
        setIsAddingProfile={setIsAddingProfile}
        optionsRoles={optionsRoles}
        handleSaveProfile={handleSaveProfile}
        handleDeleteProfile={handleDeleteProfile}
        seeSpecializedTraining={seeSpecializedTraining}
        seeProjectExperience={seeProjectExperience}
        setSeeSpecializedTraining={setSeeSpecializedTraining}
        setSeeProjectExperience={setSeeProjectExperience}
        selectedProfile={selectedProfile}
        getProfiles={getProfileByProfileCode}


        //props de specialized training
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
        specializedTrainingSearchFields={specializedTrainingSearchFields}

      //props de experiencia de proyectos se agregan aquí
      />
    </div>
  );
};

export default ProfilePage;
