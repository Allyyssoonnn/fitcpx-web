import { toast } from "react-toastify";
import { get, post, postImage } from "./api";

export const criarPagamentoAluno = async (cod_aluno, formaPagamento, cod_empresa, cod_usuario, cod_aluno_contrato, paymentId, formCard, typePayment) => {
    const resp = await post('/pagamento/criarPagamentoAluno', { cod_aluno, formaPagamento, cod_empresa, cod_usuario, cod_aluno_contrato, paymentId, formCard, typePayment });
    if (resp.status) {
        return resp.pagamento;
    } toast.error(resp.message);
};

export const buscarCobrancaAluno = async (id) => {
    const resp = await post('/pagamento/buscarCobrancaAluno', { id });
    if (resp.status) {
        return resp.cobranca;
    } toast.error(resp.message);
};

export const pagarCobranca = async (asaasId, cod_aluno_cartao) => {
    const resp = await post('/pagamento/pagarCobranca', { asaasId, cod_aluno_cartao });
    if (resp.status) {
        return resp.cobranca;
    } toast.error(resp.message);
};