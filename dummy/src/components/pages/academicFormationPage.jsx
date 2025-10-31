import { useAcademicTraining } from "../../utils/useAcademicTraining";
import TableAcademicTrainning from "../organisms/tableAcademicTraining";
import Form from "../organisms/form"
import { Box } from "@mui/material";

const AcademicFormationPage = (
    personCod
) => {

    const {
        academicTrainings, 
        titlesTypes,

        fieldsAcademicTraining, 
        editFieldsAcademicTraining, 
        errorAcademicTraining,
        setErrorAcademicTraining,

        showFormAcademicTraining, 
        setShowFormAcademicTraining,

        isLoadingAcademicTraining, 

        handleSubmitAcademicTraining, 
        handleEditAcademicTraining, 

        openPDF, 
    } = useAcademicTraining(personCod);

    return(
        <div style={{ padding: 24 }}>
            {showFormAcademicTraining && (
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
                    <Form
                        fields={fieldsAcademicTraining}
                        onSubmit={handleSubmitAcademicTraining}
                        titleBtn={"Guardar Formación"}
                    />
                </Box>
            )}
            <TableAcademicTrainning 
                academicTrainings={academicTrainings}
                titlesTypes={titlesTypes}
                editFields={editFieldsAcademicTraining}
                fields={fieldsAcademicTraining}
                isLoading={isLoadingAcademicTraining}
                showForm={showFormAcademicTraining}
                handleEdit={handleEditAcademicTraining}
                onToggleForm={() => {
                    setShowFormAcademicTraining(!showFormAcademicTraining);
                    setErrorAcademicTraining(null);
                }}
                openPDF={openPDF}
            />
        </div>
    );
    
}

export default AcademicFormationPage;