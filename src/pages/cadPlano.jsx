import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import CurrencyInput from "../components/currencyInput";
import { getModalidades, getPlanos, setPlano } from "../api/plano";
import { useRecoilState } from "recoil";
import { stateUsuario, useNotificacao } from "../states/states";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import MultiSelect from "../components/multipleSelect";
import JoditEditor from "jodit-react";
import { jsPDF } from "jspdf";
import contratoPresencial from '../utils/contratoPresencial.html?raw';
import contratoConsultoria from '../utils/contratoConsultoria.html?raw';
import Select from "../components/baseComponents/select";

function CadPlano() {
    const editor = useRef(null);
    const { nSuccess, nConfirm } = useNotificacao();
    const [usuario] = useRecoilState(stateUsuario);
    const { register, handleSubmit, control, setValue } = useForm();
    const navigate = useNavigate();
    const location = useLocation();
    const [contrato, setContrato] = useState('');
    const [selectModalidades, setSelectModalidades] = useState([]);

    const { data: modalidades, refetch } = useQuery({
        queryKey: ['modalidades', usuario.cod_empresa],
        queryFn: () => getModalidades(usuario.cod_empresa),
        initialData: [],
    });

    const { data: planos, refetchPlanos } = useQuery({
        queryKey: ['planos', usuario.cod_empresa],
        queryFn: () => getPlanos(usuario.cod_empresa),
        initialData: [],
    });
    

    useEffect(() => {
        const planoRecebido = location.state?.plano;
        if (planoRecebido?.modalidades) setSelectModalidades(planoRecebido.modalidades);
        if (planoRecebido?.contrato_plano) setContrato(planoRecebido.contrato_plano);
        if (planoRecebido) {
            Object.keys(planoRecebido).forEach((key) => {
                setValue(key, planoRecebido[key]);
            });
        }
    }, [location, setValue, usuario]);

    async function confirma(data) {
        await setPlano({
            ...data,
            cod_usuario: usuario.cod_usuario,
            cod_empresa: usuario.cod_empresa,
            contrato_plano: contrato,
        }, selectModalidades);
        nSuccess();
        navigate('/planos');
    }

    function setModeloContrato(e, modelo) {
        e.preventDefault();
        if (contrato) {
            nConfirm('', 'As alterações no editor de contrato serão perdidas!', () => setContrato(modelo));
        } else setContrato(modelo);
    }

    return (
        <form onSubmit={handleSubmit(confirma)} className="container-fluid">
            <div className="card">
                <div className="card-header">
                    <button onClick={e => { e.stopPropagation(); navigate('/planos'); }} className="btn btn-danger mb-3 me-3">
                        <i className="bi bi-backspace me-2"></i>
                        Voltar
                    </button>
                </div>

                <div className="card-body">
                    <h5 className="card-title fw-semibold mb-4">Informações</h5>

                    <div className="row g-3">
                        <div className="col-md-5">
                            <label className="form-label fw-bold">Nome *</label>
                            <input {...register("nome_plano", { required: "O nome é obrigatório" })}
                                className="form-control"
                            />
                        </div>
                    </div>

                    <div className="row g-3 mt-3">
                        <div className="col-md-2">
                            <label className="form-label fw-bold">Duração plano</label>
                            <input {...register("duracao_plano")}
                                className="form-control"
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label fw-bold">Tipo Duração plano</label>
                            <select {...register('tipo_duracao_plano')} className="form-control">
                                <option value='Meses'>Meses</option>
                                <option value='Semanas'>Semanas</option>
                                <option value='Dias'>Dias</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-body">
                    <h5 className="card-title fw-semibold mb-4">Fincanceiro</h5>

                    <div className="row g-3 mt-3">
                        <div className="col-md-3">
                            <label className="form-label fw-bold">Valor plano</label>
                            <CurrencyInput control={control} name='valor_plano' />
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
                    <h5 className="card-title fw-semibold mb-4">Modalidades</h5>

                    <MultiSelect
                        options={modalidades}
                        chavePesquisa='nome_modalidade'
                        valueChave='cod_modalidade'
                        state={selectModalidades}
                        setState={setSelectModalidades}
                    />
                </div>
            </div>

            <div className="card">
                <div className="card-body">
                    <div className="card-header d-flex justify-content-between">
                        <h5 className="card-title fw-semibold mb-4">Contrato</h5>
                        <div className="d-flex gap-2">
                            <button className="btn btn-sm btn-info rounded" onClick={(e) => setModeloContrato(e, contratoPresencial)}>Modelo presencial</button>
                            <button className="btn btn-sm btn-info rounded" onClick={(e) => setModeloContrato(e, contratoConsultoria)}>Modelo consultoria</button>
                            <button className="btn btn-sm btn-info rounded" disabled>Modelo plano anterior</button>
                            <Select options={planos} fieldName='nome_plano' />
                        </div>
                    </div>

                    <JoditEditor
                        ref={editor}
                        value={contrato}
                        onBlur={(newContent) => setContrato(newContent)} // Atualiza quando perde o foco
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

export default CadPlano;