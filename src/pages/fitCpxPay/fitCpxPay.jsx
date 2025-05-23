import { useRecoilState } from "recoil";
import { stateEmpresa, stateUsuario } from "../../states/states";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { gerarIdCarteira, getStatusAccount, sendDocuments } from "../../api/pagamento";
import { setEmpresa, setUsuario } from "../../api/usuario";
import { useNavigate } from "react-router-dom";
import { PRODUCAO } from "../../api/api";
import { toast } from "react-toastify";
import FitInputForm from '../../components/baseComponents/FitInputForm';
import FitStateForm from '../../components/baseComponents/FitStateForm';
import Usuario from "./comp.usuarioFitCpxPay";
import DocumentUpload from "./comp.documentFitCpxPay";
import DadosBancarios from "./comp.bankFitCpxPay";

function FitCpxPay() {
    const navigate = useNavigate();
    const { register, setValue, handleSubmit, formState: { errors } } = useForm();
    const [usuario, setusuario] = useRecoilState(stateUsuario);
    const [empresa, setempresa] = useRecoilState(stateEmpresa);

    const [frontDoc, setFrontDoc] = useState(null);
    const [backDoc, setBackDoc] = useState(null);

    useEffect(() => {
        if (empresa) {
            Object.keys(empresa).forEach((key) => {
                setValue(`empresa.${key}`, empresa[key]);
            });
        }
    }, [empresa]);

    useEffect(() => {
        if (usuario) {
            Object.keys(usuario).forEach((key) => {
                setValue(`usuario.${key}`, usuario[key]);
            });
        }
    }, [usuario]);

    useEffect(() => {
        if (empresa) getStatusAccount(empresa.cod_empresa);
    }, []);

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    async function sendForm(data) {
        const { empresa, usuario } = data;

        if ((usuario.front_doc_id && usuario.back_doc_id) && (!frontDoc || !backDoc)) {
            toast.error('Por favor, envie ambos os documentos.');
            return;
        }

        const frontBase64 = await fileToBase64(frontDoc);
        const backBase64 = await fileToBase64(backDoc);

        const respEmpresa = await setEmpresa({ cod_empresa: empresa?.cod_empresa, ...empresa });
        setempresa(respEmpresa);

        const respUsuario = await setUsuario({ cod_usuario: usuario?.cod_usuario, ...usuario });
        setusuario(respUsuario);

        await gerarIdCarteira(empresa?.cod_empresa, usuario?.cod_usuario);
        await sendDocuments(frontBase64, backBase64, empresa.cod_empresa, usuario.cod_usuario);

        navigate('/dashboard');
    }

    return (
        <form className="container-fluid" onSubmit={handleSubmit(sendForm)}>
            <div className="card bg-success-subtle col-md-6">
                <div className="card-body">
                    <h5 className="card-title">Formulário FitCpx Pay</h5>
                    <h6 className="card-subtitle">Formulário para criar conta FitCpx pay para receber pagamentos no sistema.</h6>
                    <p className="mb-0">(Certifique-se de preencher todos os dados corretamente.)</p>
                </div>
            </div>

            <div>
                <Empresa register={register} errors={errors} />

                <div className="row g-3">
                    {(usuario.front_doc_id && usuario.back_doc_id) ? (
                        <div className="col-lg-6">
                            <div className="card">
                                <div className="card-body text-center">
                                    <h5 className="mb-3">Documento já enviado</h5>
                                    <div className="bg-success text-white d-inline-flex align-items-center justify-content-center rounded-circle mb-3" style={{ width: 60, height: 60 }}>
                                        <i className="bi bi-check fs-6" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <DocumentUpload
                            frontDoc={frontDoc}
                            backDoc={backDoc}
                            setFrontDoc={setFrontDoc}
                            setBackDoc={setBackDoc}
                        />
                    )}

                    <DadosBancarios register={register} errors={errors} prefixField='empresa' />
                </div>
            </div>

            <Usuario register={register} errors={errors} />

            <div className="card d-flex justify-content-end col-md-6">
                <div className="card-body">
                    {(!PRODUCAO && !empresa.dev_stripe_id) && (
                        <button type="submit" className="btn btn-success rounded">Enviar formulário</button>
                    )}
                    {(PRODUCAO && !empresa.stripe_id) && (
                        <button type="submit" className="btn btn-success rounded">Enviar formulário</button>
                    )}
                    {((PRODUCAO && empresa.stripe_id) || (!PRODUCAO && empresa.dev_stripe_id)) && (
                        <p className="text-danger">Formulário já enviado.</p>
                    )}
                </div>
            </div>
        </form>
    )
}

