import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { Play } from "lucide-react";
import { useState } from "react";

const Introduction = NiceModal.create(() => {
   const { visible, remove } = useModal();

   return (
      <Dialog open={visible} onOpenChange={remove}>
         <DialogContent>
            <DialogHeader>
               <DialogTitle className="text-accent-foreground">Bem-vindo ao FitCpx!</DialogTitle>
               <DialogDescription>
                  Para começar, clique no botão abaixo e assista aos vídeos de introdução que preparamos para você. Eles
                  vão te guiar pelos primeiros passos e mostrar como aproveitar algumas das funcionalidades do FitCpx.
               </DialogDescription>
            </DialogHeader>

            <Accordion type="single" collapsible className="w-full">
               {[
                  { title: "Apresentação", url: "https://www.youtube.com/watch?v=n226rzKLYPM" },
                  {
                     title: "Como cadastrar alunos?",
                     url: "https://www.youtube.com/watch?v=BuTcMWsrgOI",
                  },
                  { title: "Como acompanhar alunos presenciais?", url: "https://www.youtube.com/watch?v=NtOzCs5VOdw" },
               ].map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-0">
                     <AccordionTrigger className="border-1 p-3">
                        <Label>{item.title}</Label>
                     </AccordionTrigger>

                     <AccordionContent className="bg-gray-50/50 p-3 rounded-md mb-2">
                        <VideoContent url={item.url} />
                     </AccordionContent>
                  </AccordionItem>
               ))}
            </Accordion>
         </DialogContent>
      </Dialog>
   );
});

function VideoContent({ url }: { url: string }) {
   const [isPlaying, setIsPlaying] = useState(false);
   const [imgSrc, setImgSrc] = useState<string>("");

   if (!url) return null;

   // Extrai o ID para pegar a thumbnail
   const getVideoId = (url: string) => {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return match && match[2].length === 11 ? match[2] : null;
   };

   const videoId = getVideoId(url);
   const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : "";

   // Atualiza a URL da imagem apenas quando o videoId muda
   if (videoId && imgSrc === "") {
      setImgSrc(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg.jpg`);
   }

   const triggerFallback = () => {
      if (videoId) {
         setImgSrc(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`);
      }
   };

   if (!videoId) return null;

   return (
      <div className="relative w-full aspect-video rounded-md overflow-hidden bg-black group cursor-pointer">
         {!isPlaying ? (
            // Exibe a imagem estática primeiro (Thumbnail)
            <div onClick={() => setIsPlaying(true)} className="w-full h-full relative">
               <img
                  src={imgSrc}
                  alt="Thumbnail do vídeo"
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  onError={triggerFallback}
                  onLoad={(e) => {
                     const img = e.currentTarget;
                     if (img.naturalWidth === 120) {
                        triggerFallback();
                     }
                  }}
               />
               {/* Botão de Play Centralizado */}
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-red-600 p-3 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                     <Play className="w-8 h-8 text-white fill-white ml-1" />
                  </div>
               </div>
            </div>
         ) : (
            // Carrega o iframe apenas ao clicar
            <iframe
               src={embedUrl}
               title="Vídeo"
               frameBorder="0"
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
               allowFullScreen
               className="absolute top-0 left-0 w-full h-full"
            ></iframe>
         )}
      </div>
   );
}

export const modalIntroduction = {
   show: (props?: any) => NiceModal.show(Introduction, props),
   hide: () => NiceModal.hide(Introduction),
};
