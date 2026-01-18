//LISTAS
import Contratos from "../modules/contracts/contratos";
import ModContratos from "../modules/contracts/modContratos";
import Exercicios from "../modules/exercises/exercicios";
import Planos from "../modules/plans/planos";
import Modalidades from "../modules/services/modalidades";
import Alunos from "../modules/students/alunos";
import Users from "../modules/users/users";
import Treinos from "../modules/workouts/treinos";

import Agenda from "../modules/calendar/agenda";
import Relatorios from "../modules/company/relatorios";
import Planilha from "../modules/workouts/planilha";

// ===============================================

import Configuracao from "../modules/company/configuracao";
import Dashboard from "../modules/company/dashboard";
import FinanceOverview from "../modules/company/financeOverview";
import CadContrato from "../modules/contracts/cadContrato";
import ContratacaoPlano from "../modules/contracts/contratacaoPlano";
import Contrato from "../modules/contracts/contrato";
import CadExercicio from "../modules/exercises/cadExercicio";
import Help from "../modules/help/help";
import Payouts from "../modules/payouts/payouts";
import Avaliacao from "../modules/physicalAssessments/avaliacao";
import CadAvaliacao from "../modules/physicalAssessments/cadavaliacao";
import CompareAvaliacao from "../modules/physicalAssessments/compareAvaliacao";
import CadPlano from "../modules/plans/cadPlano";
import CadModalidade from "../modules/services/cadModalidade";
import Aluno from "../modules/students/aluno";
import CadAluno from "../modules/students/cadAluno";
import CadUsuario from "../modules/users/cadusuario";
import CadTreino from "../modules/workouts/cadTreino";
import SessionWorkoutHistoryView from "../modules/workouts/sessionWorkoutHistory.view";
import WorkoutView from "../modules/workouts/workout.view";
import WorkoutHistoryView from "../modules/workouts/workoutHistory.view";

const routes = [
   //Base
   { path: "/", exact: true, name: "Home" },
   { path: "/dashboard", name: "Dashboard", element: Dashboard },

   //Listas
   { path: "/users", name: "Alunos", element: Users },
   { path: "/alunos", name: "Alunos", element: Alunos },
   { path: "/exercicios", name: "Licença", element: Exercicios },
   { path: "/treinos", name: "Licença", element: Treinos },
   { path: "/planos", name: "Licença", element: Planos },
   { path: "/modalidades", name: "Licença", element: Modalidades },
   { path: "/modcontratos", name: "Licença", element: ModContratos },
   { path: "/contratos", name: "Licença", element: Contratos },
   { path: "/payouts", name: "Licença", element: Payouts },

   //Cadastros
   { path: "/cadexercicio", name: "Licença", element: CadExercicio },
   { path: "/cadaluno", name: "Alunos", element: CadAluno },
   { path: "/cadusuario", name: "Alunos", element: CadUsuario },
   {
      path: "/cadavaliacao",
      name: "Avaliação Física",
      element: CadAvaliacao,
      videoHelp: "https://www.youtube.com/watch?v=af9KQc01PIc",
   },
   { path: "/cadtreino", name: "Treino", element: CadTreino, videoHelp: "https://youtu.be/Un1IDZm3dpk" },
   { path: "/cadplano", name: "Plano", element: CadPlano, videoHelp: "https://www.youtube.com/watch?v=5dLuERhCn_Q" },
   {
      path: "/cadmodalidade",
      name: "Modalidade",
      element: CadModalidade,
      videoHelp: "https://www.youtube.com/watch?v=UAoQjPAkWdg",
   },
   {
      path: "/cadcontrato",
      name: "Contrato",
      element: CadContrato,
      videoHelp: "https://www.youtube.com/watch?v=ADdIX7HgSOo",
   },
   { path: "/contratacaoplano", name: "Alunos", element: ContratacaoPlano },

   //Informações
   { path: "/help", name: "Aluno", element: Help },
   { path: "/aluno", name: "Aluno", element: Aluno },
   { path: "/avaliacao", name: "Avaliação", element: Avaliacao },
   { path: "/treino", name: "Avaliação", element: WorkoutView },
   { path: "/sessionWorkoutSession", name: "Avaliação", element: SessionWorkoutHistoryView },
   { path: "/workoutHistoryView", name: "Avaliação", element: WorkoutHistoryView },
   { path: "/compareavaliacao", name: "Avaliação", element: CompareAvaliacao },
   { path: "/agenda", name: "Agenda", element: Agenda },
   { path: "/planilha", name: "Licença", element: Planilha },
   { path: "/relatorios", name: "Licença", element: Relatorios },
   { path: "/configuracao", name: "Licença", element: Configuracao },
   { path: "/contrato", name: "Licença", element: Contrato },
   { path: "/financeOverview", name: "Licença", element: FinanceOverview },
];

export default routes;
