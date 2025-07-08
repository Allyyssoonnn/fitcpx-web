import { useRecoilState } from "recoil";
import { stateUsuario } from "../../states/states";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { getAvaliacoes } from "../../api/aluno";
import { FitTable } from "../../components/baseComponents/FitTable";

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
                <FitTable.Root
                    list={avaliacoes.sort((a, b) => new Date(b.data_avaliacao) - new Date(a.data_avaliacao))}
                    title="Lista de avaliações"
                    description={`${avaliacoes?.length} ${avaliacoes?.length > 1 ? "Avaliações" : "Avaliação"}`}
                    fieldSearch="nome_aluno"
                    onClickItem={(row) => navigate('/avaliacao', { state: { avaliacao: row } })}
                    columns={[
                        { name: "nome_aluno", header: "Nome", className: "fw-bold text-black" },
                        { name: "data_avaliacao", header: "Data", type: "date", className: "fw-bold text-black" },
                    ]}
                />
            </div>
        </div>
    )
}

export default Avaliacoes;