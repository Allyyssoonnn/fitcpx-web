import Alunos from "../pages/alunos";
import CadAluno from "../pages/cadAluno";
import Dashboard from "../pages/dashboard";


const routes = [
    { path: '/', exact: true, name: 'Home' },
    { path: '/dashboard', name: 'Dashboard', element: Dashboard },
    { path: '/alunos', name: 'Alunos', element: Alunos },
    { path: '/cadaluno', name: 'Alunos', element: CadAluno },
]
  
export default routes;  