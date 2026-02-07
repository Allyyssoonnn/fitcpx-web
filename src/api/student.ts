import { deleteAPI, get, post, postAttachments, postImage } from "./api";

export const getStudents = async (deleted: boolean) => await get(`/students?deleted=${deleted}`);

export const getStudentsAttachments = async (studentId: string) =>
   await get(`/students/attachments?studentId=${studentId}`);
export const sendStudentsAttachments = async (attach: FormData, studentId: string) =>
   await postAttachments(`/students/attachments?studentId=${studentId}`, attach);
export const deleteAttachment = async (id: number) => await deleteAPI(`/students/attachments?id=${id}`);

export const getStudent = async (id: number) => await get(`students/${id}`);
export const createOrUpdateStudent = async (data: any) => await post("/students", data);
export const deleteStudent = async (id: number) => await deleteAPI(`/students/${id}`);
export const updateImageStudent = async (img: any, studentId: string) =>
   await postImage(`/students/updateImageStudent${studentId ? `?studentId=${studentId}` : ""}`, img);
export const updatePasswordStudent = async (token: string, password: string) =>
   await post("/students/updatePassword", { token, password });

export const verifyExists = async (data: any) => await post("/students/verifyExists", data);
