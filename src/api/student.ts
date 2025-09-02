import { get } from "./api";

export const getStudents = async (deleted: boolean) => await get(`/student?deleted=${deleted}`);
export const getStudent = async (id: number) => await get(`student/${id}`);
