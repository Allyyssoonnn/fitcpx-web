import { useEffect } from 'react';
import { useToggleSidebar } from '../../states/states';
import Conteudo from './conteudo';
import Header from './headers';
import Sidebar from './sidebar';

function Layout() {
    const { openedSidebar, toggleSidebar } = useToggleSidebar();
    
    useEffect(() => {
        const wrapper = document.getElementById("main-wrapper");
        if (wrapper) openedSidebar ? wrapper.classList.add("show-sidebar") : wrapper.classList.remove("show-sidebar");
        document.body.setAttribute("data-sidebartype", openedSidebar ? 'full' : 'mini-sidebar');
    }, [openedSidebar]);

    return (
        <div id="main-wrapper" className='p-0'>
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
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Layout;