import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { getAlunos, getAvaliacoes } from "../api/aluno";
import { getUsuarios } from "../api/usuario";
import { getTreinos } from "../api/treino";
import { stateUsuario } from "../states/states";
import { useRecoilState } from "recoil";
import { useState } from "react";
import VisualizarRel from "../components/visualizarRel";
import { formatarData } from "../utils";

const removeObjetosArray = (data) => {
    // Identificar todas as chaves presentes em pelo menos um objeto
    const allKeys = new Set(data.flatMap(obj => Object.keys(obj)));

    return data.map(obj => {
        let newObj = {};
        allKeys.forEach(key => {
            // Se o valor for um objeto (mas não for null) ou um array, remover
            if ((typeof obj[key] === 'object' && obj[key] !== null) || Array.isArray(obj[key])) return;
            
            // Se a chave contém "cod" ou "imagem", remover
            if (key.includes('cod') || key.includes('imagem') || key.includes('createdAt') || key.includes('updatedAt') || key.includes('deletedAt')) return;

            if (obj[key] instanceof Date || key.includes('data')) {
                // Formatar a data usando toLocaleString
                newObj[key] = formatarData(obj[key]);
                return;
            }

            // Manter valores nulos ou undefined
            newObj[key] = obj[key];
        });
        return newObj;
    });
};

function Relatorios() {
    const [usuario] = useRecoilState(stateUsuario);

    const [data, setData] = useState([]);

    async function exportar(tipo) {
        var data = [];
        
        //Alunos
        if (tipo == 'Alunos') data = removeObjetosArray(await getAlunos(usuario.cod_usuario, usuario.cod_empresa));
        if (tipo == 'Avaliações') data = removeObjetosArray(await getAvaliacoes(usuario.cod_empresa));
        //Usuários
        if (tipo == 'Usuários') data = removeObjetosArray(await getUsuarios(usuario.cod_empresa));
        //Treinos
        if (tipo == 'Treinos') data = removeObjetosArray(await getTreinos({ cod_empresa: usuario.cod_empresa }));

        setData(data);

        // Criar a planilha
        // const worksheet = XLSX.utils.json_to_sheet(data);
        // const workbook = XLSX.utils.book_new();
        // XLSX.utils.book_append_sheet(workbook, worksheet, "Planilha1");

        // Criar o arquivo e baixar
        // const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        // const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });

        // saveAs(fileData, `${tipo}.xlsx`);
    }

    if (data.length) return <VisualizarRel data={data} setData={setData} />

    return (
        <div className="container-fluid">
            <div className="card shadow-lg rounded-4">
                <div className="card-header">
                    <h4 className="card-title">Relatórios</h4>
                </div>

                <div className="card-body row gap-3 text-center justify-content-center">

                    <div className="card col-md-3 shadow p-0">
                        <div className="card-header bg-success-subtle">
                            <i className="bi bi-person-lines-fill fs-6"></i>
                            <h6 className="card-title">Alunos</h6>
                        </div>

                        <div className="card-body d-flex flex-column gap-2">
                            <a className="d-flex justify-content-between">
                                Lista de alunos
                                <button onClick={() => exportar('Alunos')} className="btn btn-sm btn-success ms-2">Visualizar</button>
                            </a>
                            <a className="d-flex justify-content-between">
                                Lista de avaliações
                                <button onClick={() => exportar('Avaliações')} className="btn btn-sm btn-success ms-2">Visualizar</button>
                            </a>
                        </div>
                    </div>

                    <div className="card col-md-3 shadow p-0">
                        <div className="card-header bg-primary-subtle">
                            <i className="bi bi-person-lines-fill fs-6"></i>
                            <h6 className="card-title">Usuários</h6>
                        </div>

                        <div className="card-body d-flex flex-column">
                            <a className="d-flex justify-content-between">
                                Lista de usuários
                                <button onClick={() => exportar('Usuários')} className="btn btn-sm btn-success ms-2">Visualizar</button>
                            </a>
                        </div>
                    </div>

                    {/* <div className="card col-md-3 shadow p-0">
                        <div className="card-header bg-info-subtle">
                            <i className="bi bi-calendar-check-fill fs-6"></i>
                            <h6 className="card-title">Agenda</h6>
                        </div>

                        <div className="card-body d-flex flex-column">

                        </div>
                    </div> */}

                    {/* <div className="card col-md-3 shadow p-0">
                        <div className="card-header bg-secondary-subtle">
                            <i className="bi bi-cash fs-6"></i>
                            <h6 className="card-title">Financeiro</h6>
                        </div>

                        <div className="card-body d-flex flex-column">

                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default Relatorios;