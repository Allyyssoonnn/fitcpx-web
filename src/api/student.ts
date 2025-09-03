import { get } from "./api";

export const getStudents = async (deleted: boolean) => (await get(`/students?deleted=${deleted}`)).data;
export const getStudent = async (id: number) => (await get(`students/${id}`)).data;
