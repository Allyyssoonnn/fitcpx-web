import { get, post } from "./api";

export const getPreviewMessages = async () => await get("/chat/getPreviewMessages");
export const getMessages = async (studentId: string) => await get(`/chat/getMessages?studentId=${studentId}`);
export const sendMessage = async (message: string, studentId: string) =>
   await post("/chat/sendUserMessage", { message, studentId });
