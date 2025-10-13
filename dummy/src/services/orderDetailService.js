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