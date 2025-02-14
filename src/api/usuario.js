import { post, postImage } from "./api";

export const recovery = async (email) => {
    const resp = await post('/usuario/recovery', { email });
    if (resp.status) return resp.usuario;
    throw new Error("Erro ao carregar alunos");
};

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

export const getUsuarios = async (cod_empresa, deleted) => {
    const resp = await post('/usuario/getUsuarios', { cod_empresa, deleted });
    if (resp.status) return resp.usuarios;
    throw new Error("Erro ao carregar alunos");
};

export const setUsuario = async (usuario) => {
    const resp = await post('/usuario/setUsuario', { usuario });
    if (resp.status) return resp.usuario;
    throw new Error("Erro ao carregar alunos");
};

export const verifyEmail = async (codEmpresa) => {
    const resp = await post('/usuario/verifyEmail', { cod_empresa: codEmpresa });
    if (resp.status) return resp.email;
    throw new Error("Erro ao carregar alunos");
};