import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useRecoilState } from 'recoil';
import { stateUsuario } from '../states/usuario';

function MinhaConta() {
    const navigate = useNavigate();

    const [usuario] = useRecoilState(stateUsuario);
    console.log(usuario);
    

    // Exemplo de dados do usuário (substitua com dados reais de um usuário logado)
    // const usuario = {
    //     nome: "João Silva",
    //     email: "joao.silva@example.com",
    //     telefone: "(11) 98765-4321",
    //     endereco: "Rua Exemplo, 123 - São Paulo, SP"
    // };

    return (
        <div className="container-fluid">
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title fw-semibold mb-4">Minha Conta</h5>
                    <div className="card mb-3">
                        <div className="card-body">
                            <div className="mb-3">
                                <label className="form-label">Nome</label>
                                <p>{usuario.nome_usuario}</p>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">E-mail</label>
                                <p>{usuario.email_usuario}</p>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Telefone</label>
                                {/* <p>{usuario.telefone}</p> */}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Endereço</label>
                                {/* <p>{usuario.endereco}</p> */}
                            </div>
                        </div>
                    </div>

                    <div className="d-flex justify-content-between">
                        <Button 
                            className="btn btn-warning"
                            onClick={() => navigate('/editar-conta')}
                        >
                            <i className="bi bi-pencil me-2"></i>Editar
                        </Button>
                        <Button 
                            className="btn btn-danger"
                            onClick={() => navigate('/entrar')}  // Redireciona para login (simulando logout)
                        >
                            <i className="bi bi-box-arrow-left me-2"></i>Sair
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MinhaConta;