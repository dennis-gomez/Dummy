import React, { useState, useEffect, useRef } from "react";

const features = [
  {
    title: "Gestión segura",
    description:
      "Funciones de seguridad avanzadas para proteger sus datos y operaciones.",
  },
  {
    title: "Rendimiento rápido",
    description:
      "Optimizado para velocidad y eficiencia en todas las operaciones.",
  },
  {
    title: "Fácil integración",
    description:
      "Se integra perfectamente con sus herramientas y flujos de trabajo existentes.",
  },
];

const stats = [
  {
    value: "98%",
    label: "Tasa de eficiencia",
    desc: "Improved performance metrics",
    color: "blue",
  },
  {
    value: "24/7",
    label: "Tiempo de actividad del sistema",
    desc: "Disponibilidad confiable del servicio",
    color: "green",
  },
  {
    value: "500+",
    label: "Usuarios Activos",
    desc: "Crecimiento de comunidad",
    color: "purple",
  },
  {
    value: "99.9%",
    label: "Satisfacción",
    desc: "Felicidad del cliente",
    color: "orange",
  },
];

const LandingPage = () => {
  const [showMain, setShowMain] = useState(false);
  const [visibleFeatures, setVisibleFeatures] = useState(
    new Array(features.length).fill(false)
  );
  const [visibleStats, setVisibleStats] = useState(
    new Array(stats.length).fill(false)
  );

  const featureRefs = useRef([]);
  const statsRefs = useRef([]);
  const featuresSectionRef = useRef(null);

  useEffect(() => {
    setTimeout(() => setShowMain(true), 100);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const fIndex = featureRefs.current.indexOf(entry.target);
          if (entry.isIntersecting && fIndex !== -1) {
            setVisibleFeatures((prev) => {
              const newVisible = [...prev];
              newVisible[fIndex] = true;
              return newVisible;
            });
          }
          const sIndex = statsRefs.current.indexOf(entry.target);
          if (entry.isIntersecting && sIndex !== -1) {
            setVisibleStats((prev) => {
              const newVisible = [...prev];
              newVisible[sIndex] = true;
              return newVisible;
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    featureRefs.current.forEach((ref) => ref && observer.observe(ref));
    statsRefs.current.forEach((ref) => ref && observer.observe(ref));

    return () => {
      featureRefs.current.forEach((ref) => ref && observer.unobserve(ref));
      statsRefs.current.forEach((ref) => ref && observer.unobserve(ref));
    };
  }, []);

  const handleVerMasClick = () => {
    if (featuresSectionRef.current) {
      featuresSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-blue-700">
      {/* Primera sección */}
      <section className="min-h-screen p-8 flex flex-col items-center justify-center">
        <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Texto */}
          <div
            className={`text-white space-y-6 max-w-xl transform transition-all duration-1000 ${
              showMain
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}
          >
            <h1 className="text-7xl font-bold leading-tight">
              Sistema de Gestión Integral
            </h1>
            <p className="text-2xl font-light max-w-md">
              Creemos en el impacto humano detrás de cada tecnología
              implementada, lo que nos convierte en un acelerador de
              capacidades. No solo ofrecemos soluciones tecnológicas, sino que
              también construimos el futuro digital del continente con talento
              especializado y constante innovación.
            </p>
            <button
              onClick={handleVerMasClick}
              className="bg-white text-blue-700 font-semibold py-2 px-6 rounded-md hover:bg-gray-100 transition-colors duration-200"
            >
              Ver Más
            </button>
          </div>

          {/* Imagen con realce */}
          <div
            className={`flex justify-center transform transition-all duration-1000 delay-300 ${
              showMain
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
            }`}
          >
           {/* Imagen con realce */}
<div
  className={`flex justify-center transform transition-all duration-1000 delay-300 ${
    showMain ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
  }`}
>
  <img
    src="/pic01.png"
    alt="Illustration"
    className="w-full max-w-md rounded-3xl transition-transform duration-500 hover:scale-105"
  />
</div>
          </div>
        </div>
      </section>

      {/* Segunda sección: features + stats */}
      <section
        ref={featuresSectionRef}
        className="min-h-screen p-8 pt-16 pb-24 bg-blue-700 flex flex-col items-center justify-start"
      >
        {/* Features */}
        <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {features.map(({ title, description }, index) => (
            <div
              key={title}
              ref={(el) => (featureRefs.current[index] = el)}
              className={`bg-white rounded-xl shadow-lg p-10 flex flex-col items-center text-center max-w-md mx-auto transform transition-all duration-700 hover:scale-105 hover:shadow-xl cursor-default ${
                visibleFeatures[index]
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-90 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className="w-16 h-16 bg-blue-200 rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                {title}
              </h3>
              <p className="text-gray-700 text-lg">{description}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl w-full">
          {stats.map(({ value, label, desc, color }, index) => (
            <div
              key={label}
              ref={(el) => (statsRefs.current[index] = el)}
              className={`rounded-xl p-8 bg-white shadow-md transform transition-all duration-700 hover:scale-105 hover:shadow-xl cursor-default ${
                visibleStats[index]
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-90 translate-y-10"
              }`}
              style={{
                transitionDelay: `${index * 200}ms`,
                borderColor: `var(--tw-color-${color}-200)`,
              }}
            >
              <div
                className={`text-4xl font-extrabold text-${color}-600 mb-3`}
              >
                {value}
              </div>
              <div className="text-xl font-semibold text-gray-800 mb-1">
                {label}
              </div>
              <div className="text-gray-500 text-sm">{desc}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
