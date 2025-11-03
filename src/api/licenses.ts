import { get, post } from "./api";

export const getLicensesAvaliable = async () => await get(`/licenses`);
export const buyLicense = async (licenseId: string) => await post("/licenses/buyLicense", { licenseId });
export const sendCoupon = async (coupon: string) => await post("/licenses/sendCoupon", { coupon });
