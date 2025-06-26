import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useRecoilState } from "recoil";
import { stateUsuario } from "../../states/states";
import { useNavigate } from "react-router-dom";
import { deleteTreino, getTreinos, recoveryTreino } from "../../api/treino";
import { getSexo } from "../../utils";
import { ListComponent } from "../../components/baseComponents/ListComponent";

function Treinos() {
    const [usuario] = useRecoilState(stateUsuario);  
    const [deleted, setDeleted] = useState(false);

    const { data: treinos, refetch } = useQuery({
        queryKey: ['alunos', usuario.cod_empresa],
        queryFn: () => getTreinos({ cod_empresa: usuario.cod_empresa, deleted }),
        initialData: [],
        enabled: !!usuario.cod_empresa,
    });

    useEffect(() => {
        refetch();
    }, [deleted]);

    const navigate = useNavigate();
    
    const editarTreino = (treino) => navigate('/cadtreino', { state: { treino } });

    const delTreino = async (cod_treino) => {
        await deleteTreino(cod_treino);
        refetch();
    }

    const recoTreino = async (cod_treino) => {
        await recoveryTreino(cod_treino);
        refetch();
    }

    return (
        <div className="container-fluid">
            <div className="col-md-12">
                <ListComponent.Root
                    list={treinos}
                    title="Treinos"
                    description={`${treinos?.length} ${treinos?.length > 1 ? "Treinos" : "Treino"}`}
                    fieldSearch="nome_treino"
                    buttonOnClick={() => navigate('/cadtreino')}
                    buttonText="Novo treino"
                >
                    <ListComponent.Filters>
                        <ListComponent.Filter value={deleted} onChange={setDeleted} type="switch" name="Registros deletados" />
                    </ListComponent.Filters>

                    <ListComponent.Items>
                        {(treinos) => {
                            return treinos.map((treino, index) => (
                                <ListComponent.Item
                                    key={index}
                                    index={index}
                                    title={treino.nome_treino}
                                    description={treino.nome_usuario}
                                    badge={[getSexo(treino.sexo_treino), treino.nivel_treino, treino.observacao_treino]}
                                >
                                    <ListComponent.Options>
                                        <ListComponent.Option title="Editar" icon="bi bi-pencil" onClick={() => editarTreino(treino)} />
                                        {treino.deletedAt ? (
                                            <ListComponent.Option title="Reverter" icon="bi bi-trash" onClick={() => recoTreino(treino.cod_treino)} />
                                        ) : (
                                            <ListComponent.Option title="Excluir" icon="bi bi-trash" onClick={() => delTreino(treino.cod_treino)} />
                                        )}
                                    </ListComponent.Options>
                                </ListComponent.Item>
                            ))
                        }}
                    </ListComponent.Items>
                </ListComponent.Root>
            </div>
        </div>
    );
}

export default Treinos;