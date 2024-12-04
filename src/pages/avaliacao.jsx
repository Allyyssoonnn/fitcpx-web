/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { calculaDensidade, calculaKGGordura, calculaKGMCM, calculaKGMusculo, calculaKGOsseo, calculaKGResidual, calculaPorcentagemGordura, calculaPorcentagemMCM, calculaPorcentagemMusculo, calculaPorcentagemOsseo, calculaPorcentagemResidual, getAreaMagraGorda, getIMC } from "../utils";
import { useQuery } from "react-query";
import { getProtocolos } from "../api/usuario";
import { useRecoilState } from "recoil";
import { stateUsuario } from "../states/states";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveBar } from "@nivo/bar";

function Avaliacao() {
    const navigate = useNavigate();
    const location = useLocation();
    const [usuario] = useRecoilState(stateUsuario);

    const { data: protocolos } = useQuery({
        queryKey: ['protocolo', ],
        queryFn: () => getProtocolos(usuario.cod_usuario),
        initialData: [],
    });

    const [avaliacao, setAvaliacao] = useState({});
    const [aluno, setAluno] = useState({});

    useEffect(() => {
        const avaliacaoRecebida = location.state?.avaliacao;
        const alunoRecebido = location.state?.aluno;
        avaliacaoRecebida ? setAvaliacao(avaliacaoRecebida) : navigate('/alunos');        
        alunoRecebido ? setAluno(alunoRecebido) : navigate('/alunos');
    }, []);

    if (!avaliacao) {
        return <div>Carregando...</div>;
    }

    const imprimirResultados = () => {
        const printContent = document.getElementById("printable-area");
        const printWindow = window.open('', '', 'height=600, width=800');
        printWindow.document.write('<html><head><title>Resultado da Avaliação</title>');
        printWindow.document.write('<style>body { font-family: Arial, sans-serif; padding: 20px; margin: 0; color: #333; }');
        printWindow.document.write('h1, h2, h3 { color: #007bff; }');
        printWindow.document.write('.table { width: 100%; margin-top: 20px; border-collapse: collapse; }');
        printWindow.document.write('.table th, .table td { padding: 8px; border: 1px solid #ddd; text-align: left; }');
        // Oculta as seções específicas para impressão
        printWindow.document.write('.no-print { display: none; }');
        printWindow.document.write('</style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write(printContent.innerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    };

    const getTotalDobras = () => {
        const dobras = [
            avaliacao.triciptal,
            avaliacao.peitoral,
            avaliacao.subescapular,
            avaliacao.axilar_media,
            avaliacao.abdominal,
            avaliacao.coxa,
            avaliacao.supra_iliaca,
            avaliacao.supra_espinhal,
            avaliacao.biciptal,
            avaliacao.panturrilha,
        ];
        
        return dobras.reduce((total, valor) => {
            return total + (parseFloat(valor) || 0);
        }, 0);
    }

    return (
        <div className="container-fluid">
            <div className="card">
                <div className="card-header">
                    <div className="d-flex justify-content-between align-items-center">
                        <button onClick={() => navigate(-1)} className="btn btn-danger mb-3 me-3">
                            <i className="bi bi-arrow-left-circle me-2"></i> Voltar
                        </button>
                        <button onClick={imprimirResultados} className="btn btn-primary mb-3">
                            <i className="bi bi-printer me-2"></i> Imprimir
                        </button>
                    </div>
                </div>

                <div className="card-body" id="printable-area">
                    <div className="card row mb-4">
                        <div className="card-header">
                            <h5>Resultado da Avaliação</h5>
                        </div>

                        <div className="card-body">
                            <div className="col-md-5 no-print">
                                <label className="form-label">Protocolo</label>
                                <select onChange={e => setAvaliacao(prev => ({ ...prev, cod_protocolo: Number(e.target.value) }))} value={avaliacao.cod_protocolo} className="form-control">
                                    <option value="">Selecione um protocolo</option>
                                    {Object.keys(protocolos).map(categoria => (
                                        <optgroup key={categoria} label={categoria}>
                                            {protocolos[categoria].map(protocolo => (
                                                <option key={protocolo.cod_protocolo} value={protocolo.cod_protocolo}>
                                                    {protocolo.nome_protocolo}
                                                </option>
                                            ))}
                                        </optgroup>
                                    ))}
                                </select>
                            </div>

                            {/* <p><strong>Protocolo:</strong> {avaliacao.cod_protocolo}</p> */}
                            <p><strong>Data da Avaliação:</strong> {avaliacao.data_avaliacao}</p>
                            <p><strong>Peso:</strong> {avaliacao.peso} kg</p>
                            <p><strong>Altura:</strong> {avaliacao.altura} cm</p>
                            <p><strong>Sexo:</strong> {aluno.sexo_aluno === 'M' ? 'Masculino' : 'Feminino'}</p>
                            <p><strong>Total dobras:</strong> {getTotalDobras()} cm</p>
                            <p><strong>IMC:</strong> {getIMC(avaliacao)}</p>
                            <p className={`${avaliacao.cod_protocolo === 2 || avaliacao.cod_protocolo === 4 ? '' : 'd-none'}`}>
                                <strong>Densidade corporal:</strong> {calculaDensidade(aluno, avaliacao)}
                            </p>
                        </div>
                    </div>

                    <div className="row g-3">
                        <div className="col-md-6">
                            <ComposicaoCorporal avaliacao={avaliacao} aluno={aluno} />
                        </div>

                        <div className="col-md-6">
                            <SimetriaMembro avaliacao={avaliacao} />
                        </div>
                    </div>

                    <AreaMagraGorda avaliacao={avaliacao} />
                    <Perimetro avaliacao={avaliacao} />
                    <Diametro avaliacao={avaliacao} />
                    <Dobras avaliacao={avaliacao} />
                </div>
            </div>
        </div>
    );
}

function AreaMagraGorda({ avaliacao }) {
    const [resultados, setResultados] = useState({ braco: [], coxa: [], panturrilha: [] });

    useEffect(() => {
        const resp = getAreaMagraGorda(avaliacao);
        setResultados(resp);
    }, [avaliacao]);

    return (
        <div className="card">
            <div className="card-header">
                <h4>Área Magra/Gorda</h4>
            </div>

            <div className="card-body row justify-content-around">
                <div className="col-md-4 table-responsive">
                    <table id="basic-datatables" className="table table-sm table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Braço</th>
                            </tr>
                        </thead>

                        <tbody>
                            {resultados?.braco?.map((campo, id) => (
                                <tr key={id}>
                                    <th>{campo.nome}</th>
                                    <th>{campo.valor} {campo.prefix}</th>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="col-md-4 table-responsive">
                    <table id="basic-datatables" className="table table-sm table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Coxa</th>
                            </tr>
                        </thead>

                        <tbody>
                            {resultados?.coxa?.map((campo, id) => (
                                <tr key={id}>
                                    <th>{campo.nome}</th>
                                    <th>{campo.valor}</th>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="col-md-4 table-responsive">
                    <table id="basic-datatables" className="table table-sm table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Panturrilha</th>
                            </tr>
                        </thead>

                        <tbody>
                            {resultados?.panturrilha?.map((campo, id) => (
                                <tr key={id}>
                                    <th>{campo.nome}</th>
                                    <th>{campo.valor}</th>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

function ComposicaoCorporal({ avaliacao, aluno }) {

    return (
        <div className="card table-responsive">
            <div className="card-header">
                <h4>Composição corporal</h4>
            </div>

            <div className="card-body">
                <div style={{ height: '400px' }}>
                    <ResponsivePie
                        data={[
                            { id: 'Gordura', label: 'Gordura', value: calculaPorcentagemGordura(aluno, avaliacao), color: '#FF9999' },
                            { id: 'Músculo', label: 'Músculo', value: calculaPorcentagemMusculo(aluno, avaliacao), color: '#99FF99' },
                            { id: 'Osso', label: 'Osso', value: calculaPorcentagemOsseo(avaliacao), color: '#CCCCCC' },
                            { id: 'Residual', label: 'Residual', value: calculaPorcentagemResidual(aluno, avaliacao), color: '#99CCFF' },
                        ]}
                        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                        innerRadius={0.5}
                        padAngle={0.7}
                        cornerRadius={3}
                        // colors={{ scheme: 'nivo' }}
                        colors={(d) => d.data.color}
                        borderWidth={1}
                        borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                        enableRadialLabels={true}
                        radialLabel="id"
                        radialLabelsLinkDiagonalLength={10}
                        radialLabelsTextColor="#333333"
                        // valueFormat={value => `${Number(value)} %`}
                        activeOuterRadiusOffset={8}
                    />
                </div>
                
                <table id="basic-datatables" className="table table-sm table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Composição</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <th>Gordura</th>
                            <th>{calculaKGGordura(aluno, avaliacao)} KG</th>
                            <th>{calculaPorcentagemGordura(aluno, avaliacao)} %</th>
                        </tr>
                        <tr>
                            <th>Musc.</th>
                            <th>{calculaKGMusculo(aluno, avaliacao)} KG</th>
                            <th>{calculaPorcentagemMusculo(aluno, avaliacao)} %</th>
                        </tr>
                        <tr>
                            <th>Óssea.</th>
                            <th>{calculaKGOsseo(avaliacao)} KG</th>
                            <th>{calculaPorcentagemOsseo(avaliacao)} %</th>
                        </tr>
                        <tr>
                            <th>Resi.</th>
                            <th>{calculaKGResidual(aluno, avaliacao)} KG</th>
                            <th>{calculaPorcentagemResidual(aluno, avaliacao)} %</th>
                        </tr>
                        <tr>
                            <th>MCM</th>
                            <th>{calculaKGMCM(aluno, avaliacao)} KG</th>
                            <th>{calculaPorcentagemMCM(aluno, avaliacao)} %</th>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function SimetriaMembro({ avaliacao }) {
    const getDifferenceClass = (diff) => {
        return diff > 1 ? 'bg-danger text-white' : '';
    };

    const data = [
        {
            membro: 'Braço',
            direito: avaliacao.braco_relaxado_direito,
            esquerdo: avaliacao.braco_relaxado_esquerdo,
        },
        {
            membro: 'Braço cont.',
            direito: avaliacao.braco_contraido_direito,
            esquerdo: avaliacao.braco_contraido_esquerdo,
        },
        {
            membro: 'Antebraço',
            direito: avaliacao.antebraco_direito,
            esquerdo: avaliacao.antebraco_esquerdo,
        },
        {
            membro: 'Coxa',
            direito: avaliacao.coxa_direita,
            esquerdo: avaliacao.coxa_esquerda,
        },
    ]

    return (
        <div className="card table-responsive">
            <div className="card-header">
                <h4>Simetria dos membros</h4>
            </div>

            <div className="card-body">
                <div style={{ height: '400px' }}>
                <ResponsiveBar
                    data={data}
                    axisBottom={null}
                    keys={[
                        'direito',
                        'esquerdo',
                    ]}
                    indexBy="membro"
                    margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                    padding={0.5}
                    groupMode="grouped"
                    layout="horizontal"
                    valueScale={{ type: 'linear' }}
                    indexScale={{ type: 'band', round: true }}
                    borderColor={{ from: 'color', modifiers: [[ 'darker', 1.6 ]] }}
                    labelTextColor={{ from: 'color', modifiers: [[ 'darker', 1.6 ]] }}
                    legends={[
                        {
                            dataFrom: 'keys',
                            anchor: 'bottom-right',
                            direction: 'column',
                            justify: false,
                            translateX: 120,
                            translateY: 0,
                            itemsSpacing: 2,
                            itemWidth: 100,
                            itemHeight: 20,
                            itemDirection: 'left-to-right',
                            itemOpacity: 0.85,
                            symbolSize: 20,
                            effects: [
                                {
                                    on: 'hover',
                                    style: {
                                        itemOpacity: 1
                                    }
                                }
                            ]
                        }
                    ]}
                    role="application"
                />
                </div>

                <table id="basic-datatables" className="table table-sm table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Membro</th>
                            <th>Direito</th>
                            <th>Diferença</th>
                            <th>Esquerdo</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <th>Braço (cm)</th>
                            <th>{avaliacao.braco_relaxado_direito || '-'}</th>
                            <th
                                className={getDifferenceClass(avaliacao.braco_relaxado_esquerdo - avaliacao.braco_relaxado_direito)}
                            >{(avaliacao.braco_relaxado_esquerdo - avaliacao.braco_relaxado_direito).toFixed(2) || '-'}</th>
                            <th>{avaliacao.braco_relaxado_esquerdo || '-'}</th>
                        </tr>
                        <tr>
                            <th>Braço contraido (cm)</th>
                            <th>{avaliacao.braco_contraido_direito || '-'}</th>
                            <th
                                className={getDifferenceClass(avaliacao.braco_contraido_direito - avaliacao.braco_contraido_esquerdo)}
                            >{(avaliacao.braco_contraido_direito - avaliacao.braco_contraido_esquerdo).toFixed(2) || '-'}</th>
                            <th>{avaliacao.braco_contraido_esquerdo || '-'}</th>
                        </tr>
                        <tr>
                            <th>Antebraço (cm)</th>
                            <th>{avaliacao.antebraco_direito || '-'}</th>
                            <th
                                className={getDifferenceClass(avaliacao.antebraco_direito - avaliacao.antebraco_esquerdo)}
                            >{(avaliacao.antebraco_direito - avaliacao.antebraco_esquerdo).toFixed(2) || '-'}</th>
                            <th>{avaliacao.antebraco_esquerdo || '-'}</th>
                        </tr>
                        <tr>
                            <th>Coxa (cm)</th>
                            <th>{avaliacao.coxa_direita || '-'}</th>
                            <th
                                className={getDifferenceClass(avaliacao.coxa_direita - avaliacao.coxa_esquerda)}
                            >{(avaliacao.coxa_direita - avaliacao.coxa_esquerda).toFixed(2) || '-'}</th>
                            <th>{avaliacao.coxa_esquerda || '-'}</th>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function Perimetro({ avaliacao }) {
    return (
        <div className="card no-print">
            <div className="card-header">
                <h4>Perímetro</h4>
            </div>

            <div className="card-body">
                <div className="row g-3 mt-3">
                    <div className="card col-md-4">
                        <h6>Geral</h6>
                        <ul>
                            <li><strong>Pescoço:</strong> {avaliacao.pescoco || '-'} cm</li>
                            <li><strong>Ombro:</strong> {avaliacao.ombro || '-'} cm</li>
                            <li><strong>Tórax Inspirado:</strong> {avaliacao.torax_inspirado || '-'} cm</li>
                            <li><strong>Tórax Expirado:</strong> {avaliacao.torax_expirado || '-'} cm</li>
                            <li><strong>Punho:</strong> {avaliacao.punho || '-'} cm</li>
                            <li><strong>Cintura:</strong> {avaliacao.cintura || '-'} cm</li>
                            <li><strong>Abdômen:</strong> {avaliacao.abdomen || '-'} cm</li>
                            <li><strong>Quadril:</strong> {avaliacao.quadril || '-'} cm</li>
                        </ul>
                    </div>

                    <div className="card col-md-4">
                        <h6>Lado direito</h6>
                        <ul>
                            <li><strong>Braço Relaxado Direito:</strong> {avaliacao.braco_relaxado_direito || '-'} cm</li>
                            <li><strong>Braço Contraído Direito:</strong> {avaliacao.braco_contraido_direito || '-'} cm</li>
                            <li><strong>Antebraço Direito:</strong> {avaliacao.antebraco_direito || '-'} cm</li>
                            <li><strong>Coxa Direita:</strong> {avaliacao.coxa_direita || '-'} cm</li>
                            <li><strong>Panturrilha Direita:</strong> {avaliacao.panturrilha_direita || '-'} cm</li>
                        </ul>
                    </div>

                    <div className="card col-md-4">
                        <h6>Lado esquerdo</h6>
                        <ul>
                            <li><strong>Braço Relaxado Esquerdo:</strong> {avaliacao.braco_relaxado_esquerdo || '-'} cm</li>
                            <li><strong>Braço Contraído Esquerdo:</strong> {avaliacao.braco_contraido_esquerdo || '-'} cm</li>
                            <li><strong>Antebraço Esquerdo:</strong> {avaliacao.antebraco_esquerdo || '-'} cm</li>
                            <li><strong>Coxa Esquerda:</strong> {avaliacao.coxa_esquerda || '-'} cm</li>
                            <li><strong>Panturrilha Esquerda:</strong> {avaliacao.panturrilha_esquerda || '-'} cm</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Diametro({ avaliacao }) {
    return (
        <div className="card no-print">
            <div className="card-header">
                <h4>Diamêtro</h4>
            </div>

            <div className="card-body">
                <ul className="mt-3">
                    <li><strong>Biestilóide punho:</strong> {avaliacao.biestiloide_punho || '-'} cm</li>
                    <li><strong>Biepicôndilo Umeral:</strong> {avaliacao.biepicondilo_umeral || '-'} cm</li>
                    <li><strong>Biepicôndilo femoral:</strong> {avaliacao.biepicondilo_femoral || '-'} cm</li>
                </ul>
            </div>
        </div>
    )
}

function Dobras({ avaliacao }) {
    return (
        <div className="card no-print">
            <div className="card-header">
                <h4>Dobras cutâneas</h4>
            </div>
            
            <div className="card-body">
                <ul className="mt-3">
                    <li><strong>Triciptal:</strong> {avaliacao.triciptal || '-'} cm</li>
                    <li><strong>Peitoral:</strong> {avaliacao.peitoral || '-'} cm</li>
                    <li><strong>Subescapular:</strong> {avaliacao.subescapular || '-'} cm</li>
                    <li><strong>Axilar Media:</strong> {avaliacao.axilar_media || '-'} cm</li>
                    <li><strong>Abdominal:</strong> {avaliacao.abdominal || '-'} cm</li>
                    <li><strong>Coxa:</strong> {avaliacao.coxa || '-'} cm</li>
                    <li><strong>Supra Ilíaca:</strong> {avaliacao.supra_iliaca || '-'} cm</li>
                    <li><strong>Supra espinhal:</strong> {avaliacao.supra_espinhal || '-'} cm</li>
                    <li><strong>Biciptal:</strong> {avaliacao.biciptal || '-'} cm</li>
                    <li><strong>Panturrilha:</strong> {avaliacao.panturrilha || '-'} cm</li>
                </ul>
            </div>
        </div>
    )
}

export default Avaliacao;