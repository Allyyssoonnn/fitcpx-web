import { toast } from "react-toastify";
import { post, postFile, postImage } from "./api";

export const getAlunos = async (codUsuario, cod_empresa, deleted) => {
    const resp = await post('/aluno/getAlunos', { cod_usuario: codUsuario, cod_empresa, deleted });
    if (resp.status) return resp.alunos;
    throw new Error("Erro ao carregar alunos");
};

export const getAluno = async (codAluno) => {
    const resp = await post('/aluno/getAluno', { cod_aluno: codAluno });
    if (resp.status) return resp.aluno;
    throw new Error("Erro ao carregar aluno");
};

export const getCards = async (codAluno) => {
    const resp = await post('/aluno/getCards', { cod_aluno: codAluno });
    if (resp.status) return resp.cards;
    throw new Error("Erro ao carregar aluno");
};

export const deleteCard = async (cod_aluno_cartao) => {
    const resp = await post('/aluno/deleteCard', { cod_aluno_cartao });
    if (resp.status) return resp.status;
    throw new Error("Erro ao carregar sessao");
};

export const setAluno = async (aluno) => {
    const resp = await post('/aluno/setAluno', { aluno });
    if (resp.status) {
        return resp.aluno;
    } else toast.error(resp.msg);
    throw new Error("Erro ao carregar alunos");
};

export const deleteAluno = async (cod_aluno) => {
    const resp = await post('/aluno/deleteAluno', { cod_aluno });
    if (resp.status) return resp.sessao;
    throw new Error("Erro ao carregar sessao");
};

export const recoveryAluno = async (cod_aluno) => {
    const resp = await post('/aluno/recoveryAluno', { cod_aluno });
    if (resp.status) return resp.sessao;
    throw new Error("Erro ao carregar sessao");
};

export const getAvaliacoes = async (codEmpresa, cod_aluno) => {
    const resp = await post('/aluno/getAvaliacoes', { cod_empresa: codEmpresa, cod_aluno });
    if (resp.status) return resp.avaliacoes;
    throw new Error("Erro ao carregar aluno");
};

export const getAvaliacao = async (codAluno) => {
    const resp = await post('/aluno/getAvaliacao', { cod_aluno: codAluno });
    if (resp.status) return resp.aluno;
    throw new Error("Erro ao carregar aluno");
};

export const setAvaliacao = async (avaliacao) => {
    const resp = await post('/aluno/setAvaliacao', { avaliacao });
    if (resp.status) return resp.avaliacao;
    throw new Error("Erro ao carregar alunos");
};

export const deleteAvaliacao = async (cod_avaliacao) => {
    const resp = await post('/aluno/deleteAvaliacao', { cod_avaliacao });
    if (resp.status) return resp;
    throw new Error("Erro ao carregar sessao");
};

export const changeAlunoIMG = async (img, data) => {
    const resp = await postImage('/aluno/changeAlunoIMG', img, data);
    if (resp.status) return resp;
    throw new Error("Erro ao carregar alunos");
};

export const sendAvaliacaoIMG = async (img, data) => {
    const resp = await postImage('/aluno/sendAvaliacaoIMG', img, data);
    if (resp.status) return resp;
    throw new Error("Erro ao carregar alunos");
};

export const setAlunoContrato = async (plano) => {
    const resp = await post('/aluno/setAlunoContrato', { plano });
    if (resp.status) return resp.alunoContrato;
    throw new Error("Erro ao carregar alunos");
};

export const cancelAlunoContrato = async (cod_aluno_contrato) => {
    const resp = await post('/aluno/cancelAlunoContrato', { cod_aluno_contrato });
    if (resp.status) return resp.status;
    throw new Error("Erro ao carregar alunos");
};

export const sendAlunoContrato = async (cod_aluno_contrato, blob) => {
    const resp = await postFile('/aluno/sendAlunoContrato', { cod_aluno_contrato }, blob);
    if (resp.status) return resp;
    throw new Error("Erro ao carregar alunos");
};

export const getAlunoContratos = async (cod_aluno, cod_empresa) => {
    const resp = await post('/aluno/getAlunoContratos', { cod_aluno, cod_empresa });
    if (resp.status) return resp.alunoContratos;
    throw new Error("Erro ao carregar alunos");
};

export const getAlunoContrato = async (cod_aluno_contrato, cod_empresa) => {
    const resp = await post('/aluno/getAlunoContrato', { cod_aluno_contrato, cod_empresa });
    if (resp.status) return resp.alunoContrato;
    throw new Error("Erro ao carregar alunos");
};