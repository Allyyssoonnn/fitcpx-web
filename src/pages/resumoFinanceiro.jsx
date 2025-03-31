import { useRecoilState } from "recoil";
import { stateEmpresa, useNotificacao } from "../states/states";
import { useEffect, useRef, useState } from "react";
import { setEmpresa } from "../api/usuario";

function ResumoFinanceiro() {
    const [empresa] = useRecoilState(stateEmpresa);

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-8">
                    <Pagamentos />
                </div>

                <div className="col-md-4">
                    <Taxas />
                    <DadosRecebimento />
                </div>
            </div>
        </div>
    )
}

function Pagamentos() {
    return (
        <div className="card">
            <div className="card-body">
                <h6 className="card-title">Resumo financeiro</h6>
            </div>
        </div>
    )
}

function Taxas() {
    return (
        <div className="card">
            <div className="card-body">
                <h6 className="card-title">Taxas</h6>
                <p>Taxa de saque: <strong>R$ 2,00/Saque</strong></p>
                <p className="text-center fs-2 m-0">Ao realizar o saque será descontado a taxa</p>
            </div>
        </div>
    )
}

function DadosRecebimento() {
    const { nError } = useNotificacao();
    const pixRef = useRef(null);
    const [empresa, setempresa] = useRecoilState(stateEmpresa);
    const [pix, setpix] = useState(empresa?.pix_empresa || '');
    const [editPix, setEditPix] = useState(false);
    
    // Aplica o foco quando editPix muda para true
    useEffect(() => {
        if (editPix && pixRef.current) {
            pixRef.current.focus();
        }
    }, [editPix]);

    function validarPix(valor) {
        const regexCpf = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/; // Formato CPF
        const regexCnpj = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/; // Formato CNPJ
        const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Formato E-mail

        return regexCpf.test(valor) || regexCnpj.test(valor) || regexEmail.test(valor);
    }

    async function confirmaPix() {        
        if (!validarPix(pix)) {
            nError('Chave PIX inválida!', 'Use um CPF, CNPJ ou E-mail válido.');
            return;
        }

        setEditPix(false);
        const respEmpresa = await setEmpresa({ ...empresa, pix_empresa: pix });
        setempresa(respEmpresa);
    }

    return (
        <div className="card">
            <div className="card-body">
                <h6 className="card-title mb-3">Dados para recebimento</h6>

                <div>
                    <label className="form-label">Saldo</label>
                    <p className="text-dark text-center py-1 rounded border border-success bg-success-subtle">
                        <strong>R$ 2.146,45</strong>
                    </p>
                </div>

                <div>
                    <label className="form-label">CNPJ</label>
                    <p>{empresa.doc_empresa || 'Não informado'}</p>
                </div>

                <div>
                    <label className="form-label">Chave PIX <span className="text-muted">(CNPJ, CPF, E-mail)</span></label>
                    <div className="d-flex align-items-center gap-2">
                        <input ref={pixRef} disabled={!editPix} value={pix} onChange={e => setpix(e.target.value)} placeholder="Informar chave PIX" className="form-control" />
                        {!editPix && (
                            <button onClick={() => setEditPix(true)} className="btn btn-sm btn-outline-primary rounded">
                                <i className="bi bi-pen" />
                            </button>
                        )}
                        {editPix && (
                            <button
                                className="btn btn-sm btn-outline-success rounded"
                                onKeyDown={e => e.key == 'Enter' ? confirmaPix() : null}
                                onClick={confirmaPix}
                            >
                                <i className="bi bi-check-circle" />
                            </button>
                        )}
                    </div>
                </div>

                <button className="btn btn-success rounded mt-3 w-100">Solicitar Saque</button>
                <p className="text-center fs-2">Valor integral com desconto será enviado para o pix informado</p>
            </div>
        </div>
    )
}

export default ResumoFinanceiro;