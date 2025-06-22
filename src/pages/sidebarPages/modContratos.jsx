import { useQuery } from "react-query";
import { deleteContrato, getModContratos, recoveryContrato } from "../../api/plano";
import { useRecoilState } from "recoil";
import { stateUsuario } from "../../states/states";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ListComponent } from "../../components/baseComponents/ListComponent";

function ModContratos() {
    const [usuario] = useRecoilState(stateUsuario);
    const navigate = useNavigate();
    const [deleted, setDeleted] = useState(false);

    const { data: contratos, refetch } = useQuery({
        queryKey: ['contratos', usuario.cod_empresa],
        queryFn: () => getModContratos(usuario.cod_empresa, deleted),
        initialData: [],
    });

    const editarPlano = (contrato) => navigate('/cadcontrato', { state: { contrato } });
    const delPlano = async (cod_contrato) => {
        await deleteContrato(cod_contrato);
        refetch();
    }
    const recoveryPlan = async (cod_contrato) => {
        await recoveryContrato(cod_contrato);
        refetch();
    }

    useEffect(() => {
        refetch();
    }, [deleted]);

    return (
        <div className="container-fluid">
            <div className="col-md-12">
                <ListComponent.Root
                    list={contratos}
                    title="Modelos contratos"
                    description={`${contratos?.length} ${contratos?.length > 1 ? "Contratos" : "Contrato"}`}
                    fieldSearch="nome_contrato"
                    buttonOnClick={() => navigate('/cadcontrato')}
                    buttonText="Novo contrato"
                >
                    <ListComponent.Filters>
                        <ListComponent.Filter value={deleted} onChange={setDeleted} type="switch" name="Registros deletados" />
                    </ListComponent.Filters>

                    <ListComponent.Items>
                        {(contratos) => {
                            return contratos.map((contrato, index) => (
                                <ListComponent.Item key={index}
                                    index={index}
                                    title={contrato.nome_contrato}
                                    description={`${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(contrato?.valor_adesao)}`}
                                    badge={[contrato.duracao_contrato, contrato.tipo_duracao_contrato]}
                                    onClickItem={() => navigate('/cadcontrato', { state: { contrato } })}
                                >
                                    <ListComponent.Options>
                                        <ListComponent.Option title="Editar" icon="bi bi-pencil" onClick={() => editarPlano(contrato)} />
                                        {contrato.deletedAt ? (
                                            <ListComponent.Option title="Reverter" icon="bi bi-trash" onClick={() => recoveryPlan(contrato.cod_contrato)} />
                                        ) : (
                                            <ListComponent.Option title="Excluir" icon="bi bi-trash" onClick={() => delPlano(contrato.cod_contrato)} />
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

export default ModContratos;