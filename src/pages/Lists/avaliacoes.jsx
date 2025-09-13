import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { getPhysicalAssessments } from "../../api/physicalAssessments";
import { FitTable } from "../../components/baseComponents/FitTable";

function Avaliacoes() {
   const navigate = useNavigate();

   const { data: avaliacoes } = useQuery({
      queryKey: ["avaliacoes"],
      queryFn: getPhysicalAssessments,
      initialData: [],
   });

   return (
      <div className="container-fluid">
         <div className="col-md-12">
            <FitTable.Root
               list={avaliacoes.sort((a, b) => new Date(b.data_avaliacao) - new Date(a.data_avaliacao))}
               title="Lista de avaliações"
               description={`${avaliacoes?.length} ${avaliacoes?.length > 1 ? "Avaliações" : "Avaliação"}`}
               fieldSearch="nome_aluno"
               onClickItem={(row) => navigate("/avaliacao", { state: { avaliacao: row } })}
               columns={[
                  { name: "nome_aluno", header: "Nome", className: "fw-bold text-black" },
                  { name: "data_avaliacao", header: "Data", type: "date", className: "fw-bold text-black" },
               ]}
            />
         </div>
      </div>
   );
}

export default Avaliacoes;
