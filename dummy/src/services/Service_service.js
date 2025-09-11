// services/Service_service.js
import axios from "axios";

const API_URL = "http://localhost:3000/services/";

export const getServices = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// POST: crear servicio (backend espera req.body.service_name)
export const addService = async (service_name) => {
  try {
    const response = await axios.post(
      API_URL + "add",
      { service_name },
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error) {
    console.error("addService ERROR:", error.response?.data || error.message);
    throw error;
  }
};

// UPDATE: editar servicio (backend lee req.body)
export const updateService = async (cod_service, service_name) => {
  try {
    const response = await axios.put(
      API_URL + "update",
      { cod_service: Number(cod_service), service_name },
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error) {
    console.error("updateService ERROR:", error.response?.data || error.message);
    throw error;
  }
};

// DELETE: eliminar servicio

export const deleteService = async (cod_service) => {
  try {
    const response = await axios.delete(API_URL + "delete", {
      data: { cod_service: Number(cod_service) },
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("deleteService ERROR:", error.response?.data || error.message);
    throw error;
  }
};


