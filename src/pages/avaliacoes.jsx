import { useRecoilState } from "recoil";
import { stateUsuario } from "../states/states";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteAlimento, getAlimentos, recoveryAlimento } from "../api/cardapio";
import { useQuery } from "react-query";
import { getAvaliacoes } from "../api/aluno";
import { formatarData } from "../utils";

function Avaliacoes() {
    const [usuario] = useRecoilState(stateUsuario);
    const [searchTerm, setSearchTerm] = useState("");
    const [deleted, setDeleted] = useState(false);

    const navigate = useNavigate();
    
    const { data: avaliacoes, refetch } = useQuery({
        queryKey: ['avaliacoes', usuario.cod_usuario],
        queryFn: () => getAvaliacoes(usuario.cod_empresa),
        initialData: [],
        enabled: !!usuario.cod_empresa,
    });

    useEffect(() => {
        refetch();
    }, [deleted]);

    const filteredAvaliacoes = useMemo(() => {
        return avaliacoes.filter((avaliacao) =>
            searchTerm.toLowerCase().split(" ").filter(Boolean).every(word =>
            avaliacao.nome_aluno?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(word))
        );
    }, [avaliacoes, searchTerm]);

    return (
        <div className="container-fluid">
            <div className="card shadow-lg rounded-4">
                <div className="card-header">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h4 className="card-title d-none d-md-block">Lista de avaliações</h4>
                            <label>{filteredAvaliacoes?.length} Avaliações</label>
                        </div>

                        <div className="col-md-3 col-8">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Pesquisar avaliação"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="d-flex align-items-center justify-content-between mt-3">
                        <div className="col-md-3 col-6">
                            {/* <div>
                                <input checked={deleted} onClick={() => setDeleted(!deleted)} className="form-checkbox-control" type="checkbox" id="deleted" />
                                <label className="form-label ms-1" htmlFor="deleted">Registros deletados</label>
                            </div> */}
                        </div>

                        {/* <button className="btn btn-success" onClick={() => navigate('/cadalimento')}>
                            <i className="bi bi-plus-circle me-2"></i>
                            Novo alimento
                        </button> */}
                    </div>
                </div>

                <div className="table-responsive">
                    <table id="basic-datatables" className="display table table-striped table-hover">
                        <tbody>
                            {filteredAvaliacoes.sort((a, b) => new Date(b.data_avaliacao) - new Date(a.data_avaliacao)).map((avaliacao) => {
                                return (
                                <tr key={avaliacao.cod_alimento} style={{ borderLeft: avaliacao.base_alimento === 'S' ? '0.30rem solid rgb(212, 212, 70)' : '' }}>
                                    <th scope="row" className="d-flex align-items-center">
                                        <div className="col-md-6 d-flex flex-column">
                                            <label>{avaliacao.nome_aluno}</label>
                                            <div className="d-flex gap-2 mt-2">
                                                <button onClick={() => navigate('/avaliacao', { state: { avaliacao } })} className="btn btn-sm btn-outline-success">Ver resultado</button>
                                                <label className="badge bg-info">{formatarData(avaliacao?.data_avaliacao)}</label>
                                                {/* <label className="badge bg-dark">Carbo: {avaliacao?.carboidrato == '0,0' ? '-' : avaliacao?.carboidrato}</label> */}
                                                {/* <label className="badge bg-success">Proteína: {avaliacao?.proteina == '0,0' ? '-' : avaliacao?.proteina}</label> */}
                                                {/* <label className="badge bg-dark">{treino.nome_exercicio}</label> */}
                                                {/* <label className="badge bg-dark">{treino.nivel_treino}</label> */}
                                                {/* <label className="text-muted">{treino.nome_usuario}</label> */}
                                            </div>
                                        </div>
                                    </th>
                                    <td>
                                        {/* <div className={`${avaliacao.base_alimento === 'S' ? 'd-none' : ''} dropdown`}>
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
                                        </div> */}
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

export default Avaliacoes;