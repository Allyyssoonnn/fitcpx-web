import { useRecoilState } from "recoil";
import { stateUsuario } from "../../states/states";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteCardapio, getCardapios, recoveryCardapio } from "../../api/cardapio";
import { useQuery } from "react-query";

function Cardapios() {
    const [usuario] = useRecoilState(stateUsuario);
    const [searchTerm, setSearchTerm] = useState("");
    const [deleted, setDeleted] = useState(false);

    const { data: cardapios, refetch } = useQuery({
        queryKey: ['alunos', usuario.cod_empresa],
        queryFn: () => getCardapios({ cod_empresa: usuario.cod_empresa, deleted }),
        initialData: [],
        enabled: !!usuario.cod_empresa,
    });

    useEffect(() => {
        refetch();
    }, [deleted]);

    const editarCardapio = (cardapio) => navigate('/cadcardapio', { state: { cardapio } });

    const filteredCardapios = useMemo(() => {
        return cardapios.filter((treino) =>
            searchTerm.toLowerCase().split(" ").filter(Boolean).every(word =>
                treino.nome_treino?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(word)
            )
        );
    }, [cardapios, searchTerm]);

    const delCardapio = async (cod_cardapio) => {
        await deleteCardapio(cod_cardapio);
        refetch();
    }

    const recoCardapio = async (cod_cardapio) => {
        await recoveryCardapio(cod_cardapio);
        refetch();
    }

    const navigate = useNavigate();

    return (
        <div className="container-fluid">
            <div className="card">
                <div className="card-header">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h4 className="card-title d-none d-md-block">Lista de cardápios</h4>
                            <label>{filteredCardapios?.length} Cardápios</label>
                        </div>

                        <div className="col-md-3 col-8">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Pesquisar cardápio"
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
                        </div>

                        <button className="btn btn-success" onClick={() => navigate('/cadcardapio')}>
                            <i className="bi bi-plus-circle me-2"></i>
                            Novo cardápio
                        </button>
                    </div>
                </div>

                <div className="table-responsive">
                    <table id="basic-datatables" className="display table table-striped table-hover">
                        <tbody>
                            {filteredCardapios.map((cardapio) => {
                                return (
                                <tr key={cardapio.cod_treino} onClick={() => navigate('/treino', { state: { cod_treino: cardapio.cod_treino } })}>
                                    <th scope="row" className="d-flex align-items-center">
                                        <div className="col-md-3 d-flex flex-column">
                                            <label>{cardapio.nome_cardapio}</label>
                                            <div className="d-flex gap-2 mt-2">
                                                {/* <label className="badge bg-dark">{cardapio.nome_cardapio}</label> */}
                                                {/* <label className="badge bg-dark">{getSexo(cardapio.sexo_treino)}</label> */}
                                                {/* <label className="badge bg-dark">{cardapio.nivel_treino}</label> */}
                                            </div>
                                            <label className={`text-muted mt-2 ${!cardapio.observacao_treino ? 'd-none' : ''}`}>Obs: {cardapio.observacao_treino}</label>
                                        </div>
                                    </th>
                                    <td>
                                        <div className="dropdown">
                                            <button onClick={e => e.stopPropagation()} className="btn border-0" data-bs-toggle="dropdown">
                                                <i className="bi bi-three-dots-vertical"></i>
                                            </button>

                                            <div className="dropdown-menu dropdown-menu-end dropdown-menu-animate-up">
                                                <a onClick={e => { e.stopPropagation(); editarCardapio(cardapio); }} href="#" className="d-flex align-items-center gap-2 dropdown-item">
                                                    <i className="bi bi-pencil"></i>
                                                    <p className="mb-0">Editar</p>
                                                </a>
                                                <a onClick={e => { e.stopPropagation(); delCardapio(cardapio.cod_cardapio); }} href="#" className={`d-flex align-items-center gap-2 dropdown-item ${cardapio.deletedAt ? 'd-none' : ''}`}>
                                                    <i className="bi bi-trash"></i>
                                                    <p className="mb-0">Excluir</p>
                                                </a>
                                                <a onClick={e => { e.stopPropagation(); recoCardapio(cardapio.cod_cardapio); }} href="#" className={`d-flex align-items-center gap-2 dropdown-item ${cardapio.deletedAt ? '' : 'd-none'}`}>
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

export default Cardapios;