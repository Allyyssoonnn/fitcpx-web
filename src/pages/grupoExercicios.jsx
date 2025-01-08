import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useRecoilState } from "recoil";
import { stateUsuario } from "../states/states";
import { useNavigate } from "react-router-dom";
import { deleteGrupoExercicio, getGrupoExercicios, recoveryGrupoExercicio } from "../api/treino";

function GrupoExercicios() {
    const [usuario] = useRecoilState(stateUsuario);  
    const [searchTerm, setSearchTerm] = useState("");
    const [deleted, setDeleted] = useState(false);

    const { data: grupos, refetch } = useQuery({
        queryKey: ['alunos', usuario.cod_empresa],
        queryFn: () => getGrupoExercicios(usuario.cod_empresa, deleted),
        initialData: [],
    });

    useEffect(() => {
        refetch();
    }, [deleted]);

    const navigate = useNavigate();
    
    const editarGrupo = (grupo) => navigate('/cadgrupoexercicio', { state: { grupo } });
    const deleteGrupo = async (cod_grupo_exercicio) => {
        await deleteGrupoExercicio(cod_grupo_exercicio);
        refetch();
    }
    const recoveryGrupo = async (cod_grupo_exercicio) => {
        await recoveryGrupoExercicio(cod_grupo_exercicio);
        refetch();
    }

    const filteredGrupos = useMemo(() => {
        return grupos.filter((treino) =>
            treino.nome_grupo_exercicio?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [grupos, searchTerm]);
        
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <div className="w-50">
                                <h4 className="card-title d-none d-md-block">Grupo de exercícios</h4>
                                <input
                                    type="text"
                                    className="form-control w-60"
                                    placeholder="Pesquisar"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />

                                <div className="row g-3 mt-1">
                                    <div className="col-md-5">
                                        <input checked={deleted} onClick={() => setDeleted(!deleted)} className="form-checkbox-control" type="checkbox" id="deleted" />
                                        <label className="form-label ms-1" htmlFor="deleted">Registros deletados</label>
                                    </div>
                                </div>
                            </div>
                            
                            <button className="btn btn-success" onClick={() => navigate('/cadgrupoexercicio')}>
                                <i className="bi bi-plus-circle me-2"></i>
                                Novo grupo
                            </button>
                        </div>

                        <div className="table-responsive">
                            <table id="basic-datatables" className="display table table-striped table-hover">
                                <tbody>
                                    {filteredGrupos.map((grupo) => {
                                        return (
                                        <tr key={grupo.cod_treino} className="rounded-3" style={{ borderLeft: grupo.base_grupo_exercicio === 'S' ? '0.30rem solid rgb(212, 212, 70)' : '' }}>
                                            <th scope="row" className="d-flex align-items-center">
                                                <div className="col-md-3 d-flex flex-column">
                                                    <label>{grupo.nome_grupo_exercicio}</label>
                                                </div>
                                            </th>
                                            <td>
                                                <div className={`${grupo.base_grupo_exercicio === 'S' ? 'd-none' : ''} dropdown`}>
                                                    <button onClick={e => e.stopPropagation()} className="btn border-0 p-0" data-bs-toggle="dropdown">
                                                        <i className="bi bi-three-dots-vertical"></i>
                                                    </button>

                                                    <div className="dropdown-menu dropdown-menu-end dropdown-menu-animate-up">
                                                        <a onClick={e => { e.stopPropagation(); editarGrupo(grupo); }} href="#" className="d-flex align-items-center gap-2 dropdown-item">
                                                            <i className="bi bi-pencil"></i>
                                                            <p className="mb-0">Editar</p>
                                                        </a>
                                                        <a onClick={e => { e.stopPropagation(); deleteGrupo(grupo.cod_grupo_exercicio); }} href="#" className={`d-flex align-items-center gap-2 dropdown-item ${grupo.deletedAt ? 'd-none' : ''}`}>
                                                            <i className="bi bi-trash"></i>
                                                            <p className="mb-0">Excluir</p>
                                                        </a>
                                                        <a onClick={e => { e.stopPropagation(); recoveryGrupo(grupo.cod_grupo_exercicio); }} href="#" className={`d-flex align-items-center gap-2 dropdown-item ${grupo.deletedAt ? '' : 'd-none'}`}>
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

export default GrupoExercicios;