import { UserType } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUsers } from "../../api/user";
import { FitTable } from "../../components/baseComponents/FitTable";

function Users() {
   const { data: users } = useQuery({
      queryKey: ["users"],
      queryFn: getUsers,
      initialData: [],
   });

   const navigate = useNavigate();

   const editarUsuario = (usuario: UserType) => {
      navigate("/cadusuario", { state: { usuario: usuario } });
   };

   return (
      <div className="container-fluid">
         <div className="col-md-12">
            <FitTable.Root
               rowId="user-"
               list={users}
               title="Lista de usuários"
               description={`${users?.length} ${users?.length > 1 ? "Usuários" : "Usuário"}`}
               fieldSearch="nome_usuario"
               buttonOnClick={() => navigate("/cadusuario")}
               onClickItem={(row) => editarUsuario(row)}
               buttonText="Novo usuário"
               columns={[
                  { name: "imagem_usuario", header: "", type: "image", width: 60, className: "fw-bold text-black" },
                  { name: "nome_usuario", header: "Nome", className: "fw-bold text-black" },
                  { name: "email_usuario", header: "E-mail", className: "fw-bold text-black" },
                  { name: "Editar", header: "", type: "option", onClick: (row) => editarUsuario(row), Icon: Pencil },
               ]}
            />
         </div>
      </div>
   );
}

export default Users;
