import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import CurrencyInput from "../components/currencyInput";
import { useRecoilState } from "recoil";
import { stateUsuario, useNotificacao } from "../states/states";
import { useEffect, useRef, useState } from "react";
import JoditEditor from "jodit-react";
import contratoPresencial from '../utils/contratoPresencial.html?raw';
import contratoConsultoria from '../utils/contratoConsultoria.html?raw';
import { setModContrato } from "../api/plano";

function CadContrato() {
    const editor = useRef(null);
    const { nSuccess, nConfirm } = useNotificacao();
    const [usuario] = useRecoilState(stateUsuario);
    const { register, handleSubmit, control, setValue } = useForm();
    const navigate = useNavigate();
    const location = useLocation();
    const [contratohtml, setContratohtml] = useState('');

    useEffect(() => {
        const contratoRecebido = location.state?.contrato;
        if (contratoRecebido?.contrato) setContratohtml(contratoRecebido.contrato);
        if (contratoRecebido) {
            Object.keys(contratoRecebido).forEach((key) => {
                setValue(key, contratoRecebido[key]);
            });
        }
    }, [location, setValue, usuario]);

    async function confirma(data) {
        await setModContrato({ ...data, cod_empresa: usuario.cod_empresa, contrato: contratohtml });
        nSuccess();
        navigate('/modcontratos');
    }

    function setModeloContrato(e, modelo) {
        e.preventDefault();
        if (contratohtml) {
            nConfirm('', 'As alterações no editor de contrato serão perdidas!', () => setContratohtml(modelo));
        } else setContratohtml(modelo);
    }

    return (
        <form onSubmit={handleSubmit(confirma)} className="container-fluid">
            <div className="card">
                <div className="card-header">
                    <button onClick={e => { e.stopPropagation(); navigate('/modcontratos'); }} className="btn btn-danger mb-3 me-3">
                        <i className="bi bi-backspace me-2"></i>
                        Voltar
                    </button>
                </div>

                <div className="card-body">
                    <h5 className="card-title fw-semibold mb-4">Informações</h5>

                    <div className="row g-3">
                        <div className="col-md-5">
                            <label className="form-label fw-bold">Nome *</label>
                            <input {...register("nome_contrato", { required: "O nome é obrigatório" })}
                                className="form-control"
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label fw-bold">Valor adesão</label>
                            <CurrencyInput control={control} name='valor_adesao' />
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-body">
                    <div className="card-header d-flex justify-content-between">
                        <h5 className="card-title fw-semibold mb-4">Contrato</h5>
                        <div className="d-flex gap-2">
                            <button className="btn btn-sm btn-info rounded" onClick={(e) => setModeloContrato(e, contratoPresencial)}>Modelo presencial</button>
                            <button className="btn btn-sm btn-info rounded" onClick={(e) => setModeloContrato(e, contratoConsultoria)}>Modelo consultoria</button>
                        </div>
                    </div>

                    <JoditEditor
                        ref={editor}
                        value={contratohtml}
                        onBlur={(newContent) => setContratohtml(newContent)} // Atualiza quando perde o foco
                        config={{
                            readonly: false,
                            // height: 900,
                            // buttons: "bold,italic,underline,|,ul,ol,|,font,fontsize,brush,|,link,align,undo,redo",
                            buttons: "source,|,bold,italic,underline,strikethrough,|,ul,ol,indent,outdent,|,left,center,right,justify,|,font,fontsize,brush,paragraph,|,image,video,table,link,|,hr,undo,redo,copyformat,selectall,cut,copy,paste,|,print,fullsize",
                        }}
                    />
                </div>

                <div className="card-footer">
                    <button type='submit' className="btn btn-success">Confirmar</button>
                </div>
            </div>
        </form>
    )
}

export default CadContrato;