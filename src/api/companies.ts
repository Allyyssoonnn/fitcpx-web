import { get, post, postImage } from "./api";

export const createOrUpdateCompany = async (data: any) => await post("/companies", data);
export const updateImageCompany = async (img: any, data: any) =>
   await postImage("/companies/updateImageCompany", img, data);
export const getCompaniesLicenses = async () => await get("/companies/getAllCompanyLicenses");
export const getCompanyLicense = async () => await get("/companies/getCompanyLicense");
export const cancelCompanyLicense = async (licenseId: string) =>
   await post("/companies/cancelCompanyLicense", { licenseId });
export const getDashboardInfo = async () => await get("/companies/getDashboardInfo");
export const getOlderPhysicalAssessments = async () => await get("/companies/getOlderPhysicalAssessments");
export const getToursInfo = async () => await get("/companies/getToursInfo");
export const sendFeedback = async (type: string, message: string) =>
   await post("/companies/sendFeedback", { type, message });
export const getNotifications = async () => await get("/companies/getNotifications");
export const saveNotificationsConfig = async (notifications: string) =>
   await post("/companies/saveNotificationsConfig", { notifications });
export const getNotificationsConfig = async () => await get("/companies/getNotificationsConfig");
