import { post } from "./api";

export const getAlunos = async (codUsuario) => {
    const resp = await post('/aluno/getAlunos', { cod_usuario: codUsuario });
    if (resp.status) return resp.alunos;
    throw new Error("Erro ao carregar alunos");
};

export const setAluno = async (aluno) => {
    const resp = await post('/aluno/setAluno', { aluno });
    if (resp.status) return resp.aluno;
    throw new Error("Erro ao carregar alunos");
};