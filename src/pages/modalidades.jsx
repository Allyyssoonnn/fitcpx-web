import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteModalidade, getModalidades, recoveryModalidade } from "../api/plano";
import { useRecoilState } from "recoil";
import { stateUsuario } from "../states/states";
import { useQuery } from "react-query";

function Modalidades() {
    const [usuario] = useRecoilState(stateUsuario);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [deleted, setDeleted] = useState(false);

    const { data: modalidades, refetch } = useQuery({
        queryKey: ['modalidades', usuario.cod_empresa],
        queryFn: () => getModalidades(usuario.cod_empresa, deleted),
        initialData: [],
    });

    const editarModalidade = (modalidade) => navigate('/cadmodalidade', { state: { modalidade } });
    const delModalidae = async (cod_modalidade) => {
        await deleteModalidade(cod_modalidade);
        refetch();
    }
    const recoveryModa = async (cod_modalidade) => {
        await recoveryModalidade(cod_modalidade);
        refetch();
    }

    useEffect(() => {
        refetch();
    }, [deleted]);

    const filteredModalidades = useMemo(() => {
        return modalidades.filter((modalidade) =>
            searchTerm.toLowerCase().split(" ").filter(Boolean).every(word =>
                modalidade.nome_modalidade?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(word)
            )
        );
    }, [modalidades, searchTerm]);

    return (
        <div className="container-fluid">
            <div className="card">
                <div className="card-header">
                    <div className="d-flex justify-content-between">
                        <div>
                            <h4 className="card-title d-none d-md-block">Modalidades</h4>
                            <label>{filteredModalidades?.length} Modalidades</label>
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

                        <button className="btn btn-success" onClick={() => navigate('/cadmodalidade')}>
                            <i className="bi bi-plus-circle me-2"></i>
                            Nova modalidade
                        </button>
                    </div>
                </div>

                <div className="card-body">
                    <div className="table-responsive">
                        <table id="basic-datatables" className="display table table-striped table-hover">
                            <tbody>
                                {filteredModalidades.map((modalidade) => {
                                    return (
                                    <tr key={modalidade.cod_plano} className="rounded-3" style={{ borderLeft: '0.30rem solid rgb(212, 212, 70)' }}>
                                        <th scope="row" className="d-flex align-items-center">
                                            <div className="col-md-3 d-flex flex-column">
                                                <label>{modalidade.nome_modalidade}</label>
                                                <div className="d-flex gap-2 mt-2">
                                                    <label className="badge bg-info">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(modalidade?.valor_modalidade)}</label>
                                                    {/* <label className="badge bg-info">{modalidade?.duracao_plano} {modalidade?.tipo_duracao_plano}</label> */}
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
                                                    <a onClick={e => { e.stopPropagation(); editarModalidade(modalidade); }} href="#" className="d-flex align-items-center gap-2 dropdown-item">
                                                        <i className="bi bi-pencil"></i>
                                                        <p className="mb-0">Editar</p>
                                                    </a>
                                                    <a onClick={e => { e.stopPropagation(); delModalidae(modalidade.cod_modalidade); }} href="#" className={`d-flex align-items-center gap-2 dropdown-item ${modalidade.deletedAt ? 'd-none' : ''}`}>
                                                        <i className="bi bi-trash"></i>
                                                        <p className="mb-0">Excluir</p>
                                                    </a>
                                                    <a onClick={e => { e.stopPropagation(); recoveryModa(modalidade.cod_modalidade); }} href="#" className={`d-flex align-items-center gap-2 dropdown-item ${modalidade.deletedAt ? '' : 'd-none'}`}>
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

export default Modalidades;