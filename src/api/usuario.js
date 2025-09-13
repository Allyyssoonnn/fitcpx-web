import { postImage } from "./api";

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
