import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deletePlano, getPlanos, recoveryPlano } from "../../api/plano";
import { useQuery } from "react-query";
import { useRecoilState } from "recoil";
import { stateUsuario } from "../../states/states";
import { ListComponent } from "../../components/baseComponents/ListComponent";

function Planos() {
    const [usuario] = useRecoilState(stateUsuario);
    const navigate = useNavigate();
    const [deleted, setDeleted] = useState(false);

    const { data: planos, refetch } = useQuery({
        queryKey: ['planos', usuario.cod_empresa],
        queryFn: () => getPlanos(usuario.cod_empresa, deleted),
        initialData: [],
    });
    
    const editarPlano = (plano) => navigate('/cadplano', { state: { plano } });
    const delPlano = async (cod_plano) => {
        await deletePlano(cod_plano);
        refetch();
    }
    const recoveryPlan = async (cod_plano) => {
        await recoveryPlano(cod_plano);
        refetch();
    }

    useEffect(() => {
        refetch();
    }, [deleted]);

    return (
        <div className="container-fluid">
            <div className="col-md-12">
                <ListComponent.Root
                    list={planos}
                    title="Planos"
                    description={`${planos?.length} ${planos?.length > 1 ? "Planos" : "Plano"}`}
                    fieldSearch="nome_plano"
                    buttonOnClick={() => navigate('/cadplano')}
                    buttonText="Novo plano"
                >
                    <ListComponent.Filters>
                        <ListComponent.Filter value={deleted} onChange={setDeleted} type="switch" name="Registros deletados" />
                    </ListComponent.Filters>

                    <ListComponent.Items>
                        {(planos) => {
                            return planos.map((plano, index) => (
                                <ListComponent.Item key={index}
                                    index={index}
                                    title={plano.nome_plano}
                                    badge={[
                                        `${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(plano?.valor_plano)}`,
                                        `${plano.duracao_plano} Meses`,
                                        ...(plano.modalidades.map((mod) => mod?.modalidade?.nome_modalidade)),
                                    ]}
                                    onClickItem={() => navigate('/cadplano', { state: { plano } })}
                                >
                                    <ListComponent.Options>
                                        <ListComponent.Option title="Editar" icon="bi bi-pencil" onClick={() => editarPlano(plano)} />
                                        {plano.deletedAt ? (
                                            <ListComponent.Option title="Reverter" icon="bi bi-trash" onClick={() => recoveryPlan(plano.cod_plano)} />
                                        ) : (
                                            <ListComponent.Option title="Excluir" icon="bi bi-trash" onClick={() => delPlano(plano.cod_plano)} />
                                        )}
                                    </ListComponent.Options>
                                </ListComponent.Item>
                            ))
                        }}
                    </ListComponent.Items>
                </ListComponent.Root>
            </div>
        </div>
    )
}

export default Planos;