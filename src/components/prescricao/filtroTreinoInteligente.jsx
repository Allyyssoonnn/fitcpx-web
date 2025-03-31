import { Modal } from "react-bootstrap";
import FiltroExercicio from "../filtroExercicio";
import { useQuery } from "react-query";
import { getExercicios } from "../../api/treino";
import { useRecoilState } from "recoil";
import { stateUsuario } from "../../states/states";
import { useState } from "react";

function FiltroTreinoInteligente({ show, close, confirma }) {
    const [usuario] = useRecoilState(stateUsuario);

    const [exerciciosFiltrado, setExerciciosFiltrado] = useState([]);

    const { data: exercicios, refetch } = useQuery({
        queryKey: ['exercicios', usuario.cod_usuario],
        queryFn: () => getExercicios(usuario.cod_usuario),
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
                <FiltroExercicio exercicios={exercicios} setExerciciosFiltrados={setExerciciosFiltrado} painel={true} />
            </div>

            <div className="modal-bottom p-2 d-flex justify-content-center gap-2">
                <button className="btn btn-danger rounded" onClick={close}>Fechar</button>
                <button className="btn btn-success rounded" onClick={confirmaTreinoInteligente}>Confirmar</button>
            </div>
        </Modal>
    )
}

export default FiltroTreinoInteligente;