import { get, post } from "./api";

export const getAgenda = async (cod_empresa) => {
    const resp = await post('/agenda/getAgenda', { cod_empresa });
    if (resp.status) return resp.agenda;
    throw new Error("Erro ao carregar agenda");
};

export const setAgenda = async (evento) => {
    const resp = await post('/agenda/setAgenda', { evento });
    if (resp.status) return resp.agenda;
    throw new Error("Erro ao carregar agendas");
};

export const conectGoogle = async () => {
    const resp = await get('/agenda/conectGoogle');
    if (resp.status) return resp.url;
    throw new Error("Erro ao carregar agendas");
};

export const conectedGoogle = async (code, scope, cod_empresa) => {
    const resp = await post('/agenda/conectedGoogle', { code, scope, cod_empresa });
    if (resp.status) return resp;
    throw new Error("Erro ao carregar agendas");
};

export const syncGoogleEvents = async (cod_empresa) => {
    const resp = await post('/agenda/syncGoogleEvents', { cod_empresa });
    if (resp.status) return resp.google;
    throw new Error("Erro ao carregar agendas");
};