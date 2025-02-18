import { deleteAluno, getAlunos, recoveryAluno } from "../api/aluno";
import { useNavigate } from "react-router-dom";
import { calcularIdade } from "../utils";
import { useQuery } from "react-query";
import { useRecoilState } from "recoil";
import { stateUsuario } from '../states/states';
import { useEffect, useMemo, useState } from "react";

function Alunos() {
    const [usuario] = useRecoilState(stateUsuario);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("A");
    const [deleted, setDeleted] = useState(false);

    const { data: alunos, refetch } = useQuery({
        queryKey: ['alunos', usuario.cod_usuario],
        queryFn: () => getAlunos(usuario.cod_usuario, usuario.cod_empresa, deleted),
        initialData: [],
        enabled: !!usuario.cod_empresa,
    });

    useEffect(() => {
        refetch();
    }, [deleted]);

    const navigate = useNavigate();
    
    const editarAluno = (aluno) => navigate('/cadaluno', { state: { aluno } });

    const filteredAlunos = useMemo(() => {
        return alunos.filter((aluno) =>
            searchTerm.toLowerCase().split(" ").filter(Boolean).every(word =>
            aluno.nome_aluno?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(word)) &&
            aluno.status_aluno === statusFilter
        )
    }, [alunos, searchTerm, statusFilter]);

    const delAlun = async (cod_aluno) => {
        await deleteAluno(cod_aluno);
        refetch();
    }

    const recoveryAlun = async (cod_aluno) => {
        await recoveryAluno(cod_aluno);
        refetch();
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h4 className="card-title d-none d-md-block">Lista de alunos</h4>
                                    <label>{filteredAlunos?.length} Alunos</label>
                                </div>

                                <div className="col-md-3 col-8">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Pesquisar aluno"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="d-flex align-items-center justify-content-between mt-3">
                                <div className="col-md-3 col-6">
                                    <div>
                                        <input checked={deleted} onClick={() => setDeleted(!deleted)} className="form-checkbox-control" type="checkbox" id="deleted" />
                                        <label className="form-label ms-1" htmlFor="deleted">Registros deletados</label>
                                    </div>
                                    
                                    <div>
                                        <label className="form-label fw-bold">Status</label>
                                        <select className="form-control" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                                            <option value="A">Ativos</option>
                                            <option value="I">Inativos</option>
                                            <option value="B">Bloqueados</option>
                                        </select>
                                    </div>
                                </div>

                                <button className="btn btn-success" onClick={() => navigate('/cadaluno')}>
                                    <i className="bi bi-plus-circle me-2"></i>
                                    Novo aluno
                                </button>
                            </div>
                        </div>

                        <div className="table-responsive">
                            <table id="basic-datatables" className="display table table-striped table-hover">
                                <tbody>
                                    {!filteredAlunos?.length ? <h5 className="text-center">Nenhum aluno cadastrado</h5> : <></>}
                                    {filteredAlunos.map((aluno) => {
                                        let idade = calcularIdade(aluno.data_nascimento_aluno);
                                        return (
                                        <tr key={aluno.cod_aluno} onClick={() => navigate('/aluno', { state: { cod_aluno: aluno.cod_aluno } })}>
                                            <th scope="row" className="d-flex align-items-center">
                                                <img
                                                    src={aluno.imagem_aluno ? `${aluno.imagem_aluno}` : 'https://placehold.co/150x150?text=img'}
                                                    alt="Foto do Aluno" 
                                                    className={`
                                                        img-fluid rounded-circle me-3 border border-3
                                                        ${aluno.status_aluno === 'A' ? 'border-success' : ''}
                                                        ${aluno.status_aluno === 'B' ? 'border-danger' : ''}
                                                        ${aluno.status_aluno === 'I' ? 'border-warning' : ''}
                                                    `} 
                                                    style={{ width: '50px', height: '50px' }}
                                                    loading="lazy"
                                                />
                                                <div className="col-md-10 d-flex flex-column">
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
                                                        <a onClick={e => { e.stopPropagation(); delAlun(aluno.cod_aluno); }} href="#" className={`d-flex align-items-center gap-2 dropdown-item ${aluno.deletedAt ? 'd-none' : ''}`}>
                                                            <i className="bi bi-trash"></i>
                                                            <p className="mb-0">Excluir</p>
                                                        </a>
                                                        <a onClick={e => { e.stopPropagation(); recoveryAlun(aluno.cod_aluno); }} href="#" className={`d-flex align-items-center gap-2 dropdown-item ${aluno.deletedAt ? '' : 'd-none'}`}>
                                                            <i className="bi bi-trash"></i>
                                                            <p className="mb-0">Reverter</p>
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