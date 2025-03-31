import { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import { Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { stateUsuario } from "../states/states";
import { useRecoilState } from "recoil";
import { conectedGoogle, conectGoogle, getAgenda, setAgenda, syncGoogleEvents } from "../api/agenda";
import { useQuery } from "react-query";
import { getAlunos } from "../api/aluno";
import { getGoogleConnect } from "../api/usuario";


function Agenda() {
    const [usuario, setusuario] = useRecoilState(stateUsuario);

    useEffect(() => {
        (async function conect() {
            const params = new URLSearchParams(window.location.search);
            const code = params.get("code");
            const scope = params.get("scope");
        
            if (code) {
                const resp = await conectedGoogle(code, scope, usuario?.cod_empresa);
                
                // Remove code e scope da URL
                params.delete("code");
                params.delete("scope");
                
                // Atualiza a URL sem os parâmetros
                window.history.replaceState({}, document.title, window.location.pathname + '?' + params.toString());

                const resp2 = await getGoogleConnect(usuario?.cod_empresa);
                setusuario(prev => ({ ...prev, google: resp2 }));
            }
        })();
        (async function getConnected() {
            // if (usuario?.google?.email_google) return;
            const resp = await getGoogleConnect(usuario?.cod_empresa);
            setusuario(prev => ({ ...prev, google: resp }));
        })();
    }, []);

    async function conect() {
        window.location.href = await conectGoogle();
    }

    async function syncEvents() {
        await syncGoogleEvents(usuario?.cod_empresa);
    }
    
    return (
        <div className="container-fluid">
            <div className="card">
                <div className="card-header d-flex justify-between">
                    <div className="col-3 mb-2 mb-sm-0">
                        <button disabled={usuario?.google?.email_google} onClick={conect}
                            className={`${usuario?.google?.email_google && 'd-none'} btn text-dark border fw-normal d-flex align-items-center justify-content-center py-8`} role="button"
                        >
                            <img src="../assets/images/svgs/google-icon.svg" className="img-fluid me-2" width="18" height="18" />
                            <span className="flex-shrink-0">Conectar Google agenda</span>
                        </button>

                        <button className={`${!usuario?.google?.email_google && 'd-none'} btn text-dark border fw-normal d-flex align-items-center justify-content-center py-8`}>
                            <img src="../assets/images/svgs/google-icon.svg" className="img-fluid me-2" width="18" height="18" />
                            <span className="flex-shrink-0">{usuario?.google?.email_google}</span>
                        </button>
                    </div>

                    <div className="col-3 mb-2 mb-sm-0">
                        <button onClick={syncEvents} className={`${!usuario?.google?.email_google && 'd-none'} btn text-dark border fw-normal d-flex align-items-center justify-content-center py-8`}>
                            <img src="../assets/images/svgs/google-icon.svg" className="img-fluid me-2" width="18" height="18" />
                            <span className="flex-shrink-0">Sincronizar eventos</span>
                        </button>
                    </div>
                </div>
                <div className="card-body calender-sidebar app-calendar">
                    <Calendario />
                </div>
            </div>
        </div>
    );
}

function Calendario() {
    const [usuario] = useRecoilState(stateUsuario);
    const { handleSubmit, register, setValue } = useForm();
    const { data: alunos } = useQuery({
        queryKey: ['alunos', usuario.cod_usuario],
        queryFn: () => getAlunos(usuario.cod_usuario, usuario.cod_empresa),
        initialData: [],
        enabled: !!usuario.cod_empresa
    });
    const { data: agenda } = useQuery({
        queryKey: ['agenda', usuario.cod_usuario],
        queryFn: async () => {
            const resp = await getAgenda(usuario.cod_empresa)
            const data = resp.map(e => ({
                id: e.cod_agenda,
                cod_aluno: e.cod_aluno,
                title: e.nome_evento,
                start: e.data_inicio,
                end: e.data_fim,
                extendedProps: { calendar: "Primary" },
            }));
            return data;
        },
        initialData: [],
    });
    const calendarRef = useRef(null);

    // Estado para controlar o modal
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const calendarApi = calendarRef.current.getApi();

        // Exemplo de callback ao clicar em evento
        calendarApi.on("eventClick", (info) => {
            const event = info.event;
    
            // Preenche os campos do formulário com os dados do evento
            setValue('nome_evento', event.title);
            setValue('cod_aluno', event.cod_aluno);
            setValue('tipo_evento', event.extendedProps.calendar);
            setValue('data_inicio', event.start.toISOString().slice(0, 16));  // Formato de data para datetime-local
            setValue('data_fim', event.end ? event.end.toISOString().slice(0, 16) : event.start.toISOString().slice(0, 16));  // Caso tenha um horário de término
    
            // Abre o modal
            setShowModal(true);
        });

        // Função de redimensionamento da janela
        const handleResize = () => {
        const isSmallScreen = window.innerWidth <= 1199;
        if (isSmallScreen) {
            calendarApi.changeView("listWeek");
            calendarApi.setOption("height", 900);
        } else {
            calendarApi.changeView("dayGridMonth");
            calendarApi.setOption("height", 1052);
        }
        };

        // Adiciona listener para resize
        window.addEventListener("resize", handleResize);

        return () => {
        window.removeEventListener("resize", handleResize);
        };
    }, []);

    // Função para mostrar o modal e preencher a data de início
    const handleAddEvent = async (data) => {
        await setAgenda({ ...data, cod_usuario: usuario.cod_usuario, cod_empresa: usuario.cod_empresa });
        setShowModal(false);
    };

    const handleDateClick = (info) => {
        const clickedDate = new Date(info.start);

        // Ajustar para o formato YYYY-MM-DDTHH:MM (sem segundos)
        const start = clickedDate.toISOString().slice(0, 16); // Pegando até minutos
        const end = new Date(clickedDate.getTime() + 60 * 60 * 1000).toISOString().slice(0, 16); // Pegando 1 hora após

        // Verifica se a data formatada é válida
        if (isNaN(new Date(start).getTime()) || isNaN(new Date(end).getTime())) {
            console.error("Datas formatadas inválidas:", start, end);
            return;
        }

        setValue('inicio', start);
        setValue('fim', end);
        setShowModal(true);
    };

    const tooltip = (
        <Tooltip id="tooltip">
            <div>
                <strong>Evento:</strong> Crie e gerencie eventos para notificações e controle interno.
            </div>
            <p></p>
            <div>
                <strong>Disponibilidade:</strong> Defina horários disponíveis para que seus alunos possam agendar diretamente pelo app.
            </div>
        </Tooltip>
    );

    return (
        <div style={{ height: "900px" }}>
            <FullCalendar
                locale={ptBrLocale}
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                selectable={true}
                events={agenda}
                customButtons={{
                    addEventButton: {
                        text: "Novo evento",
                        click: () => {
                            setShowModal(true)
                        },
                    },
                }}
                select={handleDateClick}
                headerToolbar={{
                    left: "prev,next addEventButton",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                // height={window.innerWidth <= 1199 ? 900 : 1052}
                height={900}
                // height="auto"
                // eventClassNames={({ event }) => {
                //     const colorClass = `fc-bg-${event.extendedProps.calendar.toLowerCase()}`;
                //     return ["event-fc-color", colorClass];
                // }}
            />

            <Modal show={showModal} className="modal-fade" id="eventModal" aria-labelledby="eventModalLabel" aria-hidden="true">
                <div className="modal-dialog-scrollable modal-lg">
                    <form onSubmit={handleSubmit(handleAddEvent)} className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="eventModalLabel">Evento</h5>
                            <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
                        </div>

                        <div className="modal-body">
                            <div className="row">
                                <div className="col-md-12 mt-6">
                                    <label className="form-label">Tipo de Cadastro</label>
                                    <OverlayTrigger placement="bottom" overlay={tooltip}>
                                        <i className='bi bi-question-circle text-danger ms-2'></i>
                                    </OverlayTrigger>
                                    <select {...register('tipo_cadastro', { value: 'E' })} className="form-control">
                                        <option value='E'>Evento</option>
                                        <option value='D'>Disponibilidade</option>
                                    </select>
                                </div>
                                
                                <div className="col-md-12 mt-6">
                                    <label className="form-label">Nome do evento</label>
                                    <input { ...register('nome_evento', { required: 'O nome do evento é obrigatório' }) } id="event-title" type="text" className="form-control" />
                                </div>

                                <div className="col-md-12 mt-6">
                                    <label className="form-label">Descrição do evento</label>
                                    <input { ...register('descricao_evento', { required: 'O nome do evento é obrigatório' }) } id="event-title" type="text" className="form-control" />
                                </div>

                                <div className="col-md-12 mt-6">
                                    <label className="form-label">Tipo do evento</label>
                                    <input { ...register('tipo_evento') } id="event-title" type="text" className="form-control" />
                                </div>

                                <div className="col-md-12 mt-6">
                                    <label className="form-label">Cor</label>
                                    <select {...register('cor_evento')} className="form-control">
                                        <option value=''>Selecione a cor</option>
                                    </select>
                                </div>

                                <div className="col-md-12 mt-6">
                                    <label className="form-label">Aluno (opcional)</label>
                                    <select {...register('cod_aluno')} className="form-control">
                                        <option value=''>Selecione o aluno</option>
                                        {alunos.map((aluno, index) => (
                                            <option key={index} value={aluno.cod_aluno}>{aluno.nome_aluno}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-12 mt-6">
                                    <label className="form-label">Inicio</label>
                                    <input { ...register('data_inicio', { required: 'A data de inicio é obrigatória' }) } id="event-start-date" type="datetime-local" className="form-control" />
                                </div>

                                <div className="col-md-12 mt-6">
                                    <label className="form-label">Fim</label>
                                    <input { ...register('data_fim', { required: 'A data de fim é obrigatória' }) } id="event-end-date" type="datetime-local" className="form-control" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="modal-footer">
                            <button className="btn bg-danger-subtle text-danger" type="button" onClick={() => setShowModal(false)}>Fechar</button>
                            <button className="btn btn-success" type="submit">Confirmar</button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
}

export default Agenda;