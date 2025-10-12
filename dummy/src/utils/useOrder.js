import { useState, useEffect } from "react";
import ModalAlert from "../components/molecules/modalAlert";
import { getItems } from "../services/itemService";
import {getCategoryInventory,
     getProductsThatAreInInventory, addProductsToInventory } from "../services/inventoryService";
     import { getAllSuppliers } from "../services/supplierService";

export const useOrder = () => {
    

    const [isCreatingInventory, setIsCreatingInventory] = useState(false);
    const [inventary, setInventary] = useState([]);
    const [offices, setOffices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [categoryInventory, setCategoryInventory] = useState([]);
    const [avaliableProductsChecks, setAvaliableProductsChecks] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    

const fetchAvaliableProducts = async (filter="0", value="") => {
  console.log("fetchAvaliableProducts llamado con filter:", filter, "y value:", value);
  try {
    const data = await getProductsThatAreInInventory(filter, value);
console.log("buscoo")
    if(data.length === 0){
      ModalAlert("Información", "No se encontraron productos disponibles para agregar al inventario.", "info");
    }else{
    setChecksOptions(data);
    }
    console.log("Productos disponibles obtenidos:", data);
  } catch (error) {
    console.error("Error fetching available products:", error);
  }
};

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

    console.log("Datos de categorías recibidos:", data);

    // Transformamos los datos al formato { label, value }
    const categoryOptions = data.map((category) => ({
      label: category.category_name,  // o el campo correcto según tu API
      value: category.cod_category,
    }));

    categoryOptions.unshift({ label: "Todos", value: "0" }); // opción por defecto

    setCategoryInventory(categoryOptions); // guardamos en el estado
    console.log("Categorías de inventario obtenidas:", categoryOptions);
  } catch (error) {
    console.error("Error fetching category inventory:", error);
  }
};

     const fields = [
   { name: "inventory_product_cod_category", placeholder: "Categoria", label: "Categoria", type: "select", editable: true, grid: 4, width: 350, options: categoryInventory, required: false },
   {name: "seecker", placeHolder: "Buscar Producto", label: "Buscar Producto", type: "seeker", editable: true, grid: 4, width: 600, required: false},
       ];

      
const useFullFields = [
  {name: "order_date", placeholder: "Fecha de Orden", label: "Fecha de Orden", type: "date", editable: true, grid: 6, width: 300, required: true},
  {name: "order_supplier_code", placeholder: "Proveedor", label: "Proveedor", type: "select", editable: true, grid: 6, width: 300, options: suppliers, required: true},
  {name: "order_facture_number", placeholder: "Número de Factura", label: "Número de Factura", type: "text", editable: true, grid: 6, width: 300, required: true},
]
    
       const setChecksOptions = (data) =>{
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
    console.log("Nuevo inventario a agregar:", newInventory);
    console.log("Datos de la orden:", orderData);
  }




  const fetchOffices = async () => {
    try {
        const data = await getItems(9, 1); // Reemplaza '1' con el código de categoría adecuado
        setOffices(data);
        console.log("Oficinas obtenidas:", data);
    } catch (error) {
        console.error("Error fetching offices:", error);
    }
    }

  

    useEffect(() => {
    fetchOffices();
    fetchCategoryInventory();
    fetchAvaliableProducts();
    getAllSuppliersList();
  }, []);


    return {
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
       
    }

}