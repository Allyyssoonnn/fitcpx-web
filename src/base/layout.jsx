import { useEffect } from 'react';
import { stateEmpresa, stateUsuario, useToggleSidebar } from '../states/states';
import Conteudo from './conteudo';
import Header from './header';
import Sidebar from './sidebar';
import { useRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { parseCookies, setCookie } from 'nookies';
import axios from 'axios';
import { baseURL } from '../api/api';
import BackToTop from '../components/backToTop';
import { useTranslation } from 'react-i18next';

function Layout() {
    const { t } = useTranslation('root');
    const navigate = useNavigate();
    const [usuario, setusuario] = useRecoilState(stateUsuario);
    const [empresa, setempresa] = useRecoilState(stateEmpresa);
    const { openedSidebar, toggleSidebar } = useToggleSidebar();

    useEffect(() => {
        (async function load() {
            if (!usuario?.cod_usuario || !empresa?.cod_empresa) {
                const cookies = parseCookies();
                var user;
                if (import.meta.env.VITE_BUILD_TYPE == 'aluno') user = 'appaluno';
                if (import.meta.env.VITE_BUILD_TYPE == 'admin') user = 'appadmin';
                if (import.meta.env.VITE_BUILD_TYPE == 'usuario') user = 'usuario';
    
                const refreshResponse = await axios.post(baseURL + `/${user}/refreshToken`, {
                    refreshToken: cookies.refreshToken,
                });
                                
                if (refreshResponse.data.status) {
                    setCookie(null, 'token', refreshResponse.data.token, { maxAge: 60 * 15 });
                    setusuario(refreshResponse.data.usuario);
                    setempresa(refreshResponse.data.empresa);
                } else {
                    navigate('/entrar');
                }
            }
        })();
    }, []);

    useEffect(() => {
        const wrapper = document.getElementById("main-wrapper");
        if (wrapper) openedSidebar ? wrapper.classList.add("show-sidebar") : wrapper.classList.remove("show-sidebar");
        document.body.setAttribute("data-sidebartype", openedSidebar ? 'full' : 'mini-sidebar');
    }, [openedSidebar]);

    return (
        <div className={`${openedSidebar ? 'show-sidebar' : ''}`} id="main-wrapper">
            <Sidebar />
            <BackToTop />

            {openedSidebar && (
                //Clicar fora da sidebar fecha ela
                <div
                    onClick={toggleSidebar}
                    className='d-xl-none d-block'
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        zIndex: 998,
                    }}
                ></div>
            )}

            <div className='page-wrapper'>

                <div className="body-wrapper">
                    <Header />
                    
                    <Conteudo/>

                    <div className="py-6 px-6 text-center">
                        <p className="mb-0 fs-4">{t('footerText')}</p>
                    {/* <p class="mb-0 fs-4">Desenvolvido por <a href="https://adminmart.com/" target="_blank"
                        class="pe-1 text-primary text-decoration-underline">Alyson H.</a>Distribuido por <a href="https://themewagon.com/" target="_blank"
                        class="pe-1 text-primary text-decoration-underline">Milton G.</a></p> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Layout;