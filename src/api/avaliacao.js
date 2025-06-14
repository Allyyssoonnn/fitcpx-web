import { post } from "./api";

export const getResultPhysicalAssesment = async (avaliacao) => {
    const resp = await post('/avaliacao/getResultPhysicalAssesment', { avaliacao });
    if (resp.status) return resp.result;
    throw new Error("Erro ao carregar aluno");
};