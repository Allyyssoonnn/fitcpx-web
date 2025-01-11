import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function PlanilhaTreino() {
    const navigate = useNavigate();
    const location = useLocation();

    const [alunos, setAlunos] = useState([]);

    const [tema, setTema] = useState(localStorage.getItem('tema') ?? 'light');

    useEffect(() => {
        const alunos = location?.state?.alunos;
        const alunosCache = localStorage.getItem('planilhatreino');
        setAlunos(alunos || alunosCache);
        localStorage.setItem('planilhatreino', JSON.stringify(alunos));
    }, [location]);
    
    function changeTreino(idx) {
        setAlunos(prev => prev.map((aluno) => ({
            ...aluno,
            indexTreino: idx,
        })));
    }

    function alteraTema() {
        const novoTema = tema === 'light' ? 'dark' : 'light';
        localStorage.setItem('tema', novoTema);
        setTema(novoTema);
        document.documentElement.setAttribute("data-bs-theme", novoTema);
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
                    {alunos.map((aluno, index) => (
                        <div key={index} className="accordion rounded-1 mb-1" style={{ border: '0.15rem solid #85D446' }}>
                            <div className="accordion-item">
                                <h2 className="accordion-header">
                                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#panelsStayOpen-collapse${index}`} aria-expanded="true" aria-controls={`panelsStayOpen-collapse${index}`}>
                                        {aluno.nome_aluno}
                                    </button>
                                </h2>

                                <div id={`panelsStayOpen-collapse${index}`} className="accordion-collapse collapse">
                                    <div className="accordion-body row g-3">
                                        <div className="d-flex">
                                            <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
                                                {aluno?.treinos.map((treino, idx) => (
                                                    <>
                                                        <input type="radio" className="btn-check" name="btnradio" id="btnradio1" checked={idx == aluno.indexTreino} onClick={() => changeTreino(idx)} />
                                                        <label className="btn btn-outline-primary" htmlFor="btnradio1">{treino.nome_treino}</label>
                                                    </>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="d-flex flex-column">
                                            {aluno?.treinos[aluno?.indexTreino]?.sessoes?.map((sessao, idx) => (
                                                <table className="table table-sm table-info table-striped table-striped-columns table-hover table-bordered" key={idx}> 
                                                    <thead>
                                                        <tr>
                                                            <th style={{ width: '65%' }}>Exercício</th>
                                                            <th style={{ width: '10%' }}>Série</th>
                                                            <th style={{ width: '10%' }}>Repetição</th>
                                                            <th style={{ width: '15%' }}>Carga</th>
                                                        </tr>
                                                    </thead>

                                                    <tbody className="table-group-divider">
                                                        {sessao?.exercicios?.map((exc, indexExc) => (
                                                            <tr key={indexExc}>
                                                                <td>{exc.nome_exercicio}</td>
                                                                <td>{exc.serie_sessao_exercicio}</td>
                                                                <td>{exc.repeticao_sessao_exercicio}</td>
                                                                <td>{exc.carga_sessao_exercicio}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default PlanilhaTreino;