import axios from "axios";
import { baseURL } from "./api";

export const getFitnessAssessmentTemplatePDF = async () => {
  const resp = await axios.get(`${baseURL}/fitnessassessmentpdf`);
  if (resp.status) return resp.data;
  throw new Error("Erro ao carregar template");
};
