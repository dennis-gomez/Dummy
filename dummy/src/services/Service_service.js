import axios from "axios";

const API_URL = "http://localhost:3000/services/"

// Get all areas
export const getServices = async () => {
    try {
        const response = await axios(API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json', 
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

