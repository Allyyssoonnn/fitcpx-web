import { get, post } from "./api";

export const markPaymentReceived = async (paymentId: string) =>
   await post("/payments/markPaymentReceived", { paymentId });
export const getNextPayout = async () => await get("/payments/getNextPayout");
export const getPayouts = async (date: Date) => await get("/payments/getPayouts?date=" + date);
