import { post, postImage } from "./api";

export const getCardapios = async (params) => {
    const resp = await post('/cardapio/getCardapios', params);
    if (resp.status) return resp.cardapios;
    throw new Error("Erro ao carregar exercicios");
};

export const deleteCardapio = async (cod_cardapio) => {
    const resp = await post('/cardapio/deleteCardapio', { cod_cardapio });
    if (resp.status) return resp.sessao;
    throw new Error("Erro ao carregar sessao");
};

export const recoveryCardapio = async (cod_cardapio) => {
    const resp = await post('/cardapio/recoveryCardapio', { cod_cardapio });
    if (resp.status) return resp.sessao;
    throw new Error("Erro ao carregar sessao");
};

export const setRefeicao = async (refeicoes, cod_cardapio, cod_usuario, cod_empresa, removidos) => {
    const resp = await post('/cardapio/setRefeicao', { refeicoes, cod_cardapio, cod_usuario, cod_empresa, removidos });
    if (resp.status) return resp.refeicoes;
    throw new Error("Erro ao carregar grupo");
};

export const setCardapio = async (cardapio) => {
    const resp = await post('/cardapio/setCardapio', { cardapio });
    if (resp.status) return resp.cardapio;
    throw new Error("Erro ao carregar grupo");
};

export const getAlimentos = async (codEmpresa, deleted) => {
    const resp = await post('/cardapio/getAlimentos', { cod_empresa: codEmpresa, deleted });
    if (resp.status) return resp.alimentos;
    throw new Error("Erro ao carregar exercicios");
};

export const setAlimento = async (alimento) => {
    const resp = await post('/cardapio/setAlimento', { alimento });
    if (resp.status) return resp.cod_alimento;
    throw new Error("Erro ao carregar grupo");
};

export const changeAlimentoIMG = async (img, data) => {
    const resp = await postImage('/cardapio/changeAlimentoIMG', img, data);
    if (resp.status) return resp;
    throw new Error("Erro ao carregar alunos");
};

export const deleteAlimento = async (cod_alimento) => {
    const resp = await post('/cardapio/deleteAlimento', { cod_alimento });
    if (resp.status) return resp.grupo;
    throw new Error("Erro ao carregar grupo");
};

export const recoveryAlimento = async (cod_alimento) => {
    const resp = await post('/cardapio/recoveryAlimento', { cod_alimento });
    if (resp.status) return resp.grupo;
    throw new Error("Erro ao carregar grupo");
};

export const getGrupoAlimentos = async (codEmpresa, deleted) => {
    const resp = await post('/cardapio/getGrupoAlimentos', { cod_empresa: codEmpresa, deleted });
    if (resp.status) return resp.grupos;
    throw new Error("Erro ao carregar exercicios");
};

export const setGrupoAlimento = async (grupo) => {
    const resp = await post('/cardapio/setGrupoAlimento', { grupo });
    if (resp.status) return resp.grupo;
    throw new Error("Erro ao carregar grupo");
};

export const deleteGrupoAlimento = async (cod_grupo_alimento) => {
    const resp = await post('/cardapio/deleteGrupoAlimento', { cod_grupo_alimento });
    if (resp.status) return resp.grupo;
    throw new Error("Erro ao carregar grupo");
};

export const recoveryGrupoAlimento = async (cod_grupo_alimento) => {
    const resp = await post('/cardapio/recoveryGrupoAlimento', { cod_grupo_alimento });
    if (resp.status) return resp.grupo;
    throw new Error("Erro ao carregar grupo");
};