import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useRecoilState } from "recoil";
import { stateUsuario } from "../../states/states";
import { useNavigate } from "react-router-dom";
import { deleteGrupoExercicio, getGrupoExercicios, recoveryGrupoExercicio } from "../../api/treino";
import { ListComponent } from "../../components/baseComponents/ListComponent";

function GrupoExercicios() {
    const [usuario] = useRecoilState(stateUsuario);  
    const [deleted, setDeleted] = useState(false);

    const { data: grupos, refetch } = useQuery({
        queryKey: ['alunos', usuario.cod_empresa],
        queryFn: () => getGrupoExercicios(usuario.cod_empresa, deleted),
        initialData: [],
    });

    useEffect(() => {
        refetch();
    }, [deleted]);

    const navigate = useNavigate();
    
    const editarGrupo = (grupo) => navigate('/cadgrupoexercicio', { state: { grupo } });
    const deleteGrupo = async (cod_grupo_exercicio) => {
        await deleteGrupoExercicio(cod_grupo_exercicio);
        refetch();
    }
    const recoveryGrupo = async (cod_grupo_exercicio) => {
        await recoveryGrupoExercicio(cod_grupo_exercicio);
        refetch();
    }
        
    return (
        <div className="container-fluid">
            <div className="col-md-12">
                <ListComponent.Root
                    list={grupos}
                    title="Grupo de exercícios"
                    description={`${grupos?.length} ${grupos?.length > 1 ? "Grupos de exercícios" : "Grupo de exercícios"}`}
                    fieldSearch="nome_grupo_exercicio"
                    buttonOnClick={() => navigate('/cadgrupoexercicio')}
                    buttonText="Novo grupo"
                >
                    <ListComponent.Filters>
                        <ListComponent.Filter value={deleted} onChange={setDeleted} type="switch" name="Registros deleteados" />
                    </ListComponent.Filters>

                    <ListComponent.Items>
                        {(grupos) => {
                            return grupos.map((grupo, index) => (
                                <ListComponent.Item
                                    key={index}
                                    index={index}
                                    title={grupo.nome_grupo_exercicio}
                                    urlImage={grupo.imagem_grupo_exercicio}
                                    description={grupo.descricao_grupo_exercicio}
                                    onClickItem={() => navigate('/cadgrupoexercicio', { state: { grupo } })}
                                >
                                    {grupo.base_grupo_exercicio !== 'S' && (
                                        <ListComponent.Options>
                                            <ListComponent.Option title="Editar" icon="bi bi-pencil" onClick={() => editarGrupo(grupo)} />
                                            {grupo.deletedAt ? (
                                                <ListComponent.Option title="Reverter" icon="bi bi-trash" onClick={() => recoveryGrupo(grupo.cod_grupo_exercicio)} />
                                            ) : (
                                                <ListComponent.Option title="Excluir" icon="bi bi-trash" onClick={() => deleteGrupo(grupo.cod_grupo_exercicio)} />
                                            )}
                                        </ListComponent.Options>
                                    )}
                                </ListComponent.Item>
                            ))
                        }}
                    </ListComponent.Items>
                </ListComponent.Root>
            </div>
        </div>
    );
}

export default GrupoExercicios;