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
import CadTreino from "../pages/cadTreino";
import Treinos from "../pages/treinos";
import Exercicios from "../pages/exercicios";
import GrupoExercicios from "../pages/grupoExercicios";
import CadGrupoExercicio from "../pages/cadGrupoExercicio";
import CadExercicio from "../pages/cadExercicio";
import CadSessao from "../pages/cadSessao";
import Planilha from "../pages/planilha";
import Usuarios from "../pages/usuarios";
import CadUsuario from "../pages/cadusuario";
import Relatorios from "../pages/relatorios";
import Cardapios from "../pages/cardapios";
import CadCardapio from "../pages/cadCardapio";
import Alimentos from "../pages/alimentos";
import GrupoAlimentos from "../pages/grupoAlimentos";
import CadGrupoAlimento from "../pages/cadGrupoAlimento";
import CadAlimento from "../pages/cadAlimento";
import Avaliacoes from "../pages/avaliacoes";
import CadPlano from "../pages/cadPlano";
import Planos from "../pages/planos";
import Modalidades from "../pages/modalidades";
import CadModalidade from "../pages/cadModalidade";

const routes = [
    //Base
    { path: '/', exact: true, name: 'Home' },
    { path: '/dashboard', name: 'Dashboard', element: Dashboard },

    //Listas
    { path: '/alunos', name: 'Alunos', element: Alunos },
    { path: '/usuarios', name: 'Alunos', element: Usuarios },
    { path: '/exercicios', name: 'Licença', element: Exercicios },
    { path: '/grupoexercicios', name: 'Licença', element: GrupoExercicios },
    { path: '/treinos', name: 'Licença', element: Treinos },
    { path: '/licenca', name: 'Licença', element: Licenca },
    { path: '/cardapios', name: 'Licença', element: Cardapios },
    { path: '/alimentos', name: 'Licença', element: Alimentos },
    { path: '/grupoalimentos', name: 'Licença', element: GrupoAlimentos },
    { path: '/avaliacoes', name: 'Licença', element: Avaliacoes },
    { path: '/planos', name: 'Licença', element: Planos },
    { path: '/modalidades', name: 'Licença', element: Modalidades },

    //Cadastros
    { path: '/cadgrupoexercicio', name: 'Licença', element: CadGrupoExercicio },
    { path: '/cadexercicio', name: 'Licença', element: CadExercicio },
    { path: '/cadsessao', name: 'Licença', element: CadSessao },
    { path: '/cadaluno', name: 'Alunos', element: CadAluno },
    { path: '/cadusuario', name: 'Alunos', element: CadUsuario },
    { path: '/cadavaliacao', name: 'Alunos', element: CadAvaliacao },
    { path: '/cadtreino', name: 'Alunos', element: CadTreino },
    { path: '/cadcardapio', name: 'Alunos', element: CadCardapio },
    { path: '/cadgrupoalimento', name: 'Alunos', element: CadGrupoAlimento },
    { path: '/cadalimento', name: 'Alunos', element: CadAlimento },
    { path: '/cadplano', name: 'Alunos', element: CadPlano },
    { path: '/cadmodalidade', name: 'Alunos', element: CadModalidade },

    //Informações
    { path: '/aluno', name: 'Aluno', element: Aluno },
    { path: '/avaliacao', name: 'Avaliação', element: Avaliacao },
    { path: '/compareavaliacao', name: 'Avaliação', element: CompareAvaliacao },
    { path: '/minhaconta', name: 'Alunos', element: MinhaConta },
    { path: '/agenda', name: 'Agenda', element: Agenda },
    { path: '/planilha', name: 'Licença', element: Planilha },
    { path: '/relatorios', name: 'Licença', element: Relatorios },
]
  
export default routes;  