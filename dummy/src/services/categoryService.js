import axios from "axios";

const API_URL = "http://localhost:3000/maintenance_categories/";

// Get all categorys
export const getCategorys = async () => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.get(API_URL, {
            headers: {
                'Content-Type': 'application/json', 
                'Authorization': `Barer ${token}`, 
            }
        });
        return response.data;
    }catch (error) {
        throw error;
    }
}

// Create a new category
export const createCategory = async ( category ) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.post(API_URL + `add`, {
            id_area: category.id_area,
            category_name: category.category_name
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
};

// Update an category
export const updateCategory = async ( category ) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.put(API_URL + `update`, {
            id_category: category.id_category,
            id_area: category.id_area,
            category_name: category.category_name
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

// Delete an category
export const deleteCategory = async ( id_category ) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.delete(API_URL + `delete`, { 
            id_category: id_category,
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
           