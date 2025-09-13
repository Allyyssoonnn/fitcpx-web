import { get } from "./api";

export const getPhysicalAssessments = async (deleted?: string, studentId?: string) =>
   await get(
      `/physicalAssessments?${deleted ? `deleted=${deleted}&` : ""}${studentId ? `studentId=${studentId}` : ""}`
   );
