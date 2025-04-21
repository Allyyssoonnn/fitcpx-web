import { useEffect, useMemo, useState } from "react";
import { deleteCartao, getCartoes, getPagamentos, getPIXPagamento, processPagamento } from "../api/pagamento";
import { useRecoilState } from "recoil";
import { stateEmpresa, stateUsuario } from "../states/states";
import CardInput from "./CardInput";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";

function Assas({ show, recorrente, close }) {
    const navigate = useNavigate();
    const [usuario] = useRecoilState(stateUsuario);
    const [empresa] = useRecoilState(stateEmpresa);
    const [formaPagamento, setFormaPagamento] = useState('PIX');
    const [novoCartao, setNovoCartao] = useState(true);
    const [cartoes, setCartoes] = useState();

    const [selectedCartao, setSelectedCartao] = useState(null);

    async function loadCartoes() {
        const cartoes = await getCartoes(usuario.cod_empresa);
        if (cartoes.length > 0) {
            setCartoes(cartoes);
            setNovoCartao(false);
        }
    }

    useEffect(() => {
        loadCartoes();
    }, []);

    useEffect(() => {
        if (recorrente) setFormaPagamento('CREDIT_CARD');
    }, [recorrente]);

    async function processPagamentoCartao(cartao, cod_empresa_cartao) {
        console.log(cartao);
        console.log(cod_empresa_cartao);
        
        Swal.fire({
            title: "Carregando...",
            text: "Aguarde enquanto buscamos os dados.",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });
        if (formaPagamento === 'PIX') {
            const pagamento = await processPagamento(formaPagamento, empresa.cod_empresa, usuario.cod_usuario, recorrente);
            if (pagamento.cod_usuario_pagamento) {
                const pix = await getPIXPagamento(pagamento.cod_usuario_pagamento);
                Swal.fire({
                    title: `${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pagamento?.valor_usuario_pagamento)}`,
                    text: pix.payload,
                    imageUrl: `data:image/png;base64,${pix.encodedImage}`,
                    confirmButtonText: "Confirmar",
                }).then((result) => {
                    if (result.isConfirmed) close();
                })
            }
        } else if (formaPagamento === 'CREDIT_CARD') {
            await processPagamento(formaPagamento, empresa.cod_empresa, usuario.cod_usuario, recorrente, cartao, cod_empresa_cartao);
            Swal.close();
            close();
        }
    }

    async function delCartao(cod_empresa_cartao) {
        Swal.fire({
            title: "Tem certeza?",
            text: "A remoção do cartão não pode ser revertida!",
            icon: "warning",
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: "Confirmar",
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                await deleteCartao(cod_empresa_cartao);
                if (cartoes.length == 1) setNovoCartao(true);
                loadCartoes();
                Swal.fire("Cartão removido!", "", "success");
            }
        });
    }

    return (
        <div className="container-fluid d-flex flex-row gap-3">
            <div className="col-md-5 p-3">
                <div className="card">
                    <div className={`card-body bg-${recorrente ? 'success' : 'info'}-subtle rounded text-center p-3`}>
                        <h5 className={`card-title text-${recorrente ? 'success' : 'info'} mb-0`}>{recorrente ? 'Pagamento recorrente selecionado' : 'Pagamento único selecionado'}</h5>
                    </div>
                </div>

                <div className="text-center d-flex flex-column">
                    <label className="form-label">Forma de pagamento</label>
                    <div className="btn-group" role="group">
                        <button 
                            type="button" 
                            className={`btn ${recorrente ? 'd-none' : ''} ${formaPagamento === "PIX" ? "btn-primary" : "btn-outline-primary"}`} 
                            onClick={() => setFormaPagamento("PIX")}
                        >
                            PIX
                        </button>
                        <button 
                            type="button" 
                            className={`btn ${formaPagamento === "CREDIT_CARD" ? "btn-primary" : "btn-outline-primary"}`} 
                            onClick={() => setFormaPagamento("CREDIT_CARD")}
                        >
                            Cartão de Crédito
                        </button>
                    </div>
                </div>

                <div className="mt-3 p-2 bg-light rounded">
                    <h6 className="card-title">Comprador</h6>

                    <div className="d-flex flex-column gap-2">
                        <div><strong>Nome:</strong> <span className="text-muted">{empresa.nome_empresa}</span></div>
                        <div><strong>CNPJ:</strong> <span className="text-muted">{empresa.doc_empresa}</span></div>
                        <div><strong>E-mail:</strong> <span className="text-muted">{empresa.email_empresa}</span></div>
                        <div><strong>Telefone:</strong> <span className="text-muted">{empresa.telefone_empresa}</span></div>
                        <div><strong>CEP:</strong> <span className="text-muted">{empresa.cep_empresa}</span></div>
                        <div><strong>Endereço:</strong> <span className="text-muted">{empresa.endereco_empresa}, {empresa.numero_empresa}</span></div>
                        <div><strong>Localidade:</strong> <span className="text-muted">{empresa.cidade_empresa} - {empresa.estado_empresa}</span></div>
                    </div>
                </div>
            </div>
            <div className="col-md-7 d-flex justify-center bg-light rounded-3 min-h-100">
                {((formaPagamento === "CREDIT_CARD" && novoCartao) && !selectedCartao) && (
                    <div>
                        <button onClick={() => setNovoCartao(false)} className={`${cartoes?.length > 0 ? '' : 'd-none'} btn btn-outline-success`}>
                            <i className="bi bi-collection me-2" />
                            Selecionar cartão
                        </button>
                        <CardInput submit={processPagamentoCartao} />
                    </div>
                )}
                {((formaPagamento === "CREDIT_CARD" && !novoCartao) && !selectedCartao) && (
                    <SelectCard submit={processPagamentoCartao}
                        cartoes={cartoes}
                        addCartao={() => setNovoCartao(true)}
                        selectCartao={cartao => setSelectedCartao(cartao)}
                        deleteCartao={delCartao}
                    />
                )}
                {selectedCartao && (
                    <SelectedCartao cartao={selectedCartao} close={() => setSelectedCartao(null)} submit={processPagamentoCartao} />
                )}
                {formaPagamento === "PIX" && (
                    <div className="container-fluid d-flex flex-column p-3">
                        <buton onClick={processPagamentoCartao} className="btn btn-outline-primary">Gerar QR Code</buton>
                    </div>
                )}
            </div>
        </div>
    );
}

