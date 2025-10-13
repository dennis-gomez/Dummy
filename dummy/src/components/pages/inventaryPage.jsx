import React from "react";
import InventaryTable from "../organisms/inventaryTable";
import { useState } from "react";
import { Box } from "@mui/material";
import FormInventory from "../../components/organisms/formInventory";

import {useInventory} from "../../utils/useInventory";

const invevtaryPage =() =>{

const {
    isCreatingInventory,
    setIsCreatingInventory,
    fields,
    handleAddInventory,
    loading,
    inventary,
    offices,
    deleteGuaranteOrReactivated,
    handleEdit,
    avaliableProductsChecks,
    fetchAvaliableProducts,
    handleFindProduct, 

    categoryToSelect
} = useInventory();

    return (
        <>
            <div style={{ padding: 24 }}>
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Gestión de Inventario
      </h1>

      {isCreatingInventory && (
        <Box
          sx={{
            maxWidth: 1200,
            margin: "20px auto",
            p: 3,
            boxShadow: 3,
            borderRadius: 2,
            backgroundColor: "#d9d9d9",
          }}
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            Agregar al inventario
          </h3>

          <FormInventory
  fields={fields}
  formTitle="Agregar productos al inventario"
  onSubmit={handleAddInventory}
  titleBtn="agregar al inventario"
  headers={offices}
  checks={avaliableProductsChecks}
  fetchAvaliableProducts={fetchAvaliableProducts}
  setIsCreating={setIsCreatingInventory}
  
/>

        </Box>
      )}
                <InventaryTable 
                singularName="Productos"
                
                searchFields={categoryToSelect}

                isCreatingInventory={isCreatingInventory}
                setIsCreatingInventory={setIsCreatingInventory}
                isLoading={loading}
                data={inventary}
                headers={offices}
                onEdit={handleEdit}
                deleteGuaranteOrReactivated={deleteGuaranteOrReactivated}
                onFind={handleFindProduct}
                />
            </div>
        </>
    );
}
export default invevtaryPage;