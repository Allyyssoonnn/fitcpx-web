import { useRecoilState } from "recoil";
import { stateEmpresa, stateUsuario, useNotificacao } from "../../states/states";
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
import StripeStatus from "./comp.stripeStatus";

function FitCpxPay() {
    const navigate = useNavigate();
    const { nLoading, endLoading } = useNotificacao();
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

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    async function sendForm(data) {
        nLoading();
        const { empresa, usuario } = data;

        if (!frontDoc || !backDoc) {
            toast.error('Por favor, envie ambos os documentos.');
            endLoading();
            return;
        }

        const frontType = frontDoc.type;
        const backType = backDoc.type;
        const frontBase64 = await fileToBase64(frontDoc);
        const backBase64 = await fileToBase64(backDoc);

        const camposIgnoradosEmpresa = ['stripe_customer_id', 'dev_stripe_customer_id', 'dev_stripe_id', 'stripe_id'];
        const empresaFormLimpo = Object.fromEntries(
            Object.entries(empresa).filter(([key]) => !camposIgnoradosEmpresa.includes(key))
        );

        const respEmpresa = await setEmpresa({ cod_empresa: empresa?.cod_empresa, ...empresaFormLimpo });
        setempresa(respEmpresa);

        const camposIgnorados = ['stripe_id', 'dev_stripe_id', 'stripe_account_id', 'dev_stripe_account_id'];
        const usuarioFormLimpo = Object.fromEntries(
            Object.entries(usuario).filter(([key]) => !camposIgnorados.includes(key))
        );

        const respUsuario = await setUsuario({ cod_usuario: usuario?.cod_usuario, ...usuarioFormLimpo });
        setusuario(respUsuario);

        await gerarIdCarteira(empresa?.cod_empresa, usuario?.cod_usuario, 'ASAAS');
        await sendDocuments(frontBase64, backBase64, frontType, backType, empresa.cod_empresa, usuario.cod_usuario);

        endLoading();
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

            <StripeStatus cod_empresa={empresa.cod_empresa} />

            <div>
                <Empresa register={register} errors={errors} />

                <div className="row g-3">
                    <DocumentUpload
                        frontDoc={frontDoc}
                        backDoc={backDoc}
                        setFrontDoc={setFrontDoc}
                        setBackDoc={setBackDoc}
                    />

                    <DadosBancarios register={register} errors={errors} prefixField='empresa' />
                </div>
            </div>

            <Usuario register={register} errors={errors} />

            <div className="card d-flex justify-content-end col-md-6">
                <div className="card-body">
                    {(!PRODUCAO) && (
                        <button type="submit" className="btn btn-info rounded">
                            {empresa.dev_stripe_id ? 'Atualizar dados' : 'Enviar formulário'}
                        </button>
                    )}
                    {(PRODUCAO) && (
                        <button type="submit" className="btn btn-success rounded">
                            {empresa.stripe_id ? 'Atualizar dados' : 'Enviar formulário'}
                        </button>
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
                        <div className="col-lg-12">
                            <FitInputForm
                                nameField='CNPJ'
                                classNameContainer='mb-3 col-lg-6'
                                errors={errors}
                                disabled={usuario.admin_usuario !== 'S'}
                                { ...register('empresa.doc_empresa', { required: true }) }
                            />
                        </div>

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