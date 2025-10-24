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

    //para specialized training
    specializedTrainingData,
    isCreatingSpecializedTraining,
    setIsCreatingSpecializedTraining,
    specializedTrainingFields,
    handleAddSpecializedTraining,
    refreshProfile,
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

        //props de specialized training
        specializedTrainingData={specializedTrainingData}
        isCreatingSpecializedTraining={isCreatingSpecializedTraining}
        setIsCreatingSpecializedTraining={setIsCreatingSpecializedTraining}
        specializedTrainingFields={specializedTrainingFields}
        handleAddSpecializedTraining={handleAddSpecializedTraining}
      />
    </div>
  );
};

export default ProfilePage;
