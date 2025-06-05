import { toast } from "react-toastify";
import { get, post } from "./api";

export const getLicencas = async () => {
    const resp = await get('/licenca/getLicencas');
    if (resp.status) {
        return resp.licencas;
    } else toast.error(resp.message);
    throw new Error("Erro ao carregar agenda");
};

export const getLicenca = async (cod_empresa) => {
    const resp = await post('/licenca/getLicenca', { cod_empresa });
    if (resp.status) {
        return resp.licenca;
    } else toast.error(resp.message);
    throw new Error("Erro ao carregar agenda");
};

export const cancelLicenca = async (cod_empresa_licenca) => {
    const resp = await post('/licenca/cancelLicenca', { cod_empresa_licenca });
    if (resp.status) {
        return resp.licenca;
    } else toast.error(resp.message);
    throw new Error("Erro ao carregar agenda");
};

export const buyLicenca = async (cod_empresa, cod_licenca) => {
    const resp = await post('/licenca/buyLicenca', { cod_empresa, cod_licenca });
    if (resp.status) {
        return resp.licenca;
    } else toast.error(resp.message);
    throw new Error("Erro ao carregar agenda");
};

export const getPayments = async (cod_empresa) => {
    const resp = await post('/licenca/getPayments', { cod_empresa });
    if (resp.status) {
        return resp.payments;
    } else toast.error(resp.message);
    throw new Error("Erro ao carregar agenda");
};
