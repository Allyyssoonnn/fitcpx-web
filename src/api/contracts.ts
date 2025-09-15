import { post } from "./api";

export const newContract = async (data: any) => await post("/contracts/newContract", data);
