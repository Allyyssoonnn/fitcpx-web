import { useRecoilState } from "recoil";
import { stateEmpresa } from "../../states/states";
import { getAlunoContratos } from "../../api/aluno";
import { useQuery } from "react-query";
import { formatarData, formatarMoeda } from "../../utils";
import { useNavigate } from "react-router-dom";
import { ListComponent } from "../../components/baseComponents/ListComponent";

function Contratos() {
    const [empresa] = useRecoilState(stateEmpresa);

    const { data: contratos, refetch } = useQuery({
        queryKey: ['contratos', empresa.cod_empresa],
        queryFn: () => getAlunoContratos(null, empresa.cod_empresa),
        initialData: [],
        enabled: !!empresa.cod_empresa,
    });

    const navigate = useNavigate();

    return (
        <div className="container-fluid">

            <div className="col-md-12">
                <ListComponent.Root
                    list={contratos}
                    title="Contratos"
                    description={`${contratos?.length} ${contratos?.length > 1 ? "Contratos" : "Contrato"}`}
                    fieldSearch="nome_aluno_contrato"
                >
                    <ListComponent.Items>
                        {(contratos) => {
                            return contratos.map((contrato, index) => (
                                <ListComponent.Item key={index}
                                    index={index}
                                    title={contrato.aluno.nome_aluno}
                                    description={contrato.nome_aluno_contrato}
                                    badge={[
                                        formatarMoeda(contrato.total_aluno_contrato),
                                        `${JSON.parse(contrato.parcela_aluno_contrato).length} Meses`,
                                        formatarData(contrato.expiracao_aluno_contrato),
                                        contrato.status_aluno_contrato == 'ACTIVE' ? 'Ativo' : 'Inativo'
                                    ]}
                                    onClickItem={() => navigate('/contrato', { state: { cod_aluno_contrato: contrato.cod_aluno_contrato, cod_aluno: contrato.cod_aluno } })}
                                />
                            ))
                        }}
                    </ListComponent.Items>
                </ListComponent.Root>
            </div>
        </div>
    )
}

export default Contratos;