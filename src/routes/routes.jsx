//LISTAS
import Alunos from "../pages/Lists/alunos";
import Avaliacoes from "../pages/Lists/avaliacoes";
import Contratos from "../pages/Lists/contratos";
import Exercicios from "../pages/Lists/exercicios";
import Modalidades from "../pages/Lists/modalidades";
import ModContratos from "../pages/Lists/modContratos";
import Planos from "../pages/Lists/planos";
import Treinos from "../pages/Lists/treinos";
import Users from "../pages/Lists/users";

import Agenda from "../pages/Infos/agenda";
import Relatorios from "../pages/Infos/relatorios";
import Planilha from "../pages/Lists/planilha";

// ===============================================

import CadAluno from "../pages/Forms/cadAluno";
import CadAvaliacao from "../pages/Forms/cadavaliacao";
import CadContrato from "../pages/Forms/cadContrato";
import CadExercicio from "../pages/Forms/cadExercicio";
import CadModalidade from "../pages/Forms/cadModalidade";
import CadPlano from "../pages/Forms/cadPlano";
import CadSessao from "../pages/Forms/cadSessao";
import CadTreino from "../pages/Forms/cadTreino";
import CadUsuario from "../pages/Forms/cadusuario";
import ContratacaoPlano from "../pages/Forms/contratacaoPlano";
import Aluno from "../pages/Infos/aluno";
import Avaliacao from "../pages/Infos/avaliacao";
import CompareAvaliacao from "../pages/Infos/compareAvaliacao";
import Configuracao from "../pages/Infos/configuracao";
import Contrato from "../pages/Infos/contrato";
import Dashboard from "../pages/Infos/dashboard";
import FinanceOverview from "../pages/Infos/financeOverview";

const routes = [
   //Base
   { path: "/", exact: true, name: "Home" },
   { path: "/dashboard", name: "Dashboard", element: Dashboard },

   //Listas
   { path: "/users", name: "Alunos", element: Users },
   { path: "/alunos", name: "Alunos", element: Alunos },
   { path: "/exercicios", name: "Licença", element: Exercicios },
   { path: "/treinos", name: "Licença", element: Treinos },
   { path: "/avaliacoes", name: "Licença", element: Avaliacoes },
   { path: "/planos", name: "Licença", element: Planos },
   { path: "/modalidades", name: "Licença", element: Modalidades },
   { path: "/modcontratos", name: "Licença", element: ModContratos },
   { path: "/contratos", name: "Licença", element: Contratos },

   //Cadastros
   { path: "/cadexercicio", name: "Licença", element: CadExercicio },
   { path: "/cadsessao", name: "Licença", element: CadSessao },
   { path: "/cadaluno", name: "Alunos", element: CadAluno },
   { path: "/cadusuario", name: "Alunos", element: CadUsuario },
   { path: "/cadavaliacao", name: "Alunos", element: CadAvaliacao },
   { path: "/cadtreino", name: "Alunos", element: CadTreino },
   { path: "/cadplano", name: "Alunos", element: CadPlano },
   { path: "/cadmodalidade", name: "Alunos", element: CadModalidade },
   { path: "/cadcontrato", name: "Alunos", element: CadContrato },
   { path: "/contratacaoplano", name: "Alunos", element: ContratacaoPlano },

   //Informações
   { path: "/aluno", name: "Aluno", element: Aluno },
   { path: "/avaliacao", name: "Avaliação", element: Avaliacao },
   { path: "/compareavaliacao", name: "Avaliação", element: CompareAvaliacao },
   { path: "/agenda", name: "Agenda", element: Agenda },
   { path: "/planilha", name: "Licença", element: Planilha },
   { path: "/relatorios", name: "Licença", element: Relatorios },
   { path: "/configuracao", name: "Licença", element: Configuracao },
   { path: "/contrato", name: "Licença", element: Contrato },
   { path: "/financeOverview", name: "Licença", element: FinanceOverview },
];

export default routes;
