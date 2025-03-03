import { useEffect, useState } from "react";
import MercadoPago from "../components/mercadopago";
import { stateEmpresa, stateUsuario } from "../states/states";
import { useRecoilState } from "recoil";
import { useForm } from "react-hook-form";
import { motion } from 'framer-motion';

function Licenca() {
    const { handleSubmit, register, setValue, watch } = useForm();
    const [empresa, setempresa] = useRecoilState(stateEmpresa);
    const [editing, setEditing] = useState(false);
    const [renovando, setRenovando] = useState(false);
    const [selectingRec, setselectingRec] = useState(false);
    const [recorrente, setRecorrente] = useState(null);
    

    useEffect(() => {
        Object.keys(empresa).forEach((key) => {
            setValue(key, empresa[key]);
        });
    }, [empresa]);

    function close() {
        setRenovando(false);
        setRecorrente(null);
    }

    function selectRecorrente(valor) {
        setRecorrente(valor);
        setselectingRec(false);
    }

    return (
        <div className="container-fluid">
            <div className="card">
                <div className='card-body p-3' >
                    <h5 className="card-title fw-semibold mb-4">Licença de uso</h5>

                    <div className="row g-4">
                        <motion.div
                            animate={{ opacity: !renovando && !selectingRec ? 1 : 0 }}
                            className={`col-md-7 bg-light rounded py-3 ${!renovando && !selectingRec ? 'd-inline-block' : 'd-none'}`}
                        >
                            <div className="p-3 bg-success-subtle rounded-1 d-flex align-items-center">
                                <img height={30} width={30} src="../assets/images/app/gratis.png" alt="" className="img-fluid" />
                                <div className="d-flex flex-column ms-3">
                                    <h4 className="ms-2">Licença gratuita</h4>
                                    <p>A licença gratuita permite até 3 alunos e 1 único usuário.</p>
                                </div>
                            </div>

                            <Planos comprar={() => { setRenovando(true); setselectingRec(true) }} />
                        </motion.div>

                        <motion.div
                            animate={{ opacity: renovando && selectingRec ? 1 : 0 }}
                            className={`col-md-7 p-3 ${renovando && selectingRec ? 'd-inline-block' : 'd-none'}`}
                        >
                            <Recorrencia setRenovando={setRenovando} setRecorrente={selectRecorrente} />
                        </motion.div>

                        <motion.div
                            animate={{ opacity: renovando && !selectingRec ? 1 : 0 }}
                            className={`col-md-7 p-3 ${renovando && !selectingRec ? 'd-inline-block' : 'd-none'}`}
                        >
                            <button className="btn btn-danger" onClick={close}>
                                <i className="bi bi-x-circle me-2"></i>
                                Cancelar compra
                            </button>

                            <MercadoPago
                                show={renovando}
                                recorrente={recorrente}
                                close={close}
                            />
                        </motion.div>

                        <div className='col-md-4 p-3'>
                            <h4>Dados da empresa</h4>

                            <div>
                                <label className="form-label">Nome</label>
                                <p className={`${editing ? 'd-none' : ''}`}>{empresa.nome_empresa}</p>
                                <input className={`${!editing ? 'd-none' : ''} form-control`} {...register('nome_empresa')} />
                            </div>
                            <div>
                                <label className="form-label">CNPJ</label>
                                <p className={`${editing ? 'd-none' : ''}`}>{empresa.doc_empresa || 'Não informado'}</p>
                                <input className={`${!editing ? 'd-none' : ''} form-control`} {...register('doc_empresa')} />
                            </div>
                            <div>
                                <label className="form-label">E-mail</label>
                                <p className={`${editing ? 'd-none' : ''}`}>{empresa.email_empresa || 'Não informado'}</p>
                                <input className={`${!editing ? 'd-none' : ''} form-control`} {...register('email_empresa')} />
                            </div>
                            <div>
                                <label className="form-label">Telefone</label>
                                <p className={`${editing ? 'd-none' : ''}`}>{empresa.telefone_empresa || 'Não informado'}</p>
                                <input className={`${!editing ? 'd-none' : ''} form-control`} {...register('telefone_empresa')} />
                            </div>
                            <div>
                                <label className="form-label">Endereço</label>
                                <p className={`${editing ? 'd-none' : ''}`}>{empresa.cep_usuario}</p>
                                <p className={`${editing ? 'd-none' : ''}`}>{empresa.endereco_usuario || 'Não informado'} {empresa.numero_usuario} {empresa.complemento_usuario}</p>
                                <p className={`${editing ? 'd-none' : ''}`}>{empresa.cidade_usuario} {empresa.estado_usuario}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card-footer d-flex justify-content-end">
                    <div className={`${!renovando ? 'd-inline-block' : 'd-none'}`}>
                        {!editing ? (
                            <button className='btn btn-warning' onClick={e => { e.preventDefault(); setEditing(true) }}>
                                <i className="bi bi-pencil me-2"></i>Editar
                            </button>
                        ) : (
                            <button className='btn btn-success' type='submit'>
                                <i className="bi bi-pencil me-2"></i>Confirmar
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

function Recorrencia({ setRenovando, setRecorrente }) {
    return (
        <div className="container">
            <button className="btn btn-danger mb-3 d-flex align-items-center" onClick={() => setRenovando(false)}>
                <i className="bi bi-x-circle me-2"></i> Cancelar compra
            </button>

            <div className="row g-3 flex-column">
                <div className="card border-success col-md-12 shadow-xl hover:scale-105 duration-300">
                    <div className="card-body">
                        <h5 className="card-title text-success">Pagamento Recorrente</h5>
                        <p className="card-text">
                            Pagamento mensal automático. Ideal para quem deseja acesso contínuo ao sistema.
                            Renova sua licença automaticamente a cada mês. Cancele a qualquer momento, sem taxas adicionais.
                        </p>
                        <button onClick={() => setRecorrente(true)} className="btn btn-success w-100">
                            Escolher pagamento recorrente
                        </button>
                    </div>
                </div>

                <div className="card border-info col-md-12 shadow-xl hover:scale-105 duration-300">
                    <div className="card-body">
                        <h5 className="card-title text-info">Pagamento Único</h5>
                        <p className="card-text">
                            Pagamento único para 1 mês de acesso. Perfeito para quem precisa do sistema por um período específico.
                            Após 1 mês, a licença expira.
                        </p>
                        <button onClick={() => setRecorrente(false)} className="btn btn-info w-100">
                            Escolher pagamento único
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Planos({ comprar }) {
    const precos = [
        // { mes: 1, preco: 150 },
        { mes: 3, preco: 410, unitario: 60 },
        { mes: 6, preco: 940, unitario: 130 },
        { mes: 12, preco: 1650, unitario: 110 },
    ];

    return (
        <div className="mt-5">
            <div className="col-md-12 d-flex justify-content-center flex-wrap gap-3">
                
                {/* <div className={`w-60 shadow-md d-flex flex-row p-4 rounded-3 hover:scale-105 duration-300 justify-content-between align-items-center bg-white`}>
                    <div>
                        <h2 className="fs-5 font-bold text-center">1 Mês</h2>

                        <div className="text-center font-medium">
                            <p className='py-2 border-b mx-8'>Plano único</p>
                        </div>

                        <p className="text-center fs-7 fw-bold">R$ 40,00</p>
                    </div>

                    <button className='btn btn-success rounded-2 duration-150 px-3 mt-6 py-2'>
                        Comprar
                    </button>
                </div> */}

                <div className='col-md-6 shadow-xl d-flex flex-column p-4 rounded-3 hover:scale-105 duration-300 bg-white'>
                    <h2 className="badge bg-success">Plano beta</h2>
                    <h2 className="fs-5 font-bold text-center">Licença de uso</h2>

                    <p className="text-center fs-7 fw-bold">R$ 40,00 / Mês</p>
                    {/* <p className="text-center fs-2">R$ 40,00/Mês</p> */}

                    <div className="text-center font-medium">
                        <p className='py-2 border-b mx-8'>Acesso ilimitado</p>
                        {/* <p className={`py-2 border-b mx-8 ${index === 0 ? "mt-8" : ""}`}>3 Usuários</p> */}
                    </div>

                    <button onClick={comprar} className='btn btn-success rounded-2 duration-150 px-3 mt-6 mx-auto py-2'>
                        Comprar
                    </button>
                </div>
 
                {/* <div className="max-w-[1240px] mx-auto grid md:grid-cols-3 gap-8"> */}
                    {/* {precos.map((p, index) => ( */}
                        {/* <div key={index} className={`w-100 shadow-xl d-flex flex-column p-4 rounded-3 hover:scale-105 duration-300 bg-white`}> */}
                            {/* <img
                            className="w-20 mx-auto mt-[-3rem] bg-white"
                            src={card.image}
                            alt="/"
                            /> */}
                            {/* <h2 className="fs-5 font-bold text-center">{p.mes} Meses</h2>

                            <p className="text-center fs-7 fw-bold">R$ {p.preco},00</p>
                            <p className="text-center fs-2">R$ {p.unitario},00/Mês</p> */}

                            {/* <div className="text-center font-medium">
                                <p className={`py-2 border-b mx-8 ${index === 0 ? "mt-8" : ""}`}>3 Alunos</p>
                                <p className={`py-2 border-b mx-8 ${index === 0 ? "mt-8" : ""}`}>3 Usuários</p>
                            </div> */}
                            {/* <button className='btn btn-success rounded-2 duration-150 px-3 mt-6 mx-auto py-2'>
                                Comprar
                            </button> */}
                        {/* </div> */}
                    {/* ))} */}
                {/* </div> */}

                {/* <div className="controls-passos text-right">
                    <button id="btnPassoOne" className="fade-in btn btn-primary">Pr&oacute;ximo <i className="fa fa-long-arrow-right" aria-hidden="true"></i></button>
                </div> */}
            </div>
        </div>
    )
}

export default Licenca;