import Alunos from "../pages/alunos";
import CadAluno from "../pages/cadAluno";
import MinhaConta from "../pages/minhaconta";
import Dashboard from "../pages/dashboard";
import Aluno from "../pages/aluno";
import CadAvaliacao from "../pages/cadavaliacao";


const routes = [
    { path: '/', exact: true, name: 'Home' },
    { path: '/dashboard', name: 'Dashboard', element: Dashboard },
    { path: '/alunos', name: 'Alunos', element: Alunos },
    { path: '/aluno', name: 'Aluno', element: Aluno },
    { path: '/cadaluno', name: 'Alunos', element: CadAluno },
    { path: '/cadavaliacao', name: 'Alunos', element: CadAvaliacao },
    { path: '/minhaconta', name: 'Alunos', element: MinhaConta },
]
  
export default routes;  