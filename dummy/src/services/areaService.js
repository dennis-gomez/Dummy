import axios from "axios";

const API_URL = "http://localhost:3000/maintenance_areas/";

// Get all areas
export const getAreas = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios(API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}


export const addArea = async (area) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.post(API_URL + `area`, area, {
            headers: {
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}