import { atom } from "recoil";
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