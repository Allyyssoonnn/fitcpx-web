import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { calculaDensidade, calculaKGGordura, calculaKGMassaMagra, calculaKGMCM, calculaKGMCMMeta, calculaKGMusculo, calculaKGMusculoMeta, calculaKGOsseo, calculaKGOsseoMeta, calculaKGResidual, calculaKGResidualMeta, calculaPorcentagemGordura, calculaPorcentagemMassaMagra, calculaPorcentagemMCM, calculaPorcentagemMCMMeta, calculaPorcentagemMusculo, calculaPorcentagemMusculoMeta, calculaPorcentagemOsseo, calculaPorcentagemOsseoMeta, calculaPorcentagemResidual, calculaPorcentagemResidualMeta, calcularIdade, formatarData, getAreaMagraGorda, getIMC, getPesoIMCMeta, getReferenciaIMC, getReferenciaIMCMetas, getReferenciaKGGordura, getReferenciaPorcentagemGordura, verificaCamposProtocolo } from "../utils";
import { useRecoilState } from "recoil";
import { stateUsuario } from "../states/states";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";

function CompareAvaliacao() {
    const navigate = useNavigate();
    const location = useLocation();
    const [usuario] = useRecoilState(stateUsuario);

    const [avaliacao, setAvaliacao] = useState({});
    const [avaliacoesComparacao, setAvaliacoesComparacao] = useState([{}]);
    const [aluno, setAluno] = useState({});
    const [avaliacoes, setAvaliacoes] = useState([]);

    useEffect(() => {
        const avaliacaoRecebida = location.state?.avaliacao;
        const alunoRecebido = location.state?.aluno;
        avaliacaoRecebida ? setAvaliacao(avaliacaoRecebida) :  navigate('/alunos');
        alunoRecebido ? setAluno(alunoRecebido) : navigate('/alunos');
        
        if (alunoRecebido.avaliacao) {
            const indexAv = alunoRecebido.avaliacao.findIndex((av) => av == avaliacaoRecebida);
            //Seta avaliação selecionada para a terceira
            // setAvaliacoesComparacao([{}, {}, { ...avaliacaoRecebida, index: indexAv }]);
            setAvaliacoesComparacao([{ ...avaliacaoRecebida, index: indexAv }, { ...avaliacaoRecebida, index: indexAv }, { ...avaliacaoRecebida, index: indexAv }]);
            //Seta a lista de todas avaliações
            setAvaliacoes(alunoRecebido.avaliacao);
            //Seta a primeira avaliação
            // setAvaliacao1(alunoRecebido.avaliacao[alunoRecebido.avaliacao.length - 1]);
            //Seta a penultima avaliação
            // let indexAtual = alunoRecebido.avaliacao.findIndex((v) => v === avaliacaoRecebida);
            // setAvaliacao3(alunoRecebido.avaliacao[indexAtual + 1]);
        }
    }, []);

    function selecionaAvaliacao(indexAv, indexComparacao) {
        console.log(indexAv, indexComparacao);
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

                <div className="card-body">
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
                            <div style={{ height: 400 }} className="mb-4">
                                <Grafico aluno={aluno} avaliacoes={avaliacoes} />
                            </div>

                            {/* Tabela Comparativa */}
                            <div className="table-responsive">
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Avaliação</th>
                                            <th>Gordura (kg)</th>
                                            <th>Massa Magra (kg)</th>
                                            <th>Músculo (kg)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {avaliacoes.map((av, index) => (
                                            <tr key={index}>
                                                <td>{formatarData(av.data_avaliacao)}</td>
                                                <td>{calculaKGGordura(aluno, av)}</td>
                                                <td>{calculaKGMassaMagra(aluno, av)}</td>
                                                <td>{calculaKGMusculo(aluno, av)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
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
            <div className="card-header d-flex gap-3">
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
        <div className="card">
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
    const getDifferenceClass = (diff) => {
        return diff > 1 ? 'bg-danger text-white' : '';
    };

    return (
        <div className="card table-responsive">
            <div className="card-header">
                <h4>Simetria dos membros (cm)</h4>
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
                                                <td key={`dif-${index}`} className={`${diferenca > 0 ? 'text-success' : 'text-danger'}`}>{diferenca}</td>
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

function Grafico({ aluno, avaliacoes }) {
    return (
        <ResponsiveLine
            data={[
                {
                    id: 'Gordura',
                    data: avaliacoes.map((av, index) => ({
                        x: `${formatarData(av.data_avaliacao)}`,
                        y: calculaKGGordura(aluno, av),
                    })),
                },
                {
                    id: 'Massa Magra',
                    data: avaliacoes.map((av, index) => ({
                        x: `${formatarData(av.data_avaliacao)}`,
                        y: calculaKGMassaMagra(aluno, av),
                    })),
                },
                {
                    id: 'Músculo',
                    data: avaliacoes.map((av, index) => ({
                        x: `${formatarData(av.data_avaliacao)}`,
                        y: calculaKGMusculo(aluno, av),
                    })),
                },
                {
                    id: 'Osséo',
                    data: avaliacoes.map((av, index) => ({
                        x: `${formatarData(av.data_avaliacao)}`,
                        y: calculaKGOsseo(av),
                    })),
                },
                {
                    id: 'Residual',
                    data: avaliacoes.map((av, index) => ({
                        x: `${formatarData(av.data_avaliacao)}`,
                        y: calculaKGResidual(aluno, av),
                    })),
                },
            ]}
            margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{
                type: 'linear',
                min: 'auto',
                max: 'auto',
                stacked: false,
                reverse: false,
            }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
                orient: 'bottom',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Avaliações',
                legendOffset: 36,
                legendPosition: 'middle',
            }}
            axisLeft={{
                orient: 'left',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'KG',
                legendOffset: -40,
                legendPosition: 'middle',
            }}
            colors={{ scheme: 'nivo' }}
            pointSize={10}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[
                {
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
                    symbolShape: 'circle',
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemOpacity: 1,
                            },
                        },
                    ],
                },
            ]}
        />        
    )
}

export default CompareAvaliacao;