import { useQuery } from "react-query";
import { cancelCompanyLicense, getCompanyLicense } from "../../../api/companies";
import { buyLicense, getLicensesAvaliable } from "../../../api/licenses";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { useNotificacao } from "../../../states/states";
import { formatarMoeda } from "../../../utils";

function License() {
   const { nConfirm } = useNotificacao();

   const { data: licencas } = useQuery({
      queryKey: ["licencas"],
      queryFn: getLicensesAvaliable,
      initialData: [],
   });

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
         `${formatarMoeda(licenca?.valor_licenca)}/Mês`,
         `Confirma contratação do plano ${licenca?.nome_licenca}?`,
         async () => {
            await buyLicense(licenca.cod_licenca);
            refetch();
         }
      );
   }

   return (
      <div className="row">
         <div className="col-md-6">
            <div className="card border shadow-none">
               <Card>
                  <CardHeader>
                     <CardTitle>Planos disponíveis</CardTitle>
                     <CardDescription>
                        Aqui você pode contratar um plano para mais limites e opções de trabalho.
                     </CardDescription>
                  </CardHeader>

                  <CardContent>
                     {licencas.map((licenca, index) => (
                        <CardLicenca
                           key={index}
                           licenca={licenca}
                           onBuy={licenca ? onBuy : null}
                           atual={licencaAtual?.nome_licenca == licenca?.nome_licenca}
                           isVIP={licencaAtual?.cod_licenca == 5}
                        />
                     ))}
                  </CardContent>
               </Card>
            </div>
         </div>

         <div className="col-md-6">
            <Card>
               <CardHeader>
                  <CardTitle>
                     Plano atual :{" "}
                     <span className="text-success">{licencaAtual.nome_licenca ?? "Período de teste"}</span>
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

            <div className="bg-secondary p-3 rounded-md mt-3">
               <h5>Importante</h5>

               <p className="fs-2">
                  * Em caso de cancelamento da licença, as cobranças já confirmadas/recebidas (inclusive as que
                  estiverem em processamento) continuarão sendo repassadas normalmente.
               </p>
               <p className="fs-2">
                  * Contratos com pagamentos recorrentes deixarão de gerar novas cobranças, ficando a responsabilidade
                  de cobrança sob você.
               </p>
               <p className="fs-2">
                  * Todos os pagamentos pendentes serão cancelados e seus alunos não conseguirão mais pagar pelos links
                  disponibilizados.
               </p>
               <p className="fs-2">* Seus contratos permanecerão legalmente válidos.</p>
               <p className="fs-2">
                  * Após o cancelamento da licença, você continuará com acesso ao sistema, mas não poderá inserir novos
                  dados.
               </p>
               <p className="fs-2">
                  * Você terá 2 dias para reverter a decisão. Após esse prazo, todos os itens acima entrarão em vigor de
                  forma definitiva.
               </p>
            </div>
         </div>
      </div>
   );
}

function CardLicenca({ licenca, onCancel, onBuy, atual, isVIP }) {
   const isFree = licenca == {} || licenca.nome_licenca === "Gratuito";

   return (
      <div>
         <div
            className={`d-flex flex-column justify-content-between mt-7 mb-1 shadow p-3 rounded ${
               onCancel ? "border border-success" : "border border-info"
            }`}
         >
            <div className="d-flex align-items-center gap-3">
               <div className="text-bg-light rounded-1 p-6 d-flex align-items-center justify-content-center">
                  <i className="bi bi-box-seam text-dark d-block fs-7" width="22" height="22"></i>
               </div>
               <div>
                  <h5 className="fs-4 fw-semibold mb-0">{licenca.nome_licenca ?? "Período de teste"}</h5>
                  <p className="mb-0 fs-3">{licenca.descricao_licenca}</p>
                  <h5 className="fs-4 fw-semibold mb-0">
                     {formatarMoeda(licenca.valor_licenca ?? 0)}
                     /Mês
                  </h5>
               </div>
            </div>

            <div className="d-flex justify-content-end mt-3 align-items-end">
               <div>
                  {isFree && <label className="fs-2">Ativado quando não há plano contratado.</label>}

                  {atual && !isFree && <label className="fs-2">Licença atual.</label>}

                  {!onCancel && !isFree && !atual && !isVIP && (
                     <button className="btn btn-info rounded" onClick={() => onBuy(licenca)}>
                        <i className="bi bi-cart me-2"></i>
                        Comprar
                     </button>
                  )}

                  {onCancel && licenca?.status_empresa_licenca === "Active" && !isFree && !isVIP && (
                     <button onClick={onCancel} className="btn btn-danger rounded">
                        <i className="bi bi-x me-2"></i>
                        Cancelar
                     </button>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
}

export default License;
