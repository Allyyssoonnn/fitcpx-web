import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { calculaDensidade, calculaKGGordura, calculaKGMassaMagra, calculaKGMCM, calculaKGMCMMeta, calculaKGMusculo, calculaKGMusculoMeta, calculaKGOsseo, calculaKGOsseoMeta, calculaKGResidual, calculaKGResidualMeta, calculaPorcentagemGordura, calculaPorcentagemMassaMagra, calculaPorcentagemMCM, calculaPorcentagemMCMMeta, calculaPorcentagemMusculo, calculaPorcentagemMusculoMeta, calculaPorcentagemOsseo, calculaPorcentagemOsseoMeta, calculaPorcentagemResidual, calculaPorcentagemResidualMeta, calcularIdade, formatarData, getAreaMagraGorda, getIMC, getPesoIMCMeta, getReferenciaIMC, getReferenciaIMCMetas, getReferenciaKGGordura, getReferenciaPorcentagemGordura, ordenaAvalicaoData, verificaCamposProtocolo } from "../utils";
import { useRecoilState } from "recoil";
import { stateUsuario } from "../states/states";
import { getAvaliacoes } from "../api/aluno";
import { useQuery } from "react-query";
import ReactApexChart from "react-apexcharts";
import { OverlayTrigger, Tooltip } from "react-bootstrap";


