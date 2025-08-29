import { ClientType } from "./client";

export interface PhysicalAssessmentType {
   cod_avaliacao: number;
   data_avaliacao: string;
   tipo_avaliacao: string;
   peso: number;
   altura: number;
   gordura_viceral?: number | null;
   cod_protocolo: number;
   triciptal?: number | null;
   peitoral?: number | null;
   subescapular?: number | null;
   axilar_media?: number | null;
   abdominal?: number | null;
   coxa?: number | null;
   supra_iliaca?: number | null;
   supra_espinhal?: number | null;
   biciptal?: number | null;
   panturrilha?: number | null;
   pescoco?: number | null;
   ombro?: number | null;
   torax_inspirado?: number | null;
   torax_expirado?: number | null;
   punho?: number | null;
   cintura?: number | null;
   abdomen?: number | null;
   quadril?: number | null;
   braco_relaxado_direito?: number | null;
   braco_contraido_direito?: number | null;
   antebraco_direito?: number | null;
   coxa_direita?: number | null;
   panturrilha_direita?: number | null;
   braco_relaxado_esquerdo?: number | null;
   braco_contraido_esquerdo?: number | null;
   antebraco_esquerdo?: number | null;
   coxa_esquerda?: number | null;
   panturrilha_esquerda?: number | null;
   biestiloide_punho?: number | null;
   biepicondilo_umeral?: number | null;
   biepicondilo_femoral?: number | null;
   bioimpedancia_gordura?: number | null;
   bioimpedancia_muscular?: number | null;
   bioimpedancia_idade?: number | null;
   createdAt?: string;
   updatedAt?: string;
   deletedAt?: string | null;

   // // Associações opcionais
   aluno?: ClientType;
   // usuario?: {
   //    cod_usuario: number;
   //    nome_usuario?: string;
   // };
   // protocolo?: {
   //    cod_protocolo: number;
   //    nome_protocolo?: string;
   // };
   // imagem?: Array<{
   //    cod_avaliacao_imagem: number;
   //    url_imagem: string;
   // }>;
}
