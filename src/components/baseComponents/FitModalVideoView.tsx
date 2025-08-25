import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";

function FitModalViewVideo({ url, name }: { url: string; name: string }) {
   if (!url) return null;

   const embedUrl = getYouTubeEmbedUrl(url);

   return (
      <Dialog>
         <DialogTrigger asChild>
            <button className="btn btn-success">
               <i className="bi bi-camera" />
            </button>
         </DialogTrigger>

         <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
            <DialogTitle>
               <h5>{name}</h5>
            </DialogTitle>

            <div className="relative w-full h-0 pb-[56.25%] mt-0">
               <iframe
                  src={embedUrl}
                  title={name}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full"
               ></iframe>
            </div>
         </DialogContent>
      </Dialog>
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

export default FitModalViewVideo;
