import { dividirParcelas } from "../utils";

export function processaPlano(plano, duracaoPlano, valorAdesao = 0) {
   if (!plano?.modalidades?.length) {
      return {
         planoAtualizado: { ...plano, modalidades: [], valor_plano: 0, parcela_plano: "[]" },
         valorTotal: 0,
      };
   }

   const modalidades = plano.modalidades.map((m) => {
      let valorFinal = 0;
      let nomeFinal = null;
      let nomeOriginal = "";
      nomeOriginal = m.nome_modalidade_original ?? m.nome_modalidade;

      if (m.cod_modalidade_variacao && m.variacoes) {
         const variacao = m.variacoes.find((v) => v.cod_modalidade_variacao === m.cod_modalidade_variacao);

         if (variacao) {
            valorFinal = variacao.valor_modalidade_variacao ?? 0;
            nomeFinal = `${nomeOriginal} - ${variacao.nome_modalidade_variacao}`;

            const sub = (variacao.valores || []).filter(
               (v) => duracaoPlano >= Number(v.quantidade_modalidade_variacao_valor || 0),
            );

            if (sub.length) {
               const ultima = sub[sub.length - 1];

               valorFinal = Number(ultima.valor_modalidade_variacao_valor || 0);
               if (m.valor_modalidade_alterado != null) valorFinal = m.valor_modalidade_alterado;

               return {
                  ...m,
                  cod_modalidade_variacao_valor: ultima.cod_modalidade_variacao_valor,
                  valor_modalidade: valorFinal,
                  nome_modalidade: `${nomeFinal} - ${ultima.nome_modalidade_variacao_valor}`,
                  nome_modalidade_original: nomeOriginal,
               };
            }
         }
      }

      if (m.valor_modalidade_alterado != null) valorFinal = m.valor_modalidade_alterado;

      // fallback se não houver variação/subvariação
      return {
         ...m,
         valor_modalidade: valorFinal || m.valor_modalidade_original || m.valor_modalidade || 0,
         nome_modalidade: nomeFinal ?? m.nome_modalidade_original ?? m.nome_modalidade,
         nome_modalidade_original: nomeOriginal,
      };
   });

   const totalBase = modalidades.reduce((sum, m) => sum + (m.valor_modalidade || 0), 0);
   const valorTotal = totalBase * duracaoPlano;
   const parcelas = dividirParcelas(duracaoPlano, valorTotal);

   const planoAtualizado = {
      ...plano,
      modalidades,
      valor_plano: valorTotal,
      parcela_plano: JSON.stringify(parcelas),
   };

   return { planoAtualizado, valorTotal };
}
