import { toast } from "react-toastify";
import { post } from "./api";

export const setAlunoSessaoPacote = async (pacote) => {
    const resp = await post('/aluno/sessao/setAlunoSessaoPacote', { pacote });
    if (resp.status) return resp.alunoSessao;
    throw new Error("Erro ao carregar alunos");
};

export const createPaySessao = async (cod_aluno, formaPagamento, cod_empresa, cod_usuario, cod_aluno_sessao_pacote, paymentId) => {
    const resp = await post('/aluno/sessao/createPaySessao', { cod_aluno, formaPagamento, cod_empresa, cod_usuario, cod_aluno_sessao_pacote, paymentId });
    if (resp.status) {
        return resp.pagamento;
    } toast.error(resp.message);
};

export const getAlunoSessoesPacote = async (cod_aluno, cod_empresa) => {
    const resp = await post('/aluno/sessao/getAlunoSessoesPacote', { cod_aluno, cod_empresa });
    if (resp.status) return resp.alunoSessoes;
    throw new Error("Erro ao carregar alunos");
};

export const getAlunoSessaoPacote = async (cod_aluno_sessao_pacote) => {
    const resp = await post('/aluno/sessao/getAlunoSessaoPacote', { cod_aluno_sessao_pacote });
    if (resp.status) return resp.alunoSessaoPacote;
    throw new Error("Erro ao carregar alunos");
};