function Empresa({ register, errors }) {
    const [usuario] = useRecoilState(stateUsuario);

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">Empresa</h5>
                <h6>Dados da empresa para criação da conta</h6>

                <form>
                    <div className="row">
                        <div className="col-lg-6">
                            <FitInputForm
                                nameField='Nome'
                                classNameContainer='mb-3'
                                errors={errors}
                                disabled={usuario.admin_usuario !== 'S'}
                                { ...register('empresa.nome_empresa', { required: true }) }
                            />

                            <FitInputForm
                                nameField='Descrição'
                                classNameContainer='mb-3'
                                errors={errors}
                                disabled={usuario.admin_usuario !== 'S'}
                                { ...register('empresa.descricao_empresa', { required: false }) }
                            />

                            <FitInputForm
                                nameField='Telefone'
                                classNameContainer='mb-3'
                                errors={errors}
                                disabled={usuario.admin_usuario !== 'S'}
                                { ...register('empresa.telefone_empresa', { required: true }) }
                            />

                            <FitInputForm
                                nameField='CEP'
                                classNameContainer='mb-3'
                                errors={errors}
                                disabled={usuario.admin_usuario !== 'S'}
                                { ...register('empresa.cep_empresa', { required: true }) }
                            />
                        </div>

                        <div className="col-lg-6">
                            <FitInputForm
                                nameField='Email'
                                classNameContainer='mb-3'
                                errors={errors}
                                disabled={usuario.admin_usuario !== 'S'}
                                { ...register('empresa.email_empresa', { required: true }) }
                            />

                            <FitInputForm
                                nameField='Razão social'
                                classNameContainer='mb-3'
                                errors={errors}
                                disabled={usuario.admin_usuario !== 'S'}
                                { ...register('empresa.razao_social_empresa', { required: true }) }
                            />

                            <FitInputForm
                                nameField='Celular'
                                classNameContainer='mb-3'
                                errors={errors}
                                disabled={usuario.admin_usuario !== 'S'}
                                { ...register('empresa.celular_empresa', { required: true }) }
                            />

                            <div className="mb-3 row">
                                <FitInputForm
                                    nameField='Cidade'
                                    classNameContainer='mb-3 col-6'
                                    errors={errors}
                                    disabled={usuario.admin_usuario !== 'S'}
                                    { ...register('empresa.cidade_empresa', { required: true }) }
                                />

                                <FitStateForm
                                    nameField='Estado'
                                    classNameContainer='mb-3 col-6'
                                    errors={errors}
                                    disabled={usuario.admin_usuario !== 'S'}
                                    { ...register('empresa.estado_empresa', { required: true }) }
                                />
                            </div>
                        </div>

                        <div className="col-12 row">
                            <FitInputForm
                                nameField='Endereço'
                                classNameContainer='col-10'
                                errors={errors}
                                disabled={usuario.admin_usuario !== 'S'}
                                { ...register('empresa.endereco_empresa', { required: true }) }
                            />

                            <FitInputForm
                                nameField='Número'
                                classNameContainer='col-2'
                                errors={errors}
                                disabled={usuario.admin_usuario !== 'S'}
                                { ...register('empresa.numero_empresa', { required: true }) }
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default FitCpxPay;