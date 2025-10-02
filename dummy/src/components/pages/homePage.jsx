import React, { useState, useEffect } from "react";

const ManagementSystem = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 100); // activa la animación al renderizar
  }, []);

  return (
    <div className="min-h-screen bg-blue-800 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div
          className={`text-center mb-12 transform transition-all duration-1000 ${
            show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6"
          }`}
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Sistema de Gestion Integral
          </h1>
          <div className="w-100 h-1 bg-blue-900 mx-auto"></div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Text Content */}
            <div
              className={`space-y-6 transform transition-all duration-1000 ${
                show ? "opacity-100 -translate-x-0" : "opacity-0 -translate-x-10"
              }`}
            >
              <p className="text-gray-600 text-lg leading-relaxed">
                Creemos en el impacto humano detrás de cada tecnología
                implementada, lo que nos convierte en un verdadero acelerador de
                capacidades. No solo ofrecemos soluciones tecnológicas, sino que
                también construimos el futuro digital del continente con el
                poder del talento humano especializado y la constante innovación.
              </p>

              <p className="text-gray-600 text-lg leading-relaxed">
                Ha sobrevivido no solo cinco siglos, sino también el salto a la
                composición tipográfica electrónica, manteniéndose prácticamente
                inalterado. Se popularizó en la década de 1960 con la
                publicación de las hojas Letraset que contenían pasajes de Lorem
                Ipsum.
              </p>

              {/* View More Button */}
              <div className="pt-4">
                <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200">
                  <span>View More</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Right Column - Stats/Features */}
            <div
              className={`grid grid-cols-1 md:grid-cols-2 gap-6 transform transition-all duration-1000 delay-200 ${
                show ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
              }`}
            >
              {/* Stat Card 1 */}
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
                <div className="text-gray-700 font-medium">
                  Tasa de eficiencia
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  Improved performance metrics
                </div>
              </div>

              {/* Stat Card 2 */}
              <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
                <div className="text-gray-700 font-medium">
                  Tiempo de actividad del sistema
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  Disponibilidad confiable del servicio
                </div>
              </div>

              {/* Stat Card 3 */}
              <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
                <div className="text-3xl font-bold text-purple-600 mb-2">500+</div>
                <div className="text-gray-700 font-medium">Usuarios Activos</div>
                <div className="text-sm text-gray-500 mt-2">
                  Crecimiento de comunidad
                </div>
              </div>

              {/* Stat Card 4 */}
              <div className="bg-orange-50 rounded-xl p-6 border border-orange-100">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  99.9%
                </div>
                <div className="text-gray-700 font-medium">Satisfaccion</div>
                <div className="text-sm text-gray-500 mt-2">
                  Felicidad del cliente
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagementSystem;
