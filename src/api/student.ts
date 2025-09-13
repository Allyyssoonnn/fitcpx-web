import { deleteAPI, get, post, postImage } from "./api";

export const getStudents = async (deleted: boolean) => await get(`/students?deleted=${deleted}`);
export const getStudent = async (id: number) => await get(`students/${id}`);
export const createOrUpdateStudent = async (data: any) => await post("/students", data);
export const deleteStudent = async (id: number) => await deleteAPI(`/students/${id}`);
export const updateImageStudent = async (img: any, data: any) =>
   await postImage("/students/updateImageStudent", img, data);
