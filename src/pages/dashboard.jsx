import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { stateUsuario } from "../states/states";
import { useQuery } from "react-query";
import { getAlunos, getAvaliacoes } from "../api/aluno";
import { getUsuarios } from "../api/usuario";
import { getTreinos } from "../api/treino";
import { formatarData } from "../utils";

function Dashboard() {
    const [usuario] = useRecoilState(stateUsuario);

    const { data: alunos } = useQuery({
        queryKey: ['alunos', usuario.cod_usuario],
        queryFn: () => getAlunos(usuario.cod_usuario, usuario.cod_empresa),
        initialData: [],
        enabled: !!usuario.cod_empresa
    });

    const { data: avaliacoes } = useQuery({
        queryKey: ['avaliacoes', usuario.cod_empresa],
        queryFn: () => getAvaliacoes(usuario.cod_empresa),
        initialData: [],
        enabled: !!usuario.cod_empresa
    });

    return (
        <div className="container-fluid">
            <div className="row">
                <UltimasAvaliacoes alunos={alunos} avaliacoes={avaliacoes} />

                <InfoTotais alunos={alunos} avaliacoes={avaliacoes} />
            </div>
        </div>
    );
}

function InfoTotais({ alunos, avaliacoes }) {
    const [usuario] = useRecoilState(stateUsuario);

    const { data: usuarios } = useQuery({
        queryKey: ['usuarios', usuario.cod_usuario],
        queryFn: () => getUsuarios(usuario.cod_empresa),
        initialData: [],
        enabled: !!usuario.cod_empresa,
    });

    const { data: treinos } = useQuery({
        queryKey: ['treinos', usuario.cod_empresa],
        queryFn: () => getTreinos({ cod_empresa: usuario.cod_empresa, findAll: true }),
        initialData: [],
        enabled: !!usuario.cod_empresa
    });

    return (
        <div className="col-lg-4">
            <div className="card">
                <div className="card-body">
                    <div className="d-flex flex-column">
                        <h6>Resumo da empresa</h6>

                        <div className="d-flex border-bottom py-3">
                            <span className="rounded-circle round-48 mb-4 bg-success-subtle text-success d-flex align-items-center justify-content-center">
                                <i className="bi bi-person"></i>
                            </span>

                            <div className="ms-3">
                                <h6>Alunos ativos</h6>
                                <div className="d-flex align-items-center gap-2">
                                    <h3 className="mb-0">{alunos.length}</h3>
                                    {/* <span className="badge bg-primary-subtle text-primary fw-semibold rounded-pill">+8.5</span> */}
                                </div>
                            </div>
                        </div>

                        <div className="d-flex border-bottom py-3">
                            <span className="rounded-circle round-48 mb-4 bg-info-subtle text-info d-flex align-items-center justify-content-center">
                                <i className="bi bi-bar-chart"></i>
                            </span>

                            <div className="ms-3">
                                <h6>Avaliações realizadas</h6>

                                <div className="d-flex align-items-center gap-2">
                                    <h3 className="mb-0">{avaliacoes.length}</h3>
                                </div>
                            </div>
                        </div>

                        <div className="d-flex border-bottom py-3">
                            <span className="rounded-circle round-48 mb-4 bg-primary-subtle text-primary d-flex align-items-center justify-content-center">
                                <i className="bi bi-card-checklist"></i>
                            </span>

                            <div className="ms-3">
                                <h6>Treinos cadastrados</h6>

                                <div className="d-flex align-items-center gap-2">
                                    <h3 className="mb-0">{treinos.length}</h3>
                                </div>
                            </div>
                        </div>

                        <div className="d-flex border-bottom py-3">
                            <span className="rounded-circle round-48 mb-4 bg-secondary-subtle text-secondary d-flex align-items-center justify-content-center">
                                <i className="bi bi-person-gear"></i>
                            </span>

                            <div className="ms-3">
                                <h6>Usuários do sistema</h6>

                                <div className="d-flex align-items-center gap-2">
                                    <h3 className="mb-0">{usuarios.length}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function UltimasAvaliacoes({ alunos, avaliacoes }) {

    return (
        <div className="col-lg-8">
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Últimas avaliações</h5>

                    <div className="table-responsive">
                        <table className="table text-nowrap align-middle mb-0">
                            <thead>
                                <tr className="border-2 border-bottom border-primary border-0"> 
                                    <th scope="col" className="ps-0">Aluno</th>
                                    <th scope="col" className="ps-0">Data</th>
                                    <th scope="col" >Altura</th>
                                    <th scope="col" className="text-center">Peso</th>
                                </tr>
                            </thead>

                            <tbody className="table-group-divider">
                                {avaliacoes.sort((a, b) => new Date(b.data_avaliacao) - new Date(a.data_avaliacao))
                                .slice(0, 6)
                                .map((avaliacao) => (
                                    // eslint-disable-next-line react/jsx-key
                                    <tr>
                                        <th scope="row" className="ps-0 fw-medium">{avaliacao?.aluno?.nome_aluno}</th>
                                        <th scope="row" className="ps-0 fw-medium">{formatarData(avaliacao?.data_avaliacao)}</th>
                                        <td>{avaliacao?.altura} M</td>
                                        <td className="text-center fw-medium">{avaliacao?.peso} KG</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;