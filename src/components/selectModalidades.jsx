import { Modal } from "react-bootstrap";
import { formatarMoeda } from "../utils";
import Select from "./baseComponents/select";
import { useState } from "react";
import { useQuery } from "react-query";
import { useRecoilState } from "recoil";
import { stateUsuario } from "../states/states";
import { getModalidades } from "../api/plano";
import EditableCurrency from "./editableCurrency";

function SelectModalidades({ modalidadesPlano, attValue, addModalidade, removeModalidade }) {
    const [usuario] = useRecoilState(stateUsuario);
    const [modalModalidade, setModalModalidade] = useState(false);

    const { data: modalidades } = useQuery({
        queryKey: ['modalidades', usuario.cod_empresa],
        queryFn: () => getModalidades(usuario.cod_empresa),
        initialData: [],
    });

    function openModalidade(e) {
        e.preventDefault();
        setModalModalidade(true);
    }

    return (
        <div className="d-flex flex-column">
            <ModalModalidades modalidades={modalidades} show={modalModalidade} setShow={setModalModalidade} addModalidade={addModalidade} />
            <button className="btn btn-outline-success" onClick={openModalidade}>Adicionar modalidade</button>

            <h5 className="card-title fs-3 mt-3">Modalidades</h5>

            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Valor</th>
                        </tr>
                    </thead>

                    <tbody>
                        {modalidadesPlano?.map((modalidade, index) => (
                            <tr key={index}>
                                <td>{modalidade.nome_modalidade}</td>
                                {attValue ? (
                                    <td>
                                        <EditableCurrency value={modalidade?.valor_modalidade || 0} onUpdate={v => attValue(v, index)} />
                                    </td>
                                ) : (
                                    <td>{formatarMoeda(modalidade?.valor_modalidade || 0)}</td>
                                )}
                                <td>
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => removeModalidade(index)}>
                                        <i className="bi bi-trash" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function ModalModalidades({ show, setShow, modalidades, addModalidade }) {
    const [modalidade, setModalidade] = useState(null);
    const [variacao, setVariacao] = useState();
    
    function confirmar() {
        addModalidade({
            ...modalidade,
            valor_modalidade: variacao ? variacao.valor_variacao : modalidade.valor_modalidade,
            valor_modalidade_original: variacao ? variacao.valor_variacao : modalidade.valor_modalidade,
            nome_modalidade: `${modalidade.nome_modalidade} ${variacao ? ` - ${variacao.nome_variacao}` : ''}`,
            nome_modalidade_original: `${modalidade.nome_modalidade} ${variacao ? ` - ${variacao.nome_variacao}` : ''}`,
            subvariacoes: variacao.subvariacoes ?? [],
        });
        setShow(false);
    }

    function fechar() {
        setModalidade(null);
        setVariacao(null);
        setShow(false);
    }

    return (
        <Modal show={show}>
            <div className="card">
                <div className="card-header">
                    <h5 className="card-title">Incluir modalidade</h5>
                </div>

                <div className="card-body">
                    <Select
                        options={modalidades}
                        value={modalidade?.cod_modalidade}
                        fieldName='nome_modalidade'
                        fieldValue='cod_modalidade'
                        label='Selecionar modalidade'
                        onChange={(value) => setModalidade(value)}
                    />

                    <div className="mt-3">
                        {modalidade?.variaveis_modalidade && (
                            <Select
                                options={JSON.parse(modalidade?.variaveis_modalidade)}
                                fieldName='nome_variacao'
                                fieldValue='nome_variacao'
                                label='Selecionar variação'
                                onChange={(value) => setVariacao(value)}
                            />
                        )}
                    </div>

                    <div className="d-flex justify-content-center mt-3">
                        <label className="badge bg-info w-100 fs-5">{formatarMoeda((variacao?.valor_variacao ?? modalidade?.valor_modalidade) || 0)}</label>
                    </div>
                </div>

                <div className="card-footer d-flex justify-content-between">
                    <button className="btn btn-danger rounded" onClick={fechar}>Fechar</button>
                    <button className="btn btn-success rounded" onClick={confirmar} disabled={!modalidade}>Confirmar</button>
                </div>
            </div>
        </Modal>
    )
}

export default SelectModalidades;