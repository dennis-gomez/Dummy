import { useState } from "react";

function TableOptionServices() {
  const [boolean, setBoolean] = useState(false);
  const [text, setText] = useState("");

  const gestionarOpciones = (id) => {
    if (id !== 1) {
      setText("Muestro areas");
      setBoolean(true);
    } else {
      setText("Muestro categorias");
      setBoolean(true);
    }
  };

  const areas = [
    { id: 1, nombre: "Areas" },
    { id: 2, nombre: "Categorias" },
  ];

  return (
    <div>
      <style>{`
        .custom-table {
          border-collapse: collapse;
          width: 60%;
          margin: 30px auto;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          background: #fff;
          border-radius: 8px;
          overflow: hidden;
          color: #000; /* Aplica texto negro a toda la tabla */
        }
        .custom-table th, .custom-table td {
          border: 1px solid #e0e0e0;
          padding: 12px 18px;
          text-align: left;
        }
        .custom-table th {
          background: #1976d2;
          color: #fff; /* Cambié el texto del encabezado a blanco para que contraste */
          font-weight: 600;
        }
        .custom-table tr:nth-child(even) {
          background: #f5f5f5;
        }
        .custom-table tr:hover {
          background: #e3f2fd;
        }
        .custom-btn {
          background: #1976d2;
          color: #fff;
          border: none;
          border-radius: 4px;
          padding: 8px 16px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .custom-btn:hover {
          background: #1565c0;
        }
        .centered {
          text-align: center;
        }
      `}</style>

      <table className="custom-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Área</th>
          </tr>
        </thead>
        <tbody>
          {areas.map((area, index) => (
            <tr key={area.id}>
              <td className="centered">{index + 1}</td>
              <td className="centered">
                <button
                  className="custom-btn"
                  onClick={() => gestionarOpciones(index)}
                >
                  {area.nombre}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        {boolean && <p>{text}</p>}
      </div>
    </div>
  );
}

export default TableOptionServices;
