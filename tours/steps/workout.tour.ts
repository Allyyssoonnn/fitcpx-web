export const workoutSteps: any[] = [
   {
      element: "#workoutsMenu",
      popover: {
         title: "Treino",
         description: "Clique em treino para abrir as opções",
      },
      isInput: false,
   },
   {
      element: "#workouts",
      popover: {
         title: "Lista de treinos",
         description: "Abra a lista de treinos",
      },
      isInput: false,
   },
   {
      element: "#newWorkout",
      popover: {
         title: "Criar novo treino",
         description: "Vamos criar um novo treino usando essa opcão",
      },
      isInput: false,
   },
   {
      element: "#name",
      popover: {
         title: "Vamos dar um nome ao treino",
         description: "Preencha o nome do treino Ex. Feminino - Hipertrofia",
      },
      isInput: true,
   },
   {
      element: "#periodicity",
      popover: {
         title: "Agora a frequência",
         description: `Preencha a frequência do treino Ex. "3"`,
      },
      isInput: true,
   },
   {
      element: "#gender",
      popover: {
         title: "Genêro do treino",
         description: "Para treinos bases que não estão vinculados ao aluno precisamos informar o sexo",
      },
      isInput: true,
      isPortal: true,
   },
   {
      element: "#difficulty",
      popover: {
         title: "Dificuldade do treino",
         description: "Preencha a dificuldade do treino",
      },
      isInput: true,
      isPortal: true,
   },
   {
      element: "#development",
      popover: {
         title: "Desenvolvimento do treino",
         description: "Preencha a desenvolvimento do treino Ex. 'Força'",
      },
      isInput: true,
      isPortal: true,
   },
   {
      element: "#addSessions",
      popover: {
         title: "Vamos adicionar um sessão",
         description: "Sessão de treino agora Ex. 'Segunda-feira', 'Peitoral e Tríceps'",
      },
      isInput: false,
   },
   {
      element: "#btnSessionEdit-0",
      popover: {
         title: "Vamos editar o nome da sessão",
         description: "Clique no lápis para editar o nome após preencher clique enter",
      },
      isInput: true,
   },
   {
      element: "#btnSession-0",
      popover: {
         title: "Vamos ver a sessão",
         description: "Clique para ver mais desta sessão para adicionarmos exercícios",
      },
      isInput: false,
   },
   {
      element: "#addExercise-0",
      popover: {
         title: "Agora vamos adicionar um exercício",
         description: "Clique adicionar um exercício a essa sessão",
      },
      isInput: false,
   },
   {
      element: "#exercise-0-session-0-set-null",
      popover: {
         title: "Agora vamos selecionar o exercício",
         description: "Clique para abrir a lista de exercícios",
      },
      isInput: true,
      isPortal: true,
   },
   {
      element: "#serie_sessao_exercicio-0",
      popover: {
         title: "Quantidade de série",
         description: "Você pode alterar a quantidade de séries a ser realizada para esse exercício",
      },
      isInput: true,
   },
   {
      element: "#repeticao_sessao_exercicio-0",
      popover: {
         title: "Quantidade de repetições",
         description: "Você pode alterar a quantidade de repetições a ser realizada para esse exercício",
      },
      isInput: true,
   },
   {
      element: "#carga_sessao_exercicio-0",
      popover: {
         title: "Quantidade de carga",
         description: "Você pode alterar a quantidade de carga a ser realizada para esse exercício",
      },
      isInput: true,
   },
   {
      element: "#intervalo_sessao_exercicio-0",
      popover: {
         title: "Quantidade de intervalo",
         description: "Você pode alterar a quantidade de intervalo a ser realizada para esse exercício",
      },
      isInput: true,
   },
   {
      element: "#submit",
      popover: {
         title: "Agora você pode complementar ou confirmar",
         description: "Caso queira explorar a tela ou adicionar mais sessões e exercícios ou pode confirmar o cadastro",
      },
      isInput: true,
   },
];
