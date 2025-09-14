import { get, postImage } from "./api";

export const getPhysicalAssessments = async (deleted?: string, studentId?: string) =>
   await get(
      `/physicalAssessments?${deleted ? `deleted=${deleted}&` : ""}${studentId ? `studentId=${studentId}` : ""}`
   );
export const updateImagePhysicalAssessment = async (img: any, data: any) =>
   await postImage("/physicalAssessments/updateImagePhysicalAssessment", img, data);
