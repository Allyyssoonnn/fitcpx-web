import Conteudo from './conteudo';
import Header from './header';
import Sidebar from './sidebar';

function Layout() {

    return (
        <div className="page-wrapper" id="main-wrapper" data-layout="vertical" data-navbarbg="skin6" data-sidebartype="full" data-sidebar-position="fixed" data-header-position="fixed">
            <Sidebar />

            <div className="body-wrapper">
                <Header />

                <Conteudo />

                <div class="py-6 px-6 text-center">
                <p class="mb-0 fs-4">Desenvolvido por <a href="https://adminmart.com/" target="_blank"
                    class="pe-1 text-primary text-decoration-underline">Alyson H.</a>Distribuido por <a href="https://themewagon.com/" target="_blank"
                    class="pe-1 text-primary text-decoration-underline">Milton G.</a></p>
                </div>
            </div>
        </div>
    )
}

export default Layout;