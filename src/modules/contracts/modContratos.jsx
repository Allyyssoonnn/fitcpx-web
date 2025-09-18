import { ArrowLeftCircle, Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import {
   createOrUpdateContractTemplate,
   deleteContractTemplate,
   getContractsTemplates,
} from "../../api/contractsTemplates";
import { FitTable } from "../../components/baseComponents/FitTable";
import { stateUsuario } from "../../states/states";

function ModContratos() {
   const [usuario] = useRecoilState(stateUsuario);
   const navigate = useNavigate();
   const [deleted, setDeleted] = useState(false);

   const { data: contratos, refetch } = useQuery({
      queryKey: ["contratos", usuario.cod_empresa],
      queryFn: () => getContractsTemplates(deleted),
      initialData: [],
   });

   const editarPlano = (contrato) => navigate("/cadcontrato", { state: { contrato } });
   const delPlano = async (cod_contrato) => {
      await deleteContractTemplate(cod_contrato);
      refetch();
   };
   const recoveryPlan = async (contract) => {
      await createOrUpdateContractTemplate({ ...contract, deletedAt: null });
      refetch();
   };

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
               buttonOnClick={() => navigate("/cadcontrato")}
               buttonText="Novo contrato"
               columns={[
                  { name: "nome_contrato", header: "Nome", className: "fw-bold text-black" },
                  // { name: "valor_adesao", type: "currency", header: "Adesão", className: "fw-bold text-black" },
                  { name: "Editar", header: "", type: "option", onClick: (row) => editarPlano(row), Icon: Pencil },
                  {
                     name: "Excluir",
                     header: "",
                     type: "option",
                     visible: (row) => !row?.deletedAt,
                     onClick: (row) => delPlano(row),
                     Icon: Trash,
                  },
                  {
                     name: "Recuperar",
                     header: "",
                     type: "option",
                     visible: (row) => row?.deletedAt,
                     onClick: (row) => recoveryPlan(row.cod_contrato),
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

export default ModContratos;
