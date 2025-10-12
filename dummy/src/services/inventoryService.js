import axios from "axios";

const API_URL = "http://localhost:3000/inventory/";

// Obtener inventario por cod_service
export const getInventory = async () => {
  try {
    const response = await axios.get(
      API_URL,
      { headers: {
          "Content-Type": "application/json"
        }, }
    );
    return response.data.items;
  } catch (error) {
    throw error;
  }
   }

export const updateInventory = async (updateData) => {   
    try {
        const response = await axios.put(
            `${API_URL}update`,
            updateData,
            { headers: {
                "Content-Type": "application/json"
              }, }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
    }

    export const deleteInventory = async (deleteData) => {
        try {
            const response = await axios.put(
                `${API_URL}delete`,
                deleteData,
                { headers: {
                    "Content-Type": "application/json"
                  }, }
            );
            return response.data;
        } catch (error) {
            throw error;
        }
        }

        export const getCategoryInventory = async (cod_service) => {
            try {
                const response = await axios.get(
                    `${API_URL}categories`,
                    { params: { cod_service },
                    headers: {
                        "Content-Type": "application/json"
                      }, }
                );
                return response.data;
            } catch (error) {
                throw error;
            }
            }

            export const getProductsThatAreNotInInventory = async (filter,value) => {
                try {
                    const response = await axios.get(
                        `${API_URL}products-not-in-inventory`,
                        { params: { filter,value },
                        headers: {
                            "Content-Type": "application/json"
                          }, }
                    );
                    return response.data;
                } catch (error) {
                    throw error;
                }
                }

                
            export const getProductsThatAreInInventory = async (filter,value) => {
                try {
                    const response = await axios.get(
                        `${API_URL}products-in-inventory`,
                        { params: { filter,value },
                        headers: {
                            "Content-Type": "application/json"
                          }, }
                    );
                    return response.data;
                } catch (error) {
                    throw error;
                }
                }


                export const addProductsToInventory = async (data) => {
                    try {
                        const response = await axios.post(
                            `${API_URL}add`,
                            data,
                            { headers: {
                                "Content-Type": "application/json"
                              }, }
                        );
                        return response.data;
                    } catch (error) {
                        throw error;
                    }
                    }

