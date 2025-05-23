import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { stateUsuario, useNotificacao } from "../../states/states";
import { toast } from "react-toastify";
import { setUsuario } from "../../api/usuario";
import { gerarIdCarteira, sendDocuments } from "../../api/pagamento";
import { PRODUCAO } from "../../api/api";
import Usuario from "./comp.usuarioFitCpxPay";
import DocumentUpload from "./comp.documentFitCpxPay";
import DadosBancarios from "./comp.bankFitCpxPay";
import StripeStatus from "./comp.stripeStatus";

function FitCpxPayUsuario() {
    const navigate = useNavigate();
    const { nLoading, endLoading } = useNotificacao();
    const [usuario, setusuario] = useRecoilState(stateUsuario);
    const { register, setValue, handleSubmit, formState: { errors } } = useForm();

    const [frontDoc, setFrontDoc] = useState(null);
    const [backDoc, setBackDoc] = useState(null);

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
        const { usuario: usuarioForm } = data;

        if (!frontDoc || !backDoc) {
            toast.error('Por favor, envie ambos os documentos.');
            endLoading();
            return;
        }

        const frontType = frontDoc.type;
        const backType = backDoc.type;
        const frontBase64 = await fileToBase64(frontDoc);
        const backBase64 = await fileToBase64(backDoc);

        const camposIgnorados = ['stripe_id', 'dev_stripe_id', 'stripe_account_id', 'dev_stripe_account_id'];

        const usuarioFormLimpo = Object.fromEntries(
            Object.entries(usuarioForm).filter(([key]) => !camposIgnorados.includes(key))
        );

        const respUsuario = await setUsuario({ cod_usuario: usuario?.cod_usuario, ...usuarioFormLimpo });
        setusuario(respUsuario);

        await gerarIdCarteira(null, usuario?.cod_usuario);
        await sendDocuments(frontBase64, backBase64, frontType, backType, null, usuario.cod_usuario);

        endLoading();
        navigate('/dashboard');
    }

    return (
        <form className="container-fluid" onSubmit={handleSubmit(sendForm)}>
            <div className="card bg-success-subtle col-md-6">
                <div className="card-body">
                    <h5 className="card-title">Formulário FitCpx Pay para usuário</h5>
                    <h6 className="card-subtitle">Formulário para criar conta FitCpx pay para receber pagamentos no sistema.</h6>
                    <p className="mb-0">(Certifique-se de preencher todos os dados corretamente.)</p>
                </div>
            </div>

            <StripeStatus cod_usuario={usuario.cod_usuario} />

            <Usuario register={register} errors={errors} />

            <div className="row g-3">
                <DocumentUpload
                    frontDoc={frontDoc}
                    backDoc={backDoc}
                    setFrontDoc={setFrontDoc}
                    setBackDoc={setBackDoc}
                />

                <DadosBancarios register={register} errors={errors} prefixField='usuario' />
            </div>

            <div className="card d-flex justify-content-end col-md-6">
                <div className="card-body">
                    {(!PRODUCAO) && (
                        <button type="submit" className="btn btn-info rounded">
                            {usuario.dev_stripe_account_id ? 'Atualizar dados' : 'Enviar formulário'}
                        </button>
                    )}
                    {(PRODUCAO) && (
                        <button type="submit" className="btn btn-success rounded">
                            {usuario.stripe_account_id ? 'Atualizar dados' : 'Enviar formulário'}
                        </button>
                    )}
                </div>
            </div>
        </form>
    )
}

export default FitCpxPayUsuario;