import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { stateUsuario } from "../states/states";
import { useQuery } from "react-query";
import { getAlunos } from "../api/aluno";

function Dashboard() {
    const [usuario] = useRecoilState(stateUsuario);

    const { data: alunos } = useQuery({
        queryKey: ['alunos', usuario.cod_usuario],
        queryFn: () => getAlunos(usuario.cod_usuario),
        initialData: [],
    });
    
    return (
        <div className="container-fluid">
            <div className="row">

                {/* <div class="col-lg-8">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title d-flex align-items-center gap-2 mb-4">
                                Atendimentos
                                <span>
                                    <iconify-icon icon="solar:question-circle-bold" class="fs-7 d-flex text-muted" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="tooltip-success" data-bs-title="Traffic Overview"></iconify-icon>
                                </span>
                            </h5>
                        </div>
                        <div id="traffic-overview" >
                        </div>
                    </div>
                </div> */}

                <UltimasAvaliacoes alunos={alunos} />

                <div class="col-lg-4">
                    <div class="card">
                        <div class="card-body text-center">
                        <img src="/assets/images/backgrounds/avaliacao.png" alt="image" class="img-fluid" width="205" />
                        <h4 class="mt-7">Dicas de avaliação</h4>
                        <p class="card-subtitle mt-2 mb-3">Dicas valiosas para se destacar em avaliações físicas</p>
                            <button class="btn btn-primary mb-3">Saber mais</button>
                        </div>
                    </div>
                </div>

                {/* <div class="col-lg-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title d-flex align-items-center gap-2 mb-5 pb-3">
                                Status de alunos
                                <span><iconify-icon icon="solar:question-circle-bold" class="fs-7 d-flex text-muted" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="tooltip-success" data-bs-title="Locations"></iconify-icon></span>
                            </h5>

                            <div class="row">
                                <div class="col-4">
                                <iconify-icon icon="solar:laptop-minimalistic-line-duotone" class="fs-7 d-flex text-success"></iconify-icon>
                                <span class="fs-11 mt-2 d-block text-nowrap">Ativos</span>
                                <h4 class="mb-0 mt-1">87%</h4>
                                </div>
                                <div class="col-4">
                                <iconify-icon icon="solar:smartphone-line-duotone" class="fs-7 d-flex text-danger"></iconify-icon>
                                <span class="fs-11 mt-2 d-block text-nowrap">Inativos</span>
                                <h4 class="mb-0 mt-1">3%</h4>
                                </div>
                                <div class="col-4">
                                <iconify-icon icon="solar:tablet-line-duotone" class="fs-7 d-flex text-primary"></iconify-icon>
                                <span class="fs-11 mt-2 d-block text-nowrap">Pendentes</span>
                                <h4 class="mb-0 mt-1">10%</h4>
                                </div>
                            </div>

                            <div class="vstack gap-4 mt-7 pt-2">
                                <div>
                                    <div class="hstack justify-content-between">
                                        <span class="fs-3 fw-medium">Ativos</span>
                                        <h6 class="fs-3 fw-medium text-dark lh-base mb-0">87%</h6>
                                    </div>

                                    <div class="progress mt-6" role="progressbar" aria-label="Warning example" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
                                        <div class="progress-bar bg-success" style={{ width: '100%' }}></div>
                                    </div>
                                </div>

                                <div>
                                    <div class="hstack justify-content-between">
                                        <span class="fs-3 fw-medium">Inativos</span>
                                        <h6 class="fs-3 fw-medium text-dark lh-base mb-0">3%</h6>
                                    </div>
                                    <div class="progress mt-6" role="progressbar" aria-label="Warning example" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
                                        <div class="progress-bar bg-danger" style={{ width: '50%' }}></div>
                                    </div>
                                </div>

                                <div>
                                    <div class="hstack justify-content-between">
                                        <span class="fs-3 fw-medium">Pendentes</span>
                                        <h6 class="fs-3 fw-medium text-dark lh-base mb-0">10%</h6>
                                    </div>

                                    <div class="progress mt-6" role="progressbar" aria-label="Warning example" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
                                        <div class="progress-bar bg-primary" style={{ width: '35%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}

                {/* <div class="col-lg-4">
                    <div class="card overflow-hidden hover-img">
                        <div class="position-relative">
                            <a href="javascript:void(0)">
                                <img src="../assets/images/blog/dieta.png" class="card-img-top" alt="matdash-img" />
                            </a>
                            <span class="badge text-bg-light text-dark fs-2 lh-sm mb-9 me-9 py-1 px-2 fw-semibold position-absolute bottom-0 end-0">
                                Dica
                            </span>
                            <img src="../assets/images/profile/user-3.jpg" alt="matdash-img" class="img-fluid rounded-circle position-absolute bottom-0 start-0 mb-n9 ms-9" width="40" height="40" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Georgeanna Ramero" />
                        </div>

                        <div class="card-body p-4">
                            <span class="badge text-bg-light fs-2 py-1 px-2 lh-sm  mt-3">Dieta</span>
                            <a class="d-block my-4 fs-5 text-dark fw-semibold link-primary" href="">Melhore sua alimentação</a>
                            <div class="d-flex align-items-center gap-4">
                                <div class="d-flex align-items-center gap-2">
                                    <i class="ti ti-eye text-dark fs-5"></i>9
                                </div>

                                <div class="d-flex align-items-center gap-2">
                                    <i class="ti ti-message-2 text-dark fs-5"></i>3
                                </div>

                                <div class="d-flex align-items-center fs-2 ms-auto">
                                    <i class="ti ti-point text-dark"></i>Seg, Nov 11
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}

                {/* <div class="col-lg-4">
                    <div class="card overflow-hidden hover-img">
                        <div class="position-relative">
                            <a href="javascript:void(0)">
                                <img src="/assets/images/blog/treino.png" class="card-img-top" alt="matdash-img" />
                            </a>
                            <span class="badge text-bg-light text-dark fs-2 lh-sm mb-9 me-9 py-1 px-2 fw-semibold position-absolute bottom-0 end-0">
                                Ideia
                            </span>
                            <img src="../assets/images/profile/user-2.jpg" alt="matdash-img" class="img-fluid rounded-circle position-absolute bottom-0 start-0 mb-n9 ms-9" width="40" height="40" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Georgeanna Ramero" />
                        </div>

                        <div class="card-body p-4">
                            <span class="badge text-bg-light fs-2 py-1 px-2 lh-sm  mt-3">Treino</span>
                            <a class="d-block my-4 fs-5 text-dark fw-semibold link-primary" href="">
                                Dicas de prescrição
                            </a>
                            <div class="d-flex align-items-center gap-4">
                                <div class="d-flex align-items-center gap-2">
                                    <i class="ti ti-eye text-dark fs-5"></i>11
                                </div>

                                <div class="d-flex align-items-center gap-2">
                                    <i class="ti ti-message-2 text-dark fs-5"></i>38
                                </div>

                                <div class="d-flex align-items-center fs-2 ms-auto">
                                    <i class="ti ti-point text-dark"></i>Seg, Nov 11
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}

                {/* <div class="col-lg-4">
                    <div class="card overflow-hidden hover-img">
                        <div class="position-relative">
                            <a href="javascript:void(0)">
                                <img src="../assets/images/blog/dieta.png" class="card-img-top" alt="matdash-img" />
                            </a>
                            <span class="badge text-bg-light text-dark fs-2 lh-sm mb-9 me-9 py-1 px-2 fw-semibold position-absolute bottom-0 end-0">
                                Dica
                            </span>
                            <img src="../assets/images/profile/user-3.jpg" alt="matdash-img" class="img-fluid rounded-circle position-absolute bottom-0 start-0 mb-n9 ms-9" width="40" height="40" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Georgeanna Ramero" />
                        </div>

                        <div class="card-body p-4">
                            <span class="badge text-bg-light fs-2 py-1 px-2 lh-sm  mt-3">Dieta</span>
                            <a class="d-block my-4 fs-5 text-dark fw-semibold link-primary" href="">Melhore sua alimentação</a>
                            <div class="d-flex align-items-center gap-4">
                                <div class="d-flex align-items-center gap-2">
                                    <i class="ti ti-eye text-dark fs-5"></i>9
                                </div>

                                <div class="d-flex align-items-center gap-2">
                                    <i class="ti ti-message-2 text-dark fs-5"></i>3
                                </div>

                                <div class="d-flex align-items-center fs-2 ms-auto">
                                    <i class="ti ti-point text-dark"></i>Seg, Nov 11
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>
        </div>
    );
}

function UltimasAvaliacoes({ alunos }) {

    const [avaliacoes, setAvaliacoes] = useState([]);

    useEffect(() => {
        if (!alunos) return;
        const avaliacoes = alunos?.reduce((todasAvaliacoes, aluno) => {
            const avaliacoesComNome = aluno.avaliacao.map(avaliacao => ({ ...avaliacao, nome_aluno: aluno?.nome_aluno }));
            return todasAvaliacoes.concat(avaliacoesComNome);
        }, []);
        if (avaliacoes) setAvaliacoes(avaliacoes);
    }, [alunos]);

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
                                {avaliacoes.map((avaliacao) => (
                                    // eslint-disable-next-line react/jsx-key
                                    <tr>
                                        <th scope="row" className="ps-0 fw-medium">{avaliacao.nome_aluno}</th>
                                        <th scope="row" className="ps-0 fw-medium">{avaliacao.data_avaliacao}</th>
                                        <td>{avaliacao.altura} M</td>
                                        <td className="text-center fw-medium">{avaliacao.peso} KG</td>
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