import { cn } from "@/lib/utils";
import { Box, Check, HelpCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { cancelCompanyLicense, getCompanyLicense } from "../../../api/companies";
import { buyLicense, getLicensesAvaliable, sendCoupon } from "../../../api/licenses";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "../../../components/ui/input-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../../components/ui/tooltip";
import { useNotificacao } from "../../../states/states";
import { formatarMoeda } from "../../../utils";

function License() {
   const { register, handleSubmit, setValue } = useForm();
   const { nConfirm } = useNotificacao();
   const [coupon, setCoupon] = useState(null);

   const { data: licencas, refetch: refetchLicenses } = useQuery({
      queryKey: ["licencas"],
      queryFn: getLicensesAvaliable,
      initialData: [],
   });

   useEffect(() => {
      licencas.map((l) => {
         if (l.cupom_licenca) setCoupon(l.cupom_licenca);
      });
   }, [licencas]);

   const { data: licencaAtual, refetch } = useQuery({
      queryKey: ["licenca"],
      queryFn: getCompanyLicense,
      initialData: [],
   });

   async function onCancel() {
      nConfirm(null, "Tem certeza que deseja cancelar o plano?", async () => {
         await cancelCompanyLicense(licencaAtual?.cod_empresa_licenca);
         refetch();
      });
   }

   async function onBuy(licenca) {
      nConfirm(
         `${formatarMoeda(licenca?.valor_licenca)}`,
         `Confirma contratação do plano ${licenca?.nome_licenca}?`,
         async () => {
            await buyLicense(licenca.cod_licenca);
            refetch();
         }
      );
   }

   async function sendCupom(data) {
      await sendCoupon(data.cupom);
      refetchLicenses();
   }

   return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* COLUNA ESQ - Planos disponíveis */}
         <Card>
            <CardHeader>
               <CardTitle>Planos disponíveis</CardTitle>
               <CardDescription>
                  Aqui você pode contratar um plano para mais limites e opções de trabalho.
               </CardDescription>

               <form onSubmit={handleSubmit(sendCupom)}>
                  <InputGroup className="my-3">
                     <InputGroupInput
                        disabled={!!coupon}
                        value={coupon ?? undefined}
                        {...register("cupom", {
                           required: "Informe um cupom válido",
                           maxLength: 20,
                        })}
                        placeholder="Digite seu cupom"
                        onChange={(e) => {
                           const value = e.target.value.toUpperCase();
                           setValue("cupom", value);
                        }}
                        style={{ textTransform: "uppercase" }}
                     />
                     <InputGroupAddon align="inline-end">
                        <InputGroupButton disabled={!!coupon} type="submit" variant="default">
                           <Check />
                           Usar cupom
                        </InputGroupButton>
                     </InputGroupAddon>

                     <InputGroupAddon align="inline-start">
                        <Tooltip>
                           <TooltipTrigger>
                              <InputGroupButton type="button" variant="ghost" aria-label="Help" size="icon-xs">
                                 <HelpCircle />
                              </InputGroupButton>
                           </TooltipTrigger>

                           <TooltipContent side="top">
                              <>Cupons liberam licenças de uso promocionais</>
                           </TooltipContent>
                        </Tooltip>
                     </InputGroupAddon>
                  </InputGroup>
               </form>
            </CardHeader>

            <CardContent>
               <div className="grid gap-4">
                  {licencas.map((licenca, index) => (
                     <CardLicenca
                        key={index}
                        licenca={licenca}
                        onBuy={licenca ? onBuy : null}
                        atual={licencaAtual?.nome_licenca == licenca?.nome_licenca}
                     />
                  ))}
               </div>
            </CardContent>
         </Card>

         {/* COLUNA DIR - Plano atual + aviso */}
         <div className="flex flex-col gap-6">
            <Card>
               <CardHeader>
                  <CardTitle>
                     Plano atual:{" "}
                     <span className="text-primary">{licencaAtual.nome_licenca ?? "Período de teste"}</span>
                  </CardTitle>
                  <CardDescription>Pagamento e verificação de licença.</CardDescription>
               </CardHeader>

               <CardContent>
                  <CardLicenca
                     licenca={licencaAtual}
                     onCancel={onCancel}
                     refetch={refetch}
                     isVIP={licencaAtual?.cod_licenca == 5}
                  />
               </CardContent>
            </Card>

            <div className="bg-muted p-4 rounded-md text-sm space-y-2 leading-snug">
               <h5 className="font-semibold">Importante</h5>

               <p>* Após 30 dias de inadimplência a liceça é cancelada.</p>
               <p>* Em caso de cancelamento da licença, as cobranças já confirmadas continuarão sendo repassadas.</p>
               <p>* Pagamentos recorrentes deixarão de gerar novas cobranças.</p>
               <p>* Pagamentos pendentes serão cancelados.</p>
               <p>* Contratos continuam válidos legalmente.</p>
               <p>* Após cancelar, o acesso continua mas sem novos registros.</p>
               <p>* Cancelamento pode ser revertido em até 2 dias.</p>
            </div>
         </div>
      </div>
   );
}

