import { useRecoilState } from "recoil";
import { stateEmpresa } from "../states/states";
import { getAlunoContratos } from "../api/aluno";
import { useQuery } from "react-query";
import { formatarData, formatarMoeda } from "../utils";
import { useNavigate } from "react-router-dom";


function Contratos() {
    const [empresa] = useRecoilState(stateEmpresa);

    const { data: contratos, refetch } = useQuery({
        queryKey: ['contratos', empresa.cod_empresa],
        queryFn: () => getAlunoContratos(null, empresa.cod_empresa),
        initialData: [],
        enabled: !!empresa.cod_empresa,
    });

    return (
        <div className="container-fluid">
            <div className="card shadow-lg rounded-4">
                <div className="card-body">
                    <h5 className="card-title">Contratos</h5>

                    <div className="table-responsive mt-3">
                        <table className="table table-striped table-hover">
                            <tbody>
                                {contratos.map((contrato, index) => (
                                    <CardContrato key={index} alunoContrato={contrato} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

function CardContrato({ alunoContrato }) {
    const navigate = useNavigate();

    function verContrato() {
        navigate('/contrato', { state: { cod_aluno_contrato: alunoContrato?.cod_aluno_contrato, cod_aluno: alunoContrato?.cod_aluno } });
    }

    const rowClass = () => {
        if (alunoContrato?.status_aluno_contrato == 'ACTIVE') return 'border-start border-success';
        if (alunoContrato?.status_aluno_contrato == 'INACTIVE') return 'border-start border-danger';
    }
    
    return (
        <tr className={rowClass()}>
            <td>
                <p className="mb-0 fs-5">{alunoContrato?.nome_aluno_contrato}</p>
                <label>Aluno: <strong>{alunoContrato?.aluno?.nome_aluno}</strong></label>
                
                <div className="d-flex gap-2 mt-3">
                    <button className="btn btn-sm btn-outline-info rounded" onClick={verContrato}>Ver contrato</button>
                    <label className="badge bg-success">{formatarMoeda(alunoContrato?.total_aluno_contrato)}</label>
                    <label className="badge bg-info">{JSON.parse(alunoContrato?.parcela_aluno_contrato).length} Meses</label>
                    <label className="badge bg-warning">Expiração: {formatarData(alunoContrato?.expiracao_aluno_contrato)}</label>
                </div>
            </td>
        </tr>
    )
}

export default Contratos;