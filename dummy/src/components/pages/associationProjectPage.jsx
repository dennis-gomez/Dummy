import FormAssociationProject from "../organisms/formAssociationProject"
import { Box } from "@mui/material";
import TableAssociationProject from "../organisms/tableAssociationProject";
import { useAssociationProject } from "../../utils/useAssociationProject";

const AssociationProjectPage = (
    perfilCod
) => {
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
                        onSubmit={handleSubmitAssociation}
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
                handleEditAssociation={handleEditAssociation}
                
                onToggleForm={() => {
                    setShowFormAssociations(!showFormAssociations);
                    setErrorAssociations(null);
                }}
            />
        </div>
    );
}

export default AssociationProjectPage;