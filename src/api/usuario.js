import { post, postImage } from "./api";

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
