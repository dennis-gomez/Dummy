import FormAssociationProject from "../organisms/formAssociationProject"
import { Box } from "@mui/material";
import TableAssociationProject from "../organisms/tableAssociationProject";
import { useAssociationProject } from "../../utils/useAssociationProject";

const AssociationProjectPage = ({ perfilCod, getProfiles }) => {
    console.log("Rendering AssociationProjectPage with perfilCod:", perfilCod);
    const {
        associations,
        rolesTypes,
        projects,

        fieldsAssociation,
        editFieldsAssociation,
        errorAssociations,
        setErrorAssociations,

        showFormAssociations,
        setShowFormAssociations,

        isLoadingAssociation,

        handleSubmitAssociation,
        handleEditAssociation,
    } = useAssociationProject(perfilCod);

    const handleAdd = async (formData) => {
        const profile = await handleSubmitAssociation(formData);
        await getProfiles(perfilCod);
    }

    const handleEdit = async (formData) => {
        await handleEditAssociation(formData);
        await getProfiles(perfilCod);
    }

    return (
        <div style={{ padding: 24 }}>
            {showFormAssociations && (
                <Box
                    sx={{
                        maxWidth: 900,
                        margin: "20px auto",
                        p: 3,
                        boxShadow: 3,
                        borderRadius: 2,
                        backgroundColor: "#d9d9d9",
                        textAlign: "center",
                    }}
                >
                    <FormAssociationProject
                        onSubmit={handleAdd}
                        projects={projects}
                        associations={associations}
                        rolesTypes={rolesTypes}
                    />
                </Box>
            )}

            <TableAssociationProject
                associations={associations}
                rolesTypes={rolesTypes}

                fieldsAssociation={fieldsAssociation}
                editFieldsAssociation={editFieldsAssociation}

                showFormAssociations={showFormAssociations}

                isLoadingAssociation={isLoadingAssociation}
                handleEditAssociation={handleEdit}

                onToggleForm={() => {
                    setShowFormAssociations(!showFormAssociations);
                    setErrorAssociations(null);
                }}
            />
        </div>
    );
}

export default AssociationProjectPage;