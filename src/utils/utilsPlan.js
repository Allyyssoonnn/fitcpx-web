import { dividirParcelas } from "../utils";

export function processaPlano(plano, duracaoPlano, valorAdesao = 0) {
   if (!plano?.modalidades?.length) {
      return {
         planoAtualizado: { ...plano, modalidades: [], valor_plano: 0, parcela_plano: "[]" },
         valorTotal: 0,
      };
   }

   const modalidades = plano.modalidades.map((m) => {
      if (m.valor_modalidade_alterado != null) return { ...m };

      let valorFinal = 0;

      if (m.cod_modalidade_variacao && m.variacoes) {
         const variacao = m.variacoes.find((v) => v.cod_modalidade_variacao === m.cod_modalidade_variacao);

         if (variacao) {
            valorFinal = variacao.valor_modalidade_variacao ?? 0;

            const sub = (variacao.valores || []).filter(
               (v) => duracaoPlano >= Number(v.quantidade_modalidade_variacao_valor || 0)
            );

            if (sub.length) {
               const ultima = sub[sub.length - 1];
               return {
                  ...m,
                  cod_modalidade_variacao_valor: ultima.cod_modalidade_variacao_valor,
                  valor_modalidade: Number(ultima.valor_modalidade_variacao_valor || 0),
                  nome_modalidade: `${m.nome_modalidade_original} - ${ultima.nome_modalidade_variacao_valor}`,
               };
            }
         }
      }

      // fallback se não houver variação/subvariação
      return {
         ...m,
         valor_modalidade: valorFinal || m.valor_modalidade_original || m.valor_modalidade || 0,
         nome_modalidade: m.nome_modalidade_original ?? m.nome_modalidade,
      };
   });

   const totalBase = modalidades.reduce((sum, m) => sum + (m.valor_modalidade || 0), 0);
   const valorTotal = totalBase * duracaoPlano;
   const parcelas = dividirParcelas(duracaoPlano, valorTotal);
   parcelas[0] += valorAdesao;

   const planoAtualizado = {
      ...plano,
      modalidades,
      valor_plano: valorTotal,
      parcela_plano: JSON.stringify(parcelas),
   };

   return { planoAtualizado, valorTotal };
}
