import React from 'react';

const ErrorPage = () => {
  return (
    <div className="min-h-screen bg-red-600 flex flex-col justify-center items-center p-8">
      <h1 className="text-white text-6xl font-extrabold mb-4">¡Ups!!</h1>
      <p className="text-white text-xl mb-6 max-w-lg text-center">
        Algo anda mal, espere o póngase en contacto con el soporte técnico.
      </p>
      <img
        src="https://cdn-icons-png.flaticon.com/512/463/463612.png"
        alt="Error icon"
        className="w-32 h-32 mb-6"
      />
      <button
        onClick={() => window.location.reload()}
        className="bg-white text-red-600 font-semibold py-2 px-6 rounded-md hover:bg-gray-100 transition-colors duration-200"
      >
        Reintentar
      </button>
    </div>
  );
};

export default ErrorPage;
