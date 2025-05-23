import { toast } from "react-toastify";
import { get, post, postImage } from "./api";

export const getBankExtract = async (cod_empresa, month, year) => {
    const resp = await post('/pagamento/getBankExtract', { cod_empresa, month, year });
    if (resp.status) {
        return resp.bankExtract;
    } else toast.error(resp.message);
    throw new Error("Erro ao carregar agenda");
};

export const getBalance = async (cod_empresa) => {
    const resp = await post('/pagamento/getBalance', { cod_empresa });
    if (resp.status) {
        return resp.balance;
    } else toast.error(resp.message);
    throw new Error("Erro ao carregar agenda");
};

export const gerarIdCarteira = async (cod_empresa, cod_usuario) => {
    const resp = await post('/pagamento/gerarIdCarteira', { cod_empresa, cod_usuario });
    if (resp.status) {
        return resp.empresa;
    } else toast.error(resp.message);
    throw new Error("Erro ao carregar agenda");
};

export const sendDocuments = async (frontDoc, backDoc, frontDocType, backDocType, cod_empresa, cod_usuario) => {
    const resp = await post('/pagamento/sendDocuments', { frontDoc, backDoc, frontDocType, backDocType, cod_empresa, cod_usuario });
    if (resp.status) return resp;
    throw new Error("Erro ao carregar alunos");
};

export const getSetupIntent = async (cod_empresa, cod_aluno) => {
    const resp = await post('/pagamento/getIntentPayment', { cod_empresa, cod_aluno });
    if (resp.status) {
        return resp.clientSecret;
    } else toast.error(resp.message);
    throw new Error("Erro ao carregar agenda");
};

export const getSetupIntentCard = async (cod_empresa, cod_aluno, cobrarRecorrente, licenca) => {
    const resp = await post('/pagamento/getSetupIntentCard', { cod_empresa, cod_aluno, cobrarRecorrente, licenca });
    if (resp.status) {
        return resp.clientSecret;
    } else toast.error(resp.message);
    throw new Error("Erro ao carregar agenda");
};

export const updateMethodPayment = async (cod_empresa, cod_aluno, paymentId) => {
    const resp = await post('/pagamento/updateMethodPayment', { cod_empresa, cod_aluno, paymentId });
    if (resp.status) {
        return resp.clientSecret;
    } else toast.error(resp.message);
    throw new Error("Erro ao carregar agenda");
};

export const updatePaymentIntentStatus = async (paymentId, status, cobrarRecorrente, licenca) => {
    const resp = await post('/pagamento/updatePaymentIntentStatus', { paymentId, status, cobrarRecorrente, licenca });
    if (resp.status) {
        return resp;
    } else toast.error(resp.message);
    throw new Error("Erro ao carregar agenda");
};

export const getCards = async (cod_empresa, cod_aluno, licenca) => {
    const resp = await post('/pagamento/getPaymentsMethod', { cod_empresa, cod_aluno, licenca });
    if (resp.status) {
        return resp.paymentsMethod;
    } else toast.error(resp.message);
    throw new Error("Erro ao carregar agenda");
};

export const getIntentPayment = async (cod_empresa, cod_aluno_contrato_pagamento, cod_empresa_licenca_pagamento) => {
    const resp = await post('/pagamento/getIntentPayment', { cod_empresa, cod_aluno_contrato_pagamento, cod_empresa_licenca_pagamento });
    if (resp.status) {
        return resp.payment;
    } else toast.error(resp.message);
    throw new Error("Erro ao carregar agenda");
};

export const doRefundPayment = async (cod_empresa, cod_aluno_contrato_pagamento) => {
    const resp = await post('/pagamento/doRefundPayment', { cod_empresa, cod_aluno_contrato_pagamento });
    if (resp.status) {
        return resp.payment;
    } else toast.error(resp.message);
    throw new Error("Erro ao carregar agenda");
};

export const getStatusAccount = async (cod_empresa, cod_usuario) => {
    const resp = await post('/pagamento/getStatusAccount', { cod_empresa, cod_usuario });
    if (resp.status) {
        return resp.data;
    } else toast.error(resp.message);
    throw new Error("Erro ao carregar agenda");
};

export const criarPagamentoAluno = async (cod_aluno, formaPagamento, cod_empresa, cod_usuario, cod_aluno_contrato, paymentId) => {
    const resp = await post('/pagamento/criarPagamentoAluno', { cod_aluno, formaPagamento, cod_empresa, cod_usuario, cod_aluno_contrato, paymentId });
    if (resp.status) {
        return resp.pagamento;
    } toast.error(resp.message);
    // throw new Error("Erro ao carregar agenda");
};