function SelectedCartao({ cartao, close, submit }) {
    const memorizedCartao = useMemo(() => {
        return (
            <div className="card-item__side -front hover:scale-98 duration-1 cursor-pointer shadow">
                <div className="card-item__cover">
                    <img
                        src={`https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/${Math.floor(Math.random() * 25 + 1)}.jpeg`}
                        className="card-item__bg"
                        alt="Card Background"
                    />
                </div>

                <div className="card-item__wrapper">
                    <div className="card-item__top">
                        <img
                            src="https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/chip.png"
                            className="card-item__chip"
                        />
                        <div className="card-item__type">
                            <transition name="slide-fade-up">
                                <img
                                    src={`https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/${cartao.bandeira_empresa_cartao}.png`}
                                    alt=""
                                    className="card-item__typeImg"
                                />
                            </transition>
                        </div>
                    </div>

                    <label htmlFor="cardNumber" className="card-item__number">
                        ***{cartao.final_empresa_cartao}
                    </label>
                </div>
            </div>
        );
    }, [cartao]);

    return (
        <div className="d-flex flex-column gap-3 w-100 p-5">
            {memorizedCartao}

            <div className="d-flex justify-content-around">
                <button onClick={close} className="btn btn-danger rounded">
                    <i className="bi bi-x-circle me-2" />
                    Cancelar
                </button>

                <button onClick={() => submit(null, cartao.cod_empresa_cartao)} className="btn btn-success rounded">
                    <i className="bi bi-check-circle me-2" />
                    Confirmar compra
                </button>
            </div>
        </div>
    )
}

function SelectCard({ submit, addCartao, cartoes, selectCartao, deleteCartao }) {

    const memorizedCartoes = useMemo(() => {
        return cartoes?.map((cartao, index) => (
            <div key={index} className="card-item__side -front hover:scale-98 duration-1 cursor-pointer">
                <div className="card-item__cover">
                    <img
                        src={`https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/${Math.floor(Math.random() * 25 + 1)}.jpeg`}
                        className="card-item__bg"
                        alt="Card Background"
                    />
                </div>

                <div className="card-item__wrapper">
                    <div className="card-item__top">
                        <img
                            src="https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/chip.png"
                            className="card-item__chip"
                        />
                        <div className="card-item__type">
                            <transition name="slide-fade-up">
                                <img
                                    src={`https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/${cartao.bandeira_empresa_cartao}.png`}
                                    alt=""
                                    className="card-item__typeImg"
                                />
                            </transition>
                        </div>
                    </div>

                    <label htmlFor="cardNumber" className="card-item__number">
                        ***{cartao.final_empresa_cartao}
                    </label>

                    <div className="d-flex justify-content-around">
                        <button onClick={() => deleteCartao(cartao.cod_empresa_cartao)} className="btn btn-danger rounded">
                            <i className="bi bi-trash me-2" />
                            Excluir cartão
                        </button>

                        <button onClick={() => selectCartao(cartao)} className="btn btn-success rounded">
                            <i className="bi bi-check-circle me-2" />
                            Selecionar
                        </button>
                    </div>
                </div>
            </div>
        ));
    }, [cartoes]);

    return (
        <div className="container-fluid d-flex flex-column p-3">
            <button onClick={addCartao} className="btn btn-outline-success">
                <i className="bi bi-plus-circle me-2" />
                Novo cartão
            </button>

            <div className="d-flex flex-column gap-2 mt-3">
                {memorizedCartoes}
            </div>
        </div>
    )
}

export default Assas;