import { post, postImage } from "./api";

export const getProtocolos = async (codUsuario) => {
    const resp = await post('/usuario/getProtocolos', { cod_usuario: codUsuario });
    if (resp.status) return resp.protocolos;
    throw new Error("Erro ao carregar alunos");
};

export const changeUsuarioIMG = async (img, data) => {
    const resp = await postImage('/usuario/changeUsuarioIMG', img, data);
    if (resp.status) return resp;
    throw new Error("Erro ao carregar alunos");
};

export const setUsuario = async (data) => {
    const resp = await post('/usuario/setUsuario', data);
    if (resp.status) return resp.usuario;
    throw new Error("Erro ao carregar alunos");
};