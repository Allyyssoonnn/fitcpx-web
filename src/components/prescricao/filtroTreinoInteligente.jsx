import { useState } from "react";
import { Modal } from "react-bootstrap";
import { useQuery } from "react-query";
import { getExercises } from "../../api/exercises";
import FiltroExercicio from "../filtroExercicio";

function FiltroTreinoInteligente({ show, close, confirma, exercicio }) {
   const [exerciciosFiltrado, setExerciciosFiltrado] = useState([]);

   const { data: exercicios, refetch } = useQuery({
      queryKey: ["exercicios"],
      queryFn: getExercises,
      initialData: [],
   });

   function confirmaTreinoInteligente() {
      confirma(exerciciosFiltrado);
      close();
   }

   return (
      <Modal show={show} className="modal-fade">
         <div className="modal-header">
            <h5 className="modal-title">Precrição de Treino inteligente</h5>
         </div>

         <div className="modal-body">
            <FiltroExercicio
               exercicios={exercicios}
               setExerciciosFiltrados={setExerciciosFiltrado}
               painel={true}
               exercicio={exercicio}
            />
         </div>

         <div className="modal-bottom p-2 d-flex justify-content-center gap-2">
            <button className="btn btn-danger rounded" onClick={close}>
               Fechar
            </button>
            <button className="btn btn-success rounded" onClick={confirmaTreinoInteligente}>
               Confirmar
            </button>
         </div>
      </Modal>
   );
}

export default FiltroTreinoInteligente;
