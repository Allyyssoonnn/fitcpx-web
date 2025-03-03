import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deletePlano, getPlanos, recoveryPlano } from "../api/plano";
import { useQuery } from "react-query";
import { useRecoilState } from "recoil";
import { stateUsuario } from "../states/states";

function Planos() {
    const [usuario] = useRecoilState(stateUsuario);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [deleted, setDeleted] = useState(false);

    const { data: planos, refetch } = useQuery({
        queryKey: ['planos', usuario.cod_empresa],
        queryFn: () => getPlanos(usuario.cod_empresa, deleted),
        initialData: [],
    });

    const editarPlano = (plano) => navigate('/cadplano', { state: { plano } });
    const delPlano = async (cod_plano) => {
        await deletePlano(cod_plano);
        refetch();
    }
    const recoveryPlan = async (cod_plano) => {
        await recoveryPlano(cod_plano);
        refetch();
    }

    useEffect(() => {
        refetch();
    }, [deleted]);

    const filteredPlanos = useMemo(() => {
        return planos.filter((plano) =>
            searchTerm.toLowerCase().split(" ").filter(Boolean).every(word =>
                plano.nome_plano?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(word)
            )
        );
    }, [planos, searchTerm]);
    console.log(planos);
    return (
        <div className="container-fluid">
            <div className="card">
                <div className="card-header">
                    <div className="d-flex justify-content-between">
                        <div>
                            <h4 className="card-title d-none d-md-block">Planos</h4>
                            <label>{filteredPlanos?.length} Planos</label>
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

                        <button className="btn btn-success" onClick={() => navigate('/cadplano')}>
                            <i className="bi bi-plus-circle me-2"></i>
                            Novo plano
                        </button>
                    </div>
                </div>

                <div className="card-body">
                    <div className="table-responsive">
                        <table id="basic-datatables" className="display table table-striped table-hover">
                            <tbody>
                                {filteredPlanos.map((plano) => {
                                    return (
                                    <tr key={plano.cod_plano} className="rounded-3" style={{ borderLeft: '0.30rem solid rgb(212, 212, 70)' }}>
                                        <th scope="row" className="d-flex align-items-center">
                                            <div className="col-md-3 d-flex flex-column">
                                                <label>{plano.nome_plano}</label>
                                                <div className="d-flex gap-2 mt-2">
                                                    <label className="badge bg-info">{plano?.duracao_plano} {plano?.tipo_duracao_plano}</label>
                                                    <label className="badge bg-success">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(plano?.valor_plano)}</label>
                                                    {plano?.modalidades?.map((modaliade, index) => (
                                                        <label key={index} className="badge bg-warning text-dark">{modaliade?.modalidade?.nome_modalidade}</label>
                                                    ))}
                                                    {/* <label className="badge bg-dark">Carbo: {alimento?.carboidrato == '0,0' ? '-' : alimento?.carboidrato}</label> */}
                                                    {/* <label className="badge bg-dark">{treino.nome_exercicio}</label> */}
                                                    {/* <label className="badge bg-dark">{treino.nivel_treino}</label> */}
                                                    {/* <label className="text-muted">{treino.nome_usuario}</label> */}
                                                </div>
                                            </div>
                                        </th>
                                        <td>
                                            <div>
                                                <button onClick={e => e.stopPropagation()} className="btn border-0 p-0" data-bs-toggle="dropdown">
                                                    <i className="bi bi-three-dots-vertical"></i>
                                                </button>

                                                <div className="dropdown-menu dropdown-menu-end dropdown-menu-animate-up">
                                                    <a onClick={e => { e.stopPropagation(); editarPlano(plano); }} href="#" className="d-flex align-items-center gap-2 dropdown-item">
                                                        <i className="bi bi-pencil"></i>
                                                        <p className="mb-0">Editar</p>
                                                    </a>
                                                    <a onClick={e => { e.stopPropagation(); delPlano(plano.cod_plano); }} href="#" className={`d-flex align-items-center gap-2 dropdown-item ${plano.deletedAt ? 'd-none' : ''}`}>
                                                        <i className="bi bi-trash"></i>
                                                        <p className="mb-0">Excluir</p>
                                                    </a>
                                                    <a onClick={e => { e.stopPropagation(); recoveryPlan(plano.cod_plano); }} href="#" className={`d-flex align-items-center gap-2 dropdown-item ${plano.deletedAt ? '' : 'd-none'}`}>
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
    )
}

export default Planos;