import axios from "axios";

const API_URL = "http://localhost:3000/order";

// Obtener órdenes por cod_service

export const getAllOrders = async () => {
    try {
        const res = await axios.get(`${API_URL}/`, {
            headers: {
                "Content-Type": "application/json"
            },
        });
        return res.data;
    } catch (error) {
        throw error;
    }
};

export const addOrder = async (orderData,ordenDetailData) => {
    try {
        const response = await axios.post(
            `${API_URL}/add`,
            { orderData,ordenDetailData },
            { headers: {
                "Content-Type": "application/json"
              }, }
        );
        return response.data;
    } catch (error) {
        throw error;
    } 
    };

export const getActiveOrders = async () => {
    try {
        const res = await axios.get(`${API_URL}/active`, {
            headers: {
                "Content-Type": "application/json"
            },
        });
        return res.data.items;
    } catch (error) {
        throw error;
    }  
};

export const updateOrder = async (order_cod, updatedData) => {
  const res = await axios.put(`${API_URL}/update`, { order_cod: order_cod, ...updatedData });
  return res.data;
};
