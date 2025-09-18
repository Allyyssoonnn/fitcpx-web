import { deleteAPI, get, post } from "./api";

export const createOrUpdatePlan = async (data: any, services: any[]) =>
   await post("/plans", { plano: data, modalidades: services });
export const getPlans = async (deleted: boolean) => await get(`/plans?deleted=${deleted}`);
export const deletePlan = async (id: number) => await deleteAPI(`/plans/${id}`);
