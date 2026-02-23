import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import NiceModal, { useModal } from "@ebay/nice-modal-react";

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
                  { title: "Apresentação", url: "https://www.youtube.com/watch?v=n226rzKLYPM&feature=youtu.be" },
                  {
                     title: "Como cadastrar alunos?",
                     url: "https://www.youtube.com/watch?v=BuTcMWsrgOI&feature=youtu.be",
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
   if (!url) return null;

   const embedUrl = getYouTubeEmbedUrl(url);

   return (
      <div className="relative w-full aspect-video rounded-md overflow-hidden bg-black">
         <iframe
            src={embedUrl}
            title="Vídeo"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full"
            loading="lazy"
         ></iframe>
      </div>
   );
}

function getYouTubeEmbedUrl(url: string) {
   if (!url) return "";

   // Link curto youtu.be
   if (url.includes("youtu.be")) {
      return `https://www.youtube.com/embed/${url.split("/").pop()}`;
   }

   // Link normal watch?v=
   if (url.includes("watch?v=")) {
      return `https://www.youtube.com/embed/${url.split("v=")[1].split("&")[0]}`;
   }

   // Já está em formato embed
   if (url.includes("embed")) return url;

   return "";
}

export const modalIntroduction = {
   show: (props?: any) => NiceModal.show(Introduction, props),
   hide: () => NiceModal.hide(Introduction),
};
