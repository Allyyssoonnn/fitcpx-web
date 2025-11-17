import { deleteAPI, get, post } from "./api";

export const getWorkouts = async (deleted: boolean, studentId?: string) =>
   await get(`/workouts?deleted=${deleted}${studentId ? `&studentId=${studentId}` : ""}`);
export const getWorkout = async (workoutId: string) => await get(`/workouts/${workoutId}`);
export const deleteWorkout = async (id: number) => await deleteAPI(`/workouts/${id}`);
export const createOrUpdateWorkout = async (treino: any, sessoes: any) => await post("/workouts", { treino, sessoes });
export const generateWorkout = async (data: any) => await post("/workouts/generateWorkout", data);
export const getJoints = async (lang: string = "en") => await get(`/workouts/getJoints?${lang ? `lang=${lang}` : ""}`);
export const getEquipaments = async (lang: string = "en") =>
   await get(`/workouts/getEquipaments?${lang ? `lang=${lang}` : ""}`);
export const getMuscleGroups = async (lang: string = "en") =>
   await get(`/workouts/getMuscleGroups?${lang ? `lang=${lang}` : ""}`);
export const getSugestions = async (lang: string = "en") =>
   await get(`/workouts/getSugestions?${lang ? `lang=${lang}` : ""}`);
export const getExerciseTypes = async (lang: string = "en") =>
   await get(`/workouts/getExerciseTypes?${lang ? `lang=${lang}` : ""}`);
export const getExerciseResistences = async (lang: string = "en") =>
   await get(`/workouts/getExerciseResistences?${lang ? `lang=${lang}` : ""}`);
export const getMovementPatterns = async (lang: string = "en") =>
   await get(`/workouts/getMovementPatterns?${lang ? `lang=${lang}` : ""}`);
