import { get } from "./api";

export const getUsers = async () => await get("/user");
export const getUser = async (id: number) => await get(`user/${id}`);
