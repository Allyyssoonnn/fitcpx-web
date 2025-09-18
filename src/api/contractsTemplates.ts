import { deleteAPI, get, post } from "./api";

export const getContractsTemplates = async (deleted: boolean) => await get(`/contractsTemplates?deleted=${deleted}`);
export const createOrUpdateContractTemplate = async (data: any) => await post("/contractsTemplates", data);
export const deleteContractTemplate = async (id: number) => await deleteAPI(`/contractsTemplates/${id}`);
