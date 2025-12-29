import { atom, useRecoilState } from "recoil";
import { recoilPersist } from "recoil-persist";
import { toast } from "sonner";
import { Alert } from "../lib/alert";
const { persistAtom } = recoilPersist();

export const stateUsuario = atom({
   key: "stateUsuario",
   default: {
      nome_usuario: "",
      email_usuario: "",
   },
   effects_UNSTABLE: [persistAtom],
});

export const stateEmpresa = atom({
   key: "stateEmpresa",
   default: {},
   effects_UNSTABLE: [persistAtom],
});

export const stateApp = atom({
   key: "stateApp",
   default: {
      theme: "light",
   },
   effects_UNSTABLE: [persistAtom],
});

export const useNotificacao = () => {
   const nSuccess = (title, message) => Alert.fire(title || "Sucesso!", message || "", "success");
   const nError = (title, message) => Alert.fire(title || "Erro!", message || "", "error");

   const nConfirm = (title, message, func, onError) => {
      Alert.fire({
         title: title ?? "Tem certeza?",
         text: message ?? "",
         icon: "warning",
         showCancelButton: true,
         cancelButtonText: "Cancelar",
         confirmButtonText: "Confirmar",
         reverseButtons: true,
      })
         .then(async (result) => {
            if (result.isConfirmed && func) {
               func();
            }
         })
         .catch(() => {
            if (onError) onError();
         });
   };

   const nLoading = (title, message) => {
      Alert.fire({
         title: title ?? "Carregando...",
         text: message ?? "Aguarde estamos processando.",
         allowOutsideClick: false,
         didOpen: () => {
            Alert.showLoading();
         },
      });
   };

   const endLoading = () => Alert.close();

   const tSuccess = (title, message) => toast.success(title || "Sucesso!", message || "", "success");

   return { nSuccess, nError, nConfirm, nLoading, endLoading, tSuccess };
};

export const useStateApp = () => {
   const [appState, setAppState] = useRecoilState(stateApp);
   const toggleTheme = () =>
      setAppState((prevState) => ({ ...prevState, theme: prevState.theme == "light" ? "dark" : "light" }));
   return { ...appState, toggleTheme };
};

// ============== App-aluno

export const stateAluno = atom({
   key: "stateAluno",
   default: {
      nome_aluno: "",
      email_aluno: "",
   },
   effects_UNSTABLE: [persistAtom],
});

// ============== App-admin

export const stateAdmin = atom({
   key: "stateAdmin",
   default: {
      nome_admin: "",
      email_admin: "",
   },
   effects_UNSTABLE: [persistAtom],
});
