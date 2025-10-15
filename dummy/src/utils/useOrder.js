import { useState, useEffect } from "react";
import ModalAlert from "../components/molecules/modalAlert";
import { getItems } from "../services/itemService";
import {
  getCategoryInventory,
  getProductsThatAreInInventory, addProductsToInventory
} from "../services/inventoryService";
import { getAllSuppliers } from "../services/supplierService";
import { addOrder } from "../services/orderService";

import { getAllOrderDetails, updateOrderDetail, getAvaliableProductsInOrder, deleteOrderDetail, addOrderDetail, } from "../services/orderDetailService";
import { getAllOrders, getActiveOrders, updateOrder, deleteOrder, searchOrders, searchOrdersByProductCategory } from "../services/orderService";

export const useOrder = () => {


  const [isCreatingInventory, setIsCreatingInventory] = useState(false);
  const [inventary, setInventary] = useState([]);
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoryInventory, setCategoryInventory] = useState([]);
  const [avaliableProductsChecks, setAvaliableProductsChecks] = useState([]);
  const [addDetailToOrder, setAddDetailToOrder] = useState(false);
  const [orderIdForDetails, setOrderIdForDetails] = useState(null);

  const creatingDetail = (value, id) => {

    if (id) {
      fetchAvaliableProductsInOrder(id);
      setIsCreatingInventory(value);
      setOrderIdForDetails(id);
      setAddDetailToOrder(value);
    } else {
      setIsCreatingInventory(value);
      fetchAvaliableProducts();
      setAddDetailToOrder(false);
      setOrderIdForDetails(null);
    }
  }







  const [order, setOrder] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const [orderDetails, setOrderDetails] = useState([]);
  const [error, setError] = useState(null);


  // Opciones para el campo de estado de la orden


  const orderStatus = [
    { value: 1, label: "Pendiente", placeholder: "Pendiente", name: 1 },
    { value: 2, label: "Recibida", placeholder: "Recibida", name: 2 },
    { value: 3, label: "Cancelada", placeholder: "Cancelada", name: 3 },
    { value: 4, label: "Eliminada", placeholder: "Eliminada", name: 4 },
  ];

  const orderFields = [
    { name: "order_date", placeholder: "Fecha de Orden", label: "Fecha", type: "date", editable: true, restriction: "cantAfterToday", grid: 4, width: 175 },
    { name: "order_status", placeholder: "Estado", label: "Estado", type: "select", editable: true, grid: 4, width: 175, options: orderStatus },
    { name: "order_supplier_code", placeholder: "Proveedor", label: "Proveedor", type: "select", editable: true, grid: 4, width: 225, options: suppliers },
    { name: "order_facture_number", placeholder: "Número de Factura", label: "Factura", editable: true, grid: 4, width: 200 },
    { name: "order_total_amount", placeholder: "Monto Total", label: "Monto Total", type: "number", editable: false, grid: 4, width: 200 }
  ];

