import { get, post } from "./api";

export const getUsers = async () => await get("/user");
export const getUser = async (id: number) => await get(`user/${id}`);
export const login = async ({ email, password }: { email: string; password: string }) =>
   await post("/login", { email, password });
export const userRegister = async ({ name, email, password }: { name: string; email: string; password: string }) =>
   await post("/register", { name, email, password });
