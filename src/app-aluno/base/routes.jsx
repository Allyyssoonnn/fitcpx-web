import Avaliacao from "../../pages/avaliacao";
import CompareAvaliacao from "../../pages/compareAvaliacao";
import AvaliacoesAluno from "../pages/avaliacoesAluno";
import CardapiosAluno from "../pages/cardapiosAluno";
import TreinosAluno from "../pages/treinosAluno";


const routes = [
    //Base
    { path: '/', exact: true, name: 'Home' },
    { path: '/avaliacoes', name: 'Dashboard', element: AvaliacoesAluno },
    { path: '/treinos', name: 'Dashboard', element: TreinosAluno },
    { path: '/cardapios', name: 'Dashboard', element: CardapiosAluno },

    //Rotas do app usuário
    { path: '/avaliacao', name: 'Avaliação', element: Avaliacao },
    { path: '/compareavaliacao', name: 'Avaliação', element: CompareAvaliacao },
]
  
export default routes;