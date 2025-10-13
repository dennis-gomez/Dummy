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