function CompareAvaliacao() {
    const navigate = useNavigate();
    const location = useLocation();
    const [usuario] = useRecoilState(stateUsuario);

    const [avaliacao, setAvaliacao] = useState({});
    const [avaliacoesComparacao, setAvaliacoesComparacao] = useState([{}]);
    const [aluno, setAluno] = useState({});

    const { data: avaliacoes, refetch } = useQuery({
        queryKey: ['avaliacoes', aluno.cod_aluno],
        queryFn: () => getAvaliacoes(null, aluno.cod_aluno),
        initialData: [],
        enabled: !!aluno.cod_aluno,
    });

    useEffect(() => {
        if (!avaliacoes) return;
        const avaliacaoRecebida = location.state?.avaliacao;
        const alunoRecebido = location.state?.aluno;
        avaliacaoRecebida ? setAvaliacao(avaliacaoRecebida) :  navigate('/alunos');
        alunoRecebido ? setAluno(alunoRecebido) : navigate('/alunos');

        const indexAv = avaliacoes.findIndex((av) => av == avaliacaoRecebida);
        setAvaliacoesComparacao([{ ...avaliacaoRecebida, index: indexAv }, { ...avaliacaoRecebida, index: indexAv }, { ...avaliacaoRecebida, index: indexAv }]);
    }, [avaliacoes]);

    function selecionaAvaliacao(indexAv, indexComparacao) {
        setAvaliacoesComparacao(prev => prev.map((av, i) => i == indexComparacao ? avaliacoes[indexAv] : av));
    }

    if (!aluno) return <div>Carregando...</div>;

    return (
        <div className="container-fluid">
            <div className="card">
                <div className="card-header">
                    <div className="d-flex justify-content-between align-items-center">
                        <button onClick={() => navigate(-1)} className="btn btn-danger mb-3 me-3">
                            <i className="bi bi-arrow-left-circle me-2"></i> Voltar
                        </button>
                        
                        {/* <button onClick={imprimirResultados} className="btn btn-primary mb-3">
                            <i className="bi bi-printer me-2"></i> Imprimir
                        </button> */}
                    </div>
                </div>

                <div className="card-body px-0 px-sm-4">
                    <div className="row g-3 mb-5 justify-content-center align-items-center">
                        {avaliacoesComparacao.map((avComp, i) => (
                            <div className="col-md-3" key={i}>
                                <label className="form-label">Avaliação {i + 1}</label>
                                <select className="form-control" value={avComp?.index} onChange={e => selecionaAvaliacao(e.target.value, i)}>
                                    <option value={null}>Selecione uma avaliação</option>
                                    {avaliacoes.map((av, index) => (
                                        <option key={index} value={index}>{formatarData(av.data_avaliacao)}</option>
                                    ))}
                                </select>
                            </div>
                        ))}
                    </div>

                    <h4 className="mb-4 text-center">Comparação de Avaliações</h4>

                    {/* Exibe informações do aluno */}
                    <div className="mb-4">
                        <h5>Aluno: {aluno.nome_aluno || "Nome não disponível"}</h5>
                        <p><strong>Idade:</strong> {calcularIdade(aluno.data_nascimento_aluno)} anos</p>
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <h4>Composição corporal</h4>
                        </div>

                        <div className="card-body">
                            {/* Gráfico de Barras Comparativo */}
                            <div className="mb-4">
                                <GraficoNovoNPM aluno={aluno} avaliacoes={avaliacoes} />
                            </div>

                            <row className="row g-3 justify-content-around table-responsive">
                                <table id="basic-datatables" className="table table-sm table-striped table-hover table-responsive">
                                    <thead>
                                        <tr>
                                            <th>Parâmetro</th>
                                            <th>{avaliacoes[0]?.data_avaliacao ? formatarData(avaliacoes[0].data_avaliacao) : 'Selecione'}</th>
                                            <th></th>
                                            <th>{avaliacoes[1]?.data_avaliacao ? formatarData(avaliacoes[1].data_avaliacao) : 'Selecione'}</th>
                                            <th></th>
                                            <th>{avaliacoes[2]?.data_avaliacao ? formatarData(avaliacoes[2].data_avaliacao) : 'Selecione'}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            { label: 'Peso (kg)', key: 'peso' },
                                            { label: 'Músculo (%)', key: 'peso', func: calculaPorcentagemMusculo },
                                            { label: 'Músculo (kg)', key: 'peso', func: calculaKGMusculo },
                                            { label: 'Gordura (%)', key: 'peso', func: calculaPorcentagemGordura },
                                            { label: 'Gordura (kg)', key: 'peso', func: calculaKGGordura },
                                            { label: 'Massa Magra (%)', key: 'peso', func: calculaPorcentagemMassaMagra },
                                            { label: 'Massa Magra (kg)', key: 'peso', func: calculaKGMassaMagra },
                                        ].map(({ label, key, func }) => {
                                            const val1 = func && avaliacoes[0]?.cod_protocolo > 0 ? func(aluno, avaliacoes[0]) : (avaliacoes[0]?.[key] || 0);
                                            const val2 = func && avaliacoes[1]?.cod_protocolo > 0 ? func(aluno, avaliacoes[1]) : (avaliacoes[1]?.[key] || 0);
                                            const val3 = func && avaliacoes[2]?.cod_protocolo > 0 ? func(aluno, avaliacoes[2]) : (avaliacoes[2]?.[key] || 0);

                                            return (
                                            <tr key={key}>
                                                <td><strong>{label}</strong></td>
                                                <td>{val1 || 'Não informado'}</td>
                                                <th className={`${val2 - val1 > 0 ? 'text-success' : 'text-danger'}`}>
                                                    {val2 ? (val2 - val1).toFixed(2) : '-'}
                                                </th>
                                                <td>{val2 || 'Não informado'}</td>
                                                <th className={`${val3 - val2 > 0 ? 'text-success' : 'text-danger'}`}>
                                                    {val3 ? (val3 - val2).toFixed(2) : '-'}
                                                </th>
                                                <td>{val3 || 'Não informado'}</td>
                                            </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </row>
                        </div>
                    </div>
                    
                    <AreaMagraGorda avaliacao={avaliacao} avaliacoes={avaliacoesComparacao} />
                    <SimetriaMembro avaliacao={avaliacao} avaliacoes={avaliacoesComparacao} />
                    <Dobras avaliacao={avaliacao} avaliacoes={avaliacoesComparacao} />
                    <Diametro avaliacao={avaliacao} avaliacoes={avaliacoesComparacao} />
                    <Imagens avaliacao={avaliacao} avaliacoes={avaliacoesComparacao} />
                </div>
            </div>
        </div>
    );
}

function Imagens({ avaliacao, avaliacoes }) {
    const [tipoColagem, setTipoColagem] = useState(2);

    const [indexImg, setIndexImg] = useState([0, 0, 0]);

    function changeIndex(value, index) {
        setIndexImg(prev => prev.map((v, i) =>
            index == i ? Number(value) : v
        ));
    }
    
    const handleSalvarColagem = async () => {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
    
            // Carregar as imagens e obter seus tamanhos
            const images = await Promise.all(
                avaliacoes.slice(0, tipoColagem).map(async (av, index) => {
                    const img = new Image();
                    img.crossOrigin = 'anonymous'; // Habilita CORS
                    img.src = av.imagem[indexImg[index]]?.url_imagem || '';
    
                    return new Promise((resolve, reject) => {
                        img.onload = () => resolve({ img, width: img.width, height: img.height });
                        img.onerror = () => reject(new Error(`Erro ao carregar imagem ${index} ${av.imagem[indexImg[index]]?.url_imagem}`));
                    });
                })
            );
    
            // Encontrar as menores dimensões de largura e altura
            const minWidth = Math.min(...images.map(({ width }) => width));
            const minHeight = Math.min(...images.map(({ height }) => height));
    
            // Calcular a largura total do canvas baseado no número de imagens
            const totalWidth = images.length * minWidth;
            canvas.width = totalWidth;
            canvas.height = minHeight;
    
            // Desenhar as imagens no canvas, redimensionando proporcionalmente
            let currentX = 0;
            images.forEach(({ img, width, height }) => {
                const scale = Math.min(minWidth / width, minHeight / height); // Redimensionamento proporcional
                const newWidth = width * scale;  // Nova largura proporcional
                const newHeight = height * scale; // Nova altura proporcional
    
                const xOffset = (minWidth - newWidth) / 2; // Centraliza a imagem na largura
                const yOffset = (minHeight - newHeight) / 2; // Centraliza a imagem na altura
    
                // Desenhar imagem redimensionada no canvas
                ctx.drawImage(img, currentX + xOffset, yOffset, newWidth, newHeight);
                currentX += minWidth; // Mover para a próxima posição
            });
    
            // Gerar imagem do canvas
            const dataURL = canvas.toDataURL('image/png');
    
            // Criar link para download
            const link = document.createElement('a');
            link.href = dataURL;
            link.download = 'colagem.png';
            link.click();
    
        } catch (error) {
            console.error('Erro ao salvar a colagem:', error);
            alert('Ocorreu um erro ao salvar a colagem. Verifique as imagens e tente novamente.');
        }
    };

    return (
        <div className="card">
            <div className="card-header d-flex gap-3 row g-3">
                <h4>Comparação visual</h4>

                <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
                    <input type="radio" className="btn-check" name="btnradio" id="btnradio-2" checked={tipoColagem == 2} onClick={() => setTipoColagem(2)} />
                    <label className="btn btn-outline-primary" htmlFor="btnradio-2">2 Fotos</label>

                    <input type="radio" className="btn-check" name="btnradio" id="btnradio-3" checked={tipoColagem == 3} onClick={() => setTipoColagem(3)} />
                    <label className="btn btn-outline-primary" htmlFor="btnradio-3">3 Fotos</label>
                </div>

                <button className="btn btn-info" onClick={handleSalvarColagem}>Salvar</button>
            </div>
            
            <div className="card-body">
                <div className={`row g-3 ${tipoColagem === 3 ? 'row-cols-3' : 'row-cols-2'}`}>
                    {avaliacoes?.slice(0, tipoColagem).map((av, index) => (
                        <div key={index} className="col-md-3">
                            <div className="text-center">
                                <div>
                                    <label className="form-label fw-bold">Imagem</label>
                                    <select className="form-control" onChange={e => changeIndex(e.target.value, index)}>
                                        {av?.imagem?.map((img, i) => (
                                            <option key={i} value={i}>{img.descricao_imagem}</option>
                                        ))}
                                    </select>
                                </div>
                                {av?.imagem && (
                                    <img
                                        src={av?.imagem[indexImg[index]]?.url_imagem || ''}
                                        style={{ width: '100%', border: '1px solid black' }}
                                    />
                                )}
                                <h4 className="mt-2">{av?.descricao_imagem}</h4>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

function AreaMagraGorda({ avaliacao, avaliacoes }) {
    const [resultados, setResultados] = useState({ braco: [], coxa: [], panturrilha: [] });

    useEffect(() => {
        const arrayResultados = [];

        //Cria um array com os resultados de todas avaliações
        {avaliacoes.map((av) => arrayResultados.push(getAreaMagraGorda(av)))}

        // Criar estrutura com arrays vazios para cada segmento
        const groupedResults = {
            braco: [],
            coxa: [],
            panturrilha: []
        };
        
        // Iterar sobre os índices dos objetos dentro de cada avaliação
        for (let i = 0; i < 6; i++) { // Sempre há 6 itens em cada segmento
            ["braco", "coxa", "panturrilha"].forEach(segmento => {

                // Criar um novo objeto mantendo nome, campo e prefix, mas com array de valores
                groupedResults[segmento].push({
                    nome: arrayResultados[2]?.[segmento][i].nome || "",
                    campo: arrayResultados[2]?.[segmento][i].campo || "",
                    prefix: arrayResultados[2]?.[segmento][i].prefix || "",

                    // Valores
                    valor1: arrayResultados[0]?.[segmento]?.[i]?.valor || 0,
                    valor2: arrayResultados[1]?.[segmento]?.[i]?.valor || 0,
                    valor3: arrayResultados[2]?.[segmento]?.[i]?.valor || 0,

                    // Códigos das avaliações
                    cod_avaliacao1: avaliacoes[0]?.cod_avaliacao || 0,
                    cod_avaliacao2: avaliacoes[1]?.cod_avaliacao || 0,
                    cod_avaliacao3: avaliacoes[2]?.cod_avaliacao || 0,
                });
            });
        }

        setResultados(groupedResults);
    }, [avaliacoes]);

    return (
        <div className="card table-responsive">
            <div className="card-header">
                <h4>Área Magra/Gorda</h4>
            </div>

            <div className="card-body">
                <row className="row g-3 justify-content-around">
                    <table id="basic-datatables" className="table table-sm table-striped table-hover">
                        <tbody>
                            <tr>
                                <th></th>
                                <th>{avaliacoes[0]?.data_avaliacao ? formatarData(avaliacoes[0].data_avaliacao) : 'Selecione'}</th>
                                <th></th>
                                <th>{avaliacoes[1]?.data_avaliacao ? formatarData(avaliacoes[1].data_avaliacao) : 'Selecione'}</th>
                                <th></th>
                                <th>{avaliacoes[2]?.data_avaliacao ? formatarData(avaliacoes[2].data_avaliacao) : 'Selecione'}</th>
                            </tr>
                            <tr>
                                <h6>Braço</h6>
                            </tr>
                            {resultados?.braco?.map((campo, id) => {
                                // if (!campo.cod_avaliacao1) return <tr key={id}><th>Selecione a avaliação 1</th></tr>

                                return (
                                    <tr key={id}>
                                        <th>{campo.nome}</th>
                                        {campo.cod_avaliacao1 ? <td>{campo.valor1} {campo.prefix}</td> : <td>-</td>}
                                        <th className={`${campo.valor2 - campo.valor1 > 0 ? 'text-success' : 'text-danger'}`}>
                                            {(campo.valor2 - campo.valor1).toFixed(2)}
                                        </th>
                                        {campo.cod_avaliacao2 ? <td>{campo.valor2} {campo.prefix}</td> : <td>-</td>}
                                        <th className={`${campo.valor3 - campo.valor2 > 0 ? 'text-success' : 'text-danger'}`}>
                                            {(campo.valor3 - campo.valor2).toFixed(2)}
                                        </th>
                                        <td>{campo.valor3} {campo.prefix}</td>
                                    </tr>
                                )
                            })}
                            <tr>
                                <h6>Coxa</h6>
                            </tr>
                            {resultados?.coxa?.map((campo, id) => (
                                <tr key={id}>
                                    <th>{campo.nome}</th>
                                    {campo.cod_avaliacao1 ? <td>{campo.valor1} {campo.prefix}</td> : <td>-</td>}
                                    <th className={`${campo.valor2 - campo.valor1 > 0 ? 'text-success' : 'text-danger'}`}>
                                        {(campo.valor2 - campo.valor1).toFixed(2)}
                                    </th>
                                    {campo.cod_avaliacao2 ? <td>{campo.valor2} {campo.prefix}</td> : <td>-</td>}
                                    <th className={`${campo.valor3 - campo.valor2 > 0 ? 'text-success' : 'text-danger'}`}>
                                        {(campo.valor3 - campo.valor2).toFixed(2)}
                                    </th>
                                    <td>{campo.valor3} {campo.prefix}</td>
                                </tr>
                            ))}
                            <tr>
                                <h6>Panturrilha</h6>
                            </tr>
                            {resultados?.panturrilha?.map((campo, id) => (
                                <tr key={id}>
                                    <th>{campo.nome}</th>
                                    {campo.cod_avaliacao1 ? <td>{campo.valor1} {campo.prefix}</td> : <td>-</td>}
                                    <th className={`${campo.valor2 - campo.valor1 > 0 ? 'text-success' : 'text-danger'}`}>
                                        {(campo.valor2 - campo.valor1).toFixed(2)}
                                    </th>
                                    {campo.cod_avaliacao2 ? <td>{campo.valor2} {campo.prefix}</td> : <td>-</td>}
                                    <th className={`${campo.valor3 - campo.valor2 > 0 ? 'text-success' : 'text-danger'}`}>
                                        {(campo.valor3 - campo.valor2).toFixed(2)}
                                    </th>
                                    <td>{campo.valor3} {campo.prefix}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </row>
            </div>
        </div>
    )
}

function SimetriaMembro({ avaliacao, avaliacoes }) {
    const tooltipAssimetria = (
        <Tooltip id="tooltip">
            <div>O valor será destacado em vermelho quando ultrapassar 1 cm, sinalizando a necessidade de ajuste.</div>
        </Tooltip>
    );

    return (
        <div className="card table-responsive">
            <div className="card-header d-flex justify-between">
                <h4>Simetria dos membros (cm)</h4>
                <OverlayTrigger placement="bottom" overlay={tooltipAssimetria}>
                    <i className='bi bi-question-circle text-danger ms-2'></i>
                </OverlayTrigger>
            </div>
            <div className="card-body">
                <table id="basic-datatables" className="table table-sm table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Membro</th>
                            <th>{avaliacoes[0]?.data_avaliacao ? formatarData(avaliacoes[0].data_avaliacao) : 'Selecione'}</th>
                            <th></th>
                            <th></th>
                            <th>{avaliacoes[1]?.data_avaliacao ? formatarData(avaliacoes[1].data_avaliacao) : 'Selecione'}</th>
                            <th></th>
                            <th></th>
                            <th>{avaliacoes[2]?.data_avaliacao ? formatarData(avaliacoes[2].data_avaliacao) : 'Selecione'}</th>
                        </tr>
                        <tr>
                            <th></th>
                            {avaliacoes.map((_, index) => (
                                <>
                                    <th key={`dir-${index}`}>Direito</th>
                                    <th key={`dif-${index}`}>Diferença</th>
                                    <th key={`esq-${index}`}>Esquerdo</th>
                                </>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {['Braço', 'Braço contraído', 'Antebraço', 'Coxa'].map((membro, idx) => {
                            const keys = [
                                ['braco_relaxado_direito', 'braco_relaxado_esquerdo'],
                                ['braco_contraido_direito', 'braco_contraido_esquerdo'],
                                ['antebraco_direito', 'antebraco_esquerdo'],
                                ['coxa_direita', 'coxa_esquerda']
                            ];
                            return (
                                <tr key={idx}>
                                    <th>{membro}</th>
                                    {avaliacoes.map((av, index) => {
                                        const direito = av?.[keys[idx][0]] || '-';
                                        const esquerdo = av?.[keys[idx][1]] || '-';
                                        const diferenca = (direito && esquerdo && !isNaN(direito - esquerdo)) ? (direito - esquerdo).toFixed(2) : '-';
                                        return (
                                            <>
                                                <td key={`dir-${index}`}>{direito}</td>
                                                <td key={`dif-${index}`} className={`${diferenca >= 1 || diferenca <= -1 ? 'text-danger' : 'text-success'}`}>{diferenca}</td>
                                                <td key={`esq-${index}`}>{esquerdo}</td>
                                            </>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function Dobras({ avaliacao, avaliacoes }) {

    return (
        <div className="card no-print">
            <div className="card-header">
                <h4>Dobras Cutâneas (cm)</h4>
            </div>
            
            <div className="card-body">
                <row className="row g-3 justify-content-around">
                    <div className="table-responsive">
                        <table id="basic-datatables" className="table table-sm table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>Parâmetro</th>
                                    <th>{avaliacoes[0]?.data_avaliacao ? formatarData(avaliacoes[0].data_avaliacao) : 'Selecione'}</th>
                                    <th></th>
                                    <th>{avaliacoes[1]?.data_avaliacao ? formatarData(avaliacoes[1].data_avaliacao) : 'Selecione'}</th>
                                    <th></th>
                                    <th>{avaliacoes[2]?.data_avaliacao ? formatarData(avaliacoes[2].data_avaliacao) : 'Selecione'}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { label: 'Peitoral', key: 'peitoral' },
                                    { label: 'Bíceps', key: 'biciptal' },
                                    { label: 'Tríceps', key: 'triciptal' },
                                    { label: 'Subescapular', key: 'subescapular' },
                                    { label: 'Axilar Média', key: 'axilar_media' },
                                    { label: 'Abdominal', key: 'abdominal' },
                                    { label: 'Coxa', key: 'coxa' },
                                    { label: 'Supra Ilíaca', key: 'supra_iliaca' },
                                    { label: 'Supra Espinhal', key: 'supra_espinhal' },
                                    { label: 'Panturrilha', key: 'panturrilha' }
                                ].map(({ label, key }) => {
                                    const val1 = avaliacoes[0]?.[key] || 0;
                                    const val2 = avaliacoes[1]?.[key] || 0;
                                    const val3 = avaliacoes[2]?.[key] || 0;

                                    return (
                                    <tr key={key}>
                                        <td><strong>{label}</strong></td>
                                        <td>{val1 || 'Não informado'}</td>
                                        <th className={`${val2 - val1 > 0 ? 'text-success' : 'text-danger'}`}>
                                            {val2 ? (val2 - val1).toFixed(2) : '-'}
                                        </th>
                                        <td>{val2 || 'Não informado'}</td>
                                        <th className={`${val3 - val2 > 0 ? 'text-success' : 'text-danger'}`}>
                                            {val3 ? (val3 - val2).toFixed(2) : '-'}
                                        </th>
                                        <td>{val3 || 'Não informado'}</td>
                                    </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </row>
            </div>
        </div>
    )
}

function Diametro({ avaliacao, avaliacoes }) {
    return (
        <div className="card no-print">
            <div className="card-header">
                <h4>Diamêtros Osséos</h4>
            </div>

            <div className="card-body">
                <div className="row">
                    <div className="table-responsive">
                        <table id="basic-datatables" className="table table-sm table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>Parâmetro</th>
                                    <th>{avaliacoes[0]?.data_avaliacao ? formatarData(avaliacoes[0].data_avaliacao) : 'Selecione'}</th>
                                    <th></th>
                                    <th>{avaliacoes[1]?.data_avaliacao ? formatarData(avaliacoes[1].data_avaliacao) : 'Selecione'}</th>
                                    <th></th>
                                    <th>{avaliacoes[2]?.data_avaliacao ? formatarData(avaliacoes[2].data_avaliacao) : 'Selecione'}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { label: 'Biestilóide punho', key: 'biestiloide_punho' },
                                    { label: 'Biepicôndilo Umeral', key: 'biepicondilo_umeral' },
                                    { label: 'Biepicôndilo femoral', key: 'biepicondilo_femoral' },
                                ].map(({ label, key }) => {
                                    const val1 = avaliacoes[0]?.[key] || 0;
                                    const val2 = avaliacoes[1]?.[key] || 0;
                                    const val3 = avaliacoes[2]?.[key] || 0;

                                    return (
                                    <tr key={key}>
                                        <td><strong>{label}</strong></td>
                                        <td>{val1 || 'Não informado'}</td>
                                        <th className={`${val2 - val1 > 0 ? 'text-success' : 'text-danger'}`}>
                                            {val2 ? (val2 - val1).toFixed(2) : '-'}
                                        </th>
                                        <td>{val2 || 'Não informado'}</td>
                                        <th className={`${val3 - val2 > 0 ? 'text-success' : 'text-danger'}`}>
                                            {val3 ? (val3 - val2).toFixed(2) : '-'}
                                        </th>
                                        <td>{val3 || 'Não informado'}</td>
                                    </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

function GraficoNovoNPM({ aluno, avaliacoes }) {
    const [data, setData] = useState([]);
    const [seriesVisible, setSeriesVisible] = useState([]);

    useEffect(() => {
        var temp = [
            { name: "Massa Muscular", data: [], color: "var(--bs-success)" },
            { name: "Massa magra", data: [], color: "var(--bs-primary)" },
            { name: "Gordura", data: [], color: "var(--bs-danger)" },
            { name: "Osséo", data: [], color: "var(--bs-secondary)" },
            { name: "Residual", data: [], color: "var(--bs-warning)" },
        ];
        for (const av of ordenaAvalicaoData(avaliacoes)) {
            temp[0].data.push(Number(calculaKGMusculo(aluno, av)));
            temp[1].data.push(Number(calculaKGMassaMagra(aluno, av)));
            temp[2].data.push(Number(calculaKGGordura(aluno, av)));
            temp[3].data.push(Number(calculaKGOsseo(av)));
            temp[4].data.push(Number(calculaKGResidual(aluno, av)));
        }
        setData(temp);
        setSeriesVisible(temp.reduce((acc, serie) => ({ ...acc, [serie.name]: true }), {}));
    }, [avaliacoes]);

    // Função para calcular o valor máximo dentro dos dados das séries visíveis
    const getMaxValue = () => {
        const visibleData = data.filter((serie) => seriesVisible[serie.name]);  // Filtra as séries visíveis
        const allData = visibleData.flatMap((serie) => serie.data);  // Extrai todos os dados das séries visíveis
        return Math.max(...allData);  // Retorna o maior valor
    };

    // Opções do gráfico
    const options = {
        chart: { fontFamily: "inherit", type: "line", height: 300, toolbar: { show: false }, offsetX: -15 },
        legend: { show: false },
        dataLabels: { enabled: false },
        stroke: { curve: "smooth", width: 2 },
        grid: { borderColor: "var(--bs-border-color)", strokeDashArray: 4, yaxis: { lines: { show: true } } },
        markers: { size: 4 },
        xaxis: { categories: ordenaAvalicaoData(avaliacoes).reduce((arr, av, i) => [...arr, av.data_avaliacao], []), labels: { style: { fontSize: "12px", colors: "#a1aab2" } } },
        yaxis: { max: getMaxValue() + 10, min: 0, tickAmount: 4, labels: { style: { fontSize: "12px", colors: "#a1aab2" } } },
        tooltip: { theme: "dark", shared: true, intersect: false },
        colors: data.map((serie) => serie.color), // Cores fixas
    };
  
    // Dados do gráfico filtrados pelas séries visíveis
    const series = data.filter((serie) => seriesVisible[serie.name]);

    // Alterna a visibilidade das séries ao marcar/desmarcar os checkboxes
    const toggleSeries = (event) => {
        const { value, checked } = event.target;
        setSeriesVisible((prev) => ({ ...prev, [value]: checked }));
    };
  
    return (
        <div className="col-lg-12">
            <div className="card">
                <div className="card-body">
                    <div className="d-md-flex align-items-center justify-content-between mb-4">
                        <h5 className="card-title mb-0">Evolução</h5>
                        {/* <select className="form-select w-auto fw-semibold bg-light border-0 rounded-pill mt-2 mt-md-0">
                            <option value="1">Last 7 days</option>
                            <option value="2">Last 3 days</option>
                            <option value="3">Last 1 day</option>
                        </select> */}
                    </div>
        
                    {/* Checkboxes em uma única linha */}
                    <div className="legend mb-3 d-flex flex-wrap gap-3">
                    {data.map((serie) => (
                        <div key={serie.name} className="form-check form-check-inline">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id={serie.name}
                            value={serie.name}
                            checked={seriesVisible[serie.name]}
                            onChange={toggleSeries}
                            style={{ backgroundColor: serie.color, borderColor: serie.color }} // Cor fixa do checkbox
                        />
                        <label className="form-check-label" htmlFor={serie.name}>
                            {serie.name}
                        </label>
                        </div>
                    ))}
                    </div>
        
                    {/* Gráfico */}
                    <div style={{ height: "300px" }}>
                        <ReactApexChart options={options} series={series} type="line" height={300} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CompareAvaliacao;