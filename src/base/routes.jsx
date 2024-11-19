import Alunos from "../pages/alunos";
import CadAluno from "../pages/cadAluno";
import MinhaConta from "../pages/minhaconta";
import Dashboard from "../pages/dashboard";


const routes = [
    { path: '/', exact: true, name: 'Home' },
    { path: '/dashboard', name: 'Dashboard', element: Dashboard },
    { path: '/alunos', name: 'Alunos', element: Alunos },
    { path: '/cadaluno', name: 'Alunos', element: CadAluno },
    { path: '/minhaconta', name: 'Alunos', element: MinhaConta },
]
  
export default routes;  