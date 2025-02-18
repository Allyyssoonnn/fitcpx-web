import { useToggleSidebar } from '../states/states';
import Conteudo from './conteudo';
import Header from './header';
import Sidebar from './sidebar';

function Layout() {
    const { openedSidebar, toggleSidebar } = useToggleSidebar();

    return (
        <div className={`${openedSidebar ? 'show-sidebar' : ''}`} id="main-wrapper" data-layout="vertical" data-sidebartype="full">
            <Sidebar />

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
                        <p className="mb-0 fs-4">Desenvolvido por Ape Sys LTDA</p>
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