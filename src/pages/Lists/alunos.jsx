import { ArrowLeftCircle, Pencil, Trash } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { deleteAluno, recoveryAluno } from "../../api/aluno";
import { getStudents } from "../../api/student";
import { FitTable } from "../../components/baseComponents/FitTable";
import { stateUsuario } from "../../states/states";

function Alunos() {
   const { t } = useTranslation("clients");
   const [usuario] = useRecoilState(stateUsuario);
   const [statusFilter, setStatusFilter] = useState("A");
   const [deleted, setDeleted] = useState(false);

   const { data: alunos, refetch } = useQuery({
      queryKey: ["students"],
      queryFn: () => getStudents(deleted),
      initialData: [],
      enabled: !!usuario.cod_empresa,
   });

   useEffect(() => {
      refetch();
   }, [deleted, refetch]);

   const navigate = useNavigate();

   const editarAluno = (aluno) => navigate("/cadaluno", { state: { aluno } });

   const filteredAlunos = useMemo(() => {
      return statusFilter ? alunos.filter((aluno) => aluno.status_aluno === statusFilter) : alunos;
   }, [alunos, statusFilter]);

   const delAlun = async (cod_aluno) => {
      await deleteAluno(cod_aluno);
      refetch();
   };

   const recoveryAlun = async (cod_aluno) => {
      await recoveryAluno(cod_aluno);
      refetch();
   };

   const Alert =
      localStorage.getItem("validLicense") != "true" ? (
         <div className="text-center py-3 bg-light">
            Você pode não estar vendo todos os alunos cadastrados,{" "}
            <a href="/configuracao?tab=3" className="text-warning">
               clique aqui
            </a>{" "}
            e adquira um plano de uso.
         </div>
      ) : null;

   return (
      <div className="container-fluid">
         <div className="row">
            <div className="col-md-12">
               <FitTable.Root
                  subHeader={Alert}
                  rowId="aluno-"
                  list={filteredAlunos}
                  title={t("listName")}
                  description={`${filteredAlunos?.length} ${filteredAlunos?.length > 1 ? "Alunos" : "Aluno"}`}
                  buttonText={t("newButtonText")}
                  fieldSearch="nome_aluno"
                  buttonOnClick={() => navigate("/cadaluno")}
                  onClickItem={(row) => navigate("/aluno", { state: { cod_aluno: row.cod_aluno } })}
                  buttonId="newClient"
                  columns={[
                     {
                        name: "imagem_aluno",
                        header: "",
                        type: "image",
                        width: 60,
                        getCell: (row) => (
                           <img
                              src={row.imagem_aluno ? row.imagem_aluno : "https://placehold.co/150x150?text=img"}
                              alt="Imagem"
                              className={`img-fluid rounded-circle shadow-md border-3
                                        ${row.status_aluno === "A" && "border-success"}
                                        ${row.status_aluno === "I" && "border-danger"}
                                        ${row.status_aluno === "B" && "border-warning"}
                                    `}
                              width={50}
                              height={50}
                              loading="lazy"
                           />
                        ),
                     },
                     { name: "nome_aluno", header: "Nome", className: "fw-bold text-black" },
                     { name: "Editar", header: "", type: "option", onClick: (row) => editarAluno(row), Icon: Pencil },
                     {
                        name: "Excluir",
                        header: "",
                        type: "option",
                        visible: (row) => !row?.deletedAt,
                        onClick: (row) => delAlun(row.cod_aluno),
                        Icon: Trash,
                     },
                     {
                        name: "Recuperar",
                        header: "",
                        type: "option",
                        visible: (row) => row?.deletedAt,
                        onClick: (row) => recoveryAlun(row.cod_aluno),
                        Icon: ArrowLeftCircle,
                     },
                  ]}
               >
                  <FitTable.Filters>
                     <FitTable.Filter value={deleted} onChange={setDeleted} type="switch" name="Registros deleteados" />
                     <FitTable.Filter
                        value={statusFilter}
                        onChange={setStatusFilter}
                        type="select"
                        name="Status"
                        options={[
                           { label: "Todos", value: null },
                           { label: "Ativo", value: "A" },
                           { label: "Inativo", value: "I" },
                           { label: "Bloqueado", value: "B" },
                        ]}
                     />
                  </FitTable.Filters>
               </FitTable.Root>
            </div>
         </div>
      </div>
   );
}

export default Alunos;
