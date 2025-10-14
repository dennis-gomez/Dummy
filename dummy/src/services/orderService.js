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
        const res = await axios.get(`${API_URL}/active/`, {
            headers: {
                "Content-Type": "application/json"
            },
        });
        return res.data;
    } catch (error) {
        throw error;
    }  
};

export const updateOrder = async (order_cod, updatedData) => {
  const res = await axios.put(`${API_URL}/update`, { order_cod: order_cod, ...updatedData });
  return res.data;
};

export const deleteOrder = async (order_cod) => {
    try {
        const res = await axios.delete(`${API_URL}/delete`, {
            data: { order_cod },
            headers: {
                "Content-Type": "application/json"
            },
        });
        return res.data;
    } catch (error) {
        throw error;
    }
};

export const searchOrders = async (searchTerm = "0", feature = "") => {
    try {
        const res = await axios.get(`${API_URL}/search`, {
            params: { searchTerm, feature },
            headers: {
                "Content-Type": "application/json"
            },
        });
        return res.data;
    } catch (error) {
        throw error;
    }
};

export const searchOrdersByProductCategory = async (categoryCode) => {
    try {
        const res = await axios.get(`${API_URL}/search-by-category`, {
            params: { categoryCode },
            headers: {
                "Content-Type": "application/json"
            },
        });
        return res.data;
    } catch (error) {
        throw error;
    }
};