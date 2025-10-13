import axios from "axios";

const API_URL = "http://localhost:3000/order/";

export const addOrder = async (orderData,ordenDetailData) => {
    try {
        const response = await axios.post(
            `${API_URL}add`,
            { orderData,ordenDetailData },
            { headers: {
                "Content-Type": "application/json"
              }, }
        );
        return response.data;
    } catch (error) {
        throw error;
    } 
    }
