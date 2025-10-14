import React from "react";
import { useState } from "react";
import { Box } from "@mui/material";
import FormInventory from "../../components/organisms/formInventory";
import OrderAndDetailsTable from "../organisms/orderAndDetailsTable";



import { useOrder } from "../../utils/useOrder";

const orderPage = () => {

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
    useFullFields,
fetchAvaliableProductsInOrder,
    order,
    orderDetails,
    suppliers,

    orderFields,
    orderStatus,
    setAddDetailToOrder,
    creatingDetail,
    closeCreatingDetail,
    addDetailToOrder,
    HandleAddOrderDetail

  } = useOrder();


  return (
    <>
      <div style={{ padding: 24 }}>
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Gestión de Ordenes de Compra
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
              Agregar a la orden
            </h3>

            <FormInventory
              fields={fields}
              formTitle="Agregar productos al inventario"
              onSubmit={addDetailToOrder? HandleAddOrderDetail:handleAddInventory}
              titleBtn="agregar al inventario"
              headers={offices}
              checks={avaliableProductsChecks}
              fetchAvaliableProducts={addDetailToOrder? fetchAvaliableProductsInOrder:fetchAvaliableProducts}
              setIsCreating={creatingDetail}
              useFullFields={addDetailToOrder? []: useFullFields}
              warinig="No hay productos disponibles para agregar a la orden."
              tittle="Agregar productos a la orden"
              addDetailToOrder={addDetailToOrder}
              
              
            />

          </Box>
        )}
        <OrderAndDetailsTable
          singularName="Ordenes de Compras"
          searchFields={[{ name: "product_name", placeholder: "Nombre" }, { name: "product_category", placeholder: "Categoría" }, { name: "product_code", placeholder: "Código" }]}
          isCreatingInventory={isCreatingInventory}
          setIsCreatingInventory={setIsCreatingInventory}
          orderFields={orderFields}
          titleBtn="Agregar Orden"
          isLoading={loading}
          data={order}
          subData={orderDetails}
          orderStatus={orderStatus}
          suppliers={suppliers}
          headers={offices}
          onEdit={handleEdit}
          setAddDetailToOrder={creatingDetail}
          deleteGuaranteOrReactivated={deleteGuaranteOrReactivated}
        />
      </div>
    </>
  );
}
export default orderPage;