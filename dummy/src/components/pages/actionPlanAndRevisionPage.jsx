import { Box, Typography } from "@mui/material";
import Button from "../atoms/button";
import RevisionActionTable from "../organisms/revisionAndPlanTable";
import Form from "../organisms/form"; // formulario para agregar revisión
import { usePMRevisionAndPlan } from "../../utils/usePMRevisionAndPlan";

const RevisionActionPage = () => {
  const {
        revisions,
        actionPlans,
        error,
        showForm,
        setShowForm,
        fields,
        fieldsRevision,
        fieldsActionPlan,
        handleAdd,
        handleEditRevision,
        handleDeleteRevision,
        handleEditActionPlan,
        handleDeleteActionPlan,
        fetchAreaItems,
        searchText,
        searchFeature,
        setSearchText,
        setSearchFeature,
        setError,
        loading,
        handleSearchRevisionsAndPlans,

        revisionAreaCategories,
        revisionAreaItem,
        revisionTasksItem,
        revisionStatusOptions
  } = usePMRevisionAndPlan();


  const combinedData = revisions.map(rev => ({
  ...rev,
  accion_plan: actionPlans.filter(ap => ap.action_plan_cod_revision === rev.cod_revision)
}));

  return (
    <div style={{ padding: 24 }}>
      <h1 className="text-2xl font-bold text-gray-800 text-center flex-1">
        Gestión de Revisiones y Planes de Acción
      </h1>

      {/* Formulario para agregar revisión + plan de acción */}
      {showForm && (
        <Box
          sx={{
            maxWidth: 900,
            margin: "20px auto",
            p: 3,
            boxShadow: 3,
            borderRadius: 2,
            backgroundColor: "#d9d9d9",
          }}
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            Agregar Revisión
          </h3>
          <Form
            fields={fields}
            onSubmit={handleAdd}
            titleBtn="Guardar Revisión"
          />
        </Box>
      )}

      {/* Mensaje de error */}
      {error && (
        <Box
          sx={{
            p: 2,
            mt: 3,
            maxWidth: 800,
            margin: "0 auto",
            borderRadius: 2,
            backgroundColor: "#fdecea",
            border: "1px solid #f5c2c7",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <span style={{ color: "#b71c1c", fontWeight: "bold" }}>Error: </span>
          <Typography sx={{ color: "#b71c1c" }}>{error}.</Typography>
        </Box>
      )}

      

      {/* Tabla de revisiones con planes de acción */}
      <RevisionActionTable
        data={combinedData}
        subData={actionPlans}
        fields={fields}
        fieldsRevision={fieldsRevision}
        fieldsActionPlan={fieldsActionPlan}
        singularName="Revisión"
        tableName="Revisiones"
        isLoading={loading}
        onEditRevision={handleEditRevision}
        onDeleteRevision={handleDeleteRevision}
        onEditActionPlan={handleEditActionPlan}
        onDeleteActionPlan={handleDeleteActionPlan}
        handleSearch={handleSearchRevisionsAndPlans}
        searchFields={fields}
        valueText={searchText}
        valueFeature={searchFeature}
        onChangeText={setSearchText}
        onChangeFeature={setSearchFeature}
        showForm={showForm}
        setShowForm={setShowForm}

        revisionAreaCategories={revisionAreaCategories}
        revisionAreaItem={revisionAreaItem}
        revisionTasksItem ={revisionTasksItem}
        revisionStatusOptions={revisionStatusOptions}
        fetchAreaItems={fetchAreaItems}
        setError={setError}
      />
    </div>
  );
};

export default RevisionActionPage;
