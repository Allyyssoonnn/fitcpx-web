import { get, post, postImage } from "./api";

export const getUsers = async () => await get("/users");
export const getUser = async (id: number) => await get(`users/${id}`);
export const userLogin = async ({ email, password }: { email: string; password: string }) =>
   await post("/users/login", { email, password });
export const userRegister = async ({
   name,
   email,
   password,
   phone,
}: {
   name: string;
   email: string;
   password: string;
   phone: string;
}) => await post("/users/register", { name, email, password, phone });
export const recoveryAccount = async (email: string) => await post("/users/recoveryAccount", { email });
export const updatePassword = async (token: string, password: string) =>
   await post("/users/updatePassword", { token, password });
export const createOrUpdateUser = async (data: any) => await post("/users", data);
export const updateImageUser = async (img: any, data: any) => await postImage("/users/updateImageUser", img, data);
export const sendErrorUser = async (error: any, info: any) => await post("/users/onError", { error, info });
