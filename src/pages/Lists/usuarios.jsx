import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { useRecoilState } from "recoil";
import { stateUsuario } from '../../states/states';
import { useEffect, useState } from "react";
import { getUsuarios } from "../../api/usuario";
import { ListComponent } from "../../components/baseComponents/ListComponent";

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
                <ListComponent.Root
                    list={usuarios}
                    title="Lista de usuários"
                    description={`${usuarios?.length} ${usuarios?.length > 1 ? "Usuários" : "Usuário"}`}
                    fieldSearch="nome_usuario"
                    buttonOnClick={() => navigate('/cadusuario')}
                    buttonText="Novo usuário"
                >
                    <ListComponent.Filters>
                        <ListComponent.Filter value={deleted} onChange={setDeleted} type="switch" name="Registros deletados" />
                    </ListComponent.Filters>

                    <ListComponent.Items>
                        {(usuarios) => {
                            return usuarios.map((usuario, index) => (
                                <ListComponent.Item key={index}
                                    id={`option-user-${index}`}
                                    index={index}
                                    title={usuario.nome_usuario}
                                    badge={[usuario?.admin_usuario == 'S' && 'ADMIN', usuario.email_usuario]}
                                    onClickItem={() => navigate('/cadusuario', { state: { usuario } })}
                                    urlImage={usuario.imagem_usuario ? `${usuario.imagem_usuario}` : 'https://placehold.co/150x150?text=img'}
                                >
                                    <ListComponent.Options id={`option-user-${index}`}>
                                        <ListComponent.Option id={`edit-user-${index}`} title="Editar" icon="bi bi-pencil" onClick={() => editarUsuario(usuario)} />
                                    </ListComponent.Options>
                                </ListComponent.Item>
                            ))
                        }}
                    </ListComponent.Items>
                </ListComponent.Root>
            </div>
        </div>
    );
}

export default Usuarios;