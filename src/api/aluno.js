import { post } from "./api";

export const getAlunos = async (codUsuario) => {
    const resp = await post('/aluno/getAlunos', { cod_usuario: codUsuario });
    if (resp.status) return resp.alunos;
    throw new Error("Erro ao carregar alunos");
};

export const getAluno = async (codAluno) => {
    const resp = await post('/aluno/getAluno', { cod_aluno: codAluno });
    if (resp.status) return resp.aluno;
    throw new Error("Erro ao carregar aluno");
};

export const setAluno = async (aluno) => {
    const resp = await post('/aluno/setAluno', { aluno });
    if (resp.status) return resp.aluno;
    throw new Error("Erro ao carregar alunos");
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