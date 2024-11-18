import { useEffect, useState } from "react";
import { getAlunos } from "../api/aluno";
// import { Table } from "reactstrap";
import { Table } from "react-bootstrap";

function Alunos() {
    const [alunos, setAlunos] = useState([]);

    useEffect(() => {
        (async function load() {
            const resp = await getAlunos(2);
            if (resp) setAlunos(resp);
        })();
    }, []);

    return (
        <div className="container-fluid">
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Lista de alunos</h5>

                    <div className="table-responsive">
                        <div id="toolbar">
                            <a className="btn btn-success" href='cadaluno'>
                                Novo aluno
                            </a>
                        </div>

                        <Table striped hover responsive>
                            <thead>
                                <tr className="border-2 border-bottom border-primary border-0">
                                    <th scope="col">Nome</th>
                                    <th scope="col">Idade</th>
                                    <th scope="col">Peso</th>
                                    <th scope="col" data-sortable="true">Última avalição</th>
                                    <th scope="col">Editar</th>
                                </tr>
                            </thead>

                            <tbody className="table-group-divider">
                                {alunos.map((aluno) => (
                                    <tr key={aluno.cod_aluno}>
                                        <th scope="row">{aluno.nome_aluno}</th>
                                        <td>{aluno.idade}</td>
                                        <td>{aluno.peso}</td>
                                        <td>{aluno.ultima_avalicao}</td>
                                        <td>
                                            <button className="btn btn-white btn-sm">
                                                <iconify-icon width='1rem' icon="solar:pen-bold" className="fs-7 d-flex text-success"></iconify-icon>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Alunos;