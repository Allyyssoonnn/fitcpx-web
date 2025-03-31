import { toast } from "react-toastify";
import { post, postImage } from "./api";

export const sendError = async (error, stack) => {
    const resp = await post('/error/log-error', { error, stack });
    if (resp.status) return resp;
    throw new Error("Erro ao carregar alunos");
};