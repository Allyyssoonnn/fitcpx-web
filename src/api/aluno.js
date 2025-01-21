import { toast } from "react-toastify";
import { post, postImage } from "./api";

export const getAlunos = async (codUsuario, cod_empresa, deleted) => {
    const resp = await post('/aluno/getAlunos', { cod_usuario: codUsuario, cod_empresa, deleted });
    if (resp.status) return resp.alunos;
    throw new Error("Erro ao carregar alunos");
};

export const getAluno = async (codAluno) => {
    const resp = await post('/aluno/getAluno', { cod_aluno: codAluno });
    if (resp.status) return resp.aluno;
    throw new Error("Erro ao carregar aluno");
};

export const setAluno = async (aluno) => {
    const resp = await post('/aluno/setAluno', { aluno });
    if (resp.status) {
        return resp.aluno;
    } else toast.error(resp.msg);
    throw new Error("Erro ao carregar alunos");
};

export const getAvaliacao = async (codAluno) => {
    const resp = await post('/aluno/getAvaliacao', { cod_aluno: codAluno });
    if (resp.status) return resp.aluno;
    throw new Error("Erro ao carregar aluno");
};

export const setAvaliacao = async (avaliacao) => {
    const resp = await post('/aluno/setAvaliacao', { avaliacao });
    if (resp.status) return resp.avaliacao;
    throw new Error("Erro ao carregar alunos");
};

export const changeAlunoIMG = async (img, data) => {
    const resp = await postImage('/aluno/changeAlunoIMG', img, data);
    if (resp.status) return resp;
    throw new Error("Erro ao carregar alunos");
};

export const sendAvaliacaoIMG = async (img, data) => {
    const resp = await postImage('/aluno/sendAvaliacaoIMG', img, data);
    if (resp.status) return resp;
    throw new Error("Erro ao carregar alunos");
};