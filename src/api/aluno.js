import { post, postFile } from "./api";

export const cancelAlunoContrato = async (cod_aluno_contrato) => {
   const resp = await post("/aluno/cancelAlunoContrato", {
      cod_aluno_contrato,
   });
   if (resp.status) return resp.status;
   throw new Error("Erro ao carregar alunos");
};

export const resendAlunoContrato = async (cod_aluno_contrato, blob) => {
   const resp = await postFile("/aluno/resendAlunoContrato", { cod_aluno_contrato }, blob);
   if (resp.status) return resp;
   throw new Error("Erro ao carregar alunos");
};

export const downloadAlunoContrato = async (cod_aluno_contrato, signed) => {
   const resp = await post("/aluno/downloadAlunoContrato", {
      cod_aluno_contrato,
      signed,
   });
   if (resp.status) return resp.url;
   throw new Error("Erro ao carregar alunos");
};

export const getAlunoContratos = async (cod_aluno, cod_empresa) => {
   const resp = await post("/aluno/getAlunoContratos", {
      cod_aluno,
      cod_empresa,
   });
   if (resp.status) return resp.alunoContratos;
   throw new Error("Erro ao carregar alunos");
};

export const getAlunoContrato = async (cod_aluno_contrato, cod_empresa) => {
   const resp = await post("/aluno/getAlunoContrato", {
      cod_aluno_contrato,
      cod_empresa,
   });
   if (resp.status) return resp.alunoContrato;
   throw new Error("Erro ao carregar alunos");
};
