import { useState, useEffect } from "react";
import ModalAlert from "../components/molecules/modalAlert";
import { getItems } from "../services/itemService";
import {
  getCategoryInventory,
  getProductsThatAreInInventory, addProductsToInventory
} from "../services/inventoryService";
import { getAllSuppliers } from "../services/supplierService";
import { addOrder } from "../services/orderService";

import { getAllOrderDetails, updateOrderDetail, getAvaliableProductsInOrder } from "../services/orderDetailService";
import { getAllOrders, updateOrder } from "../services/orderService";

export const useOrder = () => {


  const [isCreatingInventory, setIsCreatingInventory] = useState(false);
  const [inventary, setInventary] = useState([]);
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoryInventory, setCategoryInventory] = useState([]);
  const [avaliableProductsChecks, setAvaliableProductsChecks] = useState([]);
  const [addDetailToOrder, setAddDetailToOrder] = useState(false);
  const [orderIdForDetails, setOrderIdForDetails] = useState(null);

  const creatingDetail= (value,id) =>{

    if(id){
      fetchAvaliableProductsInOrder(id);
      console.log("Creando inventario para la orden ID:", id);
    setIsCreatingInventory(value);
    setOrderIdForDetails(id);
    setAddDetailToOrder(value);
    }else{
      setIsCreatingInventory(value);
    console.log("Creando inventario sin orden asociada");
    fetchAvaliableProducts();
    setAddDetailToOrder(false);
    setOrderIdForDetails(null);
    }
  }

  const closeCreatingDetail = () =>{
    setIsCreatingInventory(false);
    setAddDetailToOrder(false);
    setOrderIdForDetails(null);
  }

  




  const [order, setOrder] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const [orderDetails, setOrderDetails] = useState([]);
  const [error, setError] = useState(null);


  // Opciones para el campo de estado de la orden


  const orderStatus = [
    { value: 1, label: "Pendiente" },
    { value: 2, label: "Recibida" },
    { value: 3, label: "Cancelada" },
    { value: 4, label: "Eliminada" }
  ];

  const orderFields = [
    { name: "order_date", placeholder: "Fecha de Orden", label: "Fecha", type: "date", editable: true, restriction: "cantAfterToday", grid: 4, width: 175 },
    { name: "order_status", placeholder: "Estado", label: "Estado", type: "select", editable: true, grid: 4, width: 175, options: orderStatus },
    { name: "order_supplier_code", placeholder: "Proveedor", label: "Proveedor", type: "select", editable: true, grid: 4, width: 225, options: suppliers },
    { name: "order_facture_number", placeholder: "Número de Factura", label: "Factura",  editable: true, grid: 4, width: 200 },
    { name: "order_total_amount", placeholder: "Monto Total", label: "Monto Total", type: "number", editable: false, grid: 4, width: 200 }
  ];


      const fetchOrders = async () => {
        setLoading(true);
        try {
            const data = await getAllOrders();
            setOrder(data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
        setLoading(false);
    };

    const fetchOrderDetails = async (page = 1, limit = 10) => {
        setLoading(true);
        try {
            const data = await getAllOrderDetails(page, limit);
            setOrderDetails(data);
        } catch (error) {
            console.error("Error fetching order details:", error);
        }
        setLoading(false);
    };


  const fetchAvaliableProducts = async (filter = "0", value = "") => {
    try {
      const data = await getProductsThatAreInInventory(filter, value);
      if (data.length === 0) {
        ModalAlert("Información", "No se encontraron productos disponibles para agregar al inventario.", "info");
      } else {
        setChecksOptions(data);
      }
    } catch (error) {
      console.error("Error fetching available products:", error);
    }
  };

  const fetchAvaliableProductsInOrder = async (orderId, filter = "0", value = "") => {
    try {
      if(orderId === -1 || orderId === null || !orderId){
        orderId = orderIdForDetails;
      }
      const data = await getAvaliableProductsInOrder(orderId, filter, value);
      if (data.length === 0) {
        ModalAlert("Información", "No se encontraron productos disponibles para agregar al inventario.", "info");
      } else {
        setChecksOptions(data);
      }
    } catch (error) {
      console.error("Error fetching available products in order:", error);
    }
    
  }

  const getAllSuppliersList = async () => {
    try {
      const data = await getAllSuppliers();

      const supplierOptions = data.map((supplier) => ({
        label: supplier.supplier_name,
        value: supplier.cod_supplier,
        placeHolder: supplier.supplier_name,
      }));
      setSuppliers(supplierOptions);

    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  const fetchCategoryInventory = async () => {
    try {
      const data = await getCategoryInventory(9);

      // Transformamos los datos al formato { label, value }
      const categoryOptions = data.map((category) => ({
        label: category.category_name,  // o el campo correcto según tu API
        value: category.cod_category,
      }));

      categoryOptions.unshift({ label: "Todos", value: "0" }); // opción por defecto

      setCategoryInventory(categoryOptions); // guardamos en el estado
    } catch (error) {
      console.error("Error fetching category inventory:", error);
    }
  };


    const handleEditOrder = async (order_cod, updatedData) => {
        try {
            setError(null);
            await updateOrder(order_cod, updatedData);
            ModalAlert("Éxito", "Orden actualizada exitosamente.", "success");
            fetchOrders();
            return true;
        } catch (err) {
            const message = err.response?.data?.message || "Error al actualizar orden.";
            setError(message);
            ModalAlert("Error", message, "error");
            return false;
        }
    };


    const handleEditOrderDetail = async (updatedData) => {
        setLoading(true);
        console.log("Detalles de orden editados:", updatedData);

        try {
            const updatedOrderDetail = await updateOrderDetail(updatedData);
            ModalAlert("Éxito", "Detalles de orden actualizados correctamente", "success");
            console.log("Detalles de orden actualizados:", updatedOrderDetail);
            fetchOrderDetails();
            // Aquí puedes actualizar el estado con los datos editados
        } catch (error) {
            console.error("Error updating order details:", error);
        }
        setLoading(false);
    }















  const fields = [
    { name: "inventory_product_cod_category", placeholder: "Categoria", label: "Categoria", type: "select", editable: true, grid: 4, width: 350, options: categoryInventory, required: false },
    { name: "seecker", placeHolder: "Buscar Producto", label: "Buscar Producto", type: "seeker", editable: true, grid: 4, width: 600, required: false },
  ];


  const useFullFields = [
    { name: "order_date", placeholder: "Fecha de Orden", label: "Fecha de Orden", type: "date", editable: true, grid: 6, width: 300, required: true },
    { name: "order_supplier_code", placeholder: "Proveedor", label: "Proveedor", type: "select", editable: true, grid: 6, width: 300, options: suppliers, required: true },
  ]

  const setChecksOptions = (data) => {
    setAvaliableProductsChecks(data.map(item => ({
      label: item.item_name,
      value: [item.cod_item, item.cod_category],
      placeholder: item.item_name,
      unit_price: item.unit_price,
      grid: 12,
      type: "checkbox",
      width: 300,
      heigth: 8,
    })));
  }



       const handleAddInventory = async (newInventory,orderData) => {
        await addOrder(orderData,newInventory);
  }

  const HandleAddOrderDetail = async (details) => {
    try {
      // Lógica para agregar detalles a la orden
      console.log("Agregar detalles a la orden ID:", orderIdForDetails, details);
      // Aquí puedes llamar a un servicio para guardar los detalles en el backend
    } catch (error) {
      console.error("Error adding order details:", error);
      ModalAlert("Error", "No se pudo agregar los detalles de la orden.", "error");
      
    }
  }




  const fetchOffices = async () => {
    try {
      const data = await getItems(9, 1); // Reemplaza '1' con el código de categoría adecuado
      setOffices(data);
    } catch (error) {
      console.error("Error fetching offices:", error);
    }
  }



  useEffect(() => {
    fetchOffices();
    fetchCategoryInventory();
 //   fetchAvaliableProducts();
    getAllSuppliersList();
    fetchOrders();
    fetchOrderDetails();
  }, []);


  return {
    // Inventario
    isCreatingInventory,
    setIsCreatingInventory,
    fields,
    handleAddInventory,
    loading,
    inventary,
    offices,
    fetchCategoryInventory,
    avaliableProductsChecks,
    fetchAvaliableProducts,
    useFullFields,

    //Datos
    order,
    orderDetails,
    suppliers,
    orderStatus,
    setAddDetailToOrder,
    creatingDetail,
    closeCreatingDetail,
    addDetailToOrder,
    HandleAddOrderDetail,
fetchAvaliableProductsInOrder,
    // Encabezados
    orderFields,
 

    // Funciones
    handleEditOrder,
    handleEditOrderDetail,

  }

}