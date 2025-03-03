import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getExercicios, getTreinos, setSessao } from "../api/treino";
import { stateUsuario } from "../states/states";
import { useRecoilState } from "recoil";
import { useQuery } from "react-query";
import AutoComplete from "../components/autoComplete";
import { arrayBorders } from "../utils";

function PlanilhaTreino() {
    const [usuario] = useRecoilState(stateUsuario);
    const navigate = useNavigate();

    const [alunos, setAlunos] = useState([]);
    const [indexAluno, setIndexAluno] = useState(0);
    const [tema, setTema] = useState(localStorage.getItem('tema') ?? 'light');

    const { data: exercicios, refetch } = useQuery({
        queryKey: ['exercicios', usuario.cod_usuario],
        queryFn: () => getExercicios(usuario.cod_usuario),
        initialData: [],
    });

    useEffect(() => {
        const alunosCache = JSON.parse(localStorage.getItem('planilhatreino'));
        setAlunos(alunosCache.map((aluno) => ({ ...aluno, indexTreino: 0, indexSessao: 0 })));
    }, []);

    function alteraTema() {
        const novoTema = tema === 'light' ? 'dark' : 'light';
        localStorage.setItem('tema', novoTema);
        setTema(novoTema);
        document.documentElement.setAttribute("data-bs-theme", novoTema);
    }

    async function changeField(value, indexSessao, indexExc, field, indexSet = null) {        
        const attAlunos = alunos.map((aluno, i) =>
            indexAluno == i
            ? { ...aluno,
                treinos: aluno.treinos.map((treino, idx) => idx == alunos[indexAluno].indexTreino ? {
                ...treino,
                sessoes: treino.sessoes.map((sessao, idxSessao) => indexSessao == idxSessao ? {
                ...sessao,
                exercicios: sessao.exercicios.map((exc, idxExc) => {
                    if (indexExc == idxExc && indexSet !== null) return { ...exc, sets: exc.sets.map((set, i) => indexSet == i ? { ...set, [field]: value } : set) }
                    if (indexExc == idxExc && indexSet == null) return { ...exc, [field]: value }
                    return exc;
                }
                )
                } : sessao)
            } : treino ) }
            : aluno
        )
        setAlunos(attAlunos);
        localStorage.setItem('planilhatreino', JSON.stringify(attAlunos));
        await setSessao(attAlunos[indexAluno].treinos[alunos[indexAluno].indexTreino].sessoes, null, null, null, []);
    }

    function changeExercicio(exercicio, indexSessao, indexExc) {
        const attAlunos = alunos.map((aluno, i) =>
            indexAluno == i
            ? { ...aluno, treinos: aluno.treinos.map((treino, idx) => idx == alunos[indexAluno].indexTreino ? {
                ...treino,
                sessoes: treino.sessoes.map((sessao, idxSessao) => indexSessao == idxSessao ? {
                    ...sessao,
                    exercicios: sessao.exercicios.map((exc, idxExc) => indexExc == idxExc ? { ...exc, ...exercicio } : exc)
                } : sessao)
            } : treino ) }
            : aluno
        )
        setAlunos(attAlunos);
        localStorage.setItem('planilhatreino', JSON.stringify(attAlunos));
    }

    async function selectTreino(index) {
        setAlunos(prev => prev.map((_, i) => i == indexAluno ? { ..._, indexTreino: index } : _));
    }

    async function selectSessao(index) {
        setAlunos(prev => prev.map((_, i) => i == indexAluno ? { ..._, indexSessao: index } : _));
    }

    async function reloadTreinos() {
        const tempAlunos = [...alunos];
        for (const aluno of tempAlunos) {
            const treinosUpdated = await getTreinos({ cod_aluno: aluno.cod_aluno });
            aluno.treinos = treinosUpdated;
        }
        setAlunos(tempAlunos);
    }

    return (
        <div>
            <div className="card">
                <div className="card-header d-flex align-items-center">
                    <button className="btn btn-info me-3" onClick={() => navigate('/planilha')}>
                        <i className="bi bi-backspace me-2"></i>
                        Voltar ao sistema
                    </button>

                    <button className="btn btn-warning" onClick={reloadTreinos}>
                        <i className="bi bi-arrow-clockwise" />
                    </button>

                    <button onClick={alteraTema} className="nav-link moon dark-layout nav-icon-hover-bg rounded-circle d-flex me-2">
                        {localStorage.getItem('tema') === 'light'
                            ? <i className="bi bi-moon-fill"></i>
                            : <i className="bi bi-sun-fill"></i>
                        }
                    </button>
                    <h4 className="card-title ms-3">Planilha de exercícios</h4>
                </div>

                <div className="card-body">
                    <div className="col-12 col-md-6 mb-3 d-flex flex-column border border-success p-3 rounded-3 w-100">
                        <label>Alunos</label>
                        <div className="btn-group" role="group">
                            {alunos?.map((aluno, index) => (
                                <>
                                    <input type="radio" className="btn-check" name="btnradio" id={`btnradio-${index}`} checked={index == indexAluno} onClick={() => setIndexAluno(index)} />
                                    <label className="btn btn-outline-success" htmlFor={`btnradio-${index}`}>{aluno.nome_aluno}</label>
                                </>
                            ))}
                        </div>
                    </div>

                    <div className="accordion">
                        <div className="accordion-item">
                            <h2 className="accordion-header">
                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                                    Treinos
                                </button>
                            </h2>

                            <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse">
                                <div className="accordion-body row g-3">
                                    <div className="d-flex flex-column rounded-3 p-3 mb-3 border border-info">
                                        <div className="col-12 col-md-6 d-flex flex-column">
                                            <label>Treinos</label>
                                            <div className="btn-group" role="group">
                                                {alunos[indexAluno]?.treinos?.map((treino, index) => (
                                                    <>
                                                        <input type="radio" className="btn-check" name="btnradioTreino" id={`btnradio-treino-${index}`} checked={index == alunos[indexAluno].indexTreino} onClick={() => selectTreino(index)} />
                                                        <label className="btn btn-outline-primary" htmlFor={`btnradio-treino-${index}`}>{treino.nome_treino}</label>
                                                    </>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="col-12 col-md-6 d-flex flex-column">
                                            <label>Sessões</label>
                                            <div className="btn-group" role="group">
                                                {alunos[indexAluno]?.treinos[alunos[indexAluno].indexTreino]?.sessoes?.map((sessao, index) => (
                                                    <>
                                                        <input type="radio" className="btn-check" name="btnradioSessao" id={`btnradio-sessao-${index}`} checked={index == alunos[indexAluno].indexSessao} onClick={() => selectSessao(index)} />
                                                        <label className="btn btn-outline-info" htmlFor={`btnradio-sessao-${index}`}>{sessao.nome_sessao}</label>
                                                    </>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="accordion">
                        <div className="accordion-item">
                            <h2 className="accordion-header">
                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="true" aria-controls="panelsStayOpen-collapseTwo">
                                    Temporizador
                                </button>
                            </h2>

                            <div id="panelsStayOpen-collapseTwo" className="accordion-collapse collapse">
                                <div className="accordion-body row g-3">
                                    <div className="d-flex flex-column rounded-3 p-3 mb-3 border border-info">
                                        <Timer />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="d-flex flex-column mt-3">
                        {alunos[indexAluno]?.treinos[alunos[indexAluno].indexTreino]?.sessoes?.map((sessao, idx) => {
                            if (idx == alunos[indexAluno].indexSessao) {
                                return (
                                    <div key={idx}>
                                        <h3 className="mb-3">{sessao.nome_sessao}</h3>

                                        <table className="table table-sm table-info table-striped table-striped-columns table-hover table-bordered"> 
                                            <thead>
                                                <tr>
                                                    <th style={{ width: '65%' }}>Exercício</th>
                                                    <th style={{ width: '5%' }}>Série</th>
                                                    <th style={{ width: '5%' }}>Rep.</th>
                                                    <th style={{ width: '5%' }}>Carga</th>
                                                    <th style={{ width: '20%' }}>Observação</th>
                                                </tr>
                                            </thead>

                                            <tbody className="table-group-divider">
                                                {sessao?.exercicios?.map((exc, indexExc) => (
                                                    <>
                                                        <tr key={indexExc}
                                                            className={`${exc.sets?.length > 0 ? arrayBorders[indexExc] : ''}`}
                                                            style={exc.sets?.length > 0 ? { borderLeft: '0.30rem solid', borderRight: '0.30rem solid' } : {}}
                                                        >
                                                            <td>
                                                                <EditExercicio value={exc.nome_exercicio} onUpdate={(v, object) => { changeField(v, idx, indexExc, 'cod_exercicio'); changeExercicio(object, idx, indexExc) }} exercicios={exercicios} />
                                                            </td>
                                                            <td>
                                                                <Edit value={exc.serie_sessao_exercicio} onUpdate={v => changeField(v, idx, indexExc, 'serie_sessao_exercicio')} />
                                                            </td>
                                                            <td>
                                                                <Edit value={exc.repeticao_sessao_exercicio} onUpdate={v => changeField(v, idx, indexExc, 'repeticao_sessao_exercicio')} />
                                                            </td>
                                                            <td>
                                                                <Edit value={exc.carga_sessao_exercicio} onUpdate={v => changeField(v, idx, indexExc, 'carga_sessao_exercicio')} />
                                                            </td>
                                                            <td>
                                                                <Edit value={exc.observacao_sessao_exercicio} onUpdate={v => changeField(v, idx, indexExc, 'observacao_sessao_exercicio')} />
                                                            </td>
                                                        </tr>
                                                        {exc.sets.map((set, indexSet) => (
                                                            <tr key={indexSet}
                                                                className={`${exc.sets?.length > 0 ? arrayBorders[indexExc] : ''}`}
                                                                style={exc.sets?.length > 0 ? { borderLeft: '0.30rem solid', borderRight: '0.30rem solid' } : {}}
                                                            >
                                                                <td>
                                                                    <EditExercicio value={set.nome_exercicio} onUpdate={(v, object) => { changeField(v, idx, indexExc, 'cod_exercicio', indexSet); changeExercicio(object, idx, indexExc) }} exercicios={exercicios} />
                                                                </td>
                                                                <td>
                                                                    <Edit value={set.serie_sessao_exercicio} onUpdate={v => changeField(v, idx, indexExc, 'serie_sessao_exercicio', indexSet)} />
                                                                </td>
                                                                <td>
                                                                    <Edit value={set.repeticao_sessao_exercicio} onUpdate={v => changeField(v, idx, indexExc, 'repeticao_sessao_exercicio', indexSet)} />
                                                                </td>
                                                                <td>
                                                                    <Edit value={set.carga_sessao_exercicio} onUpdate={v => changeField(v, idx, indexExc, 'carga_sessao_exercicio', indexSet)} />
                                                                </td>
                                                                <td>
                                                                    <Edit value={set.observacao_sessao_exercicio} onUpdate={v => changeField(v, idx, indexExc, 'observacao_sessao_exercicio', indexSet)} />
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )
                            }
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

function Timer() {
    const [time, setTime] = useState(0); // Tempo restante em segundos
    const [isRunning, setIsRunning] = useState(false);
    const [inputTime, setInputTime] = useState(""); // Entrada do usuário para definir o tempo
  
    useEffect(() => {
        let interval;
        if (isRunning && time > 0) {
            interval = setInterval(() => {
                setTime((prevTime) => prevTime - 1);
            }, 1000);
        } else if (time === 0 && isRunning) {
            setIsRunning(false);
            playSound();
        }
        return () => clearInterval(interval); // Cleanup ao desmontar
    }, [isRunning, time]);
  
    // Função para tocar som ao terminar o timer
    const playSound = () => {
        const audio = new Audio("https://www.soundjay.com/button/beep-07.wav");
        audio.play();
    };
  
    // Função para definir o tempo inicial
    const handleSetTime = () => {
        const parsedTime = parseInt(inputTime, 10);
        if (!isNaN(parsedTime) && parsedTime > 0) {
            setTime(parsedTime);
            setInputTime("");
        } else {
            alert("Por favor, insira um número válido maior que 0.");
        }
    };
  
    // Função para resetar o timer
    const resetTimer = () => {
        setIsRunning(false);
        setTime(0);
    };
  
    return (
        <div className="container mt-4 text-center">
            <h2 className="mb-3">Temporizador</h2>

            <div className="display-4">{time}s</div>

            <div className="mt-3">
                <input
                    type="number"
                    className="form-control d-inline w-50 me-2"
                    placeholder="Defina o tempo (s)"
                    value={inputTime}
                    onChange={(e) => setInputTime(e.target.value)}
                    disabled={isRunning}
                />

                <button className="btn btn-success" onClick={handleSetTime} disabled={isRunning}>Definir</button>
            </div>

            <div className="mt-3">
                <button className="btn btn-primary me-2" onClick={() => setIsRunning(!isRunning)} disabled={time === 0}>
                    {isRunning ? "Pausar" : "Iniciar"}
                </button>

                <button className="btn btn-danger" onClick={resetTimer}>Resetar</button>
            </div>
        </div>
    );
}

function EditExercicio({ value, onUpdate, exercicios }) {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(value);

    useEffect(() => {
        setInputValue(value);
    }, []);

    const handleBlur = () => {
        setIsEditing(false);
    };

    function onChange(value, object) {
        onUpdate(value, object);
        setIsEditing(false);
    }

    return isEditing ? (
        <AutoComplete
            onChange={onChange}
            autoFocus={true}
            onBlur={handleBlur}
            sugestoes={exercicios}
            chavePesquisa='nome_exercicio'
            chave='cod_exercicio'
        />
    ) : (
        <label className="w-100" onDoubleClick={() => setIsEditing(true)}>
            {value}
        </label>
    );
}

function Edit({ value, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(value);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    const handleBlur = () => {
        setIsEditing(false);
        if (inputValue.trim() && inputValue !== value) {
            onUpdate(inputValue.trim());
        }
    };

    return isEditing ? (
        <input
            type="text"
            className="form-control d-inline-block"
            style={{ width: "auto" }}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={e => e.key === 'Enter' ? handleBlur() : null}
            autoFocus
        />
    ) : (
        <label className="w-100" onDoubleClick={() => setIsEditing(true)}>
            {value || '-'}
        </label>
    );
}

export default PlanilhaTreino;