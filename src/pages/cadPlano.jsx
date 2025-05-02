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
import contratoPresencial from '../utils/contratoPresencial.html?raw';
import contratoConsultoria from '../utils/contratoConsultoria.html?raw';
import Select from "../components/baseComponents/select";
import { dividirParcelas, formatarMoeda } from "../utils";
import SelectModalidades from "../components/selectModalidades";

function CadPlano() {
    const editor = useRef(null);
    const { nSuccess, nConfirm } = useNotificacao();
    const [usuario] = useRecoilState(stateUsuario);
    const { register, handleSubmit, control, setValue, watch, getValues } = useForm();
    const navigate = useNavigate();
    const location = useLocation();
    const [contrato, setContrato] = useState('');
    const [selectModalidades, setSelectModalidades] = useState([]);

    const [valorTotal, setValorTotal] = useState(0);
    const [parcelas, setParcelas] = useState([]);

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

    const duracao_plano = watch('duracao_plano');
    const valor_adesao = watch('valor_adesao');
    
    useEffect(() => {
        (async function load() {
            if (!duracao_plano) return;
            const plano = getValues();
            await atualizarModalidadesComSubvariacoes({ plano, modalidades: selectModalidades });
            await calculaValoresDoPlano(plano);
        })();
    }, [duracao_plano]);

    function calculaValoresDoPlano(plano) {
        let total = 0;
        selectModalidades?.forEach((mod) => {
            total += mod.valor_modalidade;
        });
        total = plano.duracao_plano * total;
    
        const parcelas = dividirParcelas(plano.duracao_plano, total);
        if (plano.valor_adesao) parcelas[0] += plano.valor_adesao;
        setValorTotal(total);
        return {
            ...plano,
            valor_plano: total,
            parcela_plano: JSON.stringify(parcelas),
        }
    }

    function atualizarModalidadesComSubvariacoes(planoAtual) {
        if (!planoAtual?.modalidades) return planoAtual;
    
        const modalidadesAtualizadas = planoAtual.modalidades.map((mod) => {
            const novaModalidade = { ...mod };
    
            const subVariacoes = mod?.subvariacoes;
            if (!subVariacoes?.length) return novaModalidade;
    
            const subVariacao = subVariacoes.filter(
                (v) => duracao_plano >= v.duracao_subvariacao
            );
    
            if (!subVariacao.length) {
                novaModalidade.valor_modalidade = mod.valor_modalidade_original;
                novaModalidade.nome_modalidade = mod.nome_modalidade_original;
            } else {
                const ultima = subVariacao[subVariacao.length - 1];
                novaModalidade.valor_modalidade = ultima.valor_subvariacao;
                novaModalidade.nome_modalidade = `${mod.nome_modalidade_original} - ${String(ultima.nome_subvariacao)}`;
            }
    
            return novaModalidade;
        });
        setSelectModalidades(modalidadesAtualizadas);
    }

    function addModalidade(modalidade) {
        var modalidades = [ ...(selectModalidades || []), modalidade ];
        atualizarModalidadesComSubvariacoes({ modalidades });
        // setSelectModalidades(prev => [...(prev || []), modalidade]);
    }

    function removeModalidade(index) {
        setSelectModalidades(prev => prev?.filter((m, i) => index !== i));
    }

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
                            <input {...register("duracao_plano")} className="form-control" />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label fw-bold">Tipo Duração plano</label>
                            <select disabled {...register('tipo_duracao_plano')} className="form-control">
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
                            <input disabled className="form-control" value={formatarMoeda(valorTotal)} />
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

                    <SelectModalidades
                        addModalidade={addModalidade}
                        removeModalidade={removeModalidade}
                        modalidadesPlano={selectModalidades}
                    />
                </div>

                <div className="card-footer">
                    <button type="submit" className="btn btn-success">Confirmar</button>
                </div>
            </div>
        </form>
    )
}

export default CadPlano;