import { post } from "./api";

export const markPaymentReceived = async (paymentId: string) =>
   await post("/payments/markPaymentReceived", { paymentId });
