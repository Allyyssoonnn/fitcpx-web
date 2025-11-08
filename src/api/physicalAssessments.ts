import { deleteAPI, get, post, postImage } from "./api";

export const getPhysicalAssessments = async (deleted?: string, studentId?: string) =>
   await get(
      `/physicalAssessments?${deleted ? `deleted=${deleted}&` : ""}${studentId ? `studentId=${studentId}` : ""}`
   );
export const createOrUpdatePhysicalAssessment = async (data: any) => await post("/physicalAssessments", data);
export const updateImagePhysicalAssessment = async (img: any, data: any, id: string) =>
   await postImage(`/physicalAssessments/updateImagePhysicalAssessment?physicalId=${id}`, img, data);
export const deletePhysicalAssessment = async (id: number) => await deleteAPI(`/physicalAssessments/${id}`);
export const getFitnessAssessmentTemplatePDF = async () => await get("/physicalAssessments/fitnessassessmentpdf");
