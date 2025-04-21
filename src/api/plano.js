import { post } from "./api";

export const setPlano = async (plano, modalidades) => {
    const resp = await post('/plano/setPlano', { plano, modalidades });
    if (resp.status) return resp;
    throw new Error("Erro ao carregar grupo");
};

export const getPlanos = async (cod_empresa, deleted) => {
    const resp = await post('/plano/getPlanos', { cod_empresa, deleted });
    if (resp.status) return resp.planos;
    throw new Error("Erro ao carregar grupo");
};

export const deletePlano = async (cod_plano) => {
    const resp = await post('/plano/deletePlano', { cod_plano });
    if (resp.status) return resp;
    throw new Error("Erro ao carregar grupo");
};

export const recoveryPlano = async (cod_plano) => {
    const resp = await post('/plano/recoveryPlano', { cod_plano });
    if (resp.status) return resp;
    throw new Error("Erro ao carregar grupo");
};

export const setModalidade = async (modalidade) => {
    const resp = await post('/plano/setModalidade', { modalidade });
    if (resp.status) return resp;
    throw new Error("Erro ao carregar grupo");
};

export const getModalidades = async (cod_empresa, deleted) => {
    const resp = await post('/plano/getModalidades', { cod_empresa, deleted });
    if (resp.status) return resp.modalidades;
    throw new Error("Erro ao carregar grupo");
};

export const deleteModalidade = async (cod_modalidade) => {
    const resp = await post('/plano/deleteModalidade', { cod_modalidade });
    if (resp.status) return resp;
    throw new Error("Erro ao carregar grupo");
};

export const recoveryModalidade = async (cod_modalidade) => {
    const resp = await post('/plano/recoveryModalidade', { cod_modalidade });
    if (resp.status) return resp;
    throw new Error("Erro ao carregar grupo");
};

export const setModContrato = async (contrato) => {
    const resp = await post('/plano/setModContrato', { contrato });
    if (resp.status) return resp;
    throw new Error("Erro ao carregar grupo");
};

export const getModContratos = async (cod_empresa, deleted) => {
    const resp = await post('/plano/getModContratos', { cod_empresa, deleted });
    if (resp.status) return resp.contratos;
    throw new Error("Erro ao carregar grupo");
};

export const deleteContrato = async (cod_contrato) => {
    const resp = await post('/plano/deleteContrato', { cod_contrato });
    if (resp.status) return resp;
    throw new Error("Erro ao carregar grupo");
};

export const recoveryContrato = async (cod_contrato) => {
    const resp = await post('/plano/recoveryContrato', { cod_contrato });
    if (resp.status) return resp;
    throw new Error("Erro ao carregar grupo");
};