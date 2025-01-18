import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { calculaDensidade, calculaKGGordura, calculaKGMassaMagra, calculaKGMCM, calculaKGMusculo, calculaKGOsseo, calculaKGResidual, calculaPorcentagemGordura, calculaPorcentagemMassaMagra, calculaPorcentagemMCM, calculaPorcentagemMusculo, calculaPorcentagemOsseo, calculaPorcentagemResidual, calcularIdade, getAreaMagraGorda, getIMC, verificaCamposProtocolo } from "../utils";
import { useRecoilState } from "recoil";
import { stateUsuario } from "../states/states";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";

function CompareAvaliacao() {
    const navigate = useNavigate();
    const location = useLocation();
    const [usuario] = useRecoilState(stateUsuario);

    const [avaliacao, setAvaliacao] = useState({});
    const [avaliacao1, setAvaliacao1] = useState({});
    const [avaliacao2, setAvaliacao2] = useState({});
    const [avaliacao3, setAvaliacao3] = useState({});
    const [avaliacoes, setAvaliacoes] = useState([]);
    const [aluno, setAluno] = useState({});

    useEffect(() => {
        const avaliacaoRecebida = location.state?.avaliacao;
        const alunoRecebido = location.state?.aluno;
        avaliacaoRecebida ? setAvaliacao(avaliacaoRecebida) : navigate('/alunos');
        avaliacaoRecebida ? setAvaliacao2(avaliacaoRecebida) : navigate('/alunos');
        avaliacaoRecebida ? setAvaliacao3(avaliacaoRecebida) : navigate('/alunos');
        
        alunoRecebido ? setAluno(alunoRecebido) : navigate('/alunos');
        if (alunoRecebido.avaliacao) {
            //Seta a lista de todas avaliações
            setAvaliacoes(alunoRecebido.avaliacao);
            //Seta a primeira avaliação
            setAvaliacao1(alunoRecebido.avaliacao[alunoRecebido.avaliacao.length - 1]);
            //Seta a penultima avaliação
            let indexAtual = alunoRecebido.avaliacao.findIndex((v) => v === avaliacaoRecebida);
            setAvaliacao3(alunoRecebido.avaliacao[indexAtual + 1]);
        }
    }, []);

    function selecionaAvaliacao(index, numero) {
        if (numero === 1) setAvaliacao1({ ...avaliacoes[index], index });
        if (numero === 2) setAvaliacao2({ ...avaliacoes[index], index });
        if (numero === 3) setAvaliacao3({ ...avaliacoes[index], index });
    }

    if (!avaliacao || !aluno) {
        return <div>Carregando...</div>;
    }

    console.log(avaliacao1, avaliacao2, avaliacao3);
    

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
                    <div className="row g-3 mb-5 justify-content-center">
                        <div className="col-md-3">
                            <label className="form-label">Avaliação 1</label>
                            <select value={avaliacao1?.index} onChange={e => selecionaAvaliacao(e.target.value, 1)} className="form-control">
                                <option value="">Selecione uma avaliação</option>
                                {avaliacoes.map((av, index) => (
                                    <option key={index} value={index}>{av.data_avaliacao}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Avaliação 2</label>
                            <select value={avaliacao2?.index} onChange={e => selecionaAvaliacao(e.target.value, 2)} className="form-control">
                                <option value="">Selecione uma avaliação</option>
                                {avaliacoes.map((av, index) => (
                                    <option key={index} value={index}>{av.data_avaliacao}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Avaliação 3</label>
                            <select value={avaliacao3?.index} onChange={e => selecionaAvaliacao(e.target.value, 3)} className="form-control">
                                <option value="">Selecione uma avaliação</option>
                                {avaliacoes.map((av, index) => (
                                    <option key={index} value={index}>{av.data_avaliacao}</option>
                                ))}
                            </select>
                        </div>
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
                                <ResponsiveLine
                                    data={[
                                        {
                                            id: 'Gordura',
                                            data: avaliacoes.map((av, index) => ({
                                                x: `${av.data_avaliacao}`,
                                                y: calculaKGGordura(aluno, av),
                                            })),
                                        },
                                        {
                                            id: 'Massa Magra',
                                            data: avaliacoes.map((av, index) => ({
                                                x: `${av.data_avaliacao}`,
                                                y: calculaKGMassaMagra(aluno, av),
                                            })),
                                        },
                                        {
                                            id: 'Músculo',
                                            data: avaliacoes.map((av, index) => ({
                                                x: `${av.data_avaliacao}`,
                                                y: calculaKGMusculo(aluno, av),
                                            })),
                                        },
                                        {
                                            id: 'Osséo',
                                            data: avaliacoes.map((av, index) => ({
                                                x: `${av.data_avaliacao}`,
                                                y: calculaKGOsseo(av),
                                            })),
                                        },
                                        {
                                            id: 'Residual',
                                            data: avaliacoes.map((av, index) => ({
                                                x: `${av.data_avaliacao}`,
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
                                                <td>{av.data_avaliacao}</td>
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

                    <AreaMagraGorda avaliacao={avaliacao} avaliacoes={[avaliacao1, avaliacao2, avaliacao3]} />
                    <SimetriaMembro avaliacao={avaliacao} avaliacoes={[avaliacao1, avaliacao2, avaliacao3]} />
                    <Dobras avaliacao={avaliacao} avaliacoes={[avaliacao1, avaliacao2, avaliacao3]} />
                    <Diametro avaliacao={avaliacao} avaliacoes={[avaliacao1, avaliacao2, avaliacao3]} />
                    <Imagens avaliacao={avaliacao} avaliacoes={[avaliacao1, avaliacao2, avaliacao3]} />
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
    // const [resultados, setResultados] = useState({ braco: [], coxa: [], panturrilha: [] });
    const [resultados, setResultados] = useState([]);

    useEffect(() => {
        var temp = [];
        for (const av of avaliacoes) {
            const resp = getAreaMagraGorda(av);
            temp.push(temp[av?.cod_avaliacao] = resp);
        }
        setResultados(temp);
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
                                <th>Avaliação 1</th>
                                <th>Avaliação 2</th>
                                <th>Avaliação 3</th>
                            </tr>
                        </thead>

                        <tbody>
                            {avaliacoes.map((av, index) => (
                                <tr key={index}>
                                    {/* <th>{campo.nome}</th>
                                    <th>{campo.valor} {campo.prefix}</th> */}
                                </tr>
                            ))}
                            {/* {resultados[av.cod_avaliacao]?.braco?.map((campo, id) => (
                                <tr key={id}>
                                    <th>{campo.nome}</th>
                                    <th>{campo.valor} {campo.prefix}</th>
                                </tr>
                            ))}
                            {resultados[av.cod_avaliacao]?.coxa?.map((campo, id) => (
                                <tr key={id}>
                                    <th>{campo.nome}</th>
                                    <th>{campo.valor} {campo.prefix}</th>
                                </tr>
                            ))}
                            {resultados[av.cod_avaliacao]?.panturrilha?.map((campo, id) => (
                                <tr key={id}>
                                    <th>{campo.nome}</th>
                                    <th>{campo.valor} {campo.prefix}</th>
                                </tr>
                            ))} */}
                        </tbody>
                    </table>
                </div>
                {/* {avaliacoes.map((av, index) => {
                    if (!av?.cod_avaliacao) return (
                        <div key={index} className="col-md-4">
                            <h4>Selecione avaliação {index + 1}</h4>
                        </div>
                    )
                    return (
                        <div key={index} className="col-md-4 table-responsive">
                            <h4>Avaliação {index + 1}</h4>
                            <table id="basic-datatables" className="table table-sm table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th>Avaliação 1</th>
                                        <th>Avaliação 2</th>
                                        <th>Avaliação 3</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {resultados[av.cod_avaliacao]?.braco?.map((campo, id) => (
                                        <tr key={id}>
                                            <th>{campo.nome}</th>
                                            <th>{campo.valor} {campo.prefix}</th>
                                        </tr>
                                    ))}
                                    {resultados[av.cod_avaliacao]?.coxa?.map((campo, id) => (
                                        <tr key={id}>
                                            <th>{campo.nome}</th>
                                            <th>{campo.valor} {campo.prefix}</th>
                                        </tr>
                                    ))}
                                    {resultados[av.cod_avaliacao]?.panturrilha?.map((campo, id) => (
                                        <tr key={id}>
                                            <th>{campo.nome}</th>
                                            <th>{campo.valor} {campo.prefix}</th>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                })} */}
            </div>
        </div>
    )
}

function SimetriaMembro({ avaliacao, avaliacoes }) {
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
                <h4>Simetria dos membros (cm)</h4>
            </div>

            <div className="card-body">
                <div className="row justify-content-around">
                    {avaliacoes.map((av, index) => {
                        if (!av?.cod_avaliacao) return (
                            <div key={index} className="col-md-4">
                                <h4>Selecione avaliação {index + 1}</h4>
                            </div>
                        )
                        return (
                            <div key={index} className="col-md-4">
                                <h4>Avaliação {index + 1}</h4>
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
                                            <th>Braço</th>
                                            <th>{av.braco_relaxado_direito || '-'}</th>
                                            <th
                                                className={getDifferenceClass(av.braco_relaxado_esquerdo - av.braco_relaxado_direito)}
                                            >{(av.braco_relaxado_esquerdo - av.braco_relaxado_direito).toFixed(2) || '-'}</th>
                                            <th>{av.braco_relaxado_esquerdo || '-'}</th>
                                        </tr>
                                        <tr>
                                            <th>Braço contraido</th>
                                            <th>{av.braco_contraido_direito || '-'}</th>
                                            <th
                                                className={getDifferenceClass(av.braco_contraido_direito - av.braco_contraido_esquerdo)}
                                            >{(av.braco_contraido_direito - av.braco_contraido_esquerdo).toFixed(2) || '-'}</th>
                                            <th>{av.braco_contraido_esquerdo || '-'}</th>
                                        </tr>
                                        <tr>
                                            <th>Antebraço</th>
                                            <th>{av.antebraco_direito || '-'}</th>
                                            <th
                                                className={getDifferenceClass(av.antebraco_direito - av.antebraco_esquerdo)}
                                            >{(av.antebraco_direito - av.antebraco_esquerdo).toFixed(2) || '-'}</th>
                                            <th>{av.antebraco_esquerdo || '-'}</th>
                                        </tr>
                                        <tr>
                                            <th>Coxa</th>
                                            <th>{av.coxa_direita || '-'}</th>
                                            <th
                                                className={getDifferenceClass(av.coxa_direita - av.coxa_esquerda)}
                                            >{(av.coxa_direita - av.coxa_esquerda).toFixed(2) || '-'}</th>
                                            <th>{av.coxa_esquerda || '-'}</th>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )
                    })}
                </div>
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
                    {avaliacoes.map((av, index) => {
                        if (!av?.cod_avaliacao) return (
                            <div key={index} className="col-md-4">
                                <h4>Selecione avaliação {index + 1}</h4>
                            </div>
                        )
                        return (
                            <div key={index} className="col-md-3">
                                <h4>Avaliação {index + 1}</h4>
                                <table id="basic-datatables" className="table table-sm table-striped table-hover">
                                    {/* <thead>
                                        <tr>
                                            <th>Dobra</th>
                                        </tr>
                                    </thead> */}

                                    <tbody>
                                        <tr>
                                            <th><strong>Peitoral:</strong></th>
                                            <th>{av.peitoral || 'Não informado'}</th>
                                        </tr>
                                        <tr>
                                            <th><strong>Bíceps:</strong></th>
                                            <th>{av.biciptal || 'Não informado'}</th>
                                        </tr>
                                        <tr>
                                            <th><strong>Tríceps:</strong></th>
                                            <th>{av.triciptal || 'Não informado'}</th>
                                        </tr>
                                        <tr>
                                            <th><strong>Subescapular:</strong></th>
                                            <th>{av.subescapular || 'Não informado'}</th>
                                        </tr>
                                        <tr>
                                            <th><strong>Axilar Média:</strong></th>
                                            <th>{av.axilar_media || 'Não informado'}</th>
                                        </tr>
                                        <tr>
                                            <th><strong>Abdominal:</strong></th>
                                            <th>{av.abdominal || 'Não informado'}</th>
                                        </tr>
                                        <tr>
                                            <th><strong>Coxa:</strong></th>
                                            <th>{av.coxa || 'Não informado'}</th>
                                        </tr>
                                        <tr>
                                            <th><strong>Supra Ilíaca:</strong></th>
                                            <th>{av.supra_iliaca || 'Não informado'}</th>
                                        </tr>
                                        <tr>
                                            <th><strong>Supra Espinhal:</strong></th>
                                            <th>{av.supra_espinhal || 'Não informado'}</th>
                                        </tr>
                                        <tr>
                                            <th><strong>Panturrilha:</strong></th>
                                            <th>{av.panturrilha || 'Não informado'}</th>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )
                    })}

                    {/* <div className="mt-3 col-md-3">
                        <img className="img-fluid" src="/assets/images/app/dobras.png" />
                    </div> */}
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
                    {avaliacoes.map((av, index) => {
                        if (!av?.cod_avaliacao) return (
                            <div key={index} className="col-md-4">
                                <h4>Selecione avaliação {index + 1}</h4>
                            </div>
                        )
                        return (
                        <div key={index} className="col-md-3">
                            <h4>Avaliação {index + 1}</h4>
                            <table id="basic-datatables" className="table table-sm table-striped table-hover">
                                {/* <thead>
                                    <tr>
                                        <th>Diamêtro</th>
                                    </tr>
                                </thead> */}

                                <tbody>
                                    <tr>
                                        <th><strong>Biestilóide punho:</strong></th>
                                        <th>{av.biestiloide_punho || '-'}</th>
                                    </tr>
                                    <tr>
                                        <th><strong>Biepicôndilo Umeral:</strong></th>
                                        <th>{av.biestiloide_punho || '-'}</th>
                                    </tr>
                                    <tr>
                                        <th><strong>Biepicôndilo femoral:</strong></th>
                                        <th>{av.biepicondilo_femoral || '-'}</th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default CompareAvaliacao;