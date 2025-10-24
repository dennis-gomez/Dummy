import React from "react";
import { useProfile } from "../../utils/useProfile";
import ProfileSection from "../organisms/profileSection";

const ProfilePage = () => {
  const {
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

    //para specialized training
    specializedTrainingData,
    isCreatingSpecializedTraining,
    setIsCreatingSpecializedTraining,
    specializedTrainingFields,
    handleAddSpecializedTraining,
  } = useProfile(); // <-- desestructurar aquí

  return (
    <div>
      <ProfileSection
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
