import { post } from "./api";

export const getAgenda = async (codUsuario) => {
    const resp = await post('/agenda/getAgenda', { cod_usuario: codUsuario });
    if (resp.status) return resp.agenda;
    throw new Error("Erro ao carregar agenda");
};

export const setAgenda = async (evento) => {
    const resp = await post('/agenda/setAgenda', { evento });
    if (resp.status) return resp.agenda;
    throw new Error("Erro ao carregar agendas");
};