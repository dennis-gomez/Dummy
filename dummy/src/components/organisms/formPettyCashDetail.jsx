import React, { useState } from "react";

const PettyCashDetailForm = ({ cashBoxId, onAddDetail }) => {
  const [provider, setProvider] = useState("");
  const [requester, setRequester] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const newDetail = {
      petty_cash_details_date: new Date().toISOString().split("T")[0], // fecha actual
      petty_cash_details_provider: provider,
      petty_cash_details_requester: requester,
      petty_cash_details_description: description,
      petty_cash_details_amount: amount ? parseFloat(amount) : 0,
      petty_cash_details_is_active: true,
      petty_cash_cod: cashBoxId, // relación con caja chica padre
    };

    onAddDetail(newDetail);

    // limpiar
    setProvider("");
    setRequester("");
    setDescription("");
    setAmount("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-bold text-gray-800 text-center">
        Registro de movimiento de Caja #{cashBoxId}
      </h2>

      {/* Proveedor */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Proveedor de caja chica
        </label>
        <input
          type="text"
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
          placeholder="Ingrese el actual proveedor de la caja chica"
          required
          className="w-full rounded px-3 py-2 bg-white"
        />
      </div>

      {/* Solicitante */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Solicitante del movimiento
        </label>
        <input
          type="text"
          value={requester}
          onChange={(e) => setRequester(e.target.value)}
          placeholder="Ingrese el solicitante del movimiento"
          required
          className="w-full rounded px-3 py-2 bg-white"
        />
      </div>

      {/* Detalle */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Detalle de movimiento
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ingrese el motivo del movimiento"
          required
          className="w-full rounded px-3 py-2 bg-white"
        />
      </div>

      {/* Monto */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Monto de movimiento (₡)
        </label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Ingrese un monto"
          required
          className="w-full rounded px-3 py-2 bg-white"
        />
      </div>

      {/* Botón */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Agregar Registro
      </button>
    </form>
  );
};

export default PettyCashDetailForm;
