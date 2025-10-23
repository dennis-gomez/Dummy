import axios from "axios";

const API_URL = "http://localhost:3000/it-inventory-movements";



export const addItemToMovement = async (movementId, itemData) => {
  try {
    console.log("🚀 Enviando al backend:", {
      cod_inventory_movement: movementId,
      itemData: {
        cod_it_inventory: itemData.cod_it_inventory,
        it_inventory_movement_motive: itemData.it_inventory_movement_motive,
        it_inventory_movement_description: itemData.it_inventory_movement_description
      }
    });

    // 🔹 CORRECCIÓN: Usar API_URL + la ruta correcta
    const response = await axios.post(`${API_URL}/add-item`, {
      cod_inventory_movement: movementId,
      itemData: {
        cod_it_inventory: itemData.cod_it_inventory,
        it_inventory_movement_motive: itemData.it_inventory_movement_motive,
        it_inventory_movement_description: itemData.it_inventory_movement_description
      }
    });

    return response.data;
  } catch (error) {
    console.error("❌ Error en addItemToMovement:", error.response?.data || error.message);
    throw error;
  }
};

// 🔹 Obtener todos los movimientos-activos activos
export const getActiveInventoryMovements = async (page = 1, limit = 10) => {
  const res = await axios.get(`${API_URL}/active?page=${page}&limit=${limit}`);
  return res.data;
};


export const getAvailableInventoryItems = async () => {
  const res = await axios.get(`${API_URL}/available-items`);
  return res.data;
};

export const getAvailableAssets = async () => {
  try {
    const res = await axios.get(`${API_URL}/active`);
    // Filtrar solo los activos que tienen estado 1 (activo)
    const available = res.data.filter(asset => asset.status === 1);
    return available;
  } catch (err) {
    console.error("Error al obtener activos disponibles:", err);
    return [];
  }
};

// 🔹 Buscar movimientos-activos inactivos
export const getInactiveInventoryMovements = async (page = 1, limit = 10) => {
  const res = await axios.get(`${API_URL}/inactive?page=${page}&limit=${limit}`);
  return res.data;
};

// 🔹 Obtener un movimiento-activo específico
export const getInventoryMovementById = async (cod_inventory_movement) => {
  const res = await axios.get(`${API_URL}/getId/${cod_inventory_movement}`);
  return res.data;
};

// 🔹 Buscar movimiento-activo
export const searchInventoryMovements = async (feature, text, page = 1, limit = 10) => {
  const res = await axios.get(
    `${API_URL}/search?feature=${feature}&text=${text}&page=${page}&limit=${limit}`
  );
  return res.data;
};

// 🔹 Crear nueva relación entre movimiento y activo
export const createInventoryMovement = async (data) => {
  const res = await axios.post(`${API_URL}/add`, data);
  return res.data;
};

// 🔹 Actualizar relación
export const updateInventoryMovement = async (data) => {
  const res = await axios.put(`${API_URL}/update`, data);
  return res.data;
};

export const deleteInventoryMovement = async (cod_inventory_movement, cod_it_inventory) => {
  try {
    const response = await axios.patch(
      `${API_URL}/remove-item/${cod_inventory_movement}/${cod_it_inventory}`
    );
    return response.data; // <-- devuelve { message: "...", result: {...} }
  } catch (error) {
    console.error("Error al desactivar activo:", error.response?.data || error.message);
    throw error;
  }
};




export const destroyInventoryMovement = (cod_inventory_movement, cod_it_inventory) => {
  return axios.delete(`${API_URL}/remove-item/${cod_inventory_movement}/${cod_it_inventory}`);
};






