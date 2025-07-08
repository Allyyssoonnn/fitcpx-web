import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useRecoilState } from "recoil";
import { stateUsuario } from "../../states/states";
import { useNavigate } from "react-router-dom";
import { deleteGrupoExercicio, getGrupoExercicios, recoveryGrupoExercicio } from "../../api/treino";
import { FitTable } from "../../components/baseComponents/FitTable";
import { ArrowLeftCircle, Pencil, Trash } from "lucide-react";

function GrupoExercicios() {
    const [usuario] = useRecoilState(stateUsuario);  
    const [deleted, setDeleted] = useState(false);

    const { data: grupos, refetch } = useQuery({
        queryKey: ['alunos', usuario.cod_empresa],
        queryFn: () => getGrupoExercicios(usuario.cod_empresa, deleted),
        initialData: [],
    });

    useEffect(() => {
        refetch();
    }, [deleted]);

    const navigate = useNavigate();
    
    const editarGrupo = (grupo) => navigate('/cadgrupoexercicio', { state: { grupo } });
    const deleteGrupo = async (cod_grupo_exercicio) => {
        await deleteGrupoExercicio(cod_grupo_exercicio);
        refetch();
    }
    const recoveryGrupo = async (cod_grupo_exercicio) => {
        await recoveryGrupoExercicio(cod_grupo_exercicio);
        refetch();
    }
        
    return (
        <div className="container-fluid">
            <div className="col-md-12">
                <FitTable.Root
                    list={grupos}
                    title="Grupo de exercícios"
                    description={`${grupos?.length} ${grupos?.length > 1 ? "Grupos de exercícios" : "Grupo de exercícios"}`}
                    fieldSearch="nome_grupo_exercicio"
                    buttonOnClick={() => navigate('/cadgrupoexercicio')}
                    buttonText="Novo grupo"
                    columns={[
                        { name: "nome_grupo_exercicio", header: "Nome", className: "fw-bold text-black" },
                        { name: "Editar", header: "", type: "option", visible: (row) => row.base_grupo_exercicio !== 'S', onClick: (row) => editarGrupo(row), Icon: Pencil },
                        { name: "Excluir", header: "", type: "option", visible: (row) => !row?.deletedAt && row.base_grupo_exercicio !== 'S', onClick: (row) => deleteGrupo(row.cod_grupo_exercicio), Icon: Trash },
                        { name: "Recuperar", header: "", type: "option", visible: (row) => row?.deletedAt && row.base_grupo_exercicio !== 'S', onClick: (row) => recoveryGrupo(row.cod_grupo_exercicio), Icon: ArrowLeftCircle },
                    ]}
                >
                    <FitTable.Filters>
                        <FitTable.Filter value={deleted} onChange={setDeleted} type="switch" name="Registros deleteados" />
                    </FitTable.Filters>
                </FitTable.Root>
            </div>
        </div>
    );
}

export default GrupoExercicios;