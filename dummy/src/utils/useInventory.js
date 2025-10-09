import { useState, useEffect } from "react";
import ModalAlert from "../components/molecules/modalAlert";
import {getAllFromServicesWithRelationships, getItems } from "../services/itemService";
import { getInventory, updateInventory,deleteInventory } from "../services/inventoryService";

export const useInventory = () => {
    

    const [isCreatingInventory, setIsCreatingInventory] = useState(false);
    const [inventary, setInventary] = useState([]);
    const [offices, setOffices] = useState([]);
    const [loading, setLoading] = useState(false);
    

     const fields = [
    { name: "cod_guarantee", label: "Código", type: "text", editable: false, grid: 4, width: 200 },
       ];

     const deleteGuaranteOrReactivated = async (product_cod_item, product_category) => {
setLoading(true);
        const deleteData = {
            product_cod_item: product_cod_item,
            product_cod_category: product_category,
        };

        try {
            await deleteInventory(deleteData);
            console.log("producto eliminada:", product_cod_item, product_category);
            fetchInventory();
        } catch (error) {
            console.error("Error eliminando o reactivando producto:", error);
        }
        setLoading(false);
    };

       const handleAddInventory = (newInventory) => {
    // Lógica para agregar un nuevo inventario
    console.log("Nuevo inventario agregado:", newInventory);
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
  }, []);


    return {
        isCreatingInventory,
        setIsCreatingInventory,
        fields,
        handleAddInventory,
        loading,
        inventary,
        offices,
        handleEdit,
        deleteGuaranteOrReactivated
    }

}