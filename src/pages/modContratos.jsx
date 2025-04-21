import { useQuery } from "react-query";
import { deleteContrato, getModContratos, recoveryContrato } from "../api/plano";
import { useRecoilState } from "recoil";
import { stateUsuario } from "../states/states";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function ModContratos() {
    const [usuario] = useRecoilState(stateUsuario);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [deleted, setDeleted] = useState(false);

    const { data: contratos, refetch } = useQuery({
        queryKey: ['contratos', usuario.cod_empresa],
        queryFn: () => getModContratos(usuario.cod_empresa, deleted),
        initialData: [],
    });

    const editarPlano = (contrato) => navigate('/cadcontrato', { state: { contrato } });
    const delPlano = async (cod_contrato) => {
        await deleteContrato(cod_contrato);
        refetch();
    }
    const recoveryPlan = async (cod_contrato) => {
        await recoveryContrato(cod_contrato);
        refetch();
    }

    useEffect(() => {
        refetch();
    }, [deleted]);

    const filteredContratos = useMemo(() => {
        return contratos.filter((plano) =>
            searchTerm.toLowerCase().split(" ").filter(Boolean).every(word =>
                plano.nome_plano?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(word)
            )
        );
    }, [contratos, searchTerm]);
    
    return (
        <div className="container-fluid">
            <div className="card">
                <div className="card-header">
                    <div className="d-flex justify-content-between">
                        <div>
                            <h4 className="card-title d-none d-md-block">Modelos contratos</h4>
                            <label>{filteredContratos?.length} Contratos</label>
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

                        <button className="btn btn-success" onClick={() => navigate('/cadcontrato')}>
                            <i className="bi bi-plus-circle me-2"></i>
                            Novo contrato
                        </button>
                    </div>
                </div>

                <div className="card-body">
                    <div className="table-responsive">
                        <table id="basic-datatables" className="display table table-striped table-hover">
                            <tbody>
                                {filteredContratos.map((contrato) => {
                                    return (
                                    <tr key={contrato.cod_contrato} className="rounded-3" style={{ borderLeft: '0.30rem solid rgb(212, 212, 70)' }}>
                                        <th scope="row" className="d-flex align-items-center">
                                            <div className="col-md-3 d-flex flex-column">
                                                <label>{contrato.nome_contrato}</label>
                                                <div className="d-flex gap-2 mt-2">
                                                    {/* <label className="badge bg-info">{contrato?.duracao_plano} {contrato?.tipo_duracao_plano}</label> */}
                                                    <label className="badge bg-success">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(contrato?.valor_adesao)}</label>
                                                </div>
                                            </div>
                                        </th>
                                        <td>
                                            <div>
                                                <button onClick={e => e.stopPropagation()} className="btn border-0 p-0" data-bs-toggle="dropdown">
                                                    <i className="bi bi-three-dots-vertical"></i>
                                                </button>

                                                <div className="dropdown-menu dropdown-menu-end dropdown-menu-animate-up">
                                                    <a onClick={e => { e.stopPropagation(); editarPlano(contrato); }} href="#" className="d-flex align-items-center gap-2 dropdown-item">
                                                        <i className="bi bi-pencil"></i>
                                                        <p className="mb-0">Editar</p>
                                                    </a>
                                                    <a onClick={e => { e.stopPropagation(); delPlano(contrato.cod_contrato); }} href="#" className={`d-flex align-items-center gap-2 dropdown-item ${contrato.deletedAt ? 'd-none' : ''}`}>
                                                        <i className="bi bi-trash"></i>
                                                        <p className="mb-0">Excluir</p>
                                                    </a>
                                                    <a onClick={e => { e.stopPropagation(); recoveryPlan(contrato.cod_contrato); }} href="#" className={`d-flex align-items-center gap-2 dropdown-item ${contrato.deletedAt ? '' : 'd-none'}`}>
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

export default ModContratos;