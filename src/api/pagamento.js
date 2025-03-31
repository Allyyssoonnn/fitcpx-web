import { get, post } from "./api";

export const processPagamento = async (formaPagamento, cod_empresa, cod_usuario, recorrente, cartao, cod_empresa_cartao) => {
    const resp = await post('/pagamento/processPagamento', { formaPagamento, cod_empresa, cod_usuario, recorrente, cartao, cod_empresa_cartao });    
    if (resp.status) return resp.pagamento;
    throw new Error("Erro ao carregar agenda");
};

export const getPIXPagamento = async (cod_pagamento_usuario) => {
    const resp = await post('/pagamento/getPIXPagamento', { cod_pagamento_usuario });
    if (resp.status) return resp.pix;
    throw new Error("Erro ao carregar agenda");
};

export const getPagamentos = async (cod_empresa) => {
    const resp = await post('/pagamento/getPagamentos', { cod_empresa });
    if (resp.status) return resp.pagamentos;
    throw new Error("Erro ao carregar agenda");
};

export const deletePagamento = async (cod_pagamento_usuario) => {
    const resp = await post('/pagamento/deletePagamento', { cod_pagamento_usuario });
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