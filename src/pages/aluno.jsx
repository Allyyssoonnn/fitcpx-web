import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tabs, Tab, Row, Col, Card, Button } from 'react-bootstrap';
import { calcularIdade } from "../utils";
import { useQuery } from "react-query";
import { getAluno } from '../api/aluno';

function Aluno() {
    const location = useLocation();
    const navigate = useNavigate();
    const cod_aluno = location.state?.cod_aluno; // O ID do aluno passado pela navegação
    const [key, setKey] = useState('informacoesPessoais'); // Controle da aba ativa

    const { data: aluno } = useQuery({
        queryKey: ['aluno', ],
        queryFn: () => getAluno(cod_aluno),
    });

    return (
        <div className="container-fluid">
            <Card>
                <Card.Body>
                    <Button href='javascript:history.back()' className="btn btn-danger mb-3">
                        <i className="bi bi-backspace me-2"></i>
                        Voltar
                    </Button>

                    <Row className="mb-4">
                        <Col sm={3} className="position-relative">
                            <img
                                src="https://via.placeholder.com/150" 
                                alt="Foto do Aluno" 
                                className="img-fluid rounded-circle" 
                                style={{ width: '150px', height: '150px' }} 
                            />
                            
                            <Button 
                                className="position-absolute bottom-0 end-0 mb-2 me-2" 
                                variant="primary" 
                                size="sm"
                            >
                                <i className="bi bi-camera"></i>
                            </Button>
                        </Col>

                        <Col sm={8}>
                            <h3>{aluno?.nome_aluno}</h3>
                            <p>Idade: {calcularIdade(aluno?.data_nascimento_aluno)}</p>
                            <p>Email: {aluno?.email_aluno}</p>
                            <Button variant="warning" onClick={() => navigate('/cadaluno', { state: { aluno } })}>
                                <i className="bi bi-pencil me-2"></i>
                                Editar
                            </Button>
                        </Col>
                    </Row>

                    <Tabs
                        id="aluno-tabs"
                        activeKey={key}
                        onSelect={(k) => setKey(k)}
                        className="mb-3"
                    >
                        <Tab eventKey="informacoesPessoais" title={<><i className="bi bi-person me-2"></i>Informações Pessoais</>}>
                            <div>
                                <h5>Detalhes Pessoais</h5>
                                <p><strong>Telefone:</strong> {aluno?.telefone_aluno}</p>
                                <p><strong>Data de Nascimento:</strong> {aluno?.data_nascimento_aluno}</p>
                                <p><strong>Sexo:</strong> {aluno?.sexo_aluno}</p>
                                {/* Outros detalhes pessoais */}
                                <h5>Endereço</h5>
                                <p><strong>Endereço:</strong> {aluno?.endereco_aluno}, {aluno?.numero_aluno}, {aluno?.bairro_aluno}</p>
                                <p><strong>Cidade:</strong> {aluno?.cidade_aluno} - {aluno?.estado_aluno}</p>
                            </div>
                        </Tab>

                        <Tab eventKey="avaliacaoFisica" title={<><i className="bi bi-clipboard-data me-2"></i>Avaliação Física</>} >
                            <div>
                                <h5>Avaliação Física</h5>
                                {/* Exemplo de dados de avaliação física */}
                                <p><strong>Peso:</strong> {aluno?.peso_aluno} kg</p>
                                <p><strong>Altura:</strong> {aluno?.altura_aluno} cm</p>
                                <p><strong>IMC:</strong> {aluno?.imc_aluno}</p>
                                <Button variant="primary" onClick={() => navigate('/cadavaliacao', { state: { aluno } })}>Adicionar Avaliação</Button>
                            </div>
                        </Tab>
                    </Tabs>
                </Card.Body>
            </Card>
        </div>
    );
}

export default Aluno;