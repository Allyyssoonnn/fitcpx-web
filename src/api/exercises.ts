import { deleteAPI, get, post } from "./api";

export const getExercises = async (deleted: boolean, lang: string = "pt") =>
   await get(`/exercises?deleted=${deleted}${lang ? `&lang=${lang}` : ""}`);
export const deleteExercise = async (id: number) => await deleteAPI(`/exercises/${id}`);
export const createOrUpdateExercise = async (data: any) => await post("/exercises", data);
