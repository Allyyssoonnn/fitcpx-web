import { deleteAPI, get, post } from "./api";

export const getServices = async (deleted: boolean) => await get(`/services?deleted=${deleted}`);
export const createOrUpdateService = async (data: any) => await post("/services", data);
export const deleteService = async (id: number) => await deleteAPI(`/services/${id}`);
