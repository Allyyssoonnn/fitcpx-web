import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, ExternalLink, FileText, Mail, Pen, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";

export default function SuccessPage() {
   const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

   // Pega parâmetros da URL
   const params = new URLSearchParams(window.location.search);
   const nome = params.get("nome")?.split(" ")[0] || "Aluno(a)";
   const email = params.get("email");

   // Pega o link da fatura (pode vir codificado)
   const rawFaturaUrl = params.get("faturaUrl");
   const rawContractURL = params.get("contractURL");
   const faturaUrl = rawFaturaUrl ? decodeURIComponent(rawFaturaUrl) : null;
   const contractURL = rawContractURL ? decodeURIComponent(rawContractURL) : null;

   useEffect(() => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
      const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
   }, []);

   return (
      <div className="min-h-screen w-full flex items-center justify-center bg-accent/30 p-4 font-sans">
         <Confetti width={dimensions.width} height={dimensions.height} recycle={false} numberOfPieces={300} />

         <Card className="max-w-md w-full shadow-2xl border-muted-foreground/10 text-center relative overflow-hidden bg-background">
            {/* Barra superior */}
            <div className="absolute top-0 left-0 w-full h-2 bg-primary" />

            <CardHeader className="flex flex-col items-center gap-4 pt-10 pb-2">
               <div className="rounded-full bg-green-100 p-4 mb-1 animate-in zoom-in duration-500">
                  <CheckCircle className="w-12 h-12 text-green-600" />
               </div>

               <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tight text-foreground">
                     {faturaUrl ? "Fatura Gerada!" : "Matrícula Realizada!"}
                  </h1>
                  <p className="text-muted-foreground text-sm">
                     Tudo certo com seu cadastro, <span className="font-semibold text-foreground">{nome}</span>.
                     {faturaUrl && <br />}
                     {faturaUrl && "Agora só falta finalizar o pagamento."}
                  </p>
               </div>
            </CardHeader>

            <CardContent className="space-y-6 pb-6">
               {/* SEÇÃO 1: FATURA (Só aparece se tiver link) */}
               {faturaUrl && (
                  <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5 space-y-3">
                     <div className="flex items-center gap-2 text-blue-800 justify-center">
                        <FileText className="w-5 h-5" />
                        <span className="font-semibold">Pagamento Pendente</span>
                     </div>
                     <p className="text-xs text-muted-foreground px-2">Clique abaixo para pagamento da fatura.</p>
                     <Button
                        className="w-full font-bold shadow-sm"
                        size="lg"
                        onClick={() => window.open(faturaUrl, "_blank")}
                     >
                        Acessar Fatura Agora
                        <ExternalLink className="w-4 h-4 ml-2" />
                     </Button>
                  </div>
               )}

               {/* SEÇÃO 2: EMAIL / CONTRATO */}
               {contractURL && (
                  <div className="flex items-start gap-3 text-left p-3 rounded-lg border bg-muted/20">
                     <div className="bg-background p-2 rounded-full border shadow-sm">
                        <Mail className="w-4 h-4 text-primary" />
                     </div>
                     <div className="space-y-1">
                        <p className="text-sm font-medium">Contrato Enviado</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                           O contrato e detalhes da matrícula foram enviados para: <br />
                           <span className="font-medium text-foreground">{email}</span>
                        </p>

                        <Button
                           className="w-full"
                           variant="outline"
                           size="sm"
                           onClick={() => window.open(contractURL, "_blank")}
                        >
                           <Pen />
                           Ver contrato
                        </Button>
                     </div>
                  </div>
               )}

               <Separator />

               {/* SEÇÃO 3: DOWNLOAD DO APP */}
               <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2 text-foreground">
                     <Smartphone className="w-5 h-5 text-primary" />
                     <h3 className="font-semibold text-sm">Baixe o App do Aluno</h3>
                  </div>
                  <p className="text-xs text-muted-foreground px-4">
                     Acompanhe seus treinos e evolução diretamente pelo celular.
                  </p>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                     <Button
                        variant="outline"
                        className="h-auto py-3 flex flex-col gap-1 hover:bg-accent hover:text-accent-foreground border-muted-foreground/20"
                        onClick={() =>
                           window.open(
                              "https://play.google.com/store/apps/details?id=com.devcomplexlab.alunofitcpx&pcampaignid=web_share",
                              "_blank",
                           )
                        }
                     >
                        {/* Ícone Android simples ou texto */}
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Android</span>
                        <span className="font-bold text-sm">Google Play</span>
                     </Button>

                     <Button
                        variant="outline"
                        className="h-auto py-3 flex flex-col gap-1 hover:bg-accent hover:text-accent-foreground border-muted-foreground/20"
                        onClick={() => window.open("https://apps.apple.com/br/app/fitcpx-aluno/id6749808580", "_blank")}
                     >
                        {/* Ícone Apple simples ou texto */}
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">iOS</span>
                        <span className="font-bold text-sm">App Store</span>
                     </Button>
                  </div>
               </div>
            </CardContent>

            {/* <CardFooter className="pb-8 justify-center">
               {!faturaUrl && (
                  <Button variant="ghost" size="sm" className="text-muted-foreground text-xs">
                     <Download className="w-3 h-3 mr-2" />
                     Baixar comprovante de matrícula
                  </Button>
               )}
            </CardFooter> */}
         </Card>
      </div>
   );
}
