import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { useRecoilState } from "recoil";
import { getCalendar, newEvent } from "../../api/calendar";
import { getServices } from "../../api/services";
import { getStudents } from "../../api/student";
import FitFormUI from "../../components/fitUI/fitForm.ui";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { stateEmpresa, stateUsuario } from "../../states/states";
import { formatDateToLocalInput } from "../../utils";

function Agenda() {
   return (
      <div className="container-fluid">
         <Card>
            <CardContent className="calender-sidebar app-calendar">
               <Calendario />
            </CardContent>
         </Card>
      </div>
   );
}

function Calendario() {
   const [empresa] = useRecoilState(stateEmpresa);
   const [usuario] = useRecoilState(stateUsuario);
   const form = useForm({ defaultValues: { tipo_evento: "Agendamento" } });
   const {
      handleSubmit,
      setValue,
      formState: { errors },
      reset,
   } = form;

   const { data: alunos } = useQuery({
      queryKey: ["alunos"],
      queryFn: getStudents,
      initialData: [],
      enabled: !!usuario.cod_empresa,
   });

   const { data: modalidades } = useQuery({
      queryKey: ["modalidades", usuario.cod_empresa],
      queryFn: getServices,
      initialData: [],
   });

   const { data: agenda, refetch } = useQuery({
      queryKey: ["agenda", usuario.cod_usuario],
      queryFn: async () => {
         const resp = await getCalendar();
         const data = resp.map((e) => ({
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
         setValue("cod_agenda", event.id);
         setValue("nome_evento", event.title);
         setValue("cod_modalidade", event.extendedProps.cod_modalidade);
         setValue("cod_aluno", event.extendedProps.cod_aluno);
         setValue("tipo_evento", event.extendedProps.calendar);
         setValue("data_inicio", formatDateToLocalInput(new Date(event.start))); // Formato de data para datetime-local
         setValue(
            "data_fim",
            event.end ? formatDateToLocalInput(new Date(event.end)) : formatDateToLocalInput(new Date(event.start))
         ); // Caso tenha um horário de término

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
      const payload = {
         ...data,
         cod_usuario: usuario.cod_usuario,
         cod_empresa: usuario.cod_empresa,
      };

      // Corrige selects vazios
      Object.keys(payload).forEach((key) => {
         if (payload[key] === "") payload[key] = null;
      });

      // Converte datetime-local -> ISO string (ou UTC se preferir)
      if (payload.data_inicio) payload.data_inicio = new Date(payload.data_inicio).toISOString();
      if (payload.data_fim) payload.data_fim = new Date(payload.data_fim).toISOString();

      await newEvent(payload);
      setShowModal(false);
      refetch();
   };

   const handleDateClick = (info) => {
      reset();
      let start;

      if (info.allDay) {
         // Dia inteiro: usar o dia clicado + hora atual
         const now = new Date();
         start = new Date(
            info.start.getFullYear(),
            info.start.getMonth(),
            info.start.getDate(),
            now.getHours(),
            now.getMinutes()
         );
      } else {
         // Clicou em horário específico: usar exatamente o horário clicado
         start = new Date(info.start);
      }

      // Fim do evento: +1 hora
      const end = new Date(start.getTime() + 60 * 60 * 1000);

      // Verifica se a data formatada é válida
      if (isNaN(new Date(start).getTime()) || isNaN(new Date(end).getTime())) {
         console.error("Datas formatadas inválidas:", start, end);
         return;
      }
      const formattedStart = formatDateToLocalInput(start);
      const formattedEnd = formatDateToLocalInput(end);

      setValue("data_inicio", formattedStart);
      setValue("data_fim", formattedEnd);
      setShowModal(true);
   };

   const handleEventClick = (info) => {
      const event = info.event;

      // Preenche os campos do formulário com os dados do evento
      if (event.cod_evento) setValue("cod_evento", event.cod_evento);
      if (event.cod_modalidade) setValue("cod_modalidade", event.cod_modalidade);
      setValue("cod_empresa", empresa.cod_empresa);
      setValue("nome_evento", event.title);
      setValue("descricao_evento", event.extendedProps.descricao_evento);
      setValue("cod_aluno", event.extendedProps.cod_aluno);
      setValue("tipo_evento", event.extendedProps.tipo_evento);
      setValue("cor_evento", event.backgroundColor);
      setValue("data_inicio", event.start.toISOString().slice(0, 16));
      setValue("data_fim", event.end ? event.end.toISOString().slice(0, 16) : event.start.toISOString().slice(0, 16));

      setShowModal(true);
   };

   return (
      <div style={{ height: "900px" }}>
         <FullCalendar
            eventContent={(arg) => {
               const tipo = arg.event.extendedProps.tipo_evento;

               // Cor da marca-texto
               let highlightColor = "rgba(200,200,200,0.3)"; // cinza claro
               if (tipo === "Disponibilidade") highlightColor = "rgba(0,200,0,0.3)"; // verde

               return (
                  <div
                     style={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                     }}
                  >
                     {/* Marca-texto completa */}
                     <div
                        style={{
                           position: "absolute",
                           inset: 0,
                           background: highlightColor,
                           zIndex: 0,
                           borderRadius: "4px",
                        }}
                     ></div>

                     {/* Conteúdo do evento */}
                     <div
                        style={{
                           position: "relative",
                           zIndex: 1,
                           display: "flex",
                           alignItems: "center",
                           padding: "2px 4px",
                        }}
                     >
                        {/* Bolinha com cor do evento */}
                        <span
                           style={{
                              display: "inline-block",
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              backgroundColor: arg.event.backgroundColor,
                              marginRight: "4px",
                           }}
                        ></span>

                        {/* Hora */}
                        {arg.timeText && <strong>{arg.timeText} </strong>}

                        {/* Título */}
                        <span style={{ marginLeft: "2px" }}>{arg.event.title}</span>
                     </div>
                  </div>
               );
            }}
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
                     setShowModal(true);
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
            height={900}
         />

         <Dialog open={showModal} onOpenChange={(open) => setShowModal(open)}>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
               <FormProvider {...form}>
                  <form onSubmit={handleSubmit(handleAddEvent)} className="modal-content">
                     <DialogHeader>
                        <DialogTitle>Novo evento</DialogTitle>
                     </DialogHeader>

                     <FitFormUI
                        errors={errors}
                        fields={[
                           {
                              cols: 1,
                              fields: [
                                 {
                                    label: "Tipo",
                                    selectOptions: ["Agendamento", "Disponibilidade"],
                                    type: "toggle",
                                    fieldName: "tipo_evento",
                                 },
                                 {
                                    label: "Modalidade/Serviço",
                                    fieldName: "cod_modalidade",
                                    type: "select",
                                    selectOptions: modalidades.map((modalidade) => ({
                                       label: modalidade.nome_modalidade,
                                       value: modalidade.cod_modalidade,
                                    })),
                                    clearSelectButton: true,
                                 },
                                 {
                                    label: "Aluno",
                                    fieldName: "cod_aluno",
                                    type: "select",
                                    selectOptions: alunos.map((aluno) => ({
                                       label: aluno.nome_aluno,
                                       value: aluno.cod_aluno,
                                    })),
                                    clearSelectButton: true,
                                 },
                                 {
                                    label: "Nome",
                                    fieldName: "nome_evento",
                                    hideField: (data) => !!data?.cod_modalidade,
                                    options: {
                                       required: true,
                                    },
                                 },
                                 {
                                    label: "Descrição",
                                    fieldName: "descricao_evento",
                                    hideField: (data) => !!data?.cod_modalidade,
                                    options: {
                                       required: true,
                                    },
                                 },
                                 {
                                    label: "Cor",
                                    fieldName: "cor_evento",
                                    hideField: (data) => !!data?.cod_modalidade,
                                    type: "color",
                                    options: {
                                       required: true,
                                    },
                                 },
                                 {
                                    label: "Início",
                                    fieldName: "data_inicio",
                                    inputType: "datetime-local",
                                    options: {
                                       required: true,
                                    },
                                 },
                                 {
                                    label: "Fim",
                                    fieldName: "data_fim",
                                    inputType: "datetime-local",
                                    options: {
                                       required: true,
                                    },
                                 },
                              ],
                           },
                        ]}
                     />

                     <DialogFooter className="mt-3">
                        <Button type="submit">Confirmar</Button>
                     </DialogFooter>
                  </form>
               </FormProvider>
            </DialogContent>
         </Dialog>
      </div>
   );
}

export default Agenda;
