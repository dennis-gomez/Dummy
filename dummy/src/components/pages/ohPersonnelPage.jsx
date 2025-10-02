import { Box, Typography } from "@mui/material";
import Form from "../organisms/form";
import OHPersonnelTable from "../organisms/ohPersonnelTable";
import { useOH_Personnel } from "../../utils/useOhPersonnel";

const OHPersonnelPage = () => {
  const {
    fields,
    personnel,
    searchText,
    searchFeature,
    setSearchText,
    setSearchFeature,
    showForm,
    setShowForm,
    error,
    setError,
    loading,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSearchPersonnel,
  } = useOH_Personnel();

  return (
    <div style={{ padding: 24 }}>
      <h1 className="text-2xl font-bold text-gray-800 text-center flex-1">
        Gestión del Personal de Brigadas
      </h1>

      {/* Formulario */}
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
            Agregar Personal
          </h3>
          <Form 
          fields={fields} 
          onSubmit={handleAdd} 
          values={personnel.map(p => ({ value: p.oh_personnel_UID, id: p.cod_personnel }))}
          titleBtn={"Guardar Personal"} />
        </Box>
      )}

      {/* Mensajes de error */}
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

      {/* Tabla */}
      <OHPersonnelTable
        fields={fields}
        personnel={personnel}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onSearch={handleSearchPersonnel}
        isLoading={loading}
        valueText={searchText}
        valueFeature={searchFeature}
        onChangeText={setSearchText}
        onChangeFeature={setSearchFeature}
        showForm={showForm}
        setShowForm={setShowForm}
        setError={setError}
      />
    </div>
  );
};

export default OHPersonnelPage;
