import { useState, useEffect } from "react";
import ModalAlert from "../components/molecules/modalAlert";
import { getItems } from "../services/itemService";
import { getInventory, updateInventory,deleteInventory, getCategoryInventory,
     getProductsThatAreNotInInventory, addProductsToInventory, findProductsInventory } from "../services/inventoryService";

export const useInventory = () => {
    

    const [isCreatingInventory, setIsCreatingInventory] = useState(false);
    const [inventary, setInventary] = useState([]);
    const [offices, setOffices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [categoryInventory, setCategoryInventory] = useState([]);
    const [avaliableProductsChecks, setAvaliableProductsChecks] = useState([]);
    

const fetchAvaliableProducts = async (filter="0", value="") => {
  try {
    const data = await getProductsThatAreNotInInventory(filter, value);

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

      
    
       const setChecksOptions = (data) =>{
       setAvaliableProductsChecks(data.map(item => ({
        label: item.item_name,
        value: [item.cod_item, item.cod_category],
        placeholder: item.item_name,
        grid: 12,
        type: "checkbox",
        width: 300,
        heigth: 8,
       })));
       }

  

     const deleteGuaranteOrReactivated = async (product_cod_item, product_category) => {
setLoading(true);
        const deleteData = {
            product_cod_item: product_cod_item,
            product_cod_category: product_category,
        };

        try {
            await deleteInventory(deleteData);
            console.log("producto eliminada:", product_cod_item, product_category);
            ModalAlert("Éxito", "Producto eliminado o reactivado correctamente", "success");
            fetchInventory();
        } catch (error) {
            console.error("Error eliminando o reactivando producto:", error);
        }
        setLoading(false);
        fetchAvaliableProducts();
    };

       const handleAddInventory = async (newInventory) => {
    console.log("Nuevo inventario a agregar:", newInventory);

    // Aquí puedes llamar a la función del servicio para agregar el inventario
    try {
        const addedInventory = await addProductsToInventory(newInventory);
        console.log("Inventario agregado:", addedInventory);
        ModalAlert("Éxito", "Inventario agregado correctamente", "success");
        fetchInventory();
    } catch (error) {
        console.error("Error agregando inventario:", error);
    }

    setIsCreatingInventory(false);
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

    const handleEdit= async (editedInventory) => {
        
        setLoading(true);

        console.log("Inventario editado:", editedInventory);

        try {
            const updatedInventory = await updateInventory(editedInventory);
            ModalAlert("Éxito", "Inventario actualizado correctamente", "success");
            console.log("Inventario actualizado:", updatedInventory);
            fetchInventory();
            // Aquí puedes actualizar el estado con los datos editados
        } catch (error) {
            console.error("Error updating inventory:", error);
        }
        setLoading(false);
    }

    const fetchInventory = async () => {
        setLoading(true);
    try {
        const data = await getInventory();
        console.log("Inventario obtenido:", data);
        console.log(data[0].cantidades);
        setInventary(data);
        // Aquí puedes actualizar el estado con los datos obtenidos
    }
    catch (error) {
        console.error("Error fetching inventory:", error);
    }
    setLoading(false);
    }

    useEffect(() => {
    fetchOffices();
    fetchInventory();
    fetchCategoryInventory();
    fetchAvaliableProducts();
  }, []);

  const handleFindProduct = async ( cod_item_product ) => {
    setLoading(true);
    try {
      const data = await findProductsInventory( cod_item_product );
      ModalAlert("Éxito", "Inventario actualizado correctamente", "success");
      setInventary(data);
    } catch (error) {
      ModalAlert("Error", "Error al buscar productos", "error");
      console.error("Error al encontrar el inventario");
    }
    setLoading(false);
  }

    return {
        isCreatingInventory,
        setIsCreatingInventory,
        fields,
        handleAddInventory,
        loading,
        inventary,
        offices,
        handleEdit,
        deleteGuaranteOrReactivated,
        fetchCategoryInventory,
        avaliableProductsChecks,
        fetchAvaliableProducts,
        handleFindProduct,
    }
    
}