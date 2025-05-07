import { toast } from "react-toastify";
import { get, post, postImage } from "./api";

export const cashWithdrawal = async (cod_empresa) => {
    const resp = await post('/pagamento/cashWithdrawal', { cod_empresa });
    if (resp.status) {
        return resp.status;
    } else toast.error(resp.message);
    throw new Error("Erro ao carregar agenda");
};

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
    const resp = await post('/pagamento/getSetupIntent', { cod_empresa, cod_aluno });
    if (resp.status) {
        return resp.clientSecret;
    } else toast.error(resp.message);
    throw new Error("Erro ao carregar agenda");
};

export const getCards = async (cod_empresa, cod_aluno) => {
    const resp = await post('/pagamento/getPaymentsMethod', { cod_empresa, cod_aluno });
    if (resp.status) {
        return resp.paymentsMethod;
    } else toast.error(resp.message);
    throw new Error("Erro ao carregar agenda");
};

export const getStatusAccount = async (cod_empresa) => {
    const resp = await post('/pagamento/getStatusAccount', { cod_empresa });
    if (resp.status) {
        return resp.clientSecret;
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