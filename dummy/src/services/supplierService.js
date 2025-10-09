import axios from "axios";

const API_URL = "http://localhost:3000/suppliers"; // ajusta la ruta base si cambia

// Obtener todos los proveedores
export const getAllSuppliers = async () => {
  try {
    const { data } = await axios.get(API_URL);
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Error al obtener proveedores" };
  }
};

// Obtener proveedor por ID
export const getSupplierById = async (id) => {
  try {
    const { data } = await axios.get(`${API_URL}/${id}`);
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Error al obtener proveedor" };
  }
};

// Crear nuevo proveedor
export const createSupplier = async (supplierData) => {
  try {
    const { data } = await axios.post(API_URL, supplierData);
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Error al crear proveedor" };
  }
};

// Actualizar proveedor
export const updateSupplier = async (id, supplierData) => {
  try {
    const { data } = await axios.put(`${API_URL}/${id}`, supplierData);
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Error al actualizar proveedor" };
  }
};

// Eliminar proveedor
export const deleteSupplier = async (id) => {
  try {
    const { data } = await axios.delete(`${API_URL}/${id}`);
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Error al eliminar proveedor" };
  }
};

// Buscar proveedores (opcional, si implementás un endpoint /search)
export const searchSuppliers = async (field, value) => {
  try {
    const { data } = await axios.get(`${API_URL}/search`, {
      params: { field, value },
    });
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Error al buscar proveedor" };
  }
};