function CardLicenca({ licenca, onCancel, onBuy, atual, isVIP }) {
   const isFree = !licenca || licenca.nome_licenca === "Gratuito";
   const isActive = licenca?.status_empresa_licenca === "Active";

   const borderClass = cn(
      "shadow-md transition-all hover:shadow-lg",
      atual && "border border-primary",
      isVIP && "border border-purple-500",
      isFree && "border border-dashed border-gray-300"
   );

   return (
      <Card className={borderClass}>
         {/* HEADER: ícone ao lado do nome (mudança mínima) */}
         <CardHeader className="text-left">
            <div className="flex items-center gap-3">
               <div className="bg-muted rounded-full w-10 h-10 flex items-center justify-center">
                  <Box className="w-5 h-5 text-muted-foreground" />
               </div>

               {/* Título + descrição ficam juntos; descrição continua abaixo */}
               <div className="flex-1">
                  <CardTitle className="text-xl font-bold mb-0">
                     {licenca?.nome_licenca ?? "Período de teste"}
                  </CardTitle>
               </div>
            </div>

            {licenca?.cupom_licenca && (
               <div className="flex flex-row gap-1">
                  <Badge className="mt-2 bg-amber-300 text-black">Cupom: {licenca?.cupom_licenca}</Badge>
                  <Badge className="mt-2 bg-amber-300 text-black">Válido até: {licenca?.dueCoupon}</Badge>
               </div>
            )}

            {licenca?.daysLeft !== null && licenca?.daysLeft >= 0 && (
               <Badge className="mt-2 bg-amber-300 text-black">
                  {licenca?.daysLeft == 0
                     ? "Último dia"
                     : `${licenca?.daysLeft} ${licenca?.daysLeft == 1 ? "Dia restante" : "Dias restantes"}`}
               </Badge>
            )}

            <CardDescription className="text-sm mt-2">{licenca?.descricao_licenca}</CardDescription>

            <div className="mt-2">
               <span className="text-2xl font-semibold">
                  {formatarMoeda(licenca?.mensal_licenca ?? licenca?.valor_licenca ?? 0)}
               </span>
               <span className="text-sm opacity-70 ms-1">\Mês</span>
            </div>

            {!!licenca?.mensal_licenca && (
               <span className="text-sm opacity-70 ms-1">{formatarMoeda(licenca?.valor_licenca)}</span>
            )}

            {/* BADGES */}
            <div className="mt-2">
               {isFree && <Badge variant="outline">Plano Gratuito</Badge>}
               {atual && !isFree && <Badge variant="default">Licença Atual</Badge>}
               {isVIP && <Badge className="bg-purple-600">VIP</Badge>}
               {licenca?.prefix_licenca && <Badge className="bg-purple-600">{licenca?.prefix_licenca}</Badge>}
            </div>
         </CardHeader>

         <CardContent>
            {isFree && <p className="text-center text-sm opacity-80">Ativado quando não há plano contratado.</p>}

            {atual && !isFree && <p className="text-center text-sm opacity-80">Licença atual.</p>}
         </CardContent>

         <CardFooter className="flex justify-center">
            {/* BOTÃO COMPRAR */}
            {!onCancel && !isFree && !atual && !isVIP && (
               <Button onClick={() => onBuy(licenca)} className="w-full">
                  <i className="bi bi-cart me-2"></i> Comprar
               </Button>
            )}

            {/* BOTÃO CANCELAR */}
            {onCancel && isActive && !isFree && !isVIP && (
               <Button onClick={onCancel} variant="destructive" className="w-full">
                  <i className="bi bi-x me-2"></i> Cancelar
               </Button>
            )}
         </CardFooter>
      </Card>
   );
}

export default License;
