import { get, post, postImage } from "./api";

export const loginGoogle = async () => {
   const resp = await get("/usuario/loginGoogle");
   if (resp.status) return resp.url;
   throw new Error("Erro ao carregar alunos");
};

export const loggedGoogle = async (code, scope, cod_empresa) => {
   const resp = await post("/usuario/loggedGoogle", { code, scope, cod_empresa });
   if (resp.status) return resp;
   throw new Error("Erro ao carregar alunos");
};

export const getProtocolos = async (codUsuario) => {
   const resp = await post("/usuario/getProtocolos", { cod_usuario: codUsuario });
   if (resp.status) return resp.protocolos;
   throw new Error("Erro ao carregar alunos");
};

export const changeUsuarioIMG = async (img, data) => {
   const resp = await postImage("/usuario/changeUsuarioIMG", img, data);
   if (resp.status) return resp;
   throw new Error("Erro ao carregar alunos");
};

export const changeEmpresaIMG = async (img, data) => {
   const resp = await postImage("/usuario/changeEmpresaIMG", img, data);
   if (resp.status) return resp;
   throw new Error("Erro ao carregar alunos");
};

export const setUsuario = async (usuario) => {
   const resp = await post("/usuario/setUsuario", { usuario });
   if (resp.status) return resp.usuario;
   throw new Error("Erro ao carregar alunos");
};

export const setEmpresa = async (empresa) => {
   const resp = await post("/usuario/setEmpresa", { empresa });
   if (resp.status) return resp.empresa;
   throw new Error("Erro ao carregar alunos");
};
