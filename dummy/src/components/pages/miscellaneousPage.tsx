import React, { useState } from "react";

function MiscellaneousPage() {

const [boolean, setBoolean] = useState(false);

    return (
        <>

<div>
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
                    }
                    .custom-table th, .custom-table td {
                        border: 1px solid #e0e0e0;
                        padding: 12px 18px;
                        text-align: left;
                    }
                    .custom-table th {
                        background: #1976d2;
                        color: #fff;
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
                `}</style>
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Codigo</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>
                                <button className="custom-btn" onClick={() => { setBoolean(!boolean); }}>Mantenimiento preventivo</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

{boolean && (
<div>

hola Xd inserte tabla aqui

</div>


)}

        </div>
        </>
    );
}

export default MiscellaneousPage;