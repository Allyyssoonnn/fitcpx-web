import { ArrowLeftCircle, Info, Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { createOrUpdateWorkout, deleteWorkout, getWorkouts } from "../../api/workouts";
import { FitTable } from "../../components/baseComponents/FitTable";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../components/ui/tooltip";
import { stateUsuario } from "../../states/states";

function Treinos() {
   const [usuario] = useRecoilState(stateUsuario);
   const [deleted, setDeleted] = useState(false);

   const { data: treinos, refetch } = useQuery({
      queryKey: ["alunos", usuario.cod_empresa],
      queryFn: () => getWorkouts(deleted),
      initialData: [],
      enabled: !!usuario.cod_empresa,
   });

   useEffect(() => {
      refetch();
   }, [deleted]);

   const navigate = useNavigate();

   const editarTreino = (treino) => navigate("/cadtreino", { state: { treino } });

   const delTreino = async (cod_treino) => {
      await deleteWorkout(cod_treino);
      refetch();
   };

   const recoTreino = async (workout) => {
      await createOrUpdateWorkout({ ...workout, deletedAt: null });
      refetch();
   };

   return (
      <div className="container-fluid">
         <div className="col-md-12">
            <FitTable.Root
               list={treinos}
               title="Treinos"
               description={`${treinos?.length} ${treinos?.length > 1 ? "Treinos" : "Treino"}`}
               fieldSearch="nome_treino"
               buttonOnClick={() => navigate("/cadtreino")}
               buttonText="Novo treino"
               columns={[
                  {
                     name: "nome_treino",
                     header: "Nome",
                     className: "fw-bold text-black",
                     getCell: (row) => {
                        if (!row.cod_empresa) {
                           return <tr>{row.nome_treino}</tr>;
                        } else {
                           return (
                              <div className="flex items-center gap-2">
                                 <Tooltip>
                                    <TooltipTrigger>
                                       <Info color="#8eea47ff" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                       <p>
                                          Este treino é um modelo padrão do sistema e não pode ser editado nem excluído.
                                       </p>
                                    </TooltipContent>
                                 </Tooltip>
                                 {row.nome_treino}
                              </div>
                           );
                        }
                     },
                  },
                  { name: "nivel_treino", header: "Nível", className: "fw-bold text-black" },
                  // { name: "observacao_treino", header: "Observação", className: "fw-bold text-black" },
                  { name: "Editar", header: "", type: "option", onClick: (row) => editarTreino(row), Icon: Pencil },
                  {
                     name: "Excluir",
                     header: "",
                     type: "option",
                     visible: (row) => !row?.deletedAt,
                     onClick: (row) => delTreino(row.cod_treino),
                     Icon: Trash,
                  },
                  {
                     name: "Recuperar",
                     header: "",
                     type: "option",
                     visible: (row) => row?.deletedAt,
                     onClick: (row) => recoTreino(row),
                     Icon: ArrowLeftCircle,
                  },
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
