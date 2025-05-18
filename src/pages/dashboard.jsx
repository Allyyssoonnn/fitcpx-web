import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { stateEmpresa, stateUsuario } from "../states/states";
import { useQuery } from "react-query";
import { getAlunoContratos, getAlunos, getAvaliacoes } from "../api/aluno";
import { getUsuarios, setEmpresa, verifyEmail } from "../api/usuario";
import { getTreinos } from "../api/treino";
import { formatarData, formatarMoeda } from "../utils";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Dashboard() {
    const [usuario] = useRecoilState(stateUsuario);
    const [empresa] = useRecoilState(stateEmpresa);

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

    const { data: contratos, refetch } = useQuery({
        queryKey: ['contratos', empresa.cod_empresa],
        queryFn: () => getAlunoContratos(null, empresa.cod_empresa),
        initialData: [],
        enabled: !!empresa.cod_empresa,
    });

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-lg-8">
                    <VerifyEmail />
                </div>

                <div className="col-lg-8">
                    <UltimosContratos contratos={contratos} />
                    <UltimasAvaliacoes alunos={alunos} avaliacoes={avaliacoes} />
                </div>

                <div className="col-lg-4">
                    <LinkFitCpxPay />
                    <InfoTotais alunos={alunos} avaliacoes={avaliacoes} />
                </div>
            </div>
        </div>
    );
}

function VerifyEmail() {
    const [empresa, setempresa] = useRecoilState(stateEmpresa);
    const [code, setCode] = useState('');

    function verificarEmail() {
        const count = Number(localStorage.getItem('emailCount'));
        if (count >= 5) {
            toast.error('Muitos E-mail solicitado, aguarde para tentar novamente');
            return;
        }
        localStorage.setItem('emailCount', count ? count + 1 : 1);
        verifyEmail(empresa.cod_empresa);
    }

    async function confirmEmail() {
        if (code !== empresa.email_codigo) {
            setCode('');
            toast.error('Código incorreto');
            return;
        }

        const attEmpresa = await setEmpresa({ cod_empresa: empresa.cod_empresa, email_confirmado: 'S' });
        if (attEmpresa) setempresa({ ...empresa, email_confirmado: 'S' });
        toast.success('Código confirmado, obrigado');
    }

    return (
        <ul>
            <li className={`${empresa.email_confirmado == 'S' ? 'd-none' : 'd-flex'} flex-row align-items-start justify-content-between gap-1 bg-warning-subtle rounded-3 p-3 ps-3`}>
                <div className="col-lg-6">
                    <div className="d-flex align-items-center mb-0">
                        <i className="bi bi-exclamation-triangle fs-6 px-2 rounded-5 text-warning"></i>
                        <h6 className="fs-3 mb-0">E-mail não verificado</h6>
                    </div>
                    <p className="mb-2">Confirme seu E-mail para aproveitar todos nosso recursos</p>
                    <button onClick={verificarEmail} className="btn btn-sm btn-outline-info rounded ms-3">Enviar código novamente</button>
                </div>

                <div className="col-lg-4">
                    <div className="d-flex align-items-center">
                        <input className="form-control" placeholder="XXXX" maxLength={4} onChange={e => setCode(e.target.value)} value={code} />
                        <button onClick={confirmEmail} className="btn btn-sm btn-info rounded ms-3">Verificar</button>
                    </div>
                </div>
            </li>
        </ul>
    )
}

function UltimosContratos({ contratos }) {
    const { t } = useTranslation('dashboard');

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">{t('recentContracts')}</h5>

                <div className="table-responsive">
                    <table className="table text-nowrap align-middle mb-0">
                        <thead>
                            <tr className="border-2 border-bottom border-success border-0"> 
                                <th scope="col" className="ps-0">{t('contract')}</th>
                                <th scope="col" className="ps-0">{t('student')}</th>
                                <th scope="col" >{t('dueDate')}</th>
                                <th scope="col" className="text-center">{t('amount')}</th>
                            </tr>
                        </thead>

                        <tbody className="table-group-divider">
                            {contratos.sort((a, b) => new Date(b.iniciopagamento_aluno_contrato) - new Date(a.iniciopagamento_aluno_contrato))
                            .slice(0, 5)
                            .map((contrato) => (
                                // eslint-disable-next-line react/jsx-key
                                <tr>
                                    <th scope="row" className="ps-0 fw-medium">{contrato?.nome_aluno_contrato}</th>
                                    <th scope="row" className="ps-0 fw-medium">{contrato?.aluno?.nome_aluno}</th>
                                    <th scope="row" className="ps-0 fw-medium">{formatarData(contrato?.expiracao_aluno_contrato)}</th>
                                    {/* <td>{contrato?.altura} M</td> */}
                                    <td className="text-center fw-medium">{formatarMoeda(contrato?.total_aluno_contrato)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

function LinkFitCpxPay() {
    const navigate = useNavigate();
    const [empresa] = useRecoilState(stateEmpresa);

    async function openLink() {
        // const link = await getLinkAccount(empresa.cod_empresa);
        navigate('/cadfitcpxpay');
    }

    return (
        <div className="card bg-success-subtle">
            <div className="card-body text-center d-flex justify-content-center align-items-center flex-wrap">
                <h6 className="card-title fs-4">Formulário FitCpx Pay</h6>
                <p>Complete o formulário para receber pagamentos pelo sistema</p>
                <button className="btn btn-success rounded" onClick={openLink}>Acessar formulário FitCpx Pay</button>
            </div>
        </div>
    )
}

function InfoTotais({ alunos, avaliacoes }) {
    const { t } = useTranslation('dashboard');
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
        <div className="card">
            <div className="card-body">
                <div className="d-flex flex-column">
                    <h6 className="card-title">{t('overview')}</h6>

                    <div className="d-flex border-bottom py-3">
                        <span className="rounded-circle round-48 mb-4 bg-success-subtle text-success d-flex align-items-center justify-content-center">
                            <i className="bi bi-person"></i>
                        </span>

                        <div className="ms-3">
                            <h6>{t('clientsOverview')}</h6>
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
                            <h6>{t('physicalAssessamentsOverview')}</h6>

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
                            <h6>{t('workoutsOverview')}</h6>

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
                            <h6>{t('usersOverview')}</h6>

                            <div className="d-flex align-items-center gap-2">
                                <h3 className="mb-0">{usuarios.length}</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function UltimasAvaliacoes({ alunos, avaliacoes }) {
    const { t } = useTranslation('dashboard');

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">{t('recentPhysicalAssessament')}</h5>

                <div className="table-responsive">
                    <table className="table text-nowrap align-middle mb-0">
                        <thead>
                            <tr className="border-2 border-bottom border-primary border-0"> 
                                <th scope="col" className="ps-0">{t('student')}</th>
                                <th scope="col" className="ps-0">{t('date')}</th>
                                <th scope="col" >{t('heigth')}</th>
                                <th scope="col" className="text-center">{t('weight')}</th>
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
    );
}

export default Dashboard;