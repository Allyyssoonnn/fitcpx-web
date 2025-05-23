import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { stateUsuario } from "../../states/states";
import { toast } from "react-toastify";
import { setUsuario } from "../../api/usuario";
import { gerarIdCarteira } from "../../api/pagamento";
import { PRODUCAO } from "../../api/api";
import Usuario from "./comp.usuarioFitCpxPay";
import DocumentUpload from "./comp.documentFitCpxPay";
import DadosBancarios from "./comp.bankFitCpxPay";

function FitCpxPayUsuario() {
    const navigate = useNavigate();
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
        if ((usuario.front_doc_id && usuario.back_doc_id) && (!frontDoc || !backDoc)) {
            toast.error('Por favor, envie ambos os documentos.');
            return;
        }

        const frontBase64 = await fileToBase64(frontDoc);
        const backBase64 = await fileToBase64(backDoc);

        const respUsuario = await setUsuario({ cod_usuario: usuario?.cod_usuario, ...data });
        setusuario(respUsuario);

        await gerarIdCarteira(null, usuario?.cod_usuario);
        // await sendDocuments(frontBase64, backBase64, empresa.cod_empresa, usuario.cod_usuario);

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

            <Usuario register={register} errors={errors} />

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

            <div className="card d-flex justify-content-end col-md-6">
                <div className="card-body">
                    {(!PRODUCAO && !usuario.dev_stripe_account_id) && (
                        <button type="submit" className="btn btn-success rounded">Enviar formulário</button>
                    )}
                    {(PRODUCAO && !usuario.stripe_account_id) && (
                        <button type="submit" className="btn btn-success rounded">Enviar formulário</button>
                    )}
                    {((PRODUCAO && usuario.stripe_account_id) || (!PRODUCAO && usuario.dev_stripe_account_id)) && (
                        <p className="text-danger">Formulário já enviado.</p>
                    )}
                </div>
            </div>
        </form>
    )
}

export default FitCpxPayUsuario;