import { ArrowLeftCircle, Pencil, Trash } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react"; // Adicionado useCallback
import { useTranslation } from "react-i18next";

import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { createOrUpdateStudent, deleteStudent, getStudents } from "../../api/student";
import { FitTable } from "../../components/baseComponents/FitTable";
import { stateUsuario } from "../../states/states";

function Alunos() {
   const { t } = useTranslation("clients");
   const [usuario] = useRecoilState(stateUsuario);
   const [statusFilter, setStatusFilter] = useState("A");
   const [deleted, setDeleted] = useState(false);
   const navigate = useNavigate();

   const { data: alunos, refetch } = useQuery({
      queryKey: ["students"],
      queryFn: () => getStudents(deleted),
      initialData: [],
      enabled: !!usuario.cod_empresa,
   });

   useEffect(() => {
      refetch();
   }, [deleted, refetch]);

   // Otimização: Memoriza a lista filtrada
   const filteredAlunos = useMemo(() => {
      return statusFilter ? alunos.filter((aluno) => aluno.status_aluno === statusFilter) : alunos;
   }, [alunos, statusFilter]);

   // Otimização: Garante que a função não seja recriada a cada render
   const editarAluno = useCallback(
      (aluno) => {
         navigate("/cadaluno", { state: { aluno } });
      },
      [navigate],
   );

   const delAlun = useCallback(
      async (cod_aluno) => {
         await deleteStudent(cod_aluno);
         refetch();
      },
      [refetch],
   );

   const recoveryAlun = useCallback(
      async (student) => {
         await createOrUpdateStudent(student);
         refetch();
      },
      [refetch],
   );

   // SOLUÇÃO PRINCIPAL: As colunas devem ser memorizadas para evitar bugs de clique/referência
   const columns = useMemo(
      () => [
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
         { name: "nome_aluno", header: "Nome", className: "fw-bold", canSort: true },
         {
            name: "Editar",
            header: "",
            type: "option",
            onClick: (row) => editarAluno(row), // Agora usa a versão memorizada
            Icon: Pencil,
         },
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
            onClick: (row) => recoveryAlun({ ...row, deletedAt: null }),
            Icon: ArrowLeftCircle,
         },
      ],
      [editarAluno, delAlun, recoveryAlun],
   ); // Dependências das colunas

   return (
      <div className="container-fluid">
         <div className="row">
            <div className="col-md-12">
               <FitTable.Root
                  rowId="clients-"
                  list={filteredAlunos}
                  title={t("listName")}
                  description={`${filteredAlunos?.length} ${filteredAlunos?.length > 1 ? "Alunos" : "Aluno"}`}
                  buttonText={t("newButtonText")}
                  fieldSearch="nome_aluno"
                  buttonOnClick={() => navigate("/cadaluno")}
                  // Garante que passamos o objeto correto no clique da linha
                  onClickItem={(row) => navigate("/aluno", { state: { cod_aluno: row.cod_aluno } })}
                  buttonId="newClient"
                  fieldId="cod_aluno" // IMPORTANTE: Certifique-se que o backend retorna exatamente "cod_aluno"
                  columns={columns} // Passamos a constante memorizada
               >
                  <FitTable.Filters>
                     <FitTable.Filter value={deleted} onChange={setDeleted} type="switch" name="Registros deletados" />
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
