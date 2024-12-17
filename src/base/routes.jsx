import Alunos from "../pages/alunos";
import CadAluno from "../pages/cadAluno";
import MinhaConta from "../pages/minhaconta";
import Dashboard from "../pages/dashboard";
import Aluno from "../pages/aluno";
import CadAvaliacao from "../pages/cadavaliacao";
import Avaliacao from "../pages/avaliacao";
import Agenda from "../pages/agenda";
import CompareAvaliacao from "../pages/compareAvaliacao";


const routes = [
    { path: '/', exact: true, name: 'Home' },
    { path: '/dashboard', name: 'Dashboard', element: Dashboard },
    { path: '/alunos', name: 'Alunos', element: Alunos },
    { path: '/aluno', name: 'Aluno', element: Aluno },
    { path: '/cadaluno', name: 'Alunos', element: CadAluno },
    { path: '/cadavaliacao', name: 'Alunos', element: CadAvaliacao },
    { path: '/avaliacao', name: 'Avaliação', element: Avaliacao },
    { path: '/compareavaliacao', name: 'Avaliação', element: CompareAvaliacao },
    { path: '/minhaconta', name: 'Alunos', element: MinhaConta },
    { path: '/agenda', name: 'Agenda', element: Agenda },
]
  
export default routes;  