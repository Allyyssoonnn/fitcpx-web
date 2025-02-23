import { useQuery } from "react-query";
import { deleteExercicio, getArticulacoes, getEquipamentos, getExercicios, getExerciciosResistencias, getGrupoExercicios, getIndicacoes, getPadraoesMovimentos, getTipoExercicios, recoveryExercicio, setExercicio } from "../../api/treino";
import { useRecoilState } from "recoil";
import { stateAdmin } from "../../states/states";
import { useEffect, useMemo, useState } from "react";
import FiltroExercicio from "../../components/filtroExercicio";


function AjusteExercicios() {
    const [admin] = useRecoilState(stateAdmin);
    const [searchTerm, setSearchTerm] = useState("");
    const [exerciciosFiltrados, setExerciciosFiltrados] = useState([]);
    const [revisando, setRevisando] = useState(false);
    const [exercicios, setExercicios] = useState([]);
    const [updates, setUpdates] = useState([]);

    const { data: tempExercicios } = useQuery({
        queryKey: ['exercicios', admin.cod_admin],
        queryFn: () => getExercicios(),
        initialData: [],
    });

    useEffect(() => {
        setExercicios(tempExercicios);
    }, [tempExercicios]);

    const { data: articulacoes } = useQuery({
        queryKey: ['articulacoes', admin.cod_admin],
        queryFn: () => getArticulacoes(null),
        initialData: [],
    });

    const { data: grupos } = useQuery({
        queryKey: ['grupos', admin.cod_admin],
        queryFn: () => getGrupoExercicios(null),
        initialData: [],
    });

    const { data: equipamentos } = useQuery({
        queryKey: ['equipamentos', admin.cod_admin],
        queryFn: () => getEquipamentos(),
        initialData: [],
    });

    const { data: tipo_exercicios } = useQuery({
        queryKey: ['tipo_exercicios', admin.cod_admin],
        queryFn: () => getTipoExercicios(),
        initialData: [],
    });
    
    const { data: exercicios_resistencias } = useQuery({
        queryKey: ['exercicios_resistencias', admin.cod_admin],
        queryFn: () => getExerciciosResistencias(),
        initialData: [],
    });

    const { data: indicacoes } = useQuery({
        queryKey: ['indicacoes', admin.cod_admin],
        queryFn: () => getIndicacoes(),
        initialData: [],
    });

    const { data: padraoes_movimentos } = useQuery({
        queryKey: ['padraoes_movimentos', admin.cod_admin],
        queryFn: () => getPadraoesMovimentos(),
        initialData: [],
    });

    const filteredExercicios = useMemo(() => {
        return exerciciosFiltrados.filter((exercicio) =>
            searchTerm.toLowerCase().split(" ").filter(Boolean).every(word =>
                exercicio.nome_exercicio?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(word)
            )
        );
    }, [exerciciosFiltrados, searchTerm]);

    function onUpdate(newValue, fieldUpdate, index) {
        const exercicio = exerciciosFiltrados.find((exc, i) => i == index);
        const exist = updates.findIndex((up, i) => up.cod_exercicio == exercicio.cod_exercicio);

        if (exist >= 0) {
            setUpdates(prevUp => prevUp.map((up, i) => i == exist ? { ...up, [fieldUpdate]: newValue } : up));
        } else {
            setUpdates(preUp => ([ ...preUp, { ...exercicio, [fieldUpdate]: newValue } ]));
        }
        setExercicios(prevExc => prevExc.map((exc, i) => index == i ? { ...exc, [fieldUpdate]: newValue } : exc));
    }

    async function enviar() {
        for (const up of updates) {
            await setExercicio(up);
        }
        setUpdates([]);
        setRevisando(false);
    }

    const delExercicio = async (cod_exercicio, index) => {
        await deleteExercicio(cod_exercicio);
        setExercicios(prevExc => prevExc.map((exc, i) => index == i ? { ...exc, deletedAt: new Date() } : exc));
    }

    const recoveryExec = async (cod_exercicio, index) => {
        await recoveryExercicio(cod_exercicio);
        setExercicios(prevExc => prevExc.map((exc, i) => index == i ? { ...exc, deletedAt: null } : exc));
    }

    return (
        <div className="container-fluid mw-100">
            <div className="card">
                <div className="card-header">
                    <div className="d-flex justify-content-end mb-3 gap-3">
                        <button onClick={() => setRevisando(!revisando)} className={revisando ? 'btn btn-danger' : 'btn btn-success'} disabled={updates.length == 0}>{revisando ? 'Voltar' : 'Revisar'}</button>
                        <button onClick={enviar} className={revisando ? 'btn btn-success' : 'd-none'} disabled={updates.length == 0}>Enviar</button>
                    </div>

                    <div className="d-flex justify-content-between">
                        <h4 className="card-title d-none d-md-block">Exercícios</h4>
                        
                        <div className="col-md-3 col-12">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Pesquisar"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="card-body mh-60" style={{ overflow: 'auto', maxHeight: '80vh' }}>
                    <FiltroExercicio exercicios={exercicios} setExerciciosFiltrados={setExerciciosFiltrados} />

                    <table className="table table-sm table-info table-striped-columns table-hover table-bordered">
                        <thead>
                            <tr>
                                <th style={{ width: '5%' }}>Cod.</th>
                                <th style={{ width: '40%' }}>Exercício</th>
                                <th style={{ width: '10%' }}>Tipo</th>
                                <th style={{ width: '10%' }}>Resis.</th>
                                <th style={{ width: '10%' }}>Indic.</th>
                                <th style={{ width: '10%' }}>Mov.</th>
                                <th style={{ width: '10%' }}>Artic. 1</th>
                                <th style={{ width: '10%' }}>Artic. 2</th>
                                <th style={{ width: '10%' }}>Artic. 3</th>
                                <th style={{ width: '10%' }}>Equip. 1</th>
                                <th style={{ width: '10%' }}>Equip. 2</th>
                                <th style={{ width: '10%' }}>Equip. 3</th>
                                <th style={{ width: '20%' }}>Grupo 1</th>
                                <th style={{ width: '20%' }}>Grupo 2</th>
                                <th style={{ width: '20%' }}>Grupo 3</th>
                                <th style={{ width: '20%' }}>Grupo 4</th>
                                <th style={{ width: '20%' }}>Grupo 5</th>
                                <th style={{ width: '20%' }}>Grupo 6</th>
                                <th style={{ width: '20%' }}>Grupo 7</th>
                                <th style={{ width: '20%' }}>Grupo 8</th>
                                <th style={{ width: '20%' }}>Opt</th>
                            </tr>
                        </thead>

                        <tbody className="table-group-divider">
                            {(revisando ? updates : filteredExercicios).map((exc, indexExc) => (
                                <tr key={indexExc}>
                                    <td className={`${exc.deletedAt !== null ? 'bg-danger' : ''}`}>
                                        <label>{exc.cod_exercicio}</label>
                                    </td>
                                    <td>
                                        <Edit onUpdate={onUpdate} value={exc.nome_exercicio} fieldUpdate='nome_exercicio' index={indexExc} />
                                    </td>
                                    <td>
                                        <EditSelect index={indexExc} onUpdate={onUpdate} value={exc.cod_tipo_exercicio} options={tipo_exercicios} field='cod_tipo_exercicio' fieldUpdate='cod_tipo_exercicio' fieldName='nome_tipo_exercicio' />
                                    </td>
                                    <td>
                                        <EditSelect index={indexExc} onUpdate={onUpdate} value={exc.cod_exercicio_resistencia} options={exercicios_resistencias} field='cod_exercicio_resistencia' fieldUpdate='cod_exercicio_resistencia' fieldName='nome_exercicio_resistencia' />
                                    </td>
                                    <td>
                                        <EditSelect index={indexExc} onUpdate={onUpdate} value={exc.cod_indicacao} options={indicacoes} field='cod_indicacao' fieldUpdate='cod_indicacao' fieldName='nome_indicacao' />
                                    </td>
                                    <td>
                                        <EditSelect index={indexExc} onUpdate={onUpdate} value={exc.cod_padrao_movimento} options={padraoes_movimentos} field='cod_padrao_movimento' fieldUpdate='cod_padrao_movimento' fieldName='nome_padrao_movimento' />
                                    </td>
                                    <td>
                                        <EditSelect index={indexExc} onUpdate={onUpdate} value={exc.cod_articulacao_1} options={articulacoes} field='cod_articulacao' fieldUpdate='cod_articulacao_1' fieldName='nome_articulacao' />
                                    </td>
                                    <td>
                                        <EditSelect index={indexExc} onUpdate={onUpdate} value={exc.cod_articulacao_2} options={articulacoes} field='cod_articulacao' fieldUpdate='cod_articulacao_2' fieldName='nome_articulacao' />
                                    </td>
                                    <td>
                                        <EditSelect index={indexExc} onUpdate={onUpdate} value={exc.cod_articulacao_3} options={articulacoes} field='cod_articulacao' fieldUpdate='cod_articulacao_3' fieldName='nome_articulacao' />
                                    </td>
                                    <td>
                                        <EditSelect index={indexExc} onUpdate={onUpdate} value={exc.cod_equipamento_1} options={equipamentos} field='cod_equipamento' fieldUpdate='cod_equipamento_1' fieldName='nome_equipamento' />
                                    </td>
                                    <td>
                                        <EditSelect index={indexExc} onUpdate={onUpdate} value={exc.cod_equipamento_2} options={equipamentos} field='cod_equipamento' fieldUpdate='cod_equipamento_2' fieldName='nome_equipamento' />
                                    </td>
                                    <td>
                                        <EditSelect index={indexExc} onUpdate={onUpdate} value={exc.cod_equipamento_3} options={equipamentos} field='cod_equipamento' fieldUpdate='cod_equipamento_3' fieldName='nome_equipamento' />
                                    </td>
                                    <td>
                                        <EditSelect index={indexExc} onUpdate={onUpdate} value={exc.cod_grupo_exercicio_1} options={grupos} field='cod_grupo_exercicio' fieldUpdate='cod_grupo_exercicio_1' fieldName='nome_grupo_exercicio' />
                                    </td>
                                    <td>
                                        <EditSelect index={indexExc} onUpdate={onUpdate} value={exc.cod_grupo_exercicio_2} options={grupos} field='cod_grupo_exercicio' fieldUpdate='cod_grupo_exercicio_2' fieldName='nome_grupo_exercicio' />
                                    </td>
                                    <td>
                                        <EditSelect index={indexExc} onUpdate={onUpdate} value={exc.cod_grupo_exercicio_3} options={grupos} field='cod_grupo_exercicio' fieldUpdate='cod_grupo_exercicio_3' fieldName='nome_grupo_exercicio' />
                                    </td>
                                    <td>
                                        <EditSelect index={indexExc} onUpdate={onUpdate} value={exc.cod_grupo_exercicio_4} options={grupos} field='cod_grupo_exercicio' fieldUpdate='cod_grupo_exercicio_4' fieldName='nome_grupo_exercicio' />
                                    </td>
                                    <td>
                                        <EditSelect index={indexExc} onUpdate={onUpdate} value={exc.cod_grupo_exercicio_5} options={grupos} field='cod_grupo_exercicio' fieldUpdate='cod_grupo_exercicio_5' fieldName='nome_grupo_exercicio' />
                                    </td>
                                    <td>
                                        <EditSelect index={indexExc} onUpdate={onUpdate} value={exc.cod_grupo_exercicio_6} options={grupos} field='cod_grupo_exercicio' fieldUpdate='cod_grupo_exercicio_6' fieldName='nome_grupo_exercicio' />
                                    </td>
                                    <td>
                                        <EditSelect index={indexExc} onUpdate={onUpdate} value={exc.cod_grupo_exercicio_7} options={grupos} field='cod_grupo_exercicio' fieldUpdate='cod_grupo_exercicio_7' fieldName='nome_grupo_exercicio' />
                                    </td>
                                    <td>
                                        <EditSelect index={indexExc} onUpdate={onUpdate} value={exc.cod_grupo_exercicio_8} options={grupos} field='cod_grupo_exercicio' fieldUpdate='cod_grupo_exercicio_8' fieldName='nome_grupo_exercicio' />
                                    </td>
                                    <td>
                                        <div className='dropdown'>
                                            <button onClick={e => e.stopPropagation()} className="btn border-0" data-bs-toggle="dropdown">
                                                <i className="bi bi-three-dots-vertical"></i>
                                            </button>

                                            <div className="dropdown-menu dropdown-menu-end dropdown-menu-animate-up">
                                                <a onClick={e => { e.stopPropagation(); delExercicio(exc.cod_exercicio, indexExc); }} href="#" className={`d-flex align-items-center gap-2 dropdown-item ${exc.deletedAt ? 'd-none' : ''}`}>
                                                    <i className="bi bi-trash"></i>
                                                    <p className="mb-0">Excluir</p>
                                                </a>
                                                <a onClick={e => { e.stopPropagation(); recoveryExec(exc.cod_exercicio, indexExc); }} href="#" className={`d-flex align-items-center gap-2 dropdown-item ${exc.deletedAt ? '' : 'd-none'}`}>
                                                    <i className="bi bi-trash"></i>
                                                    <p className="mb-0">Reverter</p>
                                                </a>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                
                </div>
            </div>
        </div>
    )
}

function Edit({ value, onUpdate, fieldUpdate, index }) {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(value);

    useEffect(() => {
        setInputValue(value);
    }, []);

    const handleBlur = () => {
        setIsEditing(false);
        if (inputValue.trim() && inputValue !== value) {
            onUpdate(inputValue.trim(), fieldUpdate, index);
        }
    };

    return isEditing ? (
        <input
            type="text"
            className="form-control d-inline-block w-100"
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
        </label>
    );
}

function EditSelect({ value, onUpdate, options, field, fieldName, fieldUpdate, index }) {
    const [isEditing, setIsEditing] = useState(false);
    const [newValue, setNewValue] = useState(value);

    useEffect(() => {
        setNewValue(value);
    }, []);

    const handleBlur = () => {
        setIsEditing(false);
        onUpdate(newValue, fieldUpdate, index);
        // if (newValue.trim() && newValue !== value) {
        //     onUpdate(newValue.trim());
        // }
    };

    return isEditing ? (
        // <input
        //     type="text"
        //     className="form-control d-inline-block w-100"
        //     style={{ width: "auto" }}
        //     value={inputValue}
        //     onChange={(e) => setInputValue(e.target.value)}
        //     onBlur={handleBlur}
        //     onKeyDown={e => e.key === 'Enter' ? handleBlur() : null}
        //     autoFocus
        // />
        <div className="w-100">
            {/* <label className="form-label fw-bold">Nível *</label> */}
            <select
                onBlur={handleBlur}
                value={newValue}
                className="form-control"
                onChange={(e) => setNewValue(e.target.value)}
            >
                <option value=''>Selecione</option>
                {options.map((opt, index) => (
                    <option key={index} value={opt[field]}>{opt[fieldName]}</option>
                ))}
            </select>
        </div>
    ) : (
        <label className="w-100" onDoubleClick={() => setIsEditing(true)}>
            {value ? (options?.find((e) => (e[field] || '') == value))[fieldName] : '-'}
        </label>
    );
}

export default AjusteExercicios;