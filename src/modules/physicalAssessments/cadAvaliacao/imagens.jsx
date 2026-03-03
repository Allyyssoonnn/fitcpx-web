import { useEffect, useRef, useState } from "react";
import ImageCropModal from "../../../components/cutImg";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";

function Imagens({
   capturedImages,
   setCapturedImages,
   imageDescriptions,
   setImageDescriptions,
   deletedImages,
   setDeletedImages,
}) {
   const [showCropModal, setShowCropModal] = useState(false);
   const [imageToCrop, setImageToCrop] = useState(null);
   const fileInputRefs = useRef({});
   const [currentOption, setCurrentOption] = useState(null);
   const [options, setOptions] = useState([1, 2, 3]);

   const [editImages, setEditImages] = useState({});
   const [iniciouTela, setIniciouTela] = useState(false);

   useEffect(() => {
      if (iniciouTela) return;
      if (options.length < Object.keys(capturedImages).length) {
         setOptions(Array.from({ length: Object.keys(capturedImages).length }, (_, i) => i + 1));
         setIniciouTela(true);
      }
   }, [capturedImages]);

   const handleEdit = (event, option) => {
      event.preventDefault();

      setCurrentOption(option);
      setImageToCrop(editImages[option]);
      setShowCropModal(true);
   };

   // Função para lidar com arrastar e soltar
   const handleDrop = (event, option) => {
      event.preventDefault();
      const files = Array.from(event.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
      if (!files.length) {
         console.error("Nenhuma imagem válida encontrada.");
         return;
      }

      if (files.length > 20) {
         alert("Selecione no máximo 20 imagens de uma vez.");
         return;
      }

      setOptions((prevOptions) => {
         // Começa do último índice existente + 1
         const lastIndex = prevOptions.length ? Math.max(...prevOptions) : 0;
         const newOptions = files.map((_, i) => lastIndex + i + 1);
         return [...prevOptions, ...newOptions];
      });

      files.forEach((file, i) => {
         const reader = new FileReader();
         reader.onload = (e) => {
            const imageData = e.target.result;

            const img = new Image();
            img.src = imageData;
            img.onload = () => {
               const height = img.height;
               const width = img.height / 2;
               const canvas = document.createElement("canvas");
               canvas.width = width;
               canvas.height = height;
               const ctx = canvas.getContext("2d");
               const sx = (img.width - width) / 2;
               ctx.drawImage(img, sx, 0, width, height, 0, 0, width, height);
               const croppedImage = canvas.toDataURL("image/jpeg", 0.8);

               setEditImages((prev) => ({ ...prev, [option + i]: imageData }));
               setCapturedImages((prev) => ({ ...prev, [option + i]: croppedImage }));
               setImageDescriptions((prev) => ({
                  ...prev,
                  [option + i]: file.name.split(".")[0],
               }));
            };
         };
         reader.readAsDataURL(file);
      });
   };

   const handleDragOver = (event) => {
      event.preventDefault();
   };

   // Função para lidar com clique no seletor de arquivos
   const handleFileChange = (event, option) => {
      const file = event.target.files[0];

      if (file && file.type.startsWith("image/")) {
         const reader = new FileReader();
         reader.onload = (e) => {
            const imageData = e.target.result;
            // Enviar imagem para o modal de corte
            setCurrentOption(option);
            setImageToCrop(imageData);
            setShowCropModal(true);
         };
         reader.readAsDataURL(file);
      } else {
         console.error("O arquivo selecionado não é uma imagem válida.");
      }

      event.target.value = "";
   };

   const handleModalConfirm = (croppedImage) => {
      if (currentOption !== null) {
         setCapturedImages((prevImages) => ({
            ...prevImages,
            [currentOption]: croppedImage,
         }));
      }
      setShowCropModal(false);
   };

   const handleModalCancel = () => {
      setShowCropModal(false);
   };

   const removePhoto = (option) => {
      if (editImages[option]) {
         setEditImages((prevImages) => {
            const updatedImages = { ...prevImages };
            delete updatedImages[option];
            return updatedImages;
         });
      }
      //Preenche caso já tenha salvo uma imagem para que seja deletada
      if (capturedImages[option].includes("store.fitcpx.com")) {
         setDeletedImages((prevImages) => [...prevImages, capturedImages[option]]);
      }
      setCapturedImages((prevImages) => {
         const updatedImages = { ...prevImages };
         delete updatedImages[option];
         return updatedImages;
      });
   };

   // Função para atualizar a descrição de uma imagem
   const updateDescription = (option, description) => {
      setImageDescriptions((prevDescriptions) => ({
         ...prevDescriptions,
         [option]: description,
      }));
   };

   const renderOption = (option) => (
      <div className="col-md-3 text-center" onDrop={(e) => handleDrop(e, option)} onDragOver={handleDragOver}>
         <div className="upload-option border border-dark rounded p-3">
            {option}

            {capturedImages[option] ? (
               <div className="mb-2">
                  <img src={capturedImages[option]} style={{ width: "100%", border: "1px solid black" }} />
               </div>
            ) : (
               // <img src="https://via.assets.so/img.jpg?w=340&h=240&tc=white&t=Imagem" style={{ width: '320px', height: '240px' }} loading="lazy" />
               <div
                  style={{
                     width: "auto",
                     height: "300px",
                     border: "1px dashed black",
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "center",
                  }}
               >
                  Arraste uma imagem aqui
               </div>
            )}

            <p></p>

            <button
               onClick={(e) => {
                  e.preventDefault();
                  fileInputRefs.current[option]?.click();
               }}
               className="btn btn-primary btn-sm me-2"
            >
               <i className="bi bi-upload me-2"></i>
               Carregar
            </button>

            {capturedImages[option] && (
               <button
                  onClick={(e) => {
                     e.preventDefault();
                     removePhoto(option);
                  }}
                  className="btn btn-danger btn-sm"
               >
                  <i className="bi bi-trash me-2"></i>
                  Remover
               </button>
            )}

            <p></p>

            <Input
               placeholder="Descrição imagem"
               type="text"
               value={imageDescriptions[option] || ""}
               onChange={(e) => updateDescription(option, e.target.value)}
            />

            <input
               type="file"
               ref={(el) => (fileInputRefs.current[option] = el)}
               style={{ display: "none" }}
               onChange={(e) => handleFileChange(e, option)}
            />

            <button
               onClick={(e) => {
                  e.preventDefault();
                  handleEdit(e, option);
               }}
               className={`${editImages[option] ? "" : "d-none"} btn btn-outline-info btn-sm mt-2 me-2`}
            >
               <i className="bi bi-pen me-2"></i>
               Editar
            </button>

            <button
               onClick={(e) => {
                  e.preventDefault();
                  removeOption(option);
               }}
               className="btn btn-outline-danger btn-sm mt-2"
            >
               <i className="bi bi-trash me-2"></i>
               Remover Opção
            </button>
         </div>
      </div>
   );

   const addOption = (e) => {
      e.preventDefault();
      setOptions((prevOptions) => [...prevOptions, prevOptions.length + 1]);
   };

   const removeOption = (option) => {
      if (editImages[option]) {
         setEditImages((prevImages) => {
            const updatedImages = { ...prevImages };
            delete updatedImages[option];
            return updatedImages;
         });
      }
      setOptions((prevOptions) => prevOptions.filter((o) => o !== option));
      //Preenche caso já tenha salvo uma imagem para que seja deletada
      if (capturedImages[option].includes("store.fitcpx.com")) {
         setDeletedImages((prevImages) => [...prevImages, capturedImages[option]]);
      }
      setCapturedImages((prevImages) => {
         const updatedImages = { ...prevImages };
         delete updatedImages[option];
         return updatedImages;
      });
   };

   return (
      <div className="row g-3">
         {/* Modal de Corte */}
         <ImageCropModal
            show={showCropModal}
            image={imageToCrop}
            onConfirm={handleModalConfirm}
            onCancel={handleModalCancel}
            height={300}
            width={150}
         />

         <div className="row g-3">
            {options.map((option) => renderOption(option))}

            <div className={`${options.length >= 20 ? "d-none" : ""} col-md-3 text-center`}>
               <div className="upload-option border border-dark rounded p-3">
                  <Button onClick={addOption}>
                     <i className="bi bi-plus-circle me-2"></i>
                     Adicionar opção
                  </Button>
               </div>
            </div>
         </div>
      </div>
   );
}

export default Imagens;
