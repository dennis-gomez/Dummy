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

// Create a new area
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

// Update an area
export const updateArea = async (area) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.put(API_URL + `update`, {
            id_area: area.id_area,
            area_name: area.area_name
        }, {
            headers: {
                'Content-Type': 'application/json', 
                'Authorization': `Barer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

// Delete an area
export const deleteArea = async (id_area) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.delete(API_URL + `delete`, { 
            id_area: id_area,
            headers: {
                'Content-Type': 'application/json', 
                'Authorization': `Barer ${token}`,   
            },
        });
        return response.data;
    }catch (error) {
        throw error;
    }   
};