import React, { useState, useEffect } from "react";

const ErrorPage = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 100); // activa la animación al montar
  }, []);

  return (
    <div className="min-h-screen bg-red-600 flex flex-col justify-center items-center p-8">
      {/* Título */}
      <h1
        className={`text-white text-6xl font-extrabold mb-4 transform transition-all duration-1000 ${
          show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6"
        }`}
      >
        ¡Ups!!
      </h1>

      {/* Texto */}
      <p
        className={`text-white text-xl mb-6 max-w-lg text-center transform transition-all duration-1000 delay-200 ${
          show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        }`}
      >
        Algo anda mal, espere o póngase en contacto con el soporte técnico.
      </p>

      {/* Imagen */}
      <img
        src="https://cdn-icons-png.flaticon.com/512/463/463612.png"
        alt="Error icon"
        className={`w-32 h-32 mb-6 transform transition-all duration-1000 delay-400 ${
          show ? "opacity-100 scale-100" : "opacity-0 scale-75"
        }`}
      />

      {/* Botón */}
      <button
        onClick={() => window.location.reload()}
        className={`bg-white text-red-600 font-semibold py-2 px-6 rounded-md hover:bg-gray-100 transition-colors duration-200 transform transition-all duration-1000 delay-600 ${
          show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        Reintentar
      </button>
    </div>
  );
};

export default ErrorPage;
