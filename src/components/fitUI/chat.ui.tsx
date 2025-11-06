import { getMessages, getPreviewMessages, sendMessage } from "@/api/chat";
import { getStudents } from "@/api/student";
import {
   ArrowDown,
   ArrowLeft,
   ArrowUp,
   Check,
   CheckCheck,
   MessageCircle,
   MessageCirclePlus,
   SendHorizonal,
} from "lucide-react";
import { forwardRef, useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { Button } from "../ui/button";
import { Command, CommandItem } from "../ui/command";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

interface ActiveChat {
   studentId: number;
   studentName: string;
   messages: Message[];
}

interface ChatMessagesProps {
   activeChat: ActiveChat | undefined;
   sendMessageChat: (text: string) => void;
}

interface ChatContactsProps {
   startNewChat: () => void;
   openChat: (id: number, name?: string) => void;
   recentContacts: Message[];
}

interface Message {
   message: string;
   studentId: number;
   studentName: string;
   userName: string;
   userId: number | null;
   companyId: number;
   createdAt: string;
   from: string;
   status: string;
}

interface ChatContactProps {
   openChat: () => void;
   name: string;
   message: string;
   date?: string;
}

export default function ChatUI() {
   const containerRef = useRef<HTMLDivElement>(null);
   const [show, setShow] = useState(false);
   const [showNewChat, setShowNewChat] = useState(false);
   const [studentId, setStudentId] = useState(0);
   const [activeChat, setActiveChat] = useState<ActiveChat>();

   const { data, refetch } = useQuery({
      queryKey: ["chat"],
      queryFn: getPreviewMessages,
      initialData: [],
   });

   useEffect(() => {
      if (containerRef.current) {
         containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
   }, [show, studentId, activeChat]);

   const openChat = async (id: number, name?: string) => {
      setShowNewChat(false);
      const resp = await getMessages(String(id));
      setActiveChat({
         messages: resp,
         studentId: id,
         studentName: resp[0]?.studentName ?? name ?? "",
      });
      setStudentId(id);
   };

   const sendMessageChat = async (text: string) => {
      if (activeChat?.studentId) {
         await sendMessage(text, String(activeChat?.studentId));
         openChat(activeChat?.studentId);
      }
      refetch();
   };

   return (
      <div
         className={`
            lg:w-96 lg:end-10 lg:bottom-0 lg:top-auto lg:h-[550px] lg:shadow-xl
            right-0 bottom-5
            ${show ? "w-full" : "w-10"}
            fixed rounded-lg flex flex-col justify-between shadow-xl overflow-hidden transition-all duration-300
         `}
         // style={{ zIndex: 1000 }}
         style={{ zIndex: 1000, height: show ? "550px" : "40px" }}
      >
         {studentId > 0 && <ChatBackBar show={show} setShow={setShow} openChat={openChat} activeChat={activeChat} />}
         {studentId <= 0 && <ChatBar show={show} setShow={setShow} />}

         {show && !showNewChat && !activeChat?.studentId && (
            <ChatContacts openChat={openChat} recentContacts={data} startNewChat={() => setShowNewChat(true)} />
         )}
         {show && !showNewChat && !!activeChat?.studentId && activeChat?.studentId > 0 && (
            <ChatMessages activeChat={activeChat} ref={containerRef} sendMessageChat={sendMessageChat} />
         )}
         {show && showNewChat && !activeChat?.studentId && (
            <NewChat openChat={openChat} closeNewChat={() => setShowNewChat(false)} />
         )}
      </div>
   );
}

function ChatBar({ show, setShow }: { show: boolean; setShow: (status: boolean) => void }) {
   return (
      <Button className="bg-green-400 bottom-0 p-2 lg:flex lg:justify-between shadow-md" onClick={() => setShow(!show)}>
         <div className="flex items-center">
            <MessageCircle className="text-white size-5" />
            <label className="text-white flex-nowrap flex cursor-pointer d-none d-lg-block ms-1">Conversas</label>
         </div>

         <div className="flex justify-end items-center d-none d-lg-block">{show ? <ArrowDown /> : <ArrowUp />}</div>
      </Button>
   );
}

function ChatBackBar({
   show,
   setShow,
   openChat,
   activeChat,
}: {
   show: boolean;
   setShow: (status: boolean) => void;
   openChat: (id: number) => void;
   activeChat: ActiveChat | undefined;
}) {
   function back(e: any) {
      e.preventDefault();
      e.stopPropagation();
      openChat(0);
   }
   return (
      <Button className="bg-green-400 bottom-0 p-2 flex justify-between shadow-md" onClick={() => setShow(!show)}>
         <Button size="sm" variant="ghost" onClick={back}>
            <ArrowLeft />
         </Button>

         <div className="flex gap-1 items-center">
            <label className="text-white flex-nowrap flex font-semibold">{activeChat?.studentName}</label>
            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-700">
               {activeChat?.studentName ? String(activeChat?.studentName).substring(0, 1) : ""}
            </div>
         </div>
      </Button>
   );
}

const ChatMessages = forwardRef<HTMLDivElement, ChatMessagesProps>(({ activeChat, sendMessageChat }, ref) => {
   return (
      <>
         <div ref={ref} className="bg-gray-200 p-3 gap-3 flex flex-col overflow-auto h-full">
            {activeChat?.messages.map((v) => (
               <ChatMessage
                  status={v.status}
                  message={v.message}
                  from={v.from}
                  name={v.from === "student" ? activeChat?.studentName : v.userName ?? "Você"}
               />
            ))}
         </div>
         <ChatSend sendMessageChat={sendMessageChat} />
      </>
   );
});

function ChatContacts({ openChat, recentContacts, startNewChat }: ChatContactsProps) {
   const [search, setSearch] = useState("");

   function normalizeText(text: string) {
      return text
         ?.toString()
         .normalize("NFD") // separa acentos
         .replace(/[\u0300-\u036f]/g, "") // remove acentos
         .toLowerCase(); // deixa minúsculo
   }

   return (
      <>
         <div className="flex justify-center items-center py-2 px-1 gap-2 bg-white">
            <Input
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               placeholder="Pesquise"
               className="bg-white"
            />

            <Button size="sm" onClick={startNewChat}>
               <MessageCirclePlus />
               Nova <span className="d-none d-lg-block">conversa</span>
            </Button>
         </div>

         <Command className="bg-white flex flex-col overflow-auto">
            {recentContacts.map((v) => {
               if (!normalizeText(v.studentName).includes(normalizeText(search))) return;
               return (
                  <ChatContact
                     name={v.studentName}
                     date={v.createdAt}
                     message={v.message}
                     openChat={() => openChat(v.studentId)}
                  />
               );
            })}
         </Command>
      </>
   );
}

function ChatContact({ name, openChat, message, date }: ChatContactProps) {
   return (
      <CommandItem
         className="flex flex-col justify-start items-start p-3 border-b hover:bg-gray-100 cursor-pointer"
         onSelect={openChat}
      >
         <div className="w-full flex justify-between items-center">
            {/* Nome em negrito para destaque */}
            <label className="font-semibold text-gray-800">{name}</label>
            {/* Data menor e em cor de destaque */}
            {date && <label className="text-xs text-gray-500">{new Date(date).toLocaleString()}</label>}
         </div>
         {/* Última mensagem mais clara e truncada */}
         <label className="text-sm text-gray-600 truncate w-full">{message}</label>
      </CommandItem>
   );
}

function ChatMessage({ message, from, name, status }: { message: string; from: string; name: string; status: string }) {
   const position = from === "student" ? "justify-start" : "justify-end";
   const isStudent = from === "student";
   const bubbleClass = isStudent ? "bg-white text-gray-900" : "bg-green-500 text-white";
   return (
      <div className={`flex ${position}`}>
         {/* Max-width e arredondamento aprimorado */}
         <div className={`max-w-[80%] p-2 rounded-xl flex shadow-sm flex-col ${bubbleClass}`}>
            {/* Nome do remetente (removido ou sutil se for você mesmo) */}
            {isStudent && <label className="text-xs font-semibold mb-1">{name}</label>}

            <label style={{ whiteSpace: "pre-wrap" }} className="text-sm">
               {message}
            </label>

            <div className="fs-1 self-end flex items-center gap-1 mt-1 text-xs opacity-75">
               {/* Use uma formatação de horário mais simples para o chat ativo */}
               {new Date().toLocaleString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
               })}

               {/* Ícones de status com cores (ajuste o tamanho para 12px) */}
               {isStudent ? null : status == "read" ? ( // O status de leitura só é relevante para o usuário que enviou
                  <CheckCheck size={12} className="text-blue-500" />
               ) : (
                  <Check size={12} className="text-gray-200" />
               )}
            </div>
         </div>
      </div>
   );
}

