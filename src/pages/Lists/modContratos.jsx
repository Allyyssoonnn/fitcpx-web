import { useQuery } from "react-query";
import { deleteContrato, getModContratos, recoveryContrato } from "../../api/plano";
import { useRecoilState } from "recoil";
import { stateUsuario } from "../../states/states";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FitTable } from "../../components/baseComponents/FitTable";
import { ArrowLeftCircle, Pencil, Trash } from "lucide-react";

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
                <FitTable.Root
                    list={contratos}
                    title="Modelos contratos"
                    description={`${contratos?.length} ${contratos?.length > 1 ? "Contratos" : "Contrato"}`}
                    fieldSearch="nome_contrato"
                    buttonOnClick={() => navigate('/cadcontrato')}
                    buttonText="Novo contrato"
                    columns={[
                        { name: "nome_contrato", header: "Nome", className: "fw-bold text-black" },
                        // { name: "valor_adesao", type: "currency", header: "Adesão", className: "fw-bold text-black" },
                        { name: "Editar", header: "", type: "option", onClick: (row) => editarPlano(row), Icon: Pencil },
                        { name: "Excluir", header: "", type: "option", visible: (row) => !row?.deletedAt, onClick: (row) => delPlano(row.cod_contrato), Icon: Trash },
                        { name: "Recuperar", header: "", type: "option", visible: (row) => row?.deletedAt, onClick: (row) => recoveryPlan(row.cod_contrato), Icon: ArrowLeftCircle },
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

export default ModContratos;