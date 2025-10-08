import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Button from "../atoms/button";
import Seeker from "../molecules/seeker";
import PettyCashForm from "../organisms/formPettyCash";
import PettyCashTable from "../organisms/tablePettyCash";
import { useNavigate } from "react-router-dom";

// servicios
import {
  getAllPettyCash,
  createPettyCash,
  updatePettyCash,
  deletePettyCash,
  searchPettyCash, // ✅ agregado para el buscador
} from "../../services/pettyCashService";

function PettyCashPage() {
  const [cashBoxes, setCashBoxes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchFeature, setSearchFeature] = useState("petty_cash_creation_date");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // cargar cajas chicas al inicio
  useEffect(() => {
    fetchCashBoxes();
  }, []);

  const fetchCashBoxes = async () => {
    try {
      setLoading(true);
      const data = await getAllPettyCash();
      setCashBoxes(data);
    } catch (err) {
      setError(err.message || "Error al cargar cajas chicas");
    } finally {
      setLoading(false);
    }
  };


 // 🔍 Buscar caja chica por campo y texto (acepta DD-MM-YY o DD/MM/YY)
const handleSearch = async () => {
  if (!searchText.trim()) {
    fetchCashBoxes();
    return;
  }

  try {
    setLoading(true);

    let formattedSearch = searchText.trim();

    // 🧩 Si estamos buscando por fecha, normalizamos formato
    if (searchFeature === "petty_cash_creation_date") {
      // Acepta DD-MM-YY o DD/MM/YY
      const match = formattedSearch.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{2,4})$/);
      if (match) {
        let [_, day, month, year] = match;
        if (year.length === 2) year = "20" + year; // convierte "25" → "2025"
        formattedSearch = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`; // → YYYY-MM-DD
      }
    }

    // 🔸 Llamamos al servicio con el texto normalizado
    const data = await searchPettyCash(searchFeature, formattedSearch);
    setCashBoxes(data);
  } catch (err) {
    setError(err.message || "Error al buscar caja chica");
  } finally {
    setLoading(false);
  }
};
  // opcional: restaurar lista cuando se limpia el campo de búsqueda
  useEffect(() => {
    if (!searchText.trim()) {
      fetchCashBoxes();
    }
  }, [searchText]);

  // Agregar caja chica
  const handleAdd = async (newCashBox) => {
    try {
      await createPettyCash(newCashBox);
      fetchCashBoxes();
      setShowForm(false);
    } catch (err) {
      setError(err.message || "Error al crear caja chica");
    }
  };

  // Eliminar caja chica
  const handleDelete = async (id) => {
    try {
      await deletePettyCash(id);
      fetchCashBoxes();
    } catch (err) {
      setError(err.message || "Error al eliminar caja chica");
    }
  };

  // Editar caja chica
  const handleEdit = async (id, updatedBox) => {
    try {
      await updatePettyCash(id, updatedBox);
      fetchCashBoxes();
    } catch (err) {
      setError(err.message || "Error al actualizar caja chica");
    }
  };

  // Navegar a página de detalles
  const handleViewRecords = (id) => {
    navigate(`/caja/registros-desembolsos/${id}`);
  };

  return (
    <div style={{ padding: 24 }}>
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Gestión de Cajas Chicas
      </h1>

      {/* Mensaje de error */}
      {error && (
        <div className="p-2 mb-4 bg-red-100 text-red-600 rounded-md text-center">
          {error}
        </div>
      )}

      {/* Formulario */}
      {showForm && (
        <Box
          sx={{
            maxWidth: 900,
            margin: "20px auto",
            p: 3,
            boxShadow: 3,
            borderRadius: 2,
            backgroundColor: "#d9d9d9",
            textAlign: "center",
          }}
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            Crear Caja Chica
          </h3>
          <div className="p-4 rounded-xl">
            <PettyCashForm onAddCashBox={handleAdd} />
          </div>
        </Box>
      )}

      {/* Buscador + Botón */}
      <div className="flex flex-col lg:flex-row gap-4 w-full max-w-5xl mx-auto mb-4 mt-6">
        <Box className="flex flex-wrap gap-3 bg-white rounded-xl p-4 flex-1">
          <Seeker
            inputName="search"
            inputPlaceholder="Buscar caja chica..."
            btnName="Buscar"
            selectName="Filtrar por"
            fields={[
              { name: "petty_cash_creation_date", placeholder: "Fecha (DD-MM-YYYY)" },
              { name: "petty_cash_original_amount", placeholder: "Monto original" },
              { name: "petty_cash_actual_amount", placeholder: "Monto actual" },
            ]}
            valueText={searchText}
            valueFeature={searchFeature}
            onChangeText={setSearchText}
            onChangeFeature={setSearchFeature}
            onClick={handleSearch} // ✅ ahora funcional
          />
        </Box>

        <div className="flex items-center justify-center lg:justify-start w-full sm:w-auto">
          <div className="p-4 h-fit">
            <Button
              text={showForm ? "Cancelar" : "Agregar Caja Chica"}
              onClick={() => setShowForm(!showForm)}
              className="h-12 w-full sm:w-48 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Tabla principal */}
      <PettyCashTable
        cashBoxes={cashBoxes}
        isLoading={loading}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onViewRecords={handleViewRecords}
      />
    </div>
  );
}

export default PettyCashPage;
