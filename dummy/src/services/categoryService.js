import axios from "axios";

const API_URL = "http://localhost:3000/categories/";

// GET: categorías por servicio
export const getCategorys = async (cod_service) => {
  try {
    const res = await axios.get(API_URL, {
      params: { cod_service: Number(cod_service) },
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (err) {
    throw err;
  }
};

// ADD: crear categoría
export const addCategory = async (cod_service, category_name) => {
  try {
    const res = await axios.post(
      API_URL + "add",
      { cod_service: Number(cod_service), category_name },
      { headers: { "Content-Type": "application/json" } }
    );
    return res.data;
  } catch (err) {
    throw err;
  }
};

// UPDATE: renombrar categoría
export const updateCategory = async (cod_category, cod_service, category_name) => {
  try {
    const res = await axios.put(
      API_URL + "update",
      { cod_category: Number(cod_category), cod_service: Number(cod_service), category_name },
      { headers: { "Content-Type": "application/json" } }
    );
    return res.data;
  } catch (err) {
    throw err;
  }
};

// DELETE: eliminar categoría (body en DELETE)
export const deleteCategory = async (cod_category, cod_service) => {
  try {
    const res = await axios.delete(API_URL + "delete", {
      data: { cod_category: Number(cod_category), cod_service: Number(cod_service) },
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (err) {
    throw err;
  }
};

