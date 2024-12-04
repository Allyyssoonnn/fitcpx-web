import { post } from "./api";

export const getProtocolos = async (codUsuario) => {
    const resp = await post('/usuario/getProtocolos', { cod_usuario: codUsuario });
    if (resp.status) return resp.protocolos;
    throw new Error("Erro ao carregar alunos");
};