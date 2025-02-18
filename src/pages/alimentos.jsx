import { useRecoilState } from "recoil";
import { stateUsuario } from "../states/states";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteAlimento, getAlimentos, getGrupoAlimentos, recoveryAlimento } from "../api/cardapio";
import { useQuery } from "react-query";

function Alimentos() {
    const [usuario] = useRecoilState(stateUsuario);
    const [searchTerm, setSearchTerm] = useState("");
    const [deleted, setDeleted] = useState(false);
    const [grupoFilter, setGrupoFilter] = useState("");

    const navigate = useNavigate();

    const editarAlimento = (alimento) => navigate('/cadgrupoalimento', { state: { alimento } });
    const delAlimento = async (cod_alimento) => {
        await deleteAlimento(cod_alimento);
        refetch();
    }
    const recoveryAlim = async (cod_alimento) => {
        await recoveryAlimento(cod_alimento);
        refetch();
    }

    const { data: grupos } = useQuery({
        queryKey: ['grupos', usuario.cod_empresa],
        queryFn: () => getGrupoAlimentos(usuario.cod_empresa),
        initialData: [],
    });

    const { data: alimentos, refetch } = useQuery({
        queryKey: ['alimentos', usuario.cod_usuario],
        queryFn: () => getAlimentos(usuario.cod_empresa, deleted),
        initialData: [],
        enabled: !!usuario.cod_empresa,
    });

    useEffect(() => {
        refetch();
    }, [deleted]);

    const filteredAlimentos = useMemo(() => {
        return alimentos.filter((alimento) =>
            searchTerm.toLowerCase().split(" ").filter(Boolean).every(word =>
            alimento.nome_alimento?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(word)) &&
            (grupoFilter === "" || String(alimento.cod_grupo_alimento) === String(grupoFilter))
        );
    }, [alimentos, searchTerm, grupoFilter]);

    return (
        <div className="container-fluid">
            <div className="card">
                <div className="card-header">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h4 className="card-title d-none d-md-block">Lista de alimentos</h4>
                            <label>{filteredAlimentos?.length} Cardápios</label>
                        </div>

                        <div className="col-md-3 col-8">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Pesquisar alimento"
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
                                <label className="form-label fw-bold">Grupo de alimento</label>
                                <select className="form-control" value={grupoFilter} onChange={e => setGrupoFilter(e.target.value)}>
                                    <option value="">Todos</option>
                                    {grupos.map((grupo, index) => (
                                        <option key={index} value={grupo.cod_grupo_alimento}>{grupo.nome_grupo_alimento}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <button className="btn btn-success" onClick={() => navigate('/cadalimento')}>
                            <i className="bi bi-plus-circle me-2"></i>
                            Novo alimento
                        </button>
                    </div>
                </div>

                <div className="table-responsive">
                    <table id="basic-datatables" className="display table table-striped table-hover">
                        <tbody>
                            {filteredAlimentos.map((alimento) => {
                                return (
                                <tr key={alimento.cod_alimento} style={{ borderLeft: alimento.base_alimento === 'S' ? '0.30rem solid rgb(212, 212, 70)' : '' }}>
                                    <th scope="row" className="d-flex align-items-center">
                                        <div className="col-md-6 d-flex flex-column">
                                            <label>{alimento.nome_alimento}</label>
                                            <div className="d-flex gap-2 mt-2">
                                                <label className="badge bg-info">{alimento?.grupo_alimento?.nome_grupo_alimento}</label>
                                                <label className="badge bg-dark">Carbo: {alimento?.carboidrato == '0,0' ? '-' : alimento?.carboidrato}</label>
                                                <label className="badge bg-success">Proteína: {alimento?.proteina == '0,0' ? '-' : alimento?.proteina}</label>
                                                {/* <label className="badge bg-dark">{treino.nome_exercicio}</label> */}
                                                {/* <label className="badge bg-dark">{treino.nivel_treino}</label> */}
                                                {/* <label className="text-muted">{treino.nome_usuario}</label> */}
                                            </div>
                                        </div>
                                    </th>
                                    <td>
                                        <div className={`${alimento.base_alimento === 'S' ? 'd-none' : ''} dropdown`}>
                                            <button onClick={e => e.stopPropagation()} className="btn border-0" data-bs-toggle="dropdown">
                                                <i className="bi bi-three-dots-vertical"></i>
                                            </button>

                                            <div className="dropdown-menu dropdown-menu-end dropdown-menu-animate-up">
                                                <a onClick={e => { e.stopPropagation(); editarAlimento(alimento); }} href="#" className="d-flex align-items-center gap-2 dropdown-item">
                                                    <i className="bi bi-pencil"></i>
                                                    <p className="mb-0">Editar</p>
                                                </a>
                                                <a onClick={e => { e.stopPropagation(); delAlimento(alimento.cod_alimento); }} href="#" className={`d-flex align-items-center gap-2 dropdown-item ${alimento.deletedAt ? 'd-none' : ''}`}>
                                                    <i className="bi bi-trash"></i>
                                                    <p className="mb-0">Excluir</p>
                                                </a>
                                                <a onClick={e => { e.stopPropagation(); recoveryAlim(alimento.cod_alimento); }} href="#" className={`d-flex align-items-center gap-2 dropdown-item ${alimento.deletedAt ? '' : 'd-none'}`}>
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
    )
}

export default Alimentos;