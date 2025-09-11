const styles = `
  .tabla {
    border-collapse: collapse;
    width: 100%;       /* <-- importante para Flex */
    margin: 0;         /* <-- sin auto-centro */
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  .tabla th, .tabla td {
    border: 1px solid #e0e0e0;
    padding: 10px 14px;
    text-align: left;
    color: #000;
  }
  .tabla thead th {
    background: #1976d2;
    color: #fff;
    font-weight: 600;
  }
  .fila { cursor: pointer; }
  .fila:hover { background: #e3f2fd; }
  .th-yellow { background: #fff176; color: #000; font-weight: 700; }
  .selected { outline: 2px solid #1976d2; }
  .titulo { margin: 0 0 8px; font-weight: 600; }
`;

function TableMiscellaneousPage({ services, onSelect, selectedId }) {
  return (
    <>
      <style>{styles}</style>
      <div className="titulo">Servicios</div>

      <table className="tabla" aria-label="Tabla de Categorías">
        <thead>
          <tr>
            <th className="th-yellow" style={{ width: 110 }}>codigo servicio</th>
            <th>servicio</th>
          </tr>
        </thead>
        <tbody>
          {services.map((cat) => (
            <tr
              key={cat.cod_service}
              className={`fila ${selectedId === cat.cod_service ? "selected" : ""}`}
              onClick={() => {onSelect(cat.cod_service)}}
              aria-selected={selectedId === cat.cod_service}
            >
              <td>{cat.cod_service}</td>
              <td>{cat.service_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default TableMiscellaneousPage;
