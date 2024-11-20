import { useEffect, useState } from "react";
import { getAlunos } from "../api/aluno";
// import { Table } from "reactstrap";
import { Button, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { calcularIdade } from "../utils";
import { useQuery } from "react-query";
import { useRecoilState } from "recoil";
import { stateUsuario } from '../states/usuario';

function Alunos() {
    const [usuario] = useRecoilState(stateUsuario);

    const { data: alunos, isLoading, isError } = useQuery({
        queryKey: ['alunos', usuario.cod_usuario],
        queryFn: () => getAlunos(usuario.cod_usuario),
        // enabled: !usuario.cod_usuario,
        initialData: [],
    });

    const navigate = useNavigate();
    
    const editarAluno = (aluno) => navigate('/cadaluno', { state: { aluno } });

    return (
        <div className="container-fluid">
            <div className="card">
                <div className="card-body">
                    <a className="btn btn-success mb-3" href='cadaluno'>
                        <i className="bi bi-plus-circle me-2"></i>
                        Novo aluno
                    </a>
                    <h5 className="card-title">Lista de alunos</h5>

                    <div className="table-responsive">
                        <Table striped hover responsive>
                            <thead>
                                <tr className="border-2 border-bottom border-primary border-0">
                                    <th scope="col">Nome</th>
                                    <th scope="col">Idade</th>
                                    <th scope="col">Telefone</th>
                                    <th scope="col" data-sortable="true">E-mail</th>
                                    <th scope="col">Editar</th>
                                </tr>
                            </thead>

                            <tbody className="table-group-divider">
                                {alunos.map((aluno) => (
                                    <tr key={aluno.cod_aluno} onClick={() => navigate('/aluno', { state: { cod_aluno: aluno.cod_aluno } })}>
                                        <th scope="row">{aluno.nome_aluno}</th>
                                        <td>{calcularIdade(aluno.data_nascimento_aluno)}</td>
                                        <td>{aluno.telefone_aluno}</td>
                                        <td>{aluno.email_aluno}</td>
                                        <td>
                                            <Button className="btn btn-white btn-sm" onClick={() => editarAluno(aluno)}>
                                                <i className="bi bi-pencil"></i>
                                            </Button>
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