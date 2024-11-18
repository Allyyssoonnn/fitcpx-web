import React from 'react';

function CadAluno() {
    return (
        <div className="container-fluid">
            <div className="card">
            <div className="card-body">
                <a href='javascript:history.back()' className="btn btn-danger mb-3">Cancelar</a>

                <h5 className="card-title fw-semibold mb-4">Informações</h5>
                <div className="card">
                    <div className="card-body">
                        <form>
                            <div className="mb-3">
                                <label className="form-label">Nome*</label>
                                <input type="text" className="form-control" id="exampleInputEmail1" />
                            </div>
                            <div className="mb-3">
                                <label for="exampleInputEmail1" className="form-label">E-mail*</label>
                                <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                                <div id="emailHelp" className="form-text">O aluno usará para acessar a plataforma</div>
                            </div>
                            <div className="mb-3">
                                <label for="exampleInputPassword1" className="form-label">Senha</label>
                                <input type="password" className="form-control" id="exampleInputPassword1" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">CPF</label>
                                <input type="text" className="form-control" id="exampleInputEmail1" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">RG</label>
                                <input type="text" className="form-control" id="exampleInputEmail1" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Telefone</label>
                                <input type="text" className="form-control" id="exampleInputEmail1" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Data de nascimento</label>
                                <input type="date" className="form-control" id="exampleInputEmail1" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Sexo</label>
                                <input type="text" className="form-control" id="exampleInputEmail1" />
                            </div>
                            {/* <div className="mb-3 form-check">
                                <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                                <label className="form-check-label" for="exampleCheck1">Check me out</label>
                            </div>
                            <button type="submit" className="btn btn-primary">Submit</button> */}
                        </form>
                    </div>
                </div>

                <h5 className="card-title fw-semibold mb-4">Endereço</h5>
                
                <div className="card mb-0">
                    <div className="card-body">
                        <form>
                            <div className="mb-3">
                                <label className="form-label">CEP</label>
                                <input type="text" className="form-control" id="exampleInputEmail1" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Estado</label>
                                <input type="text" className="form-control" id="exampleInputEmail1" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Cidade</label>
                                <input type="text" className="form-control" id="exampleInputEmail1" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Endereço</label>
                                <input type="text" className="form-control" id="exampleInputEmail1" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Número</label>
                                <input type="text" className="form-control" id="exampleInputEmail1" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Complemento</label>
                                <input type="text" className="form-control" id="exampleInputEmail1" />
                            </div>
                            <button type="submit" className="btn btn-success">Confirmar</button>
                        </form>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
}

export default CadAluno;