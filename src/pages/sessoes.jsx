// import { useEffect, useMemo, useState } from "react";
// import { useQuery } from "react-query";
// import { useRecoilState } from "recoil";
// import { stateUsuario } from "../states/states";
// import { useNavigate } from "react-router-dom";
// import { deleteGrupoExercicio, deleteSessao, getSessoes, recoveryGrupoExercicio, recoverySessao } from "../api/treino";

// function Sessoes() {
//     const [usuario] = useRecoilState(stateUsuario);  
//     const [searchTerm, setSearchTerm] = useState("");
//     const [deleted, setDeleted] = useState(false);

//     const { data: sessoes, refetch } = useQuery({
//         queryKey: ['alunos', usuario.cod_empresa],
//         queryFn: () => getSessoes(usuario.cod_empresa, deleted),
//         initialData: [],
//     });

//     useEffect(() => {
//         refetch();
//     }, [deleted]);

//     const navigate = useNavigate();
    
//     const editarSessao = (sessao) => navigate('/cadsessao', { state: { sessao } });
//     const delSessao = async (cod_sessao) => {
//         await deleteSessao(cod_sessao);
//         refetch();
//     }
//     const recovSessao = async (cod_sessao) => {
//         await recoverySessao(cod_sessao);
//         refetch();
//     }

//     const filteredSessoes = useMemo(() => {
//         return sessoes.filter((treino) =>
//             treino.nome_sessao?.toLowerCase().includes(searchTerm.toLowerCase())
//         );
//     }, [sessoes, searchTerm]);

//     return (
//         <div className="container-fluid">
//             <div className="row">
//                 <div className="col-md-12">
//                     <div className="card">
//                         <div className="card-header d-flex justify-content-between align-items-center">
//                             <div className="w-50">
//                                 <h4 className="card-title d-none d-md-block">Sessões</h4>
//                                 <input
//                                     type="text"
//                                     className="form-control w-60"
//                                     placeholder="Pesquisar"
//                                     value={searchTerm}
//                                     onChange={(e) => setSearchTerm(e.target.value)}
//                                 />

//                                 <div className="row g-3 mt-1">
//                                     <div className="col-md-5">
//                                         <input checked={deleted} onClick={() => setDeleted(!deleted)} className="form-checkbox-control" type="checkbox" id="deleted" />
//                                         <label className="form-label ms-1" htmlFor="deleted">Registros deletados</label>
//                                     </div>
//                                 </div>
//                             </div>
                            
//                             <button className="btn btn-success" onClick={() => navigate('/cadsessao')}>
//                                 <i className="bi bi-plus-circle me-2"></i>
//                                 Nova sessão
//                             </button>
//                         </div>

//                         <div className="table-responsive">
//                             <table id="basic-datatables" className="display table table-striped table-hover">
//                                 <tbody>
//                                     {filteredSessoes.map((sessao) => {
//                                         return (
//                                         <tr key={sessao.cod_sessao}>
//                                             <th scope="row" className="d-flex align-items-center">
//                                                 <div className="col-md-3 d-flex flex-column">
//                                                     <label>{sessao.nome_sessao}</label>
//                                                 </div>
//                                             </th>
//                                             <td>
//                                                 <div className="dropdown">
//                                                     <button onClick={e => e.stopPropagation()} className="btn border-0 p-0" data-bs-toggle="dropdown">
//                                                         <i className="bi bi-three-dots-vertical"></i>
//                                                     </button>

//                                                     <div className="dropdown-menu dropdown-menu-end dropdown-menu-animate-up">
//                                                         <a onClick={e => { e.stopPropagation(); editarSessao(sessao); }} href="#" className="d-flex align-items-center gap-2 dropdown-item">
//                                                             <i className="bi bi-pencil"></i>
//                                                             <p className="mb-0">Editar</p>
//                                                         </a>
//                                                         <a onClick={e => { e.stopPropagation(); delSessao(sessao.cod_sessao); }} href="#" className={`d-flex align-items-center gap-2 dropdown-item ${sessao.deletedAt ? 'd-none' : ''}`}>
//                                                             <i className="bi bi-trash"></i>
//                                                             <p className="mb-0">Excluir</p>
//                                                         </a>
//                                                         <a onClick={e => { e.stopPropagation(); recovSessao(sessao.cod_sessao); }} href="#" className={`d-flex align-items-center gap-2 dropdown-item ${sessao.deletedAt ? '' : 'd-none'}`}>
//                                                             <i className="bi bi-trash"></i>
//                                                             <p className="mb-0">Reverter</p>
//                                                         </a>
//                                                     </div>
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     )})}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Sessoes;