import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useRecoilState } from "recoil";
import { stateUsuario } from "../../states/states";
import { useNavigate } from "react-router-dom";
import { deleteTreino, getTreinos, recoveryTreino } from "../../api/treino";
import { FitTable } from "../../components/baseComponents/FitTable";
import { ArrowLeftCircle, Pencil, Trash } from "lucide-react";

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
                <FitTable.Root
                    list={treinos}
                    title="Treinos"
                    description={`${treinos?.length} ${treinos?.length > 1 ? "Treinos" : "Treino"}`}
                    fieldSearch="nome_treino"
                    buttonOnClick={() => navigate('/cadtreino')}
                    buttonText="Novo treino"
                    columns={[
                        { name: "nome_treino", header: "Nome", className: "fw-bold text-black" },
                        { name: "nivel_treino", header: "Nível", className: "fw-bold text-black" },
                        { name: "observacao_treino", header: "Observação", className: "fw-bold text-black" },
                        { name: "Editar", header: "", type: "option", onClick: (row) => editarTreino(row), Icon: Pencil },
                        { name: "Excluir", header: "", type: "option", visible: (row) => !row?.deletedAt, onClick: (row) => delTreino(row.cod_treino), Icon: Trash },
                        { name: "Recuperar", header: "", type: "option", visible: (row) => row?.deletedAt, onClick: (row) => recoTreino(row.cod_treino), Icon: ArrowLeftCircle },
                    ]}
                >
                    <FitTable.Filters>
                        <FitTable.Filter value={deleted} onChange={setDeleted} type="switch" name="Registros deletados" />
                    </FitTable.Filters>
                </FitTable.Root>
            </div>
        </div>
    );
}

export default Treinos;