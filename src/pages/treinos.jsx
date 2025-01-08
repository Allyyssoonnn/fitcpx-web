import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useRecoilState } from "recoil";
import { stateUsuario } from "../states/states";
import { useNavigate } from "react-router-dom";
import { getTreinos } from "../api/treino";
import { getSexo } from "../utils";

function Treinos() {
    const [usuario] = useRecoilState(stateUsuario);  
    const [searchTerm, setSearchTerm] = useState("");

    const { data: treinos } = useQuery({
        queryKey: ['alunos', usuario.cod_empresa],
        queryFn: () => getTreinos({ cod_empresa: usuario.cod_empresa }),
        initialData: [],
    });

    const navigate = useNavigate();
    
    const editarTreino = (treino) => navigate('/cadtreino', { state: { treino } });

    const filteredAlunos = useMemo(() => {
        return treinos.filter((treino) =>
            treino.nome_treino?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [treinos, searchTerm]);
        
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <div className="w-50">
                                <h4 className="card-title d-none d-md-block">Treinos</h4>
                                <input
                                    type="text"
                                    className="form-control w-60"
                                    placeholder="Pesquisar"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            
                            <button className="btn btn-success" onClick={() => navigate('/cadtreino')}>
                                <i className="bi bi-plus-circle me-2"></i>
                                Novo treino
                            </button>
                        </div>

                        <div className="table-responsive">
                            <table id="basic-datatables" className="display table table-striped table-hover">
                                <tbody>
                                    {filteredAlunos.map((treino) => {
                                        return (
                                        <tr key={treino.cod_treino} onClick={() => navigate('/treino', { state: { cod_treino: treino.cod_treino } })}>
                                            <th scope="row" className="d-flex align-items-center">
                                                <div className="col-md-3 d-flex flex-column">
                                                    <label>{treino.nome_treino}</label>
                                                    <div className="d-flex gap-2 mt-2">
                                                        <label className="badge bg-dark">{treino.nome_usuario}</label>
                                                        <label className="badge bg-dark">{getSexo(treino.sexo_treino)}</label>
                                                        <label className="badge bg-dark">{treino.nivel_treino}</label>
                                                    </div>
                                                    <label className={`text-muted mt-2 ${!treino.observacao_treino ? 'd-none' : ''}`}>Obs: {treino.observacao_treino}</label>
                                                </div>
                                            </th>
                                            <td>
                                                <div className="dropdown">
                                                    <button onClick={e => e.stopPropagation()} className="btn border-0" data-bs-toggle="dropdown">
                                                        <i className="bi bi-three-dots-vertical"></i>
                                                    </button>

                                                    <div className="dropdown-menu dropdown-menu-end dropdown-menu-animate-up">
                                                        <a onClick={e => { e.stopPropagation(); editarTreino(treino); }} href="#" className="d-flex align-items-center gap-2 dropdown-item">
                                                            <i className="bi bi-pencil"></i>
                                                            <p className="mb-0">Editar</p>
                                                        </a>
                                                        <a href="#" className="d-flex align-items-center gap-2 dropdown-item">
                                                            <i className="bi bi-trash"></i>
                                                            <p className="mb-0">Excluir</p>
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

export default Treinos;