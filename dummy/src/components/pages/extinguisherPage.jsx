import { Box, Typography } from "@mui/material";
import Form from "../organisms/form";
import ExtinguisherTable from "../organisms/extinguisherTable";
import { useExtinguishers } from "../../utils/useExtinguishers";
import Button from "../atoms/button";

const ExtinguisherPage = () => {
  const {
    fields,
    extinguishers,
    agentItems,
    extinguisherTypes,
    extinguisherCapacityUnits,
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
    handleSearchExtinguishers,
  } = useExtinguishers();


  return (
    <div style={{ padding: 24 }}>
      <h1 className="text-2xl font-bold text-gray-800 text-center flex-1"> Gestión de Extintores </h1>

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
            Agregar Extintor
          </h3>
          <Form
            fields={fields}
            onSubmit={handleAdd}
            values={extinguishers.map(e => ({ value: e.extinguisher_serial_number, id: e.cod_extinguisher }))} // <-- pasamos los valores existentes
            titleBtn={"Guardar Extintor"}
          />
        </Box>
      )}
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
      <ExtinguisherTable
        fields={fields}
        extinguishers={extinguishers}
        agentItems={agentItems}
        extinguisherTypes={extinguisherTypes}
        extinguisherCapacityUnits={extinguisherCapacityUnits}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onSearch={handleSearchExtinguishers}
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
export default ExtinguisherPage;