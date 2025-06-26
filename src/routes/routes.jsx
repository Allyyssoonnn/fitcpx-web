//LISTAS
import Alunos from "../pages/Lists/alunos";
import Usuarios from "../pages/Lists/usuarios";
import Exercicios from "../pages/Lists/exercicios";
import GrupoExercicios from "../pages/Lists/grupoExercicios";
import Treinos from "../pages/Lists/treinos";
import Avaliacoes from "../pages/Lists/avaliacoes";
import Planos from "../pages/Lists/planos";
import Modalidades from "../pages/Lists/modalidades";
import ModContratos from "../pages/Lists/modContratos";
import Contratos from "../pages/Lists/contratos";

import Agenda from "../pages/Infos/agenda";
import Planilha from "../pages/Lists/planilha";
import Relatorios from "../pages/Infos/relatorios";

// ===============================================

import CadAluno from "../pages/Forms/cadAluno";
import Dashboard from "../pages/Infos/dashboard";
import Aluno from "../pages/Infos/aluno";
import CadAvaliacao from "../pages/Forms/cadavaliacao";
import Avaliacao from "../pages/Infos/avaliacao";
import CompareAvaliacao from "../pages/Infos/compareAvaliacao";
import CadTreino from "../pages/Forms/cadTreino";
import CadGrupoExercicio from "../pages/Forms/cadGrupoExercicio";
import CadExercicio from "../pages/Forms/cadExercicio";
import CadSessao from "../pages/Forms/cadSessao";
import CadUsuario from "../pages/Forms/cadusuario";
import Cardapios from "../pages/Lists/cardapios";
import CadCardapio from "../pages/Forms/cadCardapio";
import Alimentos from "../pages/Lists/alimentos";
import GrupoAlimentos from "../pages/Lists/grupoAlimentos";
import CadGrupoAlimento from "../pages/Forms/cadGrupoAlimento";
import CadAlimento from "../pages/Forms/cadAlimento";
import CadPlano from "../pages/Forms/cadPlano";
import CadModalidade from "../pages/Forms/cadModalidade";
import ContratacaoPlano from "../pages/Forms/contratacaoPlano";
import CadContrato from "../pages/Forms/cadContrato";
import Configuracao from "../pages/Infos/configuracao";
import Contrato from "../pages/Infos/contrato";
import ContratacaoSessao from "../pages/Forms/contratacaoSessao";
import PacoteSessao from "../pages/Infos/pacoteSessao";

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
    { path: '/avaliacoes', name: 'Licença', element: Avaliacoes },
    { path: '/planos', name: 'Licença', element: Planos },
    { path: '/modalidades', name: 'Licença', element: Modalidades },
    { path: '/modcontratos', name: 'Licença', element: ModContratos },

    { path: '/contratos', name: 'Licença', element: Contratos },
    { path: '/grupoalimentos', name: 'Licença', element: GrupoAlimentos },
    { path: '/cardapios', name: 'Licença', element: Cardapios },
    { path: '/alimentos', name: 'Licença', element: Alimentos },

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
    { path: '/cadcontrato', name: 'Alunos', element: CadContrato },
    { path: '/contratacaoplano', name: 'Alunos', element: ContratacaoPlano },
    { path: '/contratacaosessao', name: 'Alunos', element: ContratacaoSessao },

    //Informações
    { path: '/aluno', name: 'Aluno', element: Aluno },
    { path: '/avaliacao', name: 'Avaliação', element: Avaliacao },
    { path: '/compareavaliacao', name: 'Avaliação', element: CompareAvaliacao },
    { path: '/agenda', name: 'Agenda', element: Agenda },
    { path: '/planilha', name: 'Licença', element: Planilha },
    { path: '/relatorios', name: 'Licença', element: Relatorios },
    { path: '/configuracao', name: 'Licença', element: Configuracao },
    { path: '/contrato', name: 'Licença', element: Contrato },
    { path: '/pacoteSessao', name: 'Licença', element: PacoteSessao },
]
  
export default routes;  