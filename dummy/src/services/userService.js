import axios from "axios";

const API_URL = "http://localhost:3000/users/";

// Register user
export const login = async ( user ) => {
  try{
    console.log(user);
    const response = await axios.post(API_URL + "login", {
      user_email: user.user_email,
      user_password: user.user_password
    });
    return response.data;
  }catch(error){
    if (error.response && error.response.status === 401) {
      throw new Error("Credenciales inválidas.");
    }else{
      throw new Error("Error en el servidor. Por favor, inténtelo de nuevo más tarde.");
    }
  }
}
