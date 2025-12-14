import { get, post } from "./api";

export const markPaymentReceived = async (paymentId: string) =>
   await post("/payments/markPaymentReceived", { paymentId });
export const getNextPayout = async () => await get("/payments/getNextPayout");
