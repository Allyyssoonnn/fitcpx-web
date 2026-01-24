import Cropper from "cropperjs";
import "cropperjs/dist/cropper.min.css";
import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "../components/ui/dialog";
import { Button } from "./ui/button";

function ImageCropModal({ show, image, onConfirm, onCancel, height, width }) {
   const [cropper, setCropper] = useState(null);
   const [isProcessing, setIsProcessing] = useState(false); // Estado para gerenciar o processamento
   const cropperRef = useRef(null);

   const handleImageLoad = () => {
      if (cropper) {
         cropper.destroy();
      }

      const cropperInstance = new Cropper(cropperRef.current, {
         aspectRatio: width / height || 1,
         viewMode: 1,
         responsive: true,
         zoomable: true,
         minCropBoxWidth: width || 150,
         minCropBoxHeight: height || 150,
         background: false,
         ready() {
            // Inicializar a área de corte maximizada
            const containerData = cropperInstance.getContainerData();
            cropperInstance.setCropBoxData({
               left: 0,
               top: 0,
               width: containerData.width,
               height: containerData.height,
            });
         },
      });
      setCropper(cropperInstance);
   };

   const handleConfirm = async () => {
      if (cropper) {
         setIsProcessing(true); // Desativa o botão
         try {
            const croppedImage = cropper
               .getCroppedCanvas({
                  // width: width || 150,
                  // height: height || 150,
               })
               .toDataURL("image/jpeg", 0.6);
            await onConfirm(croppedImage); // Espera a ação de confirmação
         } finally {
            setIsProcessing(false); // Reativa o botão em caso de erro ou sucesso
         }
      }
   };

   useEffect(() => {
      return () => {
         if (cropper) cropper.destroy();
      };
   }, [cropper]);

   return (
      <Dialog open={show} onOpenChange={onCancel}>
         <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
               <h5 className="text-black">Recortar Imagem</h5>
            </DialogHeader>

            <div className="relative w-full h-[70vh] bg-slate-100 overflow-hidden rounded-md">
               {image && (
                  <img
                     src={image}
                     ref={cropperRef}
                     alt="Imagem para recorte"
                     onLoad={handleImageLoad}
                     style={{ maxWidth: "100%" }}
                  />
               )}
            </div>

            <DialogFooter>
               <Button disabled={isProcessing} onClick={handleConfirm}>
                  Confirmar
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}

export default ImageCropModal;
