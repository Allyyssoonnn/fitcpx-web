import { get, post } from "./api";

export const getNotifications = async (cod_empresa) => {
    const resp = await post('/app/getNotifications', { cod_empresa });
    if (resp.status) return resp.notifications;
    throw new Error("Erro ao carregar agenda");
};