import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// componentes
import Button from "../atoms/button";
import Seeker from "../molecules/seeker";
import PettyCashDetailTable from "../organisms/tablePettyCashDetail";
import PettyCashDetailForm from "../organisms/formPettyCashDetail";

// servicios
import {
  getAllPettyCashDetails,
  createPettyCashDetail,
  updatePettyCashDetail,
  deletePettyCashDetail,
  searchPettyCashDetails
} from "../../services/pettyCashDetailService";

function PettyCashDetailPage() {
  const { cashBoxId } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // búsqueda
  const [searchText, setSearchText] = useState("");
  const [searchFeature, setSearchFeature] = useState("petty_cash_details_date");

  useEffect(() => {
    if (cashBoxId) {
      fetchDetails();
    }
  }, [cashBoxId]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const data = await getAllPettyCashDetails(cashBoxId);
      setDetails(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Error al cargar movimientos");
      setDetails([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchText.trim()) {
      fetchPettyCashDetails();
      return;
    }
    try {
      setLoading(true);
      let formattedSearch = searchText.trim();

      // 🗓 Normalizar fecha (acepta DD/MM/YY o DD-MM-YYYY)
      if (searchFeature === "petty_cash_details_date") {
        const match = formattedSearch.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{2,4})$/);
        if (match) {
          let [_, day, month, year] = match;
          if (year.length === 2) year = "20" + year;
          formattedSearch = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
        }
      }

      // 🔁 Mapear al nombre que espera el backend
      const fieldMap = {
        petty_cash_details_date: "movement_date",
        petty_cash_details_amount: "movement_amount",
        petty_cash_details_description: "movement_description",
        petty_cash_details_provider: "movement_provider",
        petty_cash_details_requester: "movement_requester",
        petty_cash_details_is_active: "movement_is_active"
      };
      const backendField = fieldMap[searchFeature] || searchFeature;

      // 🔸 Llamada al backend
      const data = await searchPettyCashDetails(backendField, formattedSearch);
      setDetails(data);
    } catch (err) {
      console.error("Error en búsqueda de detalles:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!searchText.trim()) {
      fetchDetails();
    }
  }, [searchText]);

  const handleAddDetail = async (detail) => {
    try {
      await createPettyCashDetail(detail);
      fetchDetails();
      setShowForm(false);
    } catch (err) {
      setError(err.message || "Error al crear movimiento");
    }
  };

  const handleEditDetail = async (id, updatedDetail) => {
    try {
      await updatePettyCashDetail(id, updatedDetail);
      fetchDetails();
    } catch (err) {
      setError(err.message || "Error al editar movimiento");
    }
  };

  const handleDeleteDetail = async (id) => {
    try {
      await deletePettyCashDetail(id);
      fetchDetails();
    } catch (err) {
      setError(err.message || "Error al eliminar movimiento");
    }
  };

  return (
    <div style={{ padding: 24 }}>
      {/* Botón volver */}
      <Box sx={{ mb: 3 }}>
        <IconButton
          onClick={() => navigate("/caja/gestion")}
          sx={{ color: "primary.main" }}
        >
          <ArrowBackIcon />
        </IconButton>
        <span style={{ marginLeft: 8 }}>Volver a Cajas Chicas</span>
      </Box>

      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Movimientos de Caja Chica #{cashBoxId}
      </h1>

      {/* Mensaje de error */}
      {error && (
        <div className="p-2 mb-4 bg-red-100 text-red-600 rounded-md text-center">
          {error}
        </div>
      )}

      {/* Formulario de movimiento (arriba del buscador) */}
      {showForm && (
        <Box
          sx={{
            maxWidth: 800,
            margin: "20px auto",
            p: 3,
            boxShadow: 3,
            borderRadius: 2,
            backgroundColor: "#d9d9d9",
          }}
        >
          <PettyCashDetailForm
            onAddDetail={handleAddDetail}
            cashBoxId={cashBoxId}
          />
        </Box>
      )}

      {/* Buscador + Botón */}
      <div className="flex flex-col lg:flex-row gap-4 w-full max-w-5xl mx-auto mb-4 mt-6">
        <Box className="flex flex-wrap gap-3 bg-white rounded-xl p-4 flex-1">
          <Seeker
            inputName="search"
            inputPlaceholder="Buscar detalle..."
            btnName="Buscar"
            selectName="Filtrar por"
            fields={[
              { name: "petty_cash_details_date", placeholder: "Fecha (DD-MM-YYYY)" },
              { name: "petty_cash_details_provider", placeholder: "Proveedor" },
              { name: "petty_cash_details_description", placeholder: "Descripción" },
              { name: "petty_cash_details_requester", placeholder: "Solicitante" },
              { name: "petty_cash_details_amount", placeholder: "Monto" },
              { name: "petty_cash_details_is_active", placeholder: "Activo (true/false)" },
            ]}
            valueText={searchText}
            valueFeature={searchFeature}
            onChangeText={setSearchText}
            onChangeFeature={setSearchFeature}
            onClick={handleSearch}
          />

        </Box>

        <div className="flex items-center justify-center lg:justify-start w-full sm:w-auto">
          <div className="p-4 h-fit">
            <Button
              text={showForm ? "Cancelar" : "Agregar Movimiento"}
              onClick={() => setShowForm(!showForm)}
              className="h-12 w-full sm:w-48 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Tabla de detalles */}
      <PettyCashDetailTable
        details={details}
        isLoading={loading}
        onDelete={handleDeleteDetail}
        onEdit={handleEditDetail}
      />
    </div>
  );
}

export default PettyCashDetailPage;
