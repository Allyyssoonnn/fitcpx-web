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