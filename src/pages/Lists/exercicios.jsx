import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useRecoilState } from "recoil";
import { stateUsuario } from "../../states/states";
import { useNavigate } from "react-router-dom";
import { getExercicios, deleteExercicio, recoveryExercicio } from '../../api/treino';
import FiltroExercicio from "../../components/filtroExercicio";
import { FitTable } from "../../components/baseComponents/FitTable";
import { ArrowLeftCircle, Pencil, Trash } from "lucide-react";

function Exercicios() {
    const [usuario] = useRecoilState(stateUsuario);
    const [deleted, setDeleted] = useState(false);

    const [exerciciosFiltrados, setExerciciosFiltrados] = useState([]);

    const { data: exercicios, refetch } = useQuery({
        queryKey: ['exercicios', usuario.cod_usuario],
        queryFn: () => getExercicios(usuario.cod_usuario, deleted),
        initialData: [],
    });
    
    useEffect(() => {
        refetch();
    }, [deleted]);

    const navigate = useNavigate();
    
    const editarExercicio = (exercicio) => navigate('/cadexercicio', { state: { exercicio: exercicio } });
    const delExercicio = async (cod_exercicio) => {
        await deleteExercicio(cod_exercicio);
        refetch();
    }

    const recoveryExec = async (cod_exercicio) => {
        await recoveryExercicio(cod_exercicio);
        refetch();
    }
    
    const filteredExercicios = useMemo(() => {
        return exerciciosFiltrados;
    }, [exerciciosFiltrados]);
        
    return (
        <div className="container-fluid">
            <div className="col-md-12">
                <FiltroExercicio exercicios={exercicios} setExerciciosFiltrados={setExerciciosFiltrados} />
            </div>

            <div className="col-md-12">
                <FitTable.Root
                    list={filteredExercicios}
                    title="Exercícios"
                    description={`${exercicios?.length} ${exercicios?.length > 1 ? "Exercícios" : "Exercício"}`}
                    fieldSearch="nome_exercicio"
                    columns={[
                        { name: "nome_exercicio", header: "Nome", className: "fw-bold text-black" },
                        { name: "grupo_exercicio_1.nome_grupo_exercicio", header: "Grupo muscular", className: "fw-bold text-black" },
                        { name: "grupo_exercicio_2.nome_grupo_exercicio", header: "Grupo muscular", className: "fw-bold text-black" },
                        { name: "Editar", header: "", type: "option", onClick: (row) => editarExercicio(row), Icon: Pencil },
                        { name: "Excluir", header: "", type: "option", visible: (row) => !row?.deletedAt && row.base_exercicio !== 'S', onClick: (row) => delExercicio(row.cod_exercicio), Icon: Trash },
                        { name: "Recuperar", header: "", type: "option", visible: (row) => row?.deletedAt && row.base_exercicio !== 'S', onClick: (row) => recoveryExec(row.cod_exercicio), Icon: ArrowLeftCircle },
                    ]}
                    buttonOnClick={() => navigate('/cadexercicio')}
                    buttonText="Novo exercício"
                >
                    <FitTable.Filters>
                        <FitTable.Filter value={deleted} onChange={setDeleted} type="switch" name="Registros deletados" />
                    </FitTable.Filters>
                </FitTable.Root>
            </div>
        </div>
    );
}

export default Exercicios;