const fetchData = async () => {
fetchActiveOrders();
fetchOrderDetails();
};
  


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

  const fetchActiveOrders = async () => {
    setLoading(true);
    try {
      const data = await getActiveOrders();
      setOrder(data);
    } catch (error) {
      console.error("Error fetching active orders:", error);
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
      if (orderId === -1 || orderId === null || !orderId) {
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
        placeholder: supplier.supplier_name,
        name: supplier.cod_supplier,
      }));
      setSuppliers(supplierOptions);

    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };




  const searchInOrder= async (value,feature)=>{

    if(value==="Todos"){
      setLoading(true);
       fetchData();
        setLoading(false);
}else if(value ==="cod_category"){
  setLoading(true);
  try {
    const data = await searchOrdersByProductCategory(feature);
    setOrder(data.orders);
  setOrderDetails(data.details);
  } catch (error) {
    console.error("Error searching orders by category:", error);
  }

  setLoading(false);
}else{
  setLoading(true);
  try {
    const data = await searchOrders(value,feature);
    setOrder(data);
  } catch (error) {
    console.error("Error searching orders:", error);
  }
  
  setLoading(false);
}

}

  

  const fetchCategoryInventory = async () => {
    try {
      const data = await getCategoryInventory(9);

      // Transformamos los datos al formato { label, value }
      const categoryOptions = data.map((category) => ({
        label: category.category_name,  // o el campo correcto según tu API
        value: category.cod_category,
        placeholder: category.category_name,
        name: category.cod_category,
      }));

      categoryOptions.unshift({ label: "Todos", value: "0", placeholder: "Todos" }); // opción por defecto

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
      fetchData();
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
    try {
      const updatedOrderDetail = await updateOrderDetail(updatedData);
      ModalAlert("Éxito", "Detalles de orden actualizados correctamente", "success");
      fetchData();
    } catch (error) {
      console.error("Error updating order details:", error);
    }
    setLoading(false);
  }

  const filterSearch = [
    {name:"Todos", value:"Todos", placeholder:"Todos", label:"Todos"},
    { name: "order_status", placeholder: "Estado", label: "Estado", type: "select", editable: true, grid: 4, width: 175, options: orderStatus },
    { name: "order_supplier_code", placeholder: "Proveedor", label: "Proveedor", type: "select", editable: true, grid: 4, width: 225, options: suppliers },
    { name: "cod_category", placeholder: "Categoría", label: "Categoría", type: "select", editable: true, grid: 4, width: 350, options: categoryInventory.filter(cat=>cat.value!=="0") },
    { name: "order_facture_number", placeholder: "Número de Factura", label: "Factura", editable: true, grid: 4, width: 200 }
  ]



  const handleDeleteOrder = async (order_cod) => {
    try {
      setError(null);
      await deleteOrder(order_cod);
      ModalAlert("Éxito", "Orden eliminada exitosamente.", "success");
      fetchData();
      return true;
    } catch (err) {
      const message = err.response?.data?.message || "Error al eliminar orden.";
      setError(message);
      ModalAlert("Error", message, "error");
      return false;
    }
  };

  const handleDeleteOrderDetail = async (detail_cod) => {
    setLoading(true);
    try {
      await deleteOrderDetail(detail_cod);
      ModalAlert("Éxito", "Detalle de orden eliminado correctamente", "success");
      fetchData();
    } catch (error) {
      console.error("Error deleting order detail:", error);
      ModalAlert("Error", "No se pudo eliminar el detalle de la orden.", "error");
    } finally {
      setLoading(false);
    }
  };



  const fields = [
    { name: "inventory_product_cod_category", placeholder: "Categoría", label: "Categoría", type: "select", editable: true, grid: 4, width: 350, options: categoryInventory, required: false },
    { name: "seecker", placeHolder: "Buscar Producto", label: "Buscar Producto", type: "seeker", editable: true, grid: 4, width: 600, required: false },
  ];


  const useFullFields = [
    { name: "order_date", placeholder: "Fecha de Orden", label: "Fecha de Orden", type: "date", editable: true, grid: 6, width: 300, required: true, restriction: "cantAfterToday" },
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



  const handleAddInventory = async (newInventory, orderData) => {
    await addOrder(orderData, newInventory);
    setIsCreatingInventory(false);
    fetchOrders();
    fetchOrderDetails();
    ModalAlert("Éxito", "Inventario agregado exitosamente.", "success");

  }

  const HandleAddOrderDetail = async (details) => {
    try {
      await addOrderDetail(orderIdForDetails, details);
      ModalAlert("Éxito", "Detalles de la orden agregados correctamente.", "success");
      setIsCreatingInventory(false);
      setAddDetailToOrder(false);
      setOrderIdForDetails(null);
      fetchOrderDetails();
      fetchOrders();

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
    //fetchAvaliableProducts();
    getAllSuppliersList();
    fetchData();
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
    addDetailToOrder,
    HandleAddOrderDetail,
    fetchAvaliableProductsInOrder,
    // Encabezados
    orderFields,


    // Funciones
    handleEditOrder,
    handleEditOrderDetail,
    handleDeleteOrder,
    handleDeleteOrderDetail,
    filterSearch,
    searchInOrder,

  }

}