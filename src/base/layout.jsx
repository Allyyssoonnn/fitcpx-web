import { useToggleSidebar } from '../states/states';
import Conteudo from './conteudo';
import Header from './header';
import Sidebar from './sidebar';

function Layout() {
    const { openedSidebar } = useToggleSidebar();

    return (
        <div className={`${openedSidebar ? 'show-sidebar' : ''}`} id="main-wrapper" data-layout="vertical" data-sidebartype="full">
            <Sidebar />

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