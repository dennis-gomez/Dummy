import axios from "axios";
const API_URL = "http://localhost:3000/order-detail";

export const getAllOrderDetails = async () => {
    try {
        const res = await axios.get(`${API_URL}/`, {
            headers: {
                "Content-Type": "application/json"
            },
        });
        return res.data.items;
    } catch (error) {
        throw error;
    }
};

export const updateOrderDetail = async (updateData) => {
  try {
    const res = await axios.put(`${API_URL}/update`, updateData, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const getAvaliableProductsInOrder = async (orderId, filter = "0", value = "") => {
    try {
        const res = await axios.get(`${API_URL}/not-in-order`, {
            params: { orderId, filter, value },
            headers: {
                "Content-Type": "application/json"
            },
        });
        return res.data;
    } catch (error) {
        throw error;
    }
};

export const getOrderDetailsByOrderId = async (orderId) => {
    try {
        const res = await axios.get(`${API_URL}/by-order/${orderId}`, {
            headers: {
                "Content-Type": "application/json"
            },
        });
        return res.data;
    } catch (error) {
        throw error;
    }
};

export const deleteOrderDetail = async (cod_order_detail) => {
    try {
        const res = await axios.delete(`${API_URL}/delete`, {
            data: { cod_order_detail },
            headers: {
                "Content-Type": "application/json"
            },
        });
        return res.data;
    } catch (error) {
        throw error;
    }
};
