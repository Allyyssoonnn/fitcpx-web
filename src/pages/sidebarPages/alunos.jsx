import { deleteAluno, getAlunos, recoveryAluno } from "../../api/aluno";
import { useNavigate } from "react-router-dom";
import { calcularIdade } from "../../utils";
import { useQuery } from "react-query";
import { useRecoilState } from "recoil";
import { stateUsuario } from '../../states/states';
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ListComponent } from "../../components/baseComponents/ListComponent";

function Alunos() {
    const { t } = useTranslation('clients');
    const [usuario] = useRecoilState(stateUsuario);
    const [statusFilter, setStatusFilter] = useState("A");
    const [deleted, setDeleted] = useState(false);

    const { data: alunos, refetch } = useQuery({
        queryKey: ['alunos', usuario.cod_usuario],
        queryFn: () => getAlunos(usuario.cod_usuario, usuario.cod_empresa, deleted),
        initialData: [],
        enabled: !!usuario.cod_empresa,
    });

    useEffect(() => {
        refetch();
    }, [deleted]);

    const navigate = useNavigate();
    
    const editarAluno = (aluno) => navigate('/cadaluno', { state: { aluno } });

    const filteredAlunos = useMemo(() => {
        return alunos.filter((aluno) => aluno.status_aluno === statusFilter)
    }, [alunos, statusFilter]);

    const delAlun = async (cod_aluno) => {
        await deleteAluno(cod_aluno);
        refetch();
    }

    const recoveryAlun = async (cod_aluno) => {
        await recoveryAluno(cod_aluno);
        refetch();
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-12">
                    <ListComponent.Root
                        list={filteredAlunos}
                        title={t('listName')}
                        description={`${filteredAlunos?.length} ${filteredAlunos?.length > 1 ? "Alunos" : "Aluno"}`}
                        buttonText={t('newButtonText')} 
                        fieldSearch="nome_aluno"
                        buttonOnClick={() => navigate('/cadaluno')}
                    >
                        <ListComponent.Filters>
                            <ListComponent.Filter value={deleted} onChange={setDeleted} type="switch" name="Registros deleteados" />
                            <ListComponent.Filter value={statusFilter} onChange={setStatusFilter} type="select" name="Status" options={[
                                { label: "Ativo", value: "A" }, { label: "Inativo", value: "I" }, { label: "Bloqueado", value: "B" }]
                            } />
                        </ListComponent.Filters>

                        <ListComponent.Items>    
                            {(filteredAlunos) => {
                                return filteredAlunos.map((aluno, index) => (
                                    <ListComponent.Item
                                        key={index}
                                        index={index}
                                        urlImage={aluno.imagem_aluno}
                                        title={aluno.nome_aluno}
                                        description={`${calcularIdade(aluno.data_nascimento_aluno)} anos`}
                                        onClickItem={() => navigate('/aluno', { state: { cod_aluno: aluno.cod_aluno } })}
                                    >
                                        <ListComponent.Options>
                                            <ListComponent.Option title="Editar" icon="bi bi-pencil" onClick={() => editarAluno(aluno)} />
                                            {aluno.deletedAt ? (
                                                <ListComponent.Option title="Reverter" icon="bi bi-trash" onClick={() => recoveryAlun(aluno.cod_aluno)} />
                                            ) : (
                                                <ListComponent.Option title="Excluir" icon="bi bi-trash" onClick={() => delAlun(aluno.cod_aluno)} />
                                            )}
                                        </ListComponent.Options>
                                    </ListComponent.Item>
                                ))
                            }}
                        </ListComponent.Items>
                    </ListComponent.Root>
                </div>
            </div>
        </div>
    );
}

export default Alunos;