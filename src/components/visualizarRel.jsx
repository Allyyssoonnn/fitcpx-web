import { AgGridReact } from "ag-grid-react";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { useStateApp } from "../states/states";

function VisualizarRel({ data = [], setData }) {
    const { theme } = useStateApp();
    const [searchTerm, setSearchTerm] = useState("");
    const [gridApi, setGridApi] = useState();
    
    const close = () => setData([]);

    if (!data) return;
    
    return (
        <div className="container-fluid">

            <div className="card">
                <div className="card-header">
                    <div className="d-flex justify-content-between align-items-center">
                        <button onClick={close} className="btn btn-danger">Voltar</button>

                        <div className="col-md-3 col-12">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Pesquisar aluno"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="d-flex align-items-center justify-content-end mt-3 gap-3">
                        <button onClick={() => gridApi.exportDataAsExcel()} className="btn btn-info">
                            <i className="bi bi-printer"></i>
                            <span className="d-none d-md-inline-block ms-2">Imprimir</span>
                        </button>
                        <button onClick={() => gridApi.exportDataAsExcel()} className="btn btn-info">
                            <i className="bi bi-download"></i>
                            <span className="d-none d-md-inline-block ms-2">Exportar</span>
                        </button>
                    </div>                    
                </div>

                <div className="card-body" >
                    <div className="row">
                        <div className="col-12">
                            <AgGridReact
                                rowData={data}
                                columnDefs={Object.keys(data[0]).map((key) => ({
                                    field: key, // Mantém o nome original para mapear corretamente os dados
                                    headerName: key
                                        .replace(/_/g, " ") // Substitui _ por espaço
                                        .replace(/\b\w/g, (char) => char.toUpperCase()) // Primeira letra maiúscula
                                        .replace("Aluno", "")
                                        .replace("Usuario", "")
                                        .toUpperCase(), // Converte o cabeçalho final para maiúsculas
                                }))}
                                domLayout="autoHeight"
                                className={`${theme == 'light' ? 'ag-theme-quartz' : 'ag-theme-quartz-dark'}`}
                                quickFilterText={searchTerm}
                                onGridReady={params => setGridApi(params.api)}
                                headerHeight={30}
                                rowHeight={30}
                            />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default VisualizarRel;