function ChatSend({ sendMessageChat }: { sendMessageChat: (text: string) => void }) {
   const [text, setText] = useState("");

   function send() {
      if (text) {
         sendMessageChat(text);
         setText("");
      }
   }

   return (
      <div className="flex bg-white items-end p-1 border-t border-gray-200">
         <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Digite sua mensagem..."
            style={{ resize: "none", height: "40px" }}
            className="border-0 focus:ring-0 p-2"
         />

         <Button variant="ghost" onClick={send} className="h-10 w-10 text-green-500 hover:text-green-600">
            <SendHorizonal />
         </Button>
      </div>
   );
}

function NewChat({
   openChat,
   closeNewChat,
}: {
   openChat: (id: number, name?: string) => void;
   closeNewChat: () => void;
}) {
   const { data: students, refetch } = useQuery({
      queryKey: ["students"],
      queryFn: () => getStudents(false),
      initialData: [],
   });

   const [search, setSearch] = useState("");

   function normalizeText(text: string) {
      return text
         ?.toString()
         .normalize("NFD") // separa acentos
         .replace(/[\u0300-\u036f]/g, "") // remove acentos
         .toLowerCase(); // deixa minúsculo
   }

   return (
      <>
         <div className="flex justify-center items-center py-2 px-1 gap-2 bg-white">
            <Input
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               placeholder="Pesquise"
               className="bg-white"
            />

            <Button size="sm" onClick={closeNewChat}>
               <MessageCircle />
               Conversas
            </Button>
         </div>

         <Command className="bg-white flex flex-col overflow-auto">
            {students.map((v: any) => {
               if (!normalizeText(v.nome_aluno).includes(normalizeText(search))) return;
               return (
                  <ChatContact
                     name={v.nome_aluno}
                     message="Iniciar uma conversa"
                     openChat={() => openChat(v.cod_aluno, v.nome_aluno)}
                  />
               );
            })}
         </Command>
      </>
   );
}
