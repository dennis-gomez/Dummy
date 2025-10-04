import React, { useState } from "react";

const PettyCashForm = ({ onAddCashBox }) => {
  const [creationDate, setCreationDate] = useState("");
  const [originalAmount, setOriginalAmount] = useState("");
  const [isActive, setIsActive] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newCashBox = {
      petty_cash_creation_date: creationDate,
      petty_cash_original_amount: parseFloat(originalAmount),
      petty_cash_actual_amount: parseFloat(originalAmount), // inicia igual al original
      petty_cash_is_active: isActive ? 1 : 0,
    };

    onAddCashBox(newCashBox);

    // limpiar
    setCreationDate("");
    setOriginalAmount("");
    setIsActive(true);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Fecha de creación */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Fecha de Creación
        </label>
        <input
          type="date"
          value={creationDate}
          onChange={(e) => setCreationDate(e.target.value)}
          required
          className="w-full rounded px-3 py-2 bg-white"
        />
      </div>

      {/* Monto inicial */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Monto Inicial
        </label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={originalAmount}
          onChange={(e) => setOriginalAmount(e.target.value)}
          required
          className="w-full rounded px-3 py-2 bg-white"
        />
      </div>

      {/* Activo */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="bg-white"
        />
        <label className="text-sm font-medium text-gray-700">Caja Activa</label>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Crear Caja Chica
      </button>
    </form>
  );
};

export default PettyCashForm;
