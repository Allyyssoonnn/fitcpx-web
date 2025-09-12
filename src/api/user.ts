import { get, post } from "./api";

export const getUsers = async () => (await get("/users")).data;
export const getUser = async (id: number) => (await get(`users/${id}`)).data;
export const userLogin = async ({ email, password }: { email: string; password: string }) =>
   await post("/users/login", { email, password });
export const userRegister = async ({ name, email, password }: { name: string; email: string; password: string }) =>
   await post("/users/register", { name, email, password });
