import { post } from "./api";

export const getAgenda = async (cod_empresa, cod_aluno) => {
   const resp = await post("/agenda/getAgenda", { cod_empresa, cod_aluno });
   if (resp.status) return resp.agenda;
   throw new Error("Erro ao carregar agenda");
};

export const setAgenda = async (evento) => {
   const resp = await post("/agenda/setAgenda", { evento });
   if (resp.status) return resp.agenda;
   throw new Error("Erro ao carregar agendas");
};
