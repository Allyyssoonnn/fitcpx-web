import { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import { Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { stateEmpresa, stateUsuario } from "../../states/states";
import { useRecoilState } from "recoil";
import { conectedGoogle, conectGoogle, getAgenda, setAgenda, syncGoogleEvents } from "../../api/agenda";
import { useQuery } from "react-query";
import { getAlunos } from "../../api/aluno";
import { getGoogleConnect } from "../../api/usuario";
import FitSelectForm from "../../components/baseComponents/FitSelectForm";
import FitInputForm from "../../components/baseComponents/FitInputForm";
import { getModalidades } from "../../api/plano";
import { formatDateToLocalInput } from "../../utils";

function Agenda() {
    const [empresa] = useRecoilState(stateEmpresa);
    const [usuario, setusuario] = useRecoilState(stateUsuario);

    useEffect(() => {
        (async function conect() {
            const params = new URLSearchParams(window.location.search);
            const code = params.get("code");
            const scope = params.get("scope");
        
            if (code) {
                const resp = await conectedGoogle(code, scope, empresa?.cod_empresa);
                
                // Remove code e scope da URL
                params.delete("code");
                params.delete("scope");
                
                // Atualiza a URL sem os parâmetros
                window.history.replaceState({}, document.title, window.location.pathname + '?' + params.toString());

                const resp2 = await getGoogleConnect(empresa?.cod_empresa);
                setusuario(prev => ({ ...prev, google: resp2 }));
            }
        })();
        (async function getConnected() {
            // if (usuario?.google?.email_google) return;
            const resp = await getGoogleConnect(empresa?.cod_empresa);
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
            <div className="card shadow-lg rounded-4">
                <div className="card-header d-flex justify-between">
                    <div className="col-3 mb-2 mb-sm-0">
                        {/* <button
                            disabled
                            // disabled={usuario?.google?.email_google}
                            onClick={conect}
                            className={`${usuario?.google?.email_google && 'd-none'} btn text-dark border fw-normal d-flex align-items-center justify-content-center py-8`} role="button"
                        >
                            <img src="../assets/images/svgs/google-icon.svg" className="img-fluid me-2" width="18" height="18" />
                            <span className="flex-shrink-0">Conectar Google agenda</span>
                        </button> */}

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
    const [empresa] = useRecoilState(stateEmpresa);
    const [usuario] = useRecoilState(stateUsuario);
    const { handleSubmit, register, setValue, formState: { errors }, reset, control } = useForm();

    const { data: alunos } = useQuery({
        queryKey: ['alunos', usuario.cod_usuario],
        queryFn: () => getAlunos(usuario.cod_usuario, usuario.cod_empresa),
        initialData: [],
        enabled: !!usuario.cod_empresa
    });

    const { data: modalidades, refetch } = useQuery({
        queryKey: ['modalidades', usuario.cod_empresa],
        queryFn: () => getModalidades(usuario.cod_empresa),
        initialData: [],
    });

    const { data: agenda } = useQuery({
        queryKey: ['agenda', usuario.cod_usuario],
        queryFn: async () => {
            const resp = await getAgenda(empresa.cod_empresa)
            const data = resp.map(e => ({
                id: e.cod_agenda,
                title: e.nome_evento,
                start: e.data_inicio,
                end: e.data_fim,
                backgroundColor: e.cor_evento,
                borderColor: e.cor_evento,
                extendedProps: {
                    cod_aluno: e.cod_aluno,
                    tipo_evento: e.tipo_evento,
                    descricao_evento: e.descricao_evento,
                    cor_evento: e.cor_evento,
                },
            }))
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
            setValue('cod_agenda', event.id);
            setValue('nome_evento', event.title);
            setValue('cod_modalidade', event.extendedProps.cod_modalidade);
            setValue('cod_aluno', event.extendedProps.cod_aluno);
            setValue('tipo_evento', event.extendedProps.calendar);
            setValue('data_inicio', formatDateToLocalInput(new Date(event.start)));  // Formato de data para datetime-local
            setValue('data_fim', event.end ? formatDateToLocalInput(new Date(event.end)) : formatDateToLocalInput(new Date(event.start)));  // Caso tenha um horário de término
    
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
        reset();
        const clickedDate = new Date(info.start);
        const start = new Date(clickedDate);
        const end = new Date(clickedDate.getTime() + 60 * 60 * 3000); // +1 hora

        setValue('data_inicio', formatDateToLocalInput(start));
        setValue('data_fim', formatDateToLocalInput(end));

        // Verifica se a data formatada é válida
        if (isNaN(new Date(start).getTime()) || isNaN(new Date(end).getTime())) {
            console.error("Datas formatadas inválidas:", start, end);
            return;
        }

        setValue('data_inicio', start);
        setValue('data_fim', end);
        setShowModal(true);
    };

    const handleEventClick = (info) => {
        const event = info.event;

        // Preenche os campos do formulário com os dados do evento
        if (event.cod_evento) setValue('cod_evento', event.cod_evento);
        setValue('cod_empresa', empresa.cod_empresa);
        setValue('nome_evento', event.title);
        setValue('descricao_evento', event.extendedProps.descricao_evento);
        setValue('cod_aluno', event.extendedProps.cod_aluno);
        setValue('tipo_evento', event.extendedProps.tipo_evento);
        setValue('cor_evento', event.backgroundColor);
        setValue('data_inicio', event.start.toISOString().slice(0, 16));
        setValue('data_fim', event.end ? event.end.toISOString().slice(0, 16) : event.start.toISOString().slice(0, 16));

        setShowModal(true);
    }

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
                eventClick={handleEventClick}
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
                                <div className="d-flex gap-2 mt-6">
                                    <OverlayTrigger placement="bottom" overlay={tooltip}>
                                        <i className='bi bi-question-circle text-danger ms-2'></i>
                                    </OverlayTrigger>

                                    <FitSelectForm
                                        classNameContainer="w-100"
                                        nameField="Tipo de Evento"
                                        errors={errors}
                                        {...register('tipo_evento', { value: 'E' })} 
                                    >
                                        <option value='Evento'>Evento</option>
                                        <option value='Disponibilidade'>Disponibilidade</option>
                                    </FitSelectForm>
                                </div>

                                <FitInputForm
                                    classNameContainer="col-md-12 mt-6"
                                    nameField="Nome do evento"
                                    errors={errors}
                                    { ...register('nome_evento', { required: true }) }
                                />

                                <FitInputForm
                                    classNameContainer="col-md-12 mt-6"
                                    nameField="Descrição do evento"
                                    errors={errors}
                                    { ...register('descricao_evento') }
                                />

                                <CorEventoPreset register={register} control={control} errors={errors} />

                                <FitSelectForm
                                    classNameContainer="col-md-12 mt-6"
                                    nameField="Modalidade (opcional)"
                                    errors={errors}
                                    { ...register('cod_modalidade') }
                                >
                                    <option value={null}></option>
                                    {modalidades.map((modalidade, index) => (
                                        <option key={index} value={modalidade.cod_modalidade}>{modalidade.nome_modalidade}</option>
                                    ))}
                                </FitSelectForm>

                                <FitSelectForm
                                    classNameContainer="col-md-12 mt-6"
                                    nameField="Aluno (opcional)"
                                    errors={errors}
                                    { ...register('cod_aluno') }
                                >
                                    <option value={null}></option>
                                    {alunos.map((aluno, index) => (
                                        <option key={index} value={aluno.cod_aluno}>{aluno.nome_aluno}</option>
                                    ))}
                                </FitSelectForm>

                                <FitInputForm
                                    classNameContainer="col-md-12 mt-6"
                                    nameField="Inicio"
                                    errors={errors}
                                    type="datetime-local"
                                    { ...register('data_inicio', { required: true }) }
                                />

                                <FitInputForm
                                    classNameContainer="col-md-12 mt-6"
                                    nameField="Fim"
                                    errors={errors}
                                    type="datetime-local"
                                    { ...register('data_fim', { required: true }) }
                                />
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

import { useWatch } from "react-hook-form";

const CorEventoPreset = ({ register, control, errors }) => {
  const selectedColor = useWatch({ control, name: 'cor_evento' });

  const cores = ['#28a745', '#007bff', '#ffc107', '#dc3545', '#6f42c1'];

  return (
    <div className="col-md-12 mt-6">
      <label className="form-label">Cor</label>
      <div className="d-flex gap-2 flex-wrap">
        {cores.map((color) => (
          <label key={color} style={{ cursor: 'pointer' }}>
            <input
              type="radio"
              value={color}
              {...register('cor_evento', { required: true })}
              className="d-none"
            />
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: color,
                border: selectedColor === color ? '3px solid black' : '2px solid #ccc',
                transition: 'border 0.2s',
              }}
            />
          </label>
        ))}
      </div>
      {errors.cor_evento && (
        <p className="text-danger mt-1">Selecione uma cor</p>
      )}
    </div>
  );
};

export default Agenda;