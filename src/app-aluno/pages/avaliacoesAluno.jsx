import { useRecoilState } from "recoil";
import { stateAluno } from "../../states/states";
import { getAvaliacoes } from "../../api/aluno";
import { useQuery } from 'react-query';
import { useNavigate } from "react-router-dom";
import { calcularIdade, dataURLToBlob, formatarData, getSexo } from "../../utils";

function AvaliacoesAluno() {
    const [aluno] = useRecoilState(stateAluno);

    const { data: avaliacoes, refetch } = useQuery({
        queryKey: ['avaliacoes', aluno.cod_aluno],
        queryFn: () => getAvaliacoes(null, aluno.cod_aluno),
        initialData: [],
        enabled: !!aluno.cod_aluno,
    });
        
    return (
        <div className="container-fluid">
            <div className="row g-3">
                <div className="card">
                
                </div>

                <div className="card-body">
                    {avaliacoes?.sort((a, b) => new Date(b.data_avaliacao) - new Date(a.data_avaliacao))
                    .map((avaliacao, index) => (
                        <CardAvaliacao key={index} avaliacao={avaliacao} aluno={aluno} refetch={refetch} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function CardAvaliacao({ avaliacao, aluno, refetch }) {
    const navigate = useNavigate();

    return (
        <div className="card shadow-sm rounded-3 border-0 bg-white mt-4 text-center">
            <div style={{ borderTop: '0.30rem solid #85D446' }} className="card-body rounded-3">
                <h5 className="card-title">Avaliação Física</h5>
                <div className="row">
                    <div className="col-md-4">
                        <strong>Data:</strong> {formatarData(avaliacao.data_avaliacao)}
                    </div>
                    <div className="col-md-4">
                        <strong>Altura:</strong> {avaliacao.altura} m
                    </div>
                    <div className="col-md-4">
                        <strong>Peso:</strong> {avaliacao.peso} kg
                    </div>
                </div>
            </div>

            <div className="card-footer bg-light d-flex justify-content-around py-3">
                <button
                    className="btn btn-warning d-flex align-items-center"
                    onClick={() => navigate('/avaliacao', { state: { avaliacao, aluno } })}
                >
                    <i className="bi bi-printer me-2"></i> Ver resultado
                </button>
            </div>
        </div>
    )
}

export default AvaliacoesAluno;