import { useRecoilState } from "recoil";
import { stateUsuario } from "../../states/states";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { getAvaliacoes } from "../../api/aluno";
import { formatarData } from "../../utils";
import { ListComponent } from "../../components/baseComponents/ListComponent";

function Avaliacoes() {
    const [usuario] = useRecoilState(stateUsuario);

    const navigate = useNavigate();
    
    const { data: avaliacoes } = useQuery({
        queryKey: ['avaliacoes', usuario.cod_usuario],
        queryFn: () => getAvaliacoes(usuario.cod_empresa),
        initialData: [],
        enabled: !!usuario.cod_empresa,
    });

    return (
        <div className="container-fluid">
            <div className="col-md-12">
                <ListComponent.Root
                    list={avaliacoes}
                    title="Lista de avaliações"
                    description={`${avaliacoes?.length} ${avaliacoes?.length > 1 ? "Avaliações" : "Avaliação"}`}
                    fieldSearch="nome_aluno"
                >
                    <ListComponent.Items>
                        {(filteredAvaliacoes) => {
                            return filteredAvaliacoes.sort((a, b) => new Date(b.data_avaliacao) - new Date(a.data_avaliacao)).map((avaliacao, index) => (
                                <ListComponent.Item
                                    key={index}
                                    index={index}
                                    title={avaliacao.nome_aluno}
                                    description={formatarData(avaliacao.data_avaliacao)}
                                    onClickItem={() => navigate('/avaliacao', { state: { avaliacao } })}
                                    urlImage={avaliacao.imagem_aluno}
                                />
                            ))
                        }}
                    </ListComponent.Items>
                </ListComponent.Root>
            </div>
        </div>
    )
}

export default Avaliacoes;