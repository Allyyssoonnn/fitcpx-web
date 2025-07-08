import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteModalidade, getModalidades, recoveryModalidade } from "../../api/plano";
import { useRecoilState } from "recoil";
import { stateUsuario } from "../../states/states";
import { useQuery } from "react-query";
import { FitTable } from "../../components/baseComponents/FitTable";
import { ArrowLeftCircle, Pencil, Trash } from "lucide-react";

function Modalidades() {
    const [usuario] = useRecoilState(stateUsuario);
    const navigate = useNavigate();
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

    return (
        <div className="container-fluid">
            <div className="col-md-12">
                <FitTable.Root
                    list={modalidades}
                    title="Modalidades"
                    description={`${modalidades?.length} ${modalidades?.length > 1 ? "Modalidades" : "Modalidade"}`}
                    fieldSearch="nome_modalidade"
                    buttonOnClick={() => navigate('/cadmodalidade')}
                    buttonText="Nova modalidade"
                    buttonId="newService"
                    columns={[
                        { name: "nome_modalidade", header: "Nome", className: "fw-bold text-black" },
                        { name: "valor_modalidade", type: "currency", header: "Valor", className: "fw-bold text-black" },
                        { name: "Editar", header: "", type: "option", onClick: (row) => editarModalidade(row), Icon: Pencil },
                        { name: "Excluir", header: "", type: "option", visible: (row) => !row?.deletedAt, onClick: (row) => delModalidae(row.cod_modalidade), Icon: Trash },
                        { name: "Recuperar", header: "", type: "option", visible: (row) => row?.deletedAt, onClick: (row) => recoveryModa(row.cod_modalidade), Icon: ArrowLeftCircle },
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

export default Modalidades;