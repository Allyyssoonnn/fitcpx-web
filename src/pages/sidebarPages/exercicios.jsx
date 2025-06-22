import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useRecoilState } from "recoil";
import { stateUsuario } from "../../states/states";
import { useNavigate } from "react-router-dom";
import { getExercicios, deleteExercicio, recoveryExercicio } from '../../api/treino';
import FiltroExercicio from "../../components/filtroExercicio";
import { ListComponent } from "../../components/baseComponents/ListComponent";

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
                <ListComponent.Root
                    list={filteredExercicios}
                    title="Exercícios"
                    description={`${exercicios?.length} ${exercicios?.length > 1 ? "Exercícios" : "Exercício"}`}
                    fieldSearch="nome_exercicio"
                >
                    <ListComponent.Filters>
                        <ListComponent.Filter value={deleted} onChange={setDeleted} type="switch" name="Registros deletados" />
                    </ListComponent.Filters>

                    <ListComponent.Items>
                        {(exercicios) => {
                            return exercicios.map((exercicio, index) => {
                                const grupo_exercicio_1 = exercicio?.grupo_exercicio_1?.nome_grupo_exercicio;
                                const grupo_exercicio_2 = exercicio?.grupo_exercicio_2?.nome_grupo_exercicio;
                                const grupo_exercicio_3 = exercicio?.grupo_exercicio_3?.nome_grupo_exercicio;
                                const grupo_exercicio_4 = exercicio?.grupo_exercicio_4?.nome_grupo_exercicio;

                                return (
                                    <ListComponent.Item
                                        key={index}
                                        index={index}
                                        title={exercicio.nome_exercicio}
                                        description={exercicio.descricao_exercicio}
                                        onClickItem={() => navigate('/cadexercicio', { state: { exercicio: exercicio } })}
                                        badge={[grupo_exercicio_1, grupo_exercicio_2, grupo_exercicio_3, grupo_exercicio_4]}
                                    >
                                        <ListComponent.Options>
                                            <ListComponent.Option title="Editar" icon="bi bi-pencil" onClick={() => editarExercicio(exercicio)} />
                                            {exercicio.base_exercicio !== 'S' && (
                                                <>
                                                    {exercicio.deletedAt ? (
                                                        <ListComponent.Option title="Reverter" icon="bi bi-trash" onClick={() => recoveryExec(exercicio.cod_exercicio)} />
                                                    ) : (
                                                        <ListComponent.Option title="Excluir" icon="bi bi-trash" onClick={() => delExercicio(exercicio.cod_exercicio)} />
                                                    )}
                                                </>
                                            )}
                                        </ListComponent.Options>
                                    </ListComponent.Item>
                                )
                            })
                        }}
                    </ListComponent.Items>
                </ListComponent.Root>
            </div>
        </div>
    );
}

export default Exercicios;