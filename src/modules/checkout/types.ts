// src/pages/Checkout/types.ts (ou src/types/types.ts se for global)

export interface Plan {
   value: string;
   label: string;
   price: number;
   joiningFee: number;
   duration: number;
   max_installments: number;
   allowMonthly: boolean;
   contractId: number;
}

export interface Company {
   companyId: string;
   name: string;
   address: string;
   phone: string;
   img: string;
}

// Se a resposta da API tiver um formato específico, você pode tipar aqui também
export interface CompanyAndPlansResponse {
   company: Company;
   plans: Plan[];
}
