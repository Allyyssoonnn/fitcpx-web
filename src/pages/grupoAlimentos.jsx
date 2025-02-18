import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useRecoilState } from "recoil";
import { stateUsuario } from "../states/states";
import { useNavigate } from "react-router-dom";
import { deleteGrupoAlimento, getGrupoAlimentos, recoveryGrupoAlimento } from "../api/cardapio";

function GrupoAlimentos() {
    const [usuario] = useRecoilState(stateUsuario);  
    const [searchTerm, setSearchTerm] = useState("");
    const [deleted, setDeleted] = useState(false);

    const { data: grupos, refetch } = useQuery({
        queryKey: ['alunos', usuario.cod_empresa],
        queryFn: () => getGrupoAlimentos(usuario.cod_empresa, deleted),
        initialData: [],
    });

    useEffect(() => {
        refetch();
    }, [deleted]);

    const navigate = useNavigate();
    
    const editarGrupo = (grupo) => navigate('/cadgrupoalimento', { state: { grupo } });
    const deleteGrupo = async (cod_grupo_alimento) => {
        await deleteGrupoAlimento(cod_grupo_alimento);
        refetch();
    }
    const recoveryGrupo = async (cod_grupo_alimento) => {
        await recoveryGrupoAlimento(cod_grupo_alimento);
        refetch();
    }

    const filteredGrupos = useMemo(() => {
        return grupos.filter((grupoAlimento) =>
            searchTerm.toLowerCase().split(" ").filter(Boolean).every(word =>
                grupoAlimento.nome_grupo_alimento?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(word)
            )
        );
    }, [grupos, searchTerm]);
        
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h4 className="card-title d-none d-md-block">Grupo de alimentos</h4>
                                    <label>{filteredGrupos?.length} Grupos</label>
                                </div>

                                <div className="col-md-3 col-12">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Pesquisar"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="d-flex align-items-center justify-content-between mt-3">
                                <div>
                                    <input checked={deleted} onClick={() => setDeleted(!deleted)} className="form-checkbox-control" type="checkbox" id="deleted" />
                                    <label className="form-label ms-1" htmlFor="deleted">Registros deletados</label>
                                </div>

                                <button className="btn btn-success" onClick={() => navigate('/cadgrupoalimento')}>
                                    <i className="bi bi-plus-circle me-2"></i>
                                    Novo grupo
                                </button>
                            </div>
                        </div>

                        <div className="table-responsive">
                            <table id="basic-datatables" className="display table table-striped table-hover">
                                <tbody>
                                    {filteredGrupos.map((grupo) => {
                                        return (
                                        <tr key={grupo.cod_treino} className="rounded-3" style={{ borderLeft: grupo.base_grupo_alimento === 'S' ? '0.30rem solid rgb(212, 212, 70)' : '' }}>
                                            <th scope="row" className="d-flex align-items-center">
                                                <div className="col-md-3 d-flex flex-column">
                                                    <label>{grupo.nome_grupo_alimento}</label>
                                                </div>
                                            </th>
                                            <td>
                                                <div className={`${grupo.base_grupo_alimento === 'S' ? 'd-none' : ''} dropdown`}>
                                                    <button onClick={e => e.stopPropagation()} className="btn border-0 p-0" data-bs-toggle="dropdown">
                                                        <i className="bi bi-three-dots-vertical"></i>
                                                    </button>

                                                    <div className="dropdown-menu dropdown-menu-end dropdown-menu-animate-up">
                                                        <a onClick={e => { e.stopPropagation(); editarGrupo(grupo); }} href="#" className="d-flex align-items-center gap-2 dropdown-item">
                                                            <i className="bi bi-pencil"></i>
                                                            <p className="mb-0">Editar</p>
                                                        </a>
                                                        <a onClick={e => { e.stopPropagation(); deleteGrupo(grupo.cod_grupo_alimento); }} href="#" className={`d-flex align-items-center gap-2 dropdown-item ${grupo.deletedAt ? 'd-none' : ''}`}>
                                                            <i className="bi bi-trash"></i>
                                                            <p className="mb-0">Excluir</p>
                                                        </a>
                                                        <a onClick={e => { e.stopPropagation(); recoveryGrupo(grupo.cod_grupo_alimento); }} href="#" className={`d-flex align-items-center gap-2 dropdown-item ${grupo.deletedAt ? '' : 'd-none'}`}>
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

export default GrupoAlimentos;