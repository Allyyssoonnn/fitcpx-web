import { post } from "./api";

export const getAlunos = async (codUsuario) => {
    const resp = await post('/aluno/getAlunos', { cod_usuario: codUsuario });
    if (resp.status) return resp.alunos;
    throw new Error("Erro ao carregar alunos");
};