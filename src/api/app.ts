import { get, post } from "./api";

export const getNotifications = async (cod_empresa: number) => {
   const resp = await post("/app/getNotifications", { cod_empresa });
   if (resp.status) return resp.notifications;
   throw new Error("Erro ao carregar agenda");
};

export const sendFeedback = async (cod_empresa: number, type: string, message: string) => {
   const resp = await post("/app/sendFeedback", { cod_empresa, type, message });
   if (resp.status) return resp;
   throw new Error("Erro ao enviar feedback");
};

export const getDashboard = async () => {
   const resp = await get("/app/getDashboard");
   if (resp.dashboard) return resp.dashboard;
   throw new Error("Erro ao carregar dashboard");
};
