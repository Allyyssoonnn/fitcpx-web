import { toast } from "react-toastify";
import { get, post } from "./api";

export const gerarIdCarteira = async (cod_empresa) => {
    const resp = await post('/pagamento/gerarIdCarteira', { cod_empresa });
    if (resp.status) {
        return resp.empresa;
    } else toast.error(resp.message);
    throw new Error("Erro ao carregar agenda");
};

export const criarPagamentoAluno = async (cod_aluno, formaPagamento, cod_empresa, cod_usuario, dadosCartao, cod_aluno_cartao, cod_aluno_contrato, mensal, meuip) => {
    const resp = await post('/pagamento/criarPagamentoAluno', { cod_aluno, formaPagamento, cod_empresa, cod_usuario, dadosCartao, cod_aluno_cartao, cod_aluno_contrato, mensal, meuip });
    if (resp.status) {
        return resp.pagamento;
    } toast.error(resp.message);
    // throw new Error("Erro ao carregar agenda");
};

export const getPIXPagamentoAluno = async (cod_aluno_contrato_pagamento, cod_empresa) => {
    const resp = await post('/pagamento/getPIXPagamentoAluno', { cod_aluno_contrato_pagamento, cod_empresa });
    if (resp.status) return resp.pix;
    throw new Error("Erro ao carregar agenda");
};

export const processPagamento = async (formaPagamento, cod_empresa, cod_usuario, recorrente, cartao, cod_empresa_cartao) => {
    const resp = await post('/pagamento/processPagamento', { formaPagamento, cod_empresa, cod_usuario, recorrente, cartao, cod_empresa_cartao });    
    if (resp.status) return resp.pagamento;
    throw new Error("Erro ao carregar agenda");
};

export const getPIXPagamento = async (cod_usuario_pagamento) => {
    const resp = await post('/pagamento/getPIXPagamento', { cod_usuario_pagamento });
    if (resp.status) return resp.pix;
    throw new Error("Erro ao carregar agenda");
};

export const getPagamentos = async (cod_empresa) => {
    const resp = await post('/pagamento/getPagamentos', { cod_empresa });
    if (resp.status) return resp.pagamentos;
    throw new Error("Erro ao carregar agenda");
};

export const deletePagamento = async (cod_usuario_pagamento) => {
    const resp = await post('/pagamento/deletePagamento', { cod_usuario_pagamento });
    if (resp.status) return resp.status;
    throw new Error("Erro ao carregar agenda");
};

export const getCartoes = async (cod_empresa) => {
    const resp = await post('/pagamento/getCartoes', { cod_empresa });
    if (resp.status) return resp.cartoes;
    throw new Error("Erro ao carregar agenda");
};

export const deleteCartao = async (cod_empresa_cartao) => {
    const resp = await post('/pagamento/deleteCartao', { cod_empresa_cartao });
    if (resp.status) return resp.cartoes;
    throw new Error("Erro ao carregar agenda");
};