import { post } from "./api";

export const login = async (email, senha) => {
    const resp = await post('/appaluno/login', { email, senha });
    if (resp.status) return resp;
    throw new Error("Erro ao carregar alunos");
};