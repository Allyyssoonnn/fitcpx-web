import { atom, useRecoilState } from "recoil";
import { recoilPersist } from "recoil-persist";
import Swal from "sweetalert2";
const { persistAtom } = recoilPersist();

export const stateUsuario = atom({
    key: 'stateUsuario',
    default: {
        nome_usuario: '',
        email_usuario: ''
    },
    effects_UNSTABLE: [persistAtom]
});

export const stateEmpresa = atom({
    key: 'stateEmpresa',
    default: {},
    effects_UNSTABLE: [persistAtom]
});

export const stateApp = atom({
    key: 'stateApp',
    default: {
        openedSidebar: true,
        // bloco / painel
        viewTreino: 'bloco',
        theme: 'light',
    },
    effects_UNSTABLE: [persistAtom]
});

export const useNotificacao = () => {
    const nSuccess = (title, message) => Swal.fire(title || "Sucesso!", message || "", "success");
    const nError = (title, message) => Swal.fire(title || "Erro!", message || "", "error");
    return { nSuccess, nError };
}

export const useToggleSidebar = () => {
    const [appState, setAppState] = useRecoilState(stateApp);
    const toggleSidebar = () => setAppState(prevState => ({ ...prevState, openedSidebar: !prevState.openedSidebar }));
    return { toggleSidebar, openedSidebar: appState.openedSidebar };
}

export const useStateApp = () => {
    const [appState, setAppState] = useRecoilState(stateApp);
    const toggleTheme = () => setAppState(prevState => ({ ...prevState, theme: prevState.theme == 'light' ? 'dark' : 'light' }));
    const setViewTreino = view => setAppState(prevState => ({ ...prevState, viewTreino: view }));
    return { ...appState, toggleTheme, setViewTreino };
}

// ============== App-aluno

export const stateAluno = atom({
    key: 'stateAluno',
    default: {
        nome_aluno: '',
        email_aluno: ''
    },
    effects_UNSTABLE: [persistAtom]
});

// ============== App-admin

export const stateAdmin = atom({
    key: 'stateAdmin',
    default: {
        nome_admin: '',
        email_admin: ''
    },
    effects_UNSTABLE: [persistAtom]
});