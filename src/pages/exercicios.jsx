import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useRecoilState } from "recoil";
import { stateUsuario } from "../states/states";
import { useNavigate } from "react-router-dom";
import { getExercicios, deleteExercicio, recoveryExercicio } from '../api/treino';
import FiltroExercicio from "../components/filtroExercicio";

function Exercicios() {
    const [usuario] = useRecoilState(stateUsuario);
    const [searchTerm, setSearchTerm] = useState("");
    const [deleted, setDeleted] = useState(false);

    const [exerciciosFiltrados, setExerciciosFiltrados] = useState([]);

    const { data: exercicios, refetch } = useQuery({
        queryKey: ['exercicios', usuario.cod_usuario],
        queryFn: () => getExercicios(usuario.cod_usuario, deleted),
        initialData: [],
    });
    
    useEffect(() => {
        refetch();
    }, [deleted]);

    const navigate = useNavigate();
    
    const editarExercicio = (exercicio) => navigate('/cadexercicio', { state: { exercicio: exercicio } });
    const delExercicio = async (cod_exercicio) => {
        await deleteExercicio(cod_exercicio);
        refetch();
    }

    const recoveryExec = async (cod_exercicio) => {
        await recoveryExercicio(cod_exercicio);
        refetch();
    }
    
    const filteredExercicios = useMemo(() => {
        return exerciciosFiltrados.filter((treino) =>
            treino.nome_exercicio?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [exerciciosFiltrados, searchTerm]);
        
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <div className="d-flex justify-content-between">
                                <h4 className="card-title d-none d-md-block">Exercícios</h4>
                                
                                <div className="col-md-3 col-12">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Pesquisar"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="d-flex align-items-center justify-content-between mt-3 mb-3">
                                <div>
                                    <input checked={deleted} onClick={() => setDeleted(!deleted)} className="form-checkbox-control" type="checkbox" id="deleted" />
                                    <label className="form-label ms-1" htmlFor="deleted">Registros deletados</label>
                                </div>

                                <button className="btn btn-success" onClick={() => navigate('/cadexercicio')}>
                                    <i className="bi bi-plus-circle me-2"></i>
                                    Novo exercício
                                </button>
                            </div>

                            <div className="row g-3">
                                <FiltroExercicio exercicios={exercicios} setExerciciosFiltrados={setExerciciosFiltrados} />
                            </div>
                        </div>

                        <div className="table-responsive">
                            <table id="basic-datatables" className="display table table-striped table-hover">
                                <tbody>
                                    {filteredExercicios.map((exercicio) => {
                                        return (
                                        <tr key={exercicio.cod_treino} style={{ borderLeft: exercicio.base_exercicio === 'S' ? '0.30rem solid rgb(212, 212, 70)' : '' }}>
                                            <th scope="row" className="d-flex align-items-center">
                                                <div className="col-md-6 d-flex flex-column">
                                                    <label>{exercicio.nome_exercicio}</label>
                                                    <div className="d-flex gap-2 mt-2">
                                                        <label className="badge bg-dark">{exercicio?.grupo_exercicio?.nome_grupo_exercicio}</label>
                                                        <label className="badge bg-dark">{exercicio?.usuario?.nome_usuario}</label>
                                                        {/* <label className="badge bg-dark">{treino.nome_exercicio}</label> */}
                                                        {/* <label className="badge bg-dark">{treino.nivel_treino}</label> */}
                                                        {/* <label className="text-muted">{treino.nome_usuario}</label> */}
                                                    </div>
                                                </div>
                                            </th>
                                            <td>
                                                <div className={`${exercicio.base_exercicio === 'S' ? 'd-none' : ''} dropdown`}>
                                                    <button onClick={e => e.stopPropagation()} className="btn border-0" data-bs-toggle="dropdown">
                                                        <i className="bi bi-three-dots-vertical"></i>
                                                    </button>

                                                    <div className="dropdown-menu dropdown-menu-end dropdown-menu-animate-up">
                                                        <a onClick={e => { e.stopPropagation(); editarExercicio(exercicio); }} href="#" className="d-flex align-items-center gap-2 dropdown-item">
                                                            <i className="bi bi-pencil"></i>
                                                            <p className="mb-0">Editar</p>
                                                        </a>
                                                        <a onClick={e => { e.stopPropagation(); delExercicio(exercicio.cod_exercicio); }} href="#" className={`d-flex align-items-center gap-2 dropdown-item ${exercicio.deletedAt ? 'd-none' : ''}`}>
                                                            <i className="bi bi-trash"></i>
                                                            <p className="mb-0">Excluir</p>
                                                        </a>
                                                        <a onClick={e => { e.stopPropagation(); recoveryExec(exercicio.cod_exercicio); }} href="#" className={`d-flex align-items-center gap-2 dropdown-item ${exercicio.deletedAt ? '' : 'd-none'}`}>
                                                            <i className="bi bi-trash"></i>
                                                            <p className="mb-0">Reverter</p>
                                                        </a>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )})}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Exercicios;