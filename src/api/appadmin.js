import { post } from "./api";

export const login = async (email, senha) => {
    const resp = await post('/appadmin/login', { email, senha });
    if (resp.status) return resp;
    throw new Error("Erro ao carregar alunos");
};