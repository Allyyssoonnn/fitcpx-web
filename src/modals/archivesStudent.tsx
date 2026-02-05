import { deleteAttachment, getStudentsAttachments, sendStudentsAttachments } from "@/api/student";
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "@/components/fitUI/dropzone.ui"; // Supondo que sejam seus componentes
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area"; // Importante para listas longas
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { format } from "date-fns"; // Opcional, para datas
import { Download, File, FileText, Image as ImageIcon, Trash2, Upload, X } from "lucide-react";
import { useState } from "react";
import { useQuery } from "react-query";
import { toast } from "sonner";
import { useNotificacao } from "../states/states";

// Tipagem simulada
type Archive = {
   id: number;
   name: string;
   url: string;
   type: "pdf" | "image" | "other";
   createdAt: Date;
};

const ArchivesStudent = NiceModal.create(({ studentId, studentName }: { studentId: number; studentName: string }) => {
   const { visible, remove } = useModal();
   const [activeTab, setActiveTab] = useState("list");

   const { data: archives, refetch } = useQuery<Archive[]>({
      queryKey: ["attachments", studentId],
      queryFn: ({ queryKey }) => getStudentsAttachments(queryKey[1] as string),
      initialData: [],
      enabled: !!studentId,
   });

   return (
      <Dialog open={visible} onOpenChange={remove}>
         <DialogContent
            className="sm:max-w-lg md:max-w-xl p-0 gap-0 overflow-hidden"
            onInteractOutside={(e) => {
               // Se o elemento clicado pertencer ao SweetAlert, impede o Dialog de fechar
               if ((e.target as Element).closest(".swal2-container")) {
                  e.preventDefault();
               }
            }}
         >
            {/* Header com fundo sutil para destacar do corpo */}
            <DialogHeader className="p-6 pb-4 bg-muted/10 border-b">
               <DialogTitle className="text-xl flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Arquivos do Aluno
               </DialogTitle>
               <DialogDescription>
                  Gerencie documentos e anexos de <span className="font-medium text-primary">{studentName}</span>.
               </DialogDescription>
            </DialogHeader>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
               <div className="px-6 pt-4">
                  <TabsList className="grid w-full grid-cols-2 h-10">
                     <TabsTrigger value="list">Meus Arquivos</TabsTrigger>
                     <TabsTrigger value="upload" className="gap-2">
                        <Upload size={16} /> Novo Upload
                     </TabsTrigger>
                  </TabsList>
               </div>

               <div className="p-6 min-h-[320px]">
                  <TabsContent value="list" className="mt-0 h-full">
                     <ListArchives archives={archives ?? []} refetch={refetch} />
                  </TabsContent>

                  <TabsContent value="upload" className="mt-0 h-full flex flex-col justify-between">
                     <UploadArchive
                        onCancel={() => setActiveTab("list")}
                        refetch={refetch}
                        studentdId={String(studentId)}
                     />
                  </TabsContent>
               </div>
            </Tabs>
         </DialogContent>
      </Dialog>
   );
});

// --- Componente de Lista Melhorado ---
function ListArchives({ archives, refetch }: { archives: Archive[]; refetch: () => void }) {
   const { nConfirm } = useNotificacao();

   async function download(awsURL: string, fileName?: string) {
      if (!awsURL) toast.error("Arquivo sem link.");

      try {
         // 1. Faz o fetch do arquivo como um Blob (Binário)
         const response = await fetch(awsURL);

         if (!response.ok) throw new Error("Falha ao baixar arquivo");

         const blob = await response.blob();

         // 2. Cria uma URL temporária no navegador
         const url = window.URL.createObjectURL(blob);
         const link = document.createElement("a");
         link.href = url;

         // 3. Define o nome do arquivo (Tenta pegar da URL se não informado)
         const name = fileName || awsURL.split("/").pop() || "download";
         link.setAttribute("download", name);

         // 4. Simula o clique e limpa a memória
         document.body.appendChild(link);
         link.click();

         // Limpeza
         link.parentNode?.removeChild(link);
         window.URL.revokeObjectURL(url);
      } catch (err) {
         console.error(err);
         toast.error("Erro ao baixar. O arquivo pode ser privado ou bloqueado por CORS.");

         // Fallback: Tenta apenas abrir em nova aba se o download falhar
         window.open(awsURL, "_blank");
      }
   }

   async function deleteAttach(id: number) {
      nConfirm("", "Tem certeza que deseja apagar o arquivo?", async () => {
         try {
            await deleteAttachment(id);
            refetch();
         } catch (error) {
            console.error(error);
            toast.error("Erro ao apagar arquivo.");
         }
      });
   }

   if (archives.length === 0) {
      return (
         <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground gap-2 border-2 border-dashed rounded-lg border-muted/50 bg-muted/5">
            <File className="w-10 h-10 opacity-20" />
            <p>Nenhum arquivo encontrado.</p>
            <p className="text-xs">Vá para a aba de upload para adicionar.</p>
         </div>
      );
   }

   return (
      <ScrollArea className="h-[300px] pr-4">
         <div className="space-y-2">
            {archives.map((file) => (
               <div
                  key={file.id}
                  className="group flex items-center justify-between p-3 rounded-lg border bg-card hover:border-primary/50 hover:shadow-sm transition-all duration-200"
               >
                  <div className="flex items-center gap-3 overflow-hidden">
                     {/* Ícone baseado no tipo */}
                     <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                        {[".png", ".jpg", ".jpeg"].includes(file.type) ? (
                           <ImageIcon size={20} />
                        ) : (
                           <FileText size={20} />
                        )}
                     </div>

                     <div className="flex flex-col truncate">
                        <span className="font-medium text-sm truncate text-foreground">{file.name}</span>
                        <span className="text-xs text-muted-foreground">{format(file.createdAt, "dd/MM/yyyy")}</span>
                     </div>
                  </div>

                  <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                     <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={() => download(file.url, file.name)}
                     >
                        <Download size={16} />
                     </Button>

                     <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteAttach(file.id)}
                     >
                        <Trash2 size={16} />
                     </Button>
                  </div>
               </div>
            ))}
         </div>
      </ScrollArea>
   );
}

