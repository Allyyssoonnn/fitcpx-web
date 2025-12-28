export const workoutSteps: any[] = [
   {
      element: "#workoutsMenu",
      popover: {
         title: "Treinos",
         description: "Gerencie seus planos de treino",
      },
      isInput: false,
      needOpenSidebar: true,
   },
   {
      element: "#workouts",
      popover: {
         title: "Lista de treinos",
         description: "Visualize todos os treinos criados",
      },
      isInput: false,
   },
   {
      element: "#newWorkout",
      popover: {
         title: "Novo Treino",
         description: "Clique para criar um novo treino",
      },
      isInput: false,
      needOpenSidebar: false,
   },
   {
      element: "#name",
      popover: {
         title: "Nome do Treino",
         description: "Dê um nome para o treino. Ex: Hipertrofia Fem.",
      },
      isInput: true,
   },
   {
      element: "#periodicity",
      popover: {
         title: "Frequência",
         description: "Informe a frequência semanal. Ex: 3",
      },
      isInput: true,
   },
   {
      element: "#gender",
      popover: {
         title: "Gênero",
         description: "Selecione o gênero alvo do treino",
      },
      isInput: true,
      isPortal: true,
   },
   {
      element: "#difficulty",
      popover: {
         title: "Nível",
         description: "Defina o nível no aluno",
      },
      isInput: true,
      isPortal: true,
   },
   {
      element: "#development",
      popover: {
         title: "Objetivo",
         description: "Qual a valência será o foco do treino? Ex: Força",
      },
      isInput: true,
      isPortal: true,
   },
   {
      element: "#addSessions",
      popover: {
         title: "Nova Sessão",
         description: "Adicione uma sessão de treino",
      },
      isInput: false,
   },
   {
      element: "#btnSessionEdit-0",
      popover: {
         title: "Editar Nome da Sessão",
         description: "Clique no lápis para renomear",
      },
      isInput: true,
   },
   {
      element: "#btnSession-0",
      popover: {
         title: "Ver Sessão",
         description: "Clique para adicionar/ver exercícios",
      },
      isInput: false,
   },
   {
      element: "#addExercise-0",
      popover: {
         title: "Adicionar Exercício",
         description: "Clique para incluir um exercício na sessão",
      },
      isInput: false,
   },
   {
      element: "#exercise-0-session-0-set-null",
      popover: {
         title: "Selecionar Exercício",
         description: "Escolha um exercício da sua lista",
      },
      isInput: true,
      isPortal: true,
   },
   {
      element: "#serie_sessao_exercicio-0",
      popover: {
         title: "Séries",
         description: "Defina o número de séries",
      },
      isInput: true,
   },
   {
      element: "#repeticao_sessao_exercicio-0",
      popover: {
         title: "Repetições",
         description: "Defina o número de repetições",
      },
      isInput: true,
   },
   {
      element: "#carga_sessao_exercicio-0",
      popover: {
         title: "Carga",
         description: "Defina a carga (peso) do exercício",
      },
      isInput: true,
   },
   {
      element: "#intervalo_sessao_exercicio-0",
      popover: {
         title: "Intervalo",
         description: "Defina o descanso entre as séries (em segundos)",
      },
      isInput: true,
   },
   {
      element: "#submit",
      popover: {
         title: "Salvar Treino",
         description: "Clique para confirmar e salvar as alterações",
      },
      isInput: false,
   },
];
