import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { getContracts } from "../../api/contracts";
import { FitTable } from "../../components/baseComponents/FitTable";
import { Badge } from "../../components/ui/badge";
import { stateEmpresa } from "../../states/states";

function Contratos() {
   const [empresa] = useRecoilState(stateEmpresa);

   const { data: contratos, refetch } = useQuery({
      queryKey: ["contratos", empresa.cod_empresa],
      queryFn: getContracts,
      initialData: [],
      enabled: !!empresa.cod_empresa,
   });

   const navigate = useNavigate();

   return (
      <div className="container-fluid">
         <div className="col-md-12">
            <FitTable.Root
               list={contratos}
               title="Contratos"
               description={`${contratos?.length} ${contratos?.length > 1 ? "Contratos" : "Contrato"}`}
               fieldSearch="nome_aluno_contrato"
               onClickItem={(row) =>
                  navigate("/contrato", {
                     state: { cod_aluno_contrato: row.cod_aluno_contrato, cod_aluno: row.cod_aluno },
                  })
               }
               columns={[
                  { name: "aluno.nome_aluno", header: "Aluno", className: "fw-bold text-black" },
                  { name: "nome_aluno_contrato", header: "Nome", className: "fw-bold text-black" },
                  { name: "total_aluno_contrato", header: "Valor", type: "currency", className: "fw-bold text-black" },
                  {
                     name: "expiracao_aluno_contrato",
                     header: "Expiração",
                     type: "date",
                     className: "fw-bold text-black",
                  },
                  {
                     name: "status_aluno_contrato",
                     header: "Status",
                     className: "fw-bold text-black",
                     getCell: (row) => {
                        if (new Date(row?.expiracao_aluno_contrato) < new Date())
                           return <Badge className="bg-yellow-400 text-white">Expirado</Badge>;
                        if (row?.status_aluno_contrato == "Ativo") return <Badge className="text-white">Ativo</Badge>;
                        if (row?.status_aluno_contrato == "Inative")
                           return <Badge className="bg-red-400 text-white">Inativo</Badge>;
                        if (row?.status_aluno_contrato == "Canceled")
                           return <Badge className="bg-red-400 text-white">Cancelado</Badge>;
                        return <Badge className="bg-yellow-400 text-white">Pendente</Badge>;
                     },
                  },
               ]}
            />
         </div>
      </div>
   );
}

export default Contratos;
