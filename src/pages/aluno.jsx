import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tabs, Tab, Button } from 'react-bootstrap';
import { calcularIdade } from "../utils";
import { useQuery } from "react-query";
import { getAluno } from '../api/aluno';

function Aluno() {
    const location = useLocation();
    const navigate = useNavigate();
    const cod_aluno = location.state?.cod_aluno;
    const [key, setKey] = useState('informacoesPessoais');

    const { data: aluno } = useQuery({
        queryKey: ['aluno', ],
        queryFn: () => getAluno(cod_aluno),
    });

    return (
        <div className="container-fluid">
            <div className='card'>
                <div className='card-header'>
                    <Button href='javascript:history.back()' className="btn btn-danger mb-3">
                        <i className="bi bi-backspace me-2"></i>
                        Voltar
                    </Button>
                </div>

                <div className='card-body'>
                    <div className='row mb-4'>
                        <div className='col-sm-3 position-relative'>
                            <img
                                src="https://via.placeholder.com/150" 
                                alt="Foto do Aluno" 
                                className="img-fluid rounded-circle" 
                                style={{ width: '150px', height: '150px' }} 
                            />
                            
                            <button 
                                className="btn btn-primary position-absolute bottom-0 end-0 mb-2 me-5" 
                            >
                                <i className="bi bi-camera"></i>
                            </button>
                        </div>

                        <div className='col-sm-8'>
                            <h3>{aluno?.nome_aluno}</h3>
                            <p>Idade: {calcularIdade(aluno?.data_nascimento_aluno)}</p>
                            <p>Email: {aluno?.email_aluno}</p>
                            <Button variant="warning" onClick={() => navigate('/cadaluno', { state: { aluno } })}>
                                <i className="bi bi-pencil me-2"></i>
                                Editar
                            </Button>
                        </div>
                    </div>

                    <Tabs
                        id="aluno-tabs"
                        activeKey={key}
                        onSelect={(k) => setKey(k)}
                        className="mb-3"
                    >
                        <Tab eventKey="informacoesPessoais" title={
                            <>
                                <span className="d-none d-md-block"><i className="bi bi-person me-2"></i>Informações Pessoais</span>
                                <span className="d-block d-md-none"><i className="bi bi-person me-2"></i>Info</span>
                            </>
                        }>
                            <div>
                                <div className="p-3 bg-light rounded">
                                    <h5>Detalhes Pessoais</h5>
                                    <p><strong>Telefone:</strong> {aluno?.telefone_aluno}</p>
                                    <p><strong>Data de Nascimento:</strong> {aluno?.data_nascimento_aluno}</p>
                                    <p><strong>Sexo:</strong> {aluno?.sexo_aluno}</p>
                                </div>

                                <div className="p-3 bg-light rounded mt-3">
                                    <h5>Endereço</h5>
                                    <p><strong>Endereço:</strong> {aluno?.endereco_aluno}, {aluno?.numero_aluno}, {aluno?.bairro_aluno}</p>
                                    <p><strong>Cidade:</strong> {aluno?.cidade_aluno} - {aluno?.estado_aluno}</p>
                                </div>
                            </div>
                        </Tab>

                        <Tab eventKey="avaliacaoFisica" title={
                            <>
                                <span className="d-none d-md-block"><i className="bi bi-clipboard-data me-2"></i>Avaliação Física</span>
                                <span className="d-block d-md-none"><i className="bi bi-clipboard-data me-2"></i>Avaliação</span>
                            </>
                        } >
                            <div>
                                <button className='btn btn-primary' onClick={() => navigate('/cadavaliacao', { state: { cod_aluno: cod_aluno } })}>
                                    <i className="bi bi-plus-circle me-2"></i>
                                    Adicionar Avaliação
                                </button>

                                <div className="p-3 bg-light rounded mt-3">
                                    <h5>Avaliações</h5>
                                    
                                    <div className="table-responsive">
                                        <table id="basic-datatables" className="display table table-striped table-hover">
                                            <thead>
                                                <tr>
                                                    <th>Data</th>
                                                    <th>Opções</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {aluno?.avaliacao?.map((avaliacao) => {
                                                    return (
                                                        <tr key={avaliacao.cod_aluno}>
                                                            <th scope="row" className="d-flex">
                                                                <div className="col-md-3 d-flex flex-column">
                                                                    <label>{avaliacao.data_avaliacao}</label>
                                                                </div>

                                                                <div className="col-md-3 d-flex flex-column">
                                                                    <label>{avaliacao.altura} M</label>
                                                                </div>

                                                                <div className="col-md-3 d-flex flex-column">
                                                                    <label>{avaliacao.peso} KG</label>
                                                                </div>
                                                            </th>
                                                            <td className='col-md-3'>
                                                                <Button className="btn btn-white btn-sm me-3" onClick={() => navigate('/cadavaliacao', { state: { avaliacao } })}>
                                                                    <i className="bi bi-pencil"></i>
                                                                </Button>

                                                                <Button className="btn btn-white btn-sm" onClick={() => navigate('/cadavaliacao', { state: { avaliacao } })}>
                                                                    <i className="bi bi-printer me-2"></i>
                                                                    Ver resultado
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}

export default Aluno;