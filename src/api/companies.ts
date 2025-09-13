import { post, postImage } from "./api";

export const createOrUpdateCompany = async (data: any) => await post("/companies", data);
export const updateImageCompany = async (img: any, data: any) =>
   await postImage("/companies/updateImageCompany", img, data);
