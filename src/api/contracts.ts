import { deleteAPI, get, post } from "./api";

export const newContract = async (data: any) => await post("/contracts/newContract", data);
export const downloadContract = async (documentId: string, signed: boolean) =>
   await post("/contracts/downloadContract", { documentId, signed });
export const deleteContract = async (id: number) => await deleteAPI(`/contracts/${id}`);
export const getContracts = async (studentId?: string) =>
   await get(
      `/contracts${
         studentId && (typeof studentId === "string" || typeof studentId === "number") ? `?studentId=${studentId}` : ""
      }`,
   );
export const getContract = async (id: number) => await get(`/contracts/${id}`);
export const getDuePayments = async () => await get("/contracts/getDuePayments");

// Checkout
export const onlineContract = async (companyId: string, student: any, plan: any, registerOnly: boolean) =>
   await post(`/contracts/onlineContract?companyId=${companyId}`, { student, plan, registerOnly });
