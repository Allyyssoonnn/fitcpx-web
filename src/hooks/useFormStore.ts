// useFormStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type FormData = {
    treino: any;
    avaliacao: any;
    aluno: any;
};

type FormStore = {
    formData: FormData;
    setTreinoForm: (data: any) => void;
    setAvaliacaoForm: (data: any) => void;
    setAlunoForm: (data: any) => void;
    clearForm: () => void;
};

export const useFormStore = create<FormStore>()(
    persist(
        (set) => ({
            formData: {
                treino: {},
                avaliacao: {},
                aluno: {},
            },
            setTreinoForm: (data) =>
                set((state) => ({
                formData: { ...state.formData, treino: data },
                })),
            setAvaliacaoForm: (data) =>
                set((state) => ({
                formData: { ...state.formData, avaliacao: data },
                })),
            setAlunoForm: (data) =>
                set((state) => ({
                formData: { ...state.formData, aluno: data },
                })),
            clearForm: () =>
                set(() => ({
                formData: { treino: {}, avaliacao: {}, aluno: {} },
                })),
        }),
        {
            name: 'form-storage', // chave no localStorage
        }
    )
);