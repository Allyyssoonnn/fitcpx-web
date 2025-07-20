import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deletePlano, getPlanos, recoveryPlano } from "../../api/plano";
import { useQuery } from "react-query";
import { useRecoilState } from "recoil";
import { stateUsuario } from "../../states/states";
import { FitTable } from "../../components/baseComponents/FitTable";
import { ArrowLeftCircle, Pencil, Trash } from "lucide-react";

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
                <FitTable.Root
                    list={planos}
                    title="Planos"
                    description={`${planos?.length} ${planos?.length > 1 ? "Planos" : "Plano"}`}
                    fieldSearch="nome_plano"
                    buttonOnClick={() => navigate('/cadplano')}
                    buttonText="Novo plano"
                    columns={[
                        { name: "nome_plano", header: "Nome", className: "fw-bold text-black" },
                        // { name: "valor_plano", type: "currency", header: "Valor", className: "fw-bold text-black" },
                        { name: "Editar", header: "", type: "option", onClick: (row) => editarPlano(row), Icon: Pencil },
                        { name: "Excluir", header: "", type: "option", visible: (row) => !row?.deletedAt, onClick: (row) => delPlano(row.cod_plano), Icon: Trash },
                        { name: "Recuperar", header: "", type: "option", visible: (row) => row?.deletedAt, onClick: (row) => recoveryPlan(row.cod_plano), Icon: ArrowLeftCircle },
                    ]}
                >
                    <FitTable.Filters>
                        <FitTable.Filter value={deleted} onChange={setDeleted} type="switch" name="Registros deletados" />
                    </FitTable.Filters>
                </FitTable.Root>
            </div>
        </div>
    )
}

export default Planos;