// --- Componente de Upload Melhorado ---
function UploadArchive({
   onCancel,
   refetch,
   studentdId,
}: {
   onCancel: () => void;
   refetch: () => void;
   studentdId: string;
}) {
   const [files, setFiles] = useState<File[]>([]);
   const [isUploading, setIsUploading] = useState(false);

   const removeFile = (index: number) => {
      setFiles((prev) => prev.filter((_, i) => i !== index));
   };

   async function sendAttachments() {
      if (!files.length) {
         toast.error("Selecione os arquivos");
         return;
      }

      try {
         const formData = new FormData();
         for (const file of files) {
            formData.append("files", file);
         }
         // Apenas passe os dados brutos. O serviço que se vire para formatar.
         await sendStudentsAttachments(formData, studentdId);

         toast.success("Arquivos enviados!");
         refetch();
         onCancel(); // Opcional: fechar após sucesso
      } catch (error) {
         toast.error("Erro ao enviar arquivos");
         console.error(error);
      } finally {
         setIsUploading(false);
      }
   }

   return (
      <div className="flex flex-col h-full gap-4">
         {/* Área de Dropzone */}
         <div className="flex-1">
            <Dropzone
               maxFiles={5}
               src={files}
               //Para aceitar multiplos arquivos
               onDrop={(acceptedFiles) => {
                  if ([...files, ...acceptedFiles].length == 6) {
                     toast.error("Limite de upload atingido");
                  } else {
                     setFiles((prev) => [...prev, ...acceptedFiles]);
                  }
               }}
               // onDrop={(acceptedFiles) => setFiles(acceptedFiles)}
               accept={{ "image/*": [".png", ".jpg", ".jpeg"], "document/*": [".pdf", ".docx"] }}
               maxSize={5 * 1024 * 1024}
               // A classe aqui controla apenas o container externo (tamanho, borda base)
               className="w-full h-40 bg-muted/5 border-dashed border-2 hover:border-primary/50 hover:bg-muted/10 transition-colors"
            >
               <DropzoneEmptyState />
               <DropzoneContent />
            </Dropzone>

            {/* Lista de Preview dos arquivos selecionados */}
            {files.length > 0 && (
               <div className="space-y-2 animate-in slide-in-from-top-2 fade-in duration-300 mt-3">
                  <div className="flex items-center justify-between">
                     <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Selecionados ({files.length})
                     </p>
                     <Button
                        variant="link"
                        className="h-auto p-0 text-xs text-destructive hover:no-underline"
                        onClick={() => setFiles([])}
                     >
                        Limpar tudo
                     </Button>
                  </div>

                  <ScrollArea className="h-[120px] pr-3">
                     <div className="space-y-2">
                        {files.map((file, idx) => (
                           <div
                              key={`${file.name}-${idx}`}
                              className="group flex items-center justify-between p-2 text-sm border rounded-md bg-card/50 hover:bg-card transition-colors"
                           >
                              <div className="flex items-center gap-2 truncate">
                                 {/* Pequeno ícone visual na lista */}
                                 <div className="p-1 rounded bg-primary/10 text-primary">
                                    {file.type.includes("pdf") ? <FileText size={14} /> : <ImageIcon size={14} />}
                                 </div>
                                 <span className="truncate max-w-[180px] text-foreground/90">{file.name}</span>
                              </div>

                              <Button
                                 variant="ghost"
                                 size="icon"
                                 className="h-6 w-6 opacity-70 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10"
                                 onClick={(e) => {
                                    e.stopPropagation();
                                    removeFile(idx);
                                 }}
                              >
                                 <X size={14} />
                              </Button>
                           </div>
                        ))}
                     </div>
                  </ScrollArea>
               </div>
            )}
         </div>

         {/* Footer de Ações dentro da Tab */}
         <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onCancel}>
               Cancelar
            </Button>
            <Button disabled={files.length === 0 || isUploading} className="min-w-[100px]" onClick={sendAttachments}>
               {isUploading ? "Enviando..." : "Enviar Arquivos"}
            </Button>
         </div>
      </div>
   );
}

export const modalArchivesStudent = {
   show: (props?: any) => NiceModal.show(ArchivesStudent, props),
   hide: () => NiceModal.hide(ArchivesStudent),
};
