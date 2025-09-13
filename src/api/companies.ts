import { post } from "./api";

export const createOrUpdateCompany = async (data: any) => await post("/companies", data);
