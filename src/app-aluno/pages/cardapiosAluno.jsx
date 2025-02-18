import { useRecoilState } from "recoil";
import { stateAluno } from "../../states/states";
import { getCardapios } from "../../api/cardapio";
import { useQuery } from 'react-query';
import { useNavigate } from "react-router-dom";
import { calcularIdade, dataURLToBlob, formatarData, getSexo } from "../../utils";

function CardapiosAluno() {
    const [aluno] = useRecoilState(stateAluno);

    const { data: cardapios, refetch } = useQuery({
            queryKey: ['cardapios'],
            queryFn: () => getCardapios({ cod_aluno: aluno.cod_aluno }),
            initialData: [],
            enabled: !!aluno.cod_aluno
        });

    return (
        <div className="container-fluid">
            <div className="row g-3">
                <div className="card">
                
                </div>

                <div className="card-body">
                    {cardapios.map((cardapio, index) => (
                        <CardCardapio key={index} cardapio={cardapio} aluno={aluno} refetch={refetch} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function CardCardapio({ cardapio, aluno, refetch }) {
    const navigate = useNavigate();

    return (
        <div className='card shadow-sm rounded-3 border-0 bg-white mt-4'>
            <div style={{ borderTop: '0.30rem solid #85D446' }} className='card-body rounded-3'>
                <h5 className="card-title">{cardapio.nome_cardapio}</h5>

                <div className='row'>
                    <div className='col-md-3'>
                        <strong>Responsável:</strong> {cardapio.usuario?.nome_usuario}
                    </div>
                    <div className='col-md-3'>
                        <strong></strong> {cardapio?.refeicoes?.length} {cardapio?.refeicoes?.length > 1 ? 'Refeições' : 'Refeição'}
                    </div>
                </div>
            </div>

            <div className='card-footer bg-light d-flex justify-content-around py-3'>
                <button
                    className="btn btn-warning d-flex align-items-center"
                    onClick={() => navigate('/avaliacao', { state: { treino, aluno } })}
                >
                    <i className="bi bi-printer me-2"></i> Ver cardápio
                </button>
            </div>
        </div>
    )
}

export default CardapiosAluno;