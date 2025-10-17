import { useTechnologyInventory } from "../../utils/useTechnologyIventory";
import { Box, Typography } from "@mui/material";
import Form from "../organisms/form";
import TecnologyInventoryTable from "../organisms/tableTechnologyInventory";

function TechnologyInventory() {
    const {
        inventory,

        fields, 
        showForm, 
        setShowForm,
        error,
        setError,  
        loading,

        searchText,
        searchFeature, 
        setSearchText,
        setSearchFeature,

        getLabelByCode,
        categoryAssets, 
        assets, 
        brands, 
        systemsOperative, 
        offices,

        handleSearch,
        handleSubmit,
        handleDelete,
    } = useTechnologyInventory();

    return (    
        <>
            <div style={{ padding: 24 }}>
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Inventario de Tecnología de la Información
            </h1>

            {/* Formulario dinámico */}
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
                    Agregar Activo
                </h3>
                <Form
                    fields={fields}
                    onSubmit={handleSubmit}
                    
                    titleBtn="Guardar Registro"
                    funct={null}
                    onCancel={null}
                    values={null}
                />
                </Box>
            )}
            

            {/* Errores manejados por el backend */}
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
                <Typography sx={{ color: "#b71c1c" }}>{error}</Typography>
                </Box>
            )}

            <TecnologyInventoryTable 
                inventory={inventory}
                fields={fields}
                loading={loading}
                showForm={showForm}
                onToggleForm={() => {
                    setShowForm(!showForm);
                    setError(null);
                }}

                getLabelByCode= {getLabelByCode}
                categoryAssets = {categoryAssets} 
                assets={assets} 
                brands= {brands}
                systemsOperative={systemsOperative}
                offices={offices}

                onSearch={handleSearch}
                valueText={searchText}
                valueFeature={searchFeature}
                onChangeText={setSearchText}
                onChangeFeature={setSearchFeature}

                onDelete={handleDelete}
            />
            </div>
        </>
    );
};
export default TechnologyInventory;