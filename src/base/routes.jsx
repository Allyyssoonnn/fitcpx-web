import Alunos from "../pages/alunos";
import CadAluno from "../pages/cadAluno";
import MinhaConta from "../pages/minhaconta";
import Dashboard from "../pages/dashboard";
import Aluno from "../pages/aluno";
import CadAvaliacao from "../pages/cadavaliacao";
import Avaliacao from "../pages/avaliacao";
import Agenda from "../pages/agenda";
import CompareAvaliacao from "../pages/compareAvaliacao";
import Licenca from "../pages/licenca";
import Financeiro from "../pages/financeiro";
import CadTreino from "../pages/cadTreino";
import Treinos from "../pages/treinos";
import Exercicios from "../pages/exercicios";
import GrupoExercicios from "../pages/grupoExercicios";
import CadGrupoExercicio from "../pages/cadGrupoExercicio";
import CadExercicio from "../pages/cadExercicio";
// import Sessoes from "../pages/sessoes";
import CadSessao from "../pages/cadSessao";

const routes = [
    { path: '/', exact: true, name: 'Home' },
    { path: '/dashboard', name: 'Dashboard', element: Dashboard },
    { path: '/alunos', name: 'Alunos', element: Alunos },
    { path: '/aluno', name: 'Aluno', element: Aluno },
    { path: '/cadaluno', name: 'Alunos', element: CadAluno },
    { path: '/cadavaliacao', name: 'Alunos', element: CadAvaliacao },
    { path: '/cadtreino', name: 'Alunos', element: CadTreino },
    { path: '/avaliacao', name: 'Avaliação', element: Avaliacao },
    { path: '/compareavaliacao', name: 'Avaliação', element: CompareAvaliacao },
    { path: '/minhaconta', name: 'Alunos', element: MinhaConta },
    { path: '/agenda', name: 'Agenda', element: Agenda },
    { path: '/licenca', name: 'Licença', element: Licenca },
    { path: '/financeiro', name: 'Licença', element: Financeiro },
    { path: '/treinos', name: 'Licença', element: Treinos },
    { path: '/exercicios', name: 'Licença', element: Exercicios },
    { path: '/grupoexercicios', name: 'Licença', element: GrupoExercicios },
    { path: '/cadgrupoexercicio', name: 'Licença', element: CadGrupoExercicio },
    { path: '/cadexercicio', name: 'Licença', element: CadExercicio },
    // { path: '/sessoes', name: 'Licença', element: Sessoes },
    { path: '/cadsessao', name: 'Licença', element: CadSessao },
]
  
export default routes;  