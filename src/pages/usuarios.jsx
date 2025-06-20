import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { useRecoilState } from "recoil";
import { stateUsuario } from '../states/states';
import { useEffect, useMemo, useState } from "react";
import { getUsuarios } from "../api/usuario";

function Usuarios() {
    const [usuario] = useRecoilState(stateUsuario);
    const [searchTerm, setSearchTerm] = useState("");
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

    const filteredUsuarios = useMemo(() => {
        return usuarios.filter((usuario) =>
            usuario.nome_usuario?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [usuarios, searchTerm]);
    
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-12">
                    <div className="card shadow-lg rounded-4">
                        <div className="card-header">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h4 className="card-title d-none d-md-block">Lista de usuários</h4>
                                    <label>{filteredUsuarios?.length} Usuários</label>
                                </div>

                                <div className="col-md-3 col-8">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Pesquisar usuário"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="d-flex align-items-center justify-content-between mt-3">
                                <div>
                                    <input checked={deleted} onClick={() => setDeleted(!deleted)} className="form-checkbox-control" type="checkbox" id="deleted" />
                                    <label className="form-label ms-1" htmlFor="deleted">Registros deletados</label>
                                </div>

                                <button className="btn btn-success" onClick={() => navigate('/cadusuario')}>
                                    <i className="bi bi-plus-circle me-2"></i>
                                    Novo usuário
                                </button>
                            </div>
                        </div>

                        <div className="table-responsive">
                            <table id="basic-datatables" className="display table table-striped table-hover">
                                <tbody>
                                    {filteredUsuarios.map((usuario, index) => {
                                        return (
                                            <tr key={usuario.cod_aluno}>
                                                <th scope="row" className="d-flex align-items-center">
                                                    <img
                                                        src={usuario.imagem_usuario ? `${usuario.imagem_usuario}` : 'https://placehold.co/150x150?text=img'}
                                                        alt="Foto do Aluno" 
                                                        className="img-fluid rounded-circle me-3" 
                                                        style={{ width: '50px', height: '50px' }}
                                                        loading="lazy"
                                                    />
                                                    <div className="col-md-10 d-flex flex-column">
                                                        <label>{usuario.nome_usuario}</label>
                                                        <div className="d-flex gap-2 mt-2">
                                                            <label className="badge bg-danger text-white">{usuario?.admin_usuario == 'S' && 'ADMIN'}</label>
                                                        </div>
                                                    </div>
                                                </th>
                                                <td>
                                                    <div className="dropdown">
                                                        <button id={`option-user-${index}`} onClick={e => e.stopPropagation()} className="btn border-0" data-bs-toggle="dropdown">
                                                            <i className="bi bi-three-dots-vertical"></i>
                                                        </button>

                                                        <div className="dropdown-menu dropdown-menu-end dropdown-menu-animate-up">
                                                            <a id={`edit-user-${index}`} onClick={e => { e.stopPropagation(); editarUsuario(usuario) }} href="#" className="d-flex align-items-center gap-2 dropdown-item">
                                                                <i className="bi bi-pencil"></i>
                                                                <p className="mb-0">Editar</p>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        );})}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Usuarios;