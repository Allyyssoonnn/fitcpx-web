import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteModalidade, getModalidades, recoveryModalidade } from "../../api/plano";
import { useRecoilState } from "recoil";
import { stateUsuario } from "../../states/states";
import { useQuery } from "react-query";
import { ListComponent } from "../../components/baseComponents/ListComponent";

function Modalidades() {
    const [usuario] = useRecoilState(stateUsuario);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [deleted, setDeleted] = useState(false);

    const { data: modalidades, refetch } = useQuery({
        queryKey: ['modalidades', usuario.cod_empresa],
        queryFn: () => getModalidades(usuario.cod_empresa, deleted),
        initialData: [],
    });

    const editarModalidade = (modalidade) => navigate('/cadmodalidade', { state: { modalidade } });
    const delModalidae = async (cod_modalidade) => {
        await deleteModalidade(cod_modalidade);
        refetch();
    }
    const recoveryModa = async (cod_modalidade) => {
        await recoveryModalidade(cod_modalidade);
        refetch();
    }

    useEffect(() => {
        refetch();
    }, [deleted]);

    const filteredModalidades = useMemo(() => {
        return modalidades.filter((modalidade) =>
            searchTerm.toLowerCase().split(" ").filter(Boolean).every(word =>
                modalidade.nome_modalidade?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(word)
            )
        );
    }, [modalidades, searchTerm]);

    return (
        <div className="container-fluid">
            <div className="col-md-12">
                <ListComponent.Root
                    list={filteredModalidades}
                    title="Modalidades"
                    description={`${filteredModalidades?.length} ${filteredModalidades?.length > 1 ? "Modalidades" : "Modalidade"}`}
                    fieldSearch="nome_modalidade"
                    buttonOnClick={() => navigate('/cadmodalidade')}
                    buttonText="Nova modalidade"
                    buttonId="newService"
                >
                    <ListComponent.Filters>
                        <ListComponent.Filter value={deleted} onChange={setDeleted} type="switch" name="Registros deletados" />
                    </ListComponent.Filters>

                    <ListComponent.Items>
                        {(modalidades) => {
                            return modalidades.map((modalidade, index) => (
                                <ListComponent.Item key={index}
                                    index={index}
                                    title={modalidade.nome_modalidade}
                                    badge={[`${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(modalidade?.valor_modalidade)}`, modalidade.duracao_modalidade, modalidade.tipo_duracao_modalidade]}
                                    onClickItem={() => navigate('/cadmodalidade', { state: { modalidade } })}
                                >
                                    <ListComponent.Options>
                                        <ListComponent.Option title="Editar" icon="bi bi-pencil" onClick={() => editarModalidade(modalidade)} />
                                        {modalidade.deletedAt ? (
                                            <ListComponent.Option title="Reverter" icon="bi bi-trash" onClick={() => recoveryModa(modalidade.cod_modalidade)} />
                                        ) : (
                                            <ListComponent.Option title="Excluir" icon="bi bi-trash" onClick={() => delModalidae(modalidade.cod_modalidade)} />
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

export default Modalidades;