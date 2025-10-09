import React, { useState } from "react";

const SupplierForm = ({ onAddSupplier }) => {
  const [supplierName, setSupplierName] = useState("");
  const [supplierDate, setSupplierDate] = useState("");
  const [supplierPhone, setSupplierPhone] = useState("");
  const [supplierEmail, setSupplierEmail] = useState("");
  const [isActive, setIsActive] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newSupplier = {
      supplier_name: supplierName,
      supplier_date: supplierDate,
      supplier_phone: supplierPhone || null,
      supplier_email: supplierEmail || null,
      supplier_is_active: isActive ? 1 : 0,
    };

    onAddSupplier(newSupplier);

    // limpiar formulario
    setSupplierName("");
    setSupplierDate("");
    setSupplierPhone("");
    setSupplierEmail("");
    setIsActive(true);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-300 shadow-md rounded-2xl p-6 space-y-4 max-w-md mx-auto"
    >
      <h2 className="text-lg font-semibold text-gray-700 text-center mb-4">
        Registrar Nuevo Proveedor
      </h2>

      {/* Nombre */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre del Proveedor
        </label>
        <input
          type="text"
          value={supplierName}
          onChange={(e) => setSupplierName(e.target.value)}
          required
          className="w-full rounded px-3 py-2 border bg-white focus:ring-2 focus:ring-blue-500"
          placeholder="Ej: Proveedor XYZ"
        />
      </div>

      {/* Fecha */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fecha de Registro
        </label>
        <input
          type="date"
          value={supplierDate}
          onChange={(e) => setSupplierDate(e.target.value)}
          required
          className="w-full rounded px-3 py-2 border bg-white focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Teléfono */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Teléfono
        </label>
        <input
          type="text"
          value={supplierPhone}
          onChange={(e) => setSupplierPhone(e.target.value)}
          placeholder="Ej: 8888-8888"
          className="w-full rounded px-3 py-2 border bg-white focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Correo Electrónico
        </label>
        <input
          type="email"
          value={supplierEmail}
          onChange={(e) => setSupplierEmail(e.target.value)}
          placeholder="Ej: proveedor@mail.com"
          className="w-full rounded px-3 py-2 border bg-white focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Activo */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="accent-blue-600"
        />
        <label className="text-sm font-medium text-gray-700">
          Proveedor Activo
        </label>
      </div>

      {/* Botón */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Crear Proveedor
      </button>
    </form>
  );
};

export default SupplierForm;
