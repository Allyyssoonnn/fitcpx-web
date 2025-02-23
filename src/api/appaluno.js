import { post } from "./api";

export const login = async (login, senha) => {
    const resp = await post('/appaluno/login', { login, senha });
    if (resp.status) return resp;
    throw new Error("Erro ao carregar alunos");
};

export const finishTreino = async (sessao, tempo) => {
    const resp = await post('/appaluno/finishTreino', { sessao, tempo });
    if (resp.status) return resp;
    throw new Error("Erro ao carregar alunos");
};

export const getTreinosRealizados = async (cod_aluno) => {
    const resp = await post('/appaluno/getTreinosRealizados', { cod_aluno });
    if (resp.status) return resp.treinos;
    throw new Error("Erro ao carregar alunos");
};