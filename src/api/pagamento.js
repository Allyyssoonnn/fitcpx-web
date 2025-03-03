import { get, post } from "./api";

export const getPagamento = async (cod_usuario, cod_empresa, recorrente) => {
    const resp = await post('/pagamento/getPagamento', { cod_usuario, cod_empresa, recorrente });
    if (resp.status) return resp.pagamento;
    throw new Error("Erro ao carregar agenda");
};

export const donePagamento = async (data, cod_usuario, cod_empresa, recorrente) => {
    const resp = await post('/pagamento/donePagamento', { data, cod_usuario, cod_empresa, recorrente });
    if (resp.status) return resp.init;
    throw new Error("Erro ao carregar agenda");
};