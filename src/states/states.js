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
    },
    effects_UNSTABLE: [persistAtom]
});

export const useToggleSidebar = () => {
    const [appState, setAppState] = useRecoilState(stateApp);
    const toggleSidebar = () => setAppState(prevState => ({ ...prevState, openedSidebar: !prevState.openedSidebar }));
    return { toggleSidebar, openedSidebar: appState.openedSidebar };
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