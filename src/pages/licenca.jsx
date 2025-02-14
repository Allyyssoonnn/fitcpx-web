import { useEffect, useState } from "react";
import MercadoPago from "../components/mercadopago";
import { stateEmpresa, stateUsuario } from "../states/states";
import { useRecoilState } from "recoil";
import { useForm } from "react-hook-form";


function Licenca() {
    const { handleSubmit, register, setValue, watch } = useForm();
    const [usuario, setusuario] = useRecoilState(stateUsuario);
    const [empresa] = useRecoilState(stateEmpresa);
    const [editing, setEditing] = useState(false);
    const [renovando, setRenovando] = useState(false);
    const [status, setStatus] = useState('Licença gratuita');

    useEffect(() => {
        Object.keys(empresa).forEach((key) => {
            setValue(key, empresa[key]);
        });
    }, [empresa]);

    return (
        <div className="container-fluid">
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title fw-semibold mb-4">Licença de uso</h5>

                    <div className="row g-4">
                        <div className="col-md-7 bg-light rounded py-3">
                            <div className="p-3 bg-success-subtle rounded-1 d-flex align-items-center">
                                <img height={30} width={30} src="../assets/images/app/gratis.png" alt="" className="img-fluid" />
                                <div className="d-flex flex-column ms-3">
                                    <h4 className="ms-2">Licença gratuita</h4>
                                    <p>A licença gratuita permite até 3 alunos e 1 único usuário.</p>
                                </div>
                            </div>

                            <Planos />
                            
                            <div className={`col-md-12 ${renovando ? 'd-inline-block' : 'd-none'} justify-content-center bg-dark`}>
                                <button className="btn btn-danger" onClick={() => setRenovando(false)}>
                                    <i className="bi bi-x-circle me-2"></i>Voltar
                                </button>
                                <MercadoPago />
                            </div>
                        </div>

                        <div className="col-md-4 p-3">
                            <h4>Dados da empresa</h4>

                            <div>
                                <label className="form-label">Nome</label>
                                <p className={`${editing ? 'd-none' : ''}`}>{usuario.nome_usuario}</p>
                                <input className={`${!editing ? 'd-none' : ''} form-control`} {...register('nome_empresa')} />
                            </div>
                            <div>
                                <label className="form-label">CNPJ</label>
                                <p className={`${editing ? 'd-none' : ''}`}>{usuario.doc_empresa || 'Não informado'}</p>
                                <input className={`${!editing ? 'd-none' : ''} form-control`} {...register('doc_empresa')} />
                            </div>
                            <div>
                                <label className="form-label">E-mail</label>
                                <p className={`${editing ? 'd-none' : ''}`}>{usuario.email_empresa || 'Não informado'}</p>
                                <input className={`${!editing ? 'd-none' : ''} form-control`} {...register('email_empresa')} />
                            </div>
                            <div>
                                <label className="form-label">Telefone</label>
                                <p className={`${editing ? 'd-none' : ''}`}>{usuario.telefone_empresa || 'Não informado'}</p>
                                <input className={`${!editing ? 'd-none' : ''} form-control`} {...register('telefone_empresa')} />
                            </div>
                            <div>
                                <label className="form-label">Endereço</label>
                                <p className={`${editing ? 'd-none' : ''}`}>{usuario.cep_usuario}</p>
                                <p className={`${editing ? 'd-none' : ''}`}>{usuario.endereco_usuario || 'Não informado'} {usuario.numero_usuario} {usuario.complemento_usuario}</p>
                                <p className={`${editing ? 'd-none' : ''}`}>{usuario.cidade_usuario} {usuario.estado_usuario}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card-footer d-flex justify-content-between">
                    <button className="btn btn-success" onClick={() => setRenovando(true)}>
                        <i className="bi bi-arrow-clockwise me-2"></i>Renovar licença
                    </button>

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
    )
}

function Planos() {
    const precos = [
        // { mes: 1, preco: 150 },
        { mes: 3, preco: 410, unitario: 60 },
        { mes: 6, preco: 940, unitario: 130 },
        { mes: 12, preco: 1650, unitario: 110 },
    ];

    return (
        <div className="mt-5">
            <div className="col-md-12 d-flex justify-content-center flex-wrap gap-3">
                
                <div className={`w-60 shadow-md d-flex flex-row p-4 rounded-3 hover:scale-105 duration-300 justify-content-between align-items-center bg-white`}>
                    <div>
                        <h2 className="fs-5 font-bold text-center">1 Mês</h2>
                        <p className="text-center fs-7 fw-bold">R$ 150,00</p>
                    </div>

                    <button className='btn btn-success rounded-2 duration-150 px-3 mt-6 py-2'>
                        Comprar
                    </button>
                </div>
 
                <div className="max-w-[1240px] mx-auto grid md:grid-cols-3 gap-8">
                    {precos.map((p, index) => (
                        <div key={index} className={`w-100 shadow-xl d-flex flex-column p-4 rounded-3 hover:scale-105 duration-300 bg-white`}>
                            {/* <img
                            className="w-20 mx-auto mt-[-3rem] bg-white"
                            src={card.image}
                            alt="/"
                            /> */}
                            <h2 className="fs-5 font-bold text-center">{p.mes} Meses</h2>

                            <p className="text-center fs-7 fw-bold">R$ {p.preco},00</p>
                            <p className="text-center fs-2">R$ {p.unitario},00/Mês</p>

                            {/* <div className="text-center font-medium">
                                <p className={`py-2 border-b mx-8 ${index === 0 ? "mt-8" : ""}`}>3 Alunos</p>
                                <p className={`py-2 border-b mx-8 ${index === 0 ? "mt-8" : ""}`}>3 Usuários</p>
                            </div> */}
                            <button className='btn btn-success rounded-2 duration-150 px-3 mt-6 mx-auto py-2'>
                                Comprar
                            </button>
                        </div>
                    ))}
                </div>

                {/* <div className="controls-passos text-right">
                    <button id="btnPassoOne" className="fade-in btn btn-primary">Pr&oacute;ximo <i className="fa fa-long-arrow-right" aria-hidden="true"></i></button>
                </div> */}
            </div>
        </div>
    )
}

export default Licenca;