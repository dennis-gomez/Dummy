import axios from "axios";

const API_URL = "http://localhost:3000/areas/";

// Get all areas
export const getAreas = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios(API_URL + `maintenance_areas`, {
            method: 'GET',
            headers: {
                'Content-Type': `Barer ${token}`, 
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}
