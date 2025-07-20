import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { useRecoilState } from "recoil";
import { stateUsuario } from '../../states/states';
import { useEffect, useState } from "react";
import { getUsuarios } from "../../api/usuario";
import { FitTable } from "../../components/baseComponents/FitTable";
import { Pencil } from "lucide-react";

function Usuarios() {
    const [usuario] = useRecoilState(stateUsuario);
    const [deleted, setDeleted] = useState(false);

    const { data: usuarios, refetch } = useQuery({
        queryKey: ['usuarios', usuario.cod_usuario],
        queryFn: () => getUsuarios(usuario.cod_empresa, deleted),
        initialData: [],
        enabled: !!usuario.cod_empresa,
    });

    useEffect(() => {
        refetch();
    }, [deleted]);

    const navigate = useNavigate();
    
    const editarUsuario = (usuario) => {    
        navigate('/cadusuario', { state: { usuario: usuario } })
    };

    return (
        <div className="container-fluid">
            <div className="col-md-12">
                <FitTable.Root
                    list={usuarios}
                    title="Lista de usuários"
                    description={`${usuarios?.length} ${usuarios?.length > 1 ? "Usuários" : "Usuário"}`}
                    fieldSearch="nome_usuario"
                    buttonOnClick={() => navigate('/cadusuario')}
                    buttonText="Novo usuário"
                    columns={[
                        { name: "imagem_usuario", header: "", type: "image", width: 60, className: "fw-bold text-black" },
                        { name: "nome_usuario", header: "Nome", className: "fw-bold text-black" },
                        { name: "email_usuario", header: "E-mail", className: "fw-bold text-black" },
                        { name: "Editar", header: "", type: "option", onClick: (row) => editarUsuario(row), Icon: Pencil },
                    ]}
                >
                    {/* <FitTable.Filters>
                        <FitTable.Filter value={deleted} onChange={setDeleted} type="switch" name="Registros deletados" />
                    </FitTable.Filters> */}
                </FitTable.Root>
            </div>
        </div>
    );
}

export default Usuarios;