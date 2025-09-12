import { get, post } from "./api";

export const getGoogleUrlLogin = async () => await get("/google/getGoogleUrlLogin");
export const loggedGoogle = async (code: string, scope: string, cod_empresa: string) =>
   await post("/google/loggedGoogle", { code, scope, cod_empresa });
