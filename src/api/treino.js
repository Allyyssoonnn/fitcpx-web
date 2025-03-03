import { post } from "./api";

export const getTreinos = async (params) => {
    const resp = await post('/treino/getTreinos', { ...params });
    if (resp.status) return resp.treinos;
    throw new Error("Erro ao carregar treinos");
};

export const getTreino = async (cod_treino) => {
    const resp = await post('/treino/getTreino', { cod_treino });
    if (resp.status) return resp.treino;
    throw new Error("Erro ao carregar treinos");
};

export const setTreino = async (treino) => {
    const resp = await post('/treino/setTreino', { treino });
    if (resp.status) return resp.treino;
    throw new Error("Erro ao carregar treinos");
};

export const deleteTreino = async (cod_treino) => {
    const resp = await post('/treino/deleteTreino', { cod_treino });
    if (resp.status) return resp.sessao;
    throw new Error("Erro ao carregar sessao");
};

export const recoveryTreino = async (cod_treino) => {
    const resp = await post('/treino/recoveryTreino', { cod_treino });
    if (resp.status) return resp.sessao;
    throw new Error("Erro ao carregar sessao");
};

export const getGrupoExercicios = async (codEmpresa, deleted) => {
    const resp = await post('/treino/getGrupoExercicios', { cod_empresa: codEmpresa, deleted });
    if (resp.status) return resp.grupos;
    throw new Error("Erro ao carregar grupos");
};

export const setGrupoExercicio = async (grupo) => {
    const resp = await post('/treino/setGrupoExercicio', { grupo });
    if (resp.status) return resp.grupo;
    throw new Error("Erro ao carregar grupo");
};

export const deleteGrupoExercicio = async (cod_grupo_exercicio) => {
    const resp = await post('/treino/deleteGrupoExercicio', { cod_grupo_exercicio });
    if (resp.status) return resp.grupo;
    throw new Error("Erro ao carregar grupo");
};

export const recoveryGrupoExercicio = async (cod_grupo_exercicio) => {
    const resp = await post('/treino/recoveryGrupoExercicio', { cod_grupo_exercicio });
    if (resp.status) return resp.grupo;
    throw new Error("Erro ao carregar grupo");
};

export const getExercicios = async (codEmpresa, deleted) => {
    const resp = await post('/treino/getExercicios', { cod_empresa: codEmpresa, deleted });
    if (resp.status) return resp.exercicios;
    throw new Error("Erro ao carregar exercicios");
};

export const setExercicio = async (exercicio) => {
    const resp = await post('/treino/setExercicio', { exercicio });
    if (resp.status) return resp.exercicio;
    throw new Error("Erro ao carregar grupo");
};

export const deleteExercicio = async (cod_exercicio) => {
    const resp = await post('/treino/deleteExercicio', { cod_exercicio: cod_exercicio });
    if (resp.status) return resp.exercicio;
    throw new Error("Erro ao carregar grupo");
};

export const recoveryExercicio = async (cod_exercicio) => {
    const resp = await post('/treino/recoveryExercicio', { cod_exercicio });
    if (resp.status) return resp.grupo;
    throw new Error("Erro ao carregar grupo");
};

// export const getSessoes = async (codEmpresa, deleted) => {
//     const resp = await post('/treino/getSessoes', { cod_empresa: codEmpresa, deleted });
//     if (resp.status) return resp.sessoes;
//     throw new Error("Erro ao carregar sessoes");
// };

export const setSessao = async (sessoes, cod_treino, cod_usuario, cod_empresa, removidos) => {
    const resp = await post('/treino/setSessoes', { sessoes, cod_treino, cod_usuario, cod_empresa, removidos });
    if (resp.status) return resp.sessoes;
    throw new Error("Erro ao carregar sessao");
};

export const deleteSessao = async (cod_sessao) => {
    const resp = await post('/treino/deleteSessao', { cod_sessao });
    if (resp.status) return resp.sessao;
    throw new Error("Erro ao carregar sessao");
};

export const recoverySessao = async (cod_sessao) => {
    const resp = await post('/treino/recoverySessao', { cod_sessao });
    if (resp.status) return resp.sessao;
    throw new Error("Erro ao carregar sessao");
};

export const getEquipamentos = async (codEmpresa, deleted) => {
    const resp = await post('/treino/getEquipamentos', { cod_empresa: codEmpresa, deleted });
    if (resp.status) return resp.equipamentos;
    throw new Error("Erro ao carregar equipamentos");
};

export const getArticulacoes = async (codEmpresa, deleted) => {
    const resp = await post('/treino/getArticulacoes', { cod_empresa: codEmpresa, deleted });
    if (resp.status) return resp.articulacoes;
    throw new Error("Erro ao carregar articulacoes");
};

export const getTipoExercicios = async (codEmpresa, deleted) => {
    const resp = await post('/treino/getTipoExercicios', { cod_empresa: codEmpresa, deleted });
    if (resp.status) return resp.tipo_exercicios;
    throw new Error("Erro ao carregar tipo_exercicios");
};

export const getExerciciosResistencias = async (codEmpresa, deleted) => {
    const resp = await post('/treino/getExerciciosResistencias', { cod_empresa: codEmpresa, deleted });
    if (resp.status) return resp.exercicios_resistencias;
    throw new Error("Erro ao carregar exercicios_resistencias");
};

export const getIndicacoes = async (codEmpresa, deleted) => {
    const resp = await post('/treino/getIndicacoes', { cod_empresa: codEmpresa, deleted });
    if (resp.status) return resp.indicacoes;
    throw new Error("Erro ao carregar indicacoes");
};

export const getPadraoesMovimentos = async (codEmpresa, deleted) => {
    const resp = await post('/treino/getPadraoesMovimentos', { cod_empresa: codEmpresa, deleted });
    if (resp.status) return resp.padraoes_movimentos;
    throw new Error("Erro ao carregar indicacoes");
};