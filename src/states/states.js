import { atom, useRecoilState } from "recoil";
import { recoilPersist } from "recoil-persist";
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
        openedSidebar: false,
        theme: 'light',
    },
    effects_UNSTABLE: [persistAtom]
});

export const useToggleSidebar = () => {
    const [appState, setAppState] = useRecoilState(stateApp);
    const toggleSidebar = () => setAppState(prevState => ({ ...prevState, openedSidebar: !prevState.openedSidebar }));
    return { toggleSidebar, openedSidebar: appState.openedSidebar };
}

export const useStateApp = () => {
    const [appState, setAppState] = useRecoilState(stateApp);
    const toggleTheme = () => setAppState(prevState => ({ ...prevState, theme: prevState.theme == 'light' ? 'dark' : 'light' }));
    return { ...appState, toggleTheme };
}

// ============== App-aluno

export const stateAluno = atom({
    key: 'stateUsuario',
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