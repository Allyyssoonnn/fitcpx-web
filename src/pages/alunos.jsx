import { getAlunos } from "../api/aluno";
import { useNavigate } from "react-router-dom";
import { calcularIdade } from "../utils";
import { useQuery } from "react-query";
import { useRecoilState } from "recoil";
import { stateUsuario } from '../states/states';
import { useMemo, useState } from "react";

function Alunos() {
    const [usuario] = useRecoilState(stateUsuario);
    const [searchTerm, setSearchTerm] = useState("");

    const { data: alunos } = useQuery({
        queryKey: ['alunos', usuario.cod_usuario],
        queryFn: () => getAlunos(usuario.cod_usuario),
        initialData: [],
    });

    const navigate = useNavigate();
    
    const editarAluno = (aluno) => navigate('/cadaluno', { state: { aluno } });

    const filteredAlunos = useMemo(() => {
        return alunos.filter((aluno) =>
            aluno.nome_aluno?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [alunos, searchTerm]);
        
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h4 className="card-title d-none d-md-block">Lista de alunos</h4>
                            <input
                                type="text"
                                className="form-control w-25"
                                placeholder="Pesquisar aluno"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="table-responsive">
                            <table id="basic-datatables" className="display table table-striped table-hover">
                                <tbody>
                                    {filteredAlunos.map((aluno) => {
                                        let idade = calcularIdade(aluno.data_nascimento_aluno);
                                        return (
                                        <tr key={aluno.cod_aluno} onClick={() => navigate('/aluno', { state: { cod_aluno: aluno.cod_aluno } })}>
                                            <th scope="row" className="d-flex align-items-center">
                                                <img
                                                    src={aluno.imagem_aluno ? `${aluno.imagem_aluno}` : 'https://via.placeholder.com/150'}
                                                    alt="Foto do Aluno" 
                                                    className="img-fluid rounded-circle me-3" 
                                                    style={{ width: '50px', height: '50px' }}
                                                    loading="lazy"
                                                />
                                                <div className="col-md-3 d-flex flex-column">
                                                    <label>{aluno.nome_aluno}</label>
                                                    <label className="text-muted">{idade > 0 ? `${idade} anos` : '-'}</label>
                                                </div>
                                            </th>
                                            <td>
                                                <div className="dropdown">
                                                    <button onClick={e => e.stopPropagation()} className="btn border-0" data-bs-toggle="dropdown">
                                                        <i className="bi bi-three-dots-vertical"></i>
                                                    </button>

                                                    <div className="dropdown-menu dropdown-menu-end dropdown-menu-animate-up">
                                                        <a onClick={e => { e.stopPropagation(); editarAluno(aluno) }} href="#" className="d-flex align-items-center gap-2 dropdown-item">
                                                            <i className="bi bi-pencil"></i>
                                                            <p className="mb-0">Editar</p>
                                                        </a>
                                                    </div>
                                                </div>
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