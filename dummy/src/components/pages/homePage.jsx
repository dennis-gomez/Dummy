import React from 'react';

const ManagementSystem = () => {
  return (
    <div className="min-h-screen bg-blue-800 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Sistema de Gestion Integral
          </h1>
          <div className="w-100 h-1 bg-blue-900 mx-auto"></div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Text Content */}
            <div className="space-y-6">
              <p className="text-gray-600 text-lg leading-relaxed">
               Creemos en el impacto humano detrás de cada tecnología implementada, 
               lo que nos convierte en un verdadero acelerador de capacidades. No solo ofrecemos 
               soluciones tecnológicas, sino que también construimos el futuro digital del continente
                con el poder del talento humano especializado y la constante innovación.
              </p>
              
              <p className="text-gray-600 text-lg leading-relaxed">
               Ha sobrevivido no solo cinco siglos, sino también el salto a la composición tipográfica electrónica, 
               manteniéndose prácticamente inalterado. Se popularizó en la década de 1960
                con la publicación de las hojas Letraset que contenían pasajes de Lorem Ipsum.
              </p>

              {/* View More Button */}
              <div className="pt-4">
                <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200">
                  <span>View More</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Right Column - Stats/Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Stat Card 1 */}
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
                <div className="text-gray-700 font-medium">Tasa de eficiencia</div>
                <div className="text-sm text-gray-500 mt-2">Improved performance metrics</div>
              </div>

              {/* Stat Card 2 */}
              <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
                <div className="text-gray-700 font-medium">Tiempo de actividad del sistema</div>
                <div className="text-sm text-gray-500 mt-2">Disponibilidad confiable del servicio</div>
              </div>

              {/* Stat Card 3 */}
              <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
                <div className="text-3xl font-bold text-purple-600 mb-2">500+</div>
                <div className="text-gray-700 font-medium">Usuarios Activos</div>
                <div className="text-sm text-gray-500 mt-2">Crecimiento de comunidad</div>
              </div>

              {/* Stat Card 4 */}
              <div className="bg-orange-50 rounded-xl p-6 border border-orange-100">
                <div className="text-3xl font-bold text-orange-600 mb-2">99.9%</div>
                <div className="text-gray-700 font-medium">Satisfaccion</div>
                <div className="text-sm text-gray-500 mt-2">Felicidad del cliente</div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Gestión segura</h3>
            <p className="text-gray-600">Funciones de seguridad avanzadas para proteger sus datos y operaciones.</p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Rendimiento rápido</h3>
            <p className="text-gray-600">Optimizado para velocidad y eficiencia en todas las operaciones.</p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Fácil integración</h3>
            <p className="text-gray-600">Se integra perfectamente con sus herramientas y flujos de trabajo existentes.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagementSystem;