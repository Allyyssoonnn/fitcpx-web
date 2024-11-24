import { getAlunos } from "../api/aluno";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { calcularIdade } from "../utils";
import { useQuery } from "react-query";
import { useRecoilState } from "recoil";
import { stateUsuario } from '../states/states';

function Alunos() {
    const [usuario] = useRecoilState(stateUsuario);

    const { data: alunos } = useQuery({
        queryKey: ['alunos', usuario.cod_usuario],
        queryFn: () => getAlunos(usuario.cod_usuario),
        initialData: [],
    });

    const navigate = useNavigate();
    
    const editarAluno = (aluno) => navigate('/cadaluno', { state: { aluno } });

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="card-title">Lista de alunos</h4>
                        </div>

                        <div className="table-responsive">
                            <table id="basic-datatables" className="display table table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th>Aluno</th>
                                        <th>Editar</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {alunos.map((aluno) => {
                                        let idade = calcularIdade(aluno.data_nascimento_aluno);
                                        return (
                                        <tr key={aluno.cod_aluno} onClick={() => navigate('/aluno', { state: { cod_aluno: aluno.cod_aluno } })}>
                                            <th scope="row" className="d-flex align-items-center">
                                                <img
                                                    src="https://via.placeholder.com/150" 
                                                    alt="Foto do Aluno" 
                                                    className="img-fluid rounded-circle me-3" 
                                                    style={{ width: '50px', height: '50px' }} 
                                                />
                                                <div className="col-md-3 d-flex flex-column">
                                                    <label>{aluno.nome_aluno}</label>
                                                    <label className="text-muted">{idade > 0 ? `${idade} anos` : '-'}</label>
                                                </div>
                                            </th>
                                            <td>
                                                <Button className="btn btn-white btn-sm" onClick={() => editarAluno(aluno)}>
                                                    <i className="bi bi-pencil"></i>
                                                </Button>
                                            </td>
                                        </tr>
                                    )})}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Alunos;