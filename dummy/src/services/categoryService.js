import axios from "axios";

const API_URL = "http://localhost:3000/maintenance_categories/";

// Get all categories by cod_service
export const getCategorys = async (cod_service) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
            API_URL,
            { cod_service },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Barer ${token}`,
                }
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
}
