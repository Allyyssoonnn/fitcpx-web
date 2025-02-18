import { useRecoilState } from "recoil";
import { stateAluno } from "../../states/states";
import { getTreinos } from "../../api/treino";
import { useQuery } from 'react-query';
import { useNavigate } from "react-router-dom";
import { calcularIdade, dataURLToBlob, formatarData, getSexo } from "../../utils";

function TreinosAluno() {
    const [aluno] = useRecoilState(stateAluno);

    const { data: treinos, refetch } = useQuery({
        queryKey: ['treinos', aluno.cod_aluno],
        queryFn: () => getTreinos({ cod_aluno: aluno.cod_aluno }),
        initialData: [],
        enabled: !!aluno.cod_aluno,
    });

    return (
        <div className="container-fluid">
            <div className="row g-3">
                <div className="card">
                
                </div>

                <div className="card-body">
                    {treinos?.map((treino, index) => (
                        <CardTreino key={index} treino={treino} aluno={aluno} refetch={refetch} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function CardTreino({ treino, aluno, refetch }) {
    const navigate = useNavigate();

    return (
        <div className='card shadow-sm rounded-3 border-0 bg-white mt-4'>
            <div style={{ borderTop: '0.30rem solid #85D446' }} className='card-body rounded-3'>
                <h5 className="card-title">{treino.nome_treino}</h5>

                <div className='row'>
                    <div className='col-md-3'>
                        <strong>Responsável:</strong> {treino.usuario?.nome_usuario}
                    </div>
                    <div className='col-md-3'>
                        <strong>Nível:</strong> {treino.nivel_treino}
                    </div>
                    <div className='col-md-3'>
                        <strong>Sexo:</strong> {getSexo(treino.sexo_treino)}
                    </div>
                    <div className='col-md-3'>
                        <strong></strong> {treino?.sessoes?.length} {treino?.sessoes?.length > 1 ? 'Sessões' : 'Sessão'}
                    </div>
                </div>
            </div>

            <div className='card-footer bg-light d-flex justify-content-around py-3'>
                <button
                    className="btn btn-warning d-flex align-items-center"
                    onClick={() => navigate('/avaliacao', { state: { treino, aluno } })}
                >
                    <i className="bi bi-printer me-2"></i> Ver treino
                </button>
            </div>
        </div>
    )
}

export default TreinosAluno;