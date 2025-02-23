import AjusteExercicios from "../pages/ajusteExercicios";
import CadExercicios from "../../pages/cadExercicio";


const routes = [
    //Base
    { path: '/', exact: true, name: 'Home' },
    { path: '/ajusteexercicios', name: 'Dashboard', element: AjusteExercicios },

    //Rotas do app usuário
    { path: '/ajusteexercicios', name: 'Dashboard', element: AjusteExercicios },
    { path: '/cadexercicio', name: 'Dashboard', element: CadExercicios },
]
  
export default routes;