import { useEffect } from "react";

function Dashboard() {

    useEffect(() => {
        var chart = {
            series: [
              {
                name: "Avaliações",
                data: [2, 1, 3, 0, 4, 2, 3],
              },
              {
                name: "Treinos",
                data: [5, 8, 6, 7, 4, 2, 3],
              },
            ],
            chart: {
              toolbar: {
                show: false,
              },
              type: "line",
              fontFamily: "inherit",
              foreColor: "#adb0bb",
              height: 320,
              stacked: false,
            },
            colors: ["var(--bs-gray-300)", "var(--bs-primary)"],
            plotOptions: {},
            dataLabels: {
              enabled: false,
            },
            legend: {
              show: false,
            },
            stroke: {
              width: 2,
              curve: "smooth",
              dashArray: [8, 0],
            },
            grid: {
              borderColor: "rgba(0,0,0,0.1)",
              strokeDashArray: 3,
              xaxis: {
                lines: {
                  show: false,
                },
              },
            },
            yaxis: {
              title: {
                // text: 'Age',
              },
            },
            xaxis: {
              axisBorder: {
                show: false,
              },
              axisTicks: {
                show: false,
              },
              categories: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"],
            },
            yaxis: {
              tickAmount: 4,
            },
            markers: {
              strokeColor: ["var(--bs-gray-300)", "var(--bs-primary)"],
              strokeWidth: 2,
            },
            tooltip: {
              theme: "dark",
            },
        };

        var chart = new ApexCharts(
            document.querySelector("#traffic-overview"),
            chart
        );
        chart.render();
    }, []);

    return (
        <div className="container-fluid">
            <div class="row">

                <div class="col-lg-8">
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
                </div>

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

                <div class="col-lg-8">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Agenda de avaliações</h5>

                            <div class="table-responsive">
                                <table class="table text-nowrap align-middle mb-0">
                                    <thead>
                                        <tr class="border-2 border-bottom border-primary border-0"> 
                                            <th scope="col" class="ps-0">Aluno</th>
                                            <th scope="col" >Idade</th>
                                            <th scope="col" class="text-center">Última avaliação</th>
                                            <th scope="col" class="text-center">Data</th>
                                        </tr>
                                    </thead>

                                    <tbody class="table-group-divider">
                                        <tr>
                                            <th scope="row" class="ps-0 fw-medium">
                                            <span class="table-link1 text-truncate d-block">
                                                Alyson Henrique
                                            </span>
                                            </th>
                                            <td>
                                            <a href="javascript:void(0)" class="link-primary text-dark fw-medium d-block">23</a>
                                            </td>
                                            <td class="text-center fw-medium">13/09/2024</td>
                                            <td class="text-center fw-medium">15/11/2024</td>
                                        </tr>

                                        <tr>
                                            <th scope="row" class="ps-0 fw-medium">
                                            <span class="table-link1 text-truncate d-block">
                                                Milton G.
                                            </span>
                                            </th>
                                            <td>
                                            <a href="javascript:void(0)" class="link-primary text-dark fw-medium d-block">31</a>
                                            </td>
                                            <td class="text-center fw-medium">04/05/2024</td>
                                            <td class="text-center fw-medium">20/11/2024</td>
                                        </tr>

                                        <tr>
                                            <th scope="row" class="ps-0 fw-medium">
                                            <span class="table-link1 text-truncate d-block">
                                                Rafaela
                                            </span>
                                            </th>
                                            <td>
                                            <a href="javascript:void(0)" class="link-primary text-dark fw-medium d-block">21</a>
                                            </td>
                                            <td class="text-center fw-medium">04/07/2024</td>
                                            <td class="text-center fw-medium">25/11/2024</td>
                                        </tr>

                                        <tr>
                                            <th scope="row" class="ps-0 fw-medium">
                                            <span class="table-link1 text-truncate d-block">
                                                Sem
                                            </span>
                                            </th>
                                            <td>
                                            <a href="javascript:void(0)" class="link-primary text-dark fw-medium d-block">25</a>
                                            </td>
                                            <td class="text-center fw-medium">04/07/2024</td>
                                            <td class="text-center fw-medium">25/11/2024</td>
                                        </tr>

                                        <tr>
                                            <th scope="row" class="ps-0 fw-medium border-0">
                                            <span class="table-link1 text-truncate d-block">
                                                Ideia
                                            </span>
                                            </th>
                                            <td class="border-0">
                                            <a href="javascript:void(0)" class="link-primary text-dark fw-medium d-block">26</a>
                                            </td>
                                            <td class="text-center fw-medium border-0">04/07/2024</td>
                                            <td class="text-center fw-medium border-0">25/11/2024</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-4">
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
                </div>

                <div class="col-lg-4">
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

                                {/* <div class="d-flex align-items-center gap-2">
                                    <i class="ti ti-message-2 text-dark fs-5"></i>3
                                </div> */}

                                <div class="d-flex align-items-center fs-2 ms-auto">
                                    <i class="ti ti-point text-dark"></i>Seg, Nov 11
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-4">
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

                                {/* <div class="d-flex align-items-center gap-2">
                                    <i class="ti ti-message-2 text-dark fs-5"></i>38
                                </div> */}

                                <div class="d-flex align-items-center fs-2 ms-auto">
                                    <i class="ti ti-point text-dark"></i>Seg, Nov 11
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <div class="col-lg-4">
                    <div class="card overflow-hidden hover-img">
                        <div class="position-relative">
                            <a href="javascript:void(0)">
                                <img src="../assets/images/blog/blog-img3.jpg" class="card-img-top" alt="matdash-img" />
                            </a>
                            <span class="badge text-bg-light text-dark fs-2 lh-sm mb-9 me-9 py-1 px-2 fw-semibold position-absolute bottom-0 end-0">2
                                min Read</span>
                            <img src="../assets/images/profile/user-3.jpg" alt="matdash-img" class="img-fluid rounded-circle position-absolute bottom-0 start-0 mb-n9 ms-9" width="40" height="40" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Georgeanna Ramero" />
                        </div>

                        <div class="card-body p-4">
                            <span class="badge text-bg-light fs-2 py-1 px-2 lh-sm  mt-3">Health</span>
                            <a class="d-block my-4 fs-5 text-dark fw-semibold link-primary" href="">COVID outbreak deepens as more
                                lockdowns
                                loom in China</a>
                            <div class="d-flex align-items-center gap-4">
                                <div class="d-flex align-items-center gap-2">
                                <i class="ti ti-eye text-dark fs-5"></i>9,480
                                </div>
                                <div class="d-flex align-items-center gap-2">
                                <i class="ti ti-message-2 text-dark fs-5"></i>12
                                </div>
                                <div class="d-flex align-items-center fs-2 ms-auto">
                                <i class="ti ti-point text-dark"></i>Sat, Dec 17
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}

                <div class="col-lg-4">
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

                                {/* <div class="d-flex align-items-center gap-2">
                                    <i class="ti ti-message-2 text-dark fs-5"></i>3
                                </div> */}

                                <div class="d-flex align-items-center fs-2 ms-auto">
                                    <i class="ti ti-point text-dark"></i>Seg, Nov 11
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;