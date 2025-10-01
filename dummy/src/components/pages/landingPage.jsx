import React from 'react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-blue-700 p-8 flex items-center">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Text Content */}
        <div className="text-white space-y-6 max-w-xl">
          <h1 className="text-4xl font-bold leading-tight">
            Sistema de Gestión Integral
          </h1>
          <p className="text-lg font-light max-w-md">
            Creemos en el impacto humano detrás de cada tecnología implementada, lo que nos convierte en un acelerador de capacidades. No solo ofrecemos soluciones tecnológicas, sino que también construimos el futuro digital del continente con talento especializado y constante innovación.
          </p>
          <button className="bg-white text-blue-700 font-semibold py-2 px-6 rounded-md hover:bg-gray-100 transition-colors duration-200">
            Ver Más
          </button>
        </div>

        {/* Right Side - Illustration Placeholder */}
        <div className="flex justify-center">
          {/* Aquí puedes poner la imagen o SVG */}
          <img
            src="https://cdn-icons-png.flaticon.com/512/3159/3159067.png"
            alt="Illustration"
            className="w-full max-w-md"
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;