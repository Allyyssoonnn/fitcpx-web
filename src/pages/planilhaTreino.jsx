import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setSessao } from "../api/treino";

function PlanilhaTreino() {
    const navigate = useNavigate();

    const [alunos, setAlunos] = useState([]);
    const [indexAluno, setIndexAluno] = useState(0);
    const [indexTreino, setIndexTreino] = useState(0);

    const [tema, setTema] = useState(localStorage.getItem('tema') ?? 'light');

    useEffect(() => {
        const alunosCache = JSON.parse(localStorage.getItem('planilhatreino'));
        setAlunos(alunosCache);
    }, []);

    function alteraTema() {
        const novoTema = tema === 'light' ? 'dark' : 'light';
        localStorage.setItem('tema', novoTema);
        setTema(novoTema);
        document.documentElement.setAttribute("data-bs-theme", novoTema);
    }

    async function changeField(value, indexSessao, indexExc, field) {
        const attAlunos = alunos.map((aluno, i) =>
            indexAluno == i
            ? { ...aluno, treinos: aluno.treinos.map((treino, idx) => idx == indexTreino ? {
                ...treino,
                sessoes: treino.sessoes.map((sessao, idxSessao) => indexSessao == idxSessao ? {
                    ...sessao,
                    exercicios: sessao.exercicios.map((exc, idxExc) => indexExc == idxExc ? { ...exc, [field]: value } : exc)
                } : sessao)
            } : treino ) }
            : aluno
        )
        setAlunos(attAlunos);
        localStorage.setItem('planilhatreino', JSON.stringify(attAlunos));
        await setSessao(attAlunos[indexAluno].treinos[indexTreino].sessoes, null, null, null, []);
    }

    return (
        <div>
            <div className="card">
                <div className="card-header d-flex align-items-center">
                    <button className="btn btn-info me-3" onClick={() => navigate('/planilha')}>
                        <i className="bi bi-backspace me-2"></i>
                        Voltar ao sistema
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
                    <div className="row mb-3">
                        <div className="col-12 col-md-6 mb-3">
                            <div className="btn-group" role="group">
                                {alunos?.map((aluno, index) => (
                                    <>
                                        <input type="radio" className="btn-check" name="btnradio" id={`btnradio-${index}`} checked={index == indexAluno} onClick={() => setIndexAluno(index)} />
                                        <label className="btn btn-outline-primary" htmlFor={`btnradio-${index}`}>{aluno.nome_aluno}</label>
                                    </>
                                ))}
                            </div>
                        </div>

                        <div className="col-12 col-md-6">
                            <div className="btn-group" role="group">
                                {alunos[indexAluno]?.treinos?.map((treino, index) => (
                                    <>
                                        <input type="radio" className="btn-check" name="btnradioTreino" id={`btnradio-treino-${index}`} checked={index == indexTreino} onClick={() => setIndexTreino(index)} />
                                        <label className="btn btn-outline-primary" htmlFor={`btnradio-treino-${index}`}>{treino.nome_treino}</label>
                                    </>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="d-flex flex-column">
                        {alunos[indexAluno]?.treinos[indexTreino]?.sessoes?.map((sessao, idx) => (
                            <div key={idx}>
                                <h3 className="mb-3">{sessao.nome_sessao}</h3>

                                <table className="table table-sm table-info table-striped table-striped-columns table-hover table-bordered"> 
                                    <thead>
                                        <tr>
                                            <th style={{ width: '65%' }}>Exercício</th>
                                            <th style={{ width: '10%' }}>Série</th>
                                            <th style={{ width: '10%' }}>Rep.</th>
                                            <th style={{ width: '15%' }}>Carga</th>
                                        </tr>
                                    </thead>

                                    <tbody className="table-group-divider">
                                        {sessao?.exercicios?.map((exc, indexExc) => (
                                            <tr key={indexExc}>
                                                <td>{exc.nome_exercicio}</td>
                                                <td>
                                                    <Edit value={exc.serie_sessao_exercicio} onUpdate={v => changeField(v, idx, indexExc, 'serie_sessao_exercicio')} />
                                                </td>
                                                <td>
                                                    <Edit value={exc.repeticao_sessao_exercicio} onUpdate={v => changeField(v, idx, indexExc, 'repeticao_sessao_exercicio')} />
                                                </td>
                                                <td>
                                                    <Edit value={exc.carga_sessao_exercicio} onUpdate={v => changeField(v, idx, indexExc, 'carga_sessao_exercicio')} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function Edit({ value, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(value);

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
            {value}
            {/* <button className="btn btn-sm btn-outline-primary ms-2" onClick={() => setIsEditing(true)}>
                <i className="bi bi-pencil me-2"></i>
                Renomear
            </button> */}
        </label>
    );
}

export default PlanilhaTreino;