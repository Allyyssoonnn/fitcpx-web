import { get, post } from "./api";

export const getCalendar = async (studentId?: string) =>
   await get(
      `/calendar${
         studentId && (typeof studentId === "string" || typeof studentId === "number") ? `?studentId=${studentId}` : ""
      }`
   );
export const newEvent = async (data: any) => await post("/calendar/newEvent", data);
