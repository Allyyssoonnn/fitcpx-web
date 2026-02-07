import { getFitnessAssessmentTemplatePDF } from "./api/physicalAssessments";
import { getWorkoutTemplatePDF } from "./api/workouts";

export const states = [
   "AC",
   "AL",
   "AP",
   "AM",
   "BA",
   "CE",
   "DF",
   "ES",
   "GO",
   "MA",
   "MS",
   "MT",
   "MG",
   "PA",
   "PB",
   "PR",
   "PE",
   "PI",
   "RJ",
   "RN",
   "RS",
   "RO",
   "RR",
   "SC",
   "SP",
   "SE",
   "TO",
];

export async function getWorkoutPDF(workout, companyImg, companyName) {
   if (!workout) return null;
   var htmlTemplate = await getWorkoutTemplatePDF();

   if (!htmlTemplate) return null;

   const body = (workout.sessoes || [])
      .map(
         (session) => `
            <section>
               <h3>${session.nome_sessao}</h3>
               <ul>
               ${(session.exercicios || [])
                  .map(
                     (exercise) => `
                     <li>
                     <strong>${exercise.nome_exercicio}</strong>
                     ${exercise.serie_sessao_exercicio} Séries |
                     ${exercise.repeticao_sessao_exercicio} Reps |
                     ${exercise.intervalo_sessao_exercicio}s Pausa
                     </li>
                  `,
                  )
                  .join("")}
               </ul>
            </section>
         `,
      )
      .join("");

   htmlTemplate = htmlTemplate
      .replaceAll("<!-- {{company}} -->", companyName ?? "")
      .replaceAll("{{companyImg}}", companyImg ?? "")
      .replaceAll("<!-- {{trainer}} -->", workout.usuario.nome_usuario ?? "")
      .replaceAll("<!-- {{client}} -->", workout?.aluno?.nome_aluno ?? "Treino Base - (Sem aluno)")
      .replaceAll("<!-- {{workoutBody}} -->", body.toString() ?? "");

   return htmlTemplate;
}

export async function getFitnessAssessmentPDF(assessment, companyImg, companyName) {
   if (!assessment) return null;
   var htmlTemplate = await getFitnessAssessmentTemplatePDF();

   if (!htmlTemplate) return null;

   htmlTemplate = htmlTemplate
      .replaceAll("<!-- {{company}} -->", companyName ?? "")
      .replaceAll("{{companyImg}}", companyImg ?? "")
      .replaceAll("<!-- {{trainer}} -->", assessment.usuario.nome_usuario ?? "")
      .replaceAll("<!-- {{client}} -->", assessment.aluno.nome_aluno ?? "")
      .replaceAll("<!-- {{height}} -->", assessment.altura?.toString() ?? "")
      .replaceAll("<!-- {{weight}} -->", assessment.peso?.toString() ?? "")
      .replaceAll("<!-- {{bodyFat}} -->", assessment.compositionWeight?.gordura?.toString() ?? "")
      .replaceAll("<!-- {{bodyFatPercentage}} -->", assessment.compositionPercentage?.gordura?.toString() ?? "")
      .replaceAll("<!-- {{muscleMass}} -->", assessment.compositionWeight?.massa_muscular?.toString() ?? "")
      .replaceAll("<!-- {{musclePerMass}} -->", assessment.compositionPercentage?.massa_muscular?.toString() ?? "")
      .replaceAll("<!-- {{leanMass}} -->", assessment.compositionWeight?.massa_magra?.toString() ?? "")
      .replaceAll("<!-- {{leanPercMass}} -->", assessment.compositionPercentage?.massa_magra?.toString() ?? "")
      .replaceAll("<!-- {{boneMass}} -->", assessment.compositionWeight?.massa_ossea?.toString() ?? "")
      .replaceAll("<!-- {{bonePercMass}} -->", assessment.compositionPercentage?.massa_ossea?.toString() ?? "")
      .replaceAll("<!-- {{residualMass}} -->", assessment.compositionWeight?.massa_residual?.toString() ?? "")
      .replaceAll("<!-- {{residualPercMass}} -->", assessment.compositionPercentage?.massa_residual?.toString() ?? "")
      .replaceAll("<!-- {{tricepsFold}} -->", assessment.triciptal?.toString() ?? "")
      .replaceAll("<!-- {{chestFold}} -->", assessment.peitoral?.toString() ?? "")
      .replaceAll("<!-- {{subscapularisFold}} -->", assessment.subescapular?.toString() ?? "")
      .replaceAll("<!-- {{armpitFold}} -->", assessment.axilar_media?.toString() ?? "")
      .replaceAll("<!-- {{abdominal}} -->", assessment.abdominal?.toString() ?? "")
      .replaceAll("<!-- {{thighFold}} -->", assessment.coxa?.toString() ?? "")
      .replaceAll("<!-- {{suprailiacFold}} -->", assessment.supra_iliaca?.toString() ?? "")
      .replaceAll("<!-- {{supraspinatusFold}} -->", assessment.supra_espinhal?.toString() ?? "")
      .replaceAll("<!-- {{bicepsFold}} -->", assessment.biciptal?.toString() ?? "")
      .replaceAll("<!-- {{calfFold}} -->", assessment.panturrilha?.toString() ?? "")
      .replaceAll("<!-- {{neck}} -->", assessment.pescoco?.toString() ?? "")
      .replaceAll("<!-- {{shoulder}} -->", assessment.ombro?.toString() ?? "")
      .replaceAll("<!-- {{chestInhaled}} -->", assessment.torax_inspirado?.toString() ?? "")
      .replaceAll("<!-- {{chestExhaled}} -->", assessment.torax_expirado?.toString() ?? "")
      .replaceAll("<!-- {{waist}} -->", assessment.cintura?.toString() ?? "")
      .replaceAll("<!-- {{abdomen}} -->", assessment.abdomen?.toString() ?? "")
      .replaceAll("<!-- {{hips}} -->", assessment.quadril?.toString() ?? "")
      .replaceAll("<!-- {{rightArmRelaxed}} -->", assessment.braco_relaxado_direito?.toString() ?? "")
      .replaceAll("<!-- {{rightArmContracted}} -->", assessment.braco_contraido_direito?.toString() ?? "")
      .replaceAll("<!-- {{rightForearm}} -->", assessment.antebraco_direito?.toString() ?? "")
      .replaceAll("<!-- {{rightThigh}} -->", assessment.coxa_direita?.toString() ?? "")
      .replaceAll("<!-- {{rightCalf}} -->", assessment.panturrilha_direita?.toString() ?? "")
      .replaceAll("<!-- {{leftArmRelaxed}} -->", assessment.braco_relaxado_esquerdo?.toString() ?? "")
      .replaceAll("<!-- {{leftArmContracted}} -->", assessment.braco_contraido_esquerdo?.toString() ?? "")
      .replaceAll("<!-- {{leftForearm}} -->", assessment.antebraco_esquerdo?.toString() ?? "")
      .replaceAll("<!-- {{leftThigh}} -->", assessment.coxa_esquerda?.toString() ?? "")
      .replaceAll("<!-- {{leftCalf}} -->", assessment.panturrilha_esquerda?.toString() ?? "");

   return htmlTemplate;
}

export function ordenaAvalicaoData(avaliacoes) {
   return avaliacoes.sort((a, b) => new Date(a.data_avaliacao) - new Date(b.data_avaliacao));
}

export const getNestedError = (obj, path) => {
   if (!path) return null;
   return path.split(".").reduce((acc, part) => acc?.[part], obj);
};

export function preventForm(e) {
   if (e?.key == "Enter") e.preventDefault();
}

export function getAvaliacaoNutricional(aluno, avaliacao, objetivo, nivel_atividade) {
   const massamagra = avaliacao?.result?.compositionWeight?.massa_magra;

   const fatoresGastoCalorico = {
      Sedentário: 1.2,
      "Levemente ativo": 1.375,
      "Moderadamente ativo": 1.55,
      "Muito ativo": 1.725,
      "Extremamente ativo": 1.9,
   };
   const fatoresProteina = {
      Emagrecimento: 0.35,
      Hipertrofia: 0.3,
      Manutenção: 0.25,
      Performance: 0.2,
      "Definição Muscular": 0.35,
   };
   const fatoresGarboidrato = {
      Emagrecimento: 0.35,
      Hipertrofia: 0.55,
      Manutenção: 0.5,
      Performance: 0.6,
      "Definição Muscular": 0.45,
   };
   const fatoresGordura = {
      Emagrecimento: 0.3,
      Hipertrofia: 0.2,
      Manutenção: 0.25,
      Performance: 0.2,
      "Definição Muscular": 0.25,
   };
   const ajustesConsumoDiario = {
      Emagrecimento: -500,
      Hipertrofia: 500,
      Manutenção: 0,
      Performance: 300,
      "Definição Muscular": -200,
   };
   const ajustesAgua = { "Moderadamente ativo": 0.5, "Muito ativo": 1, "Extremamente ativo": 1.5 };

   const tmb = (370 + 21.6 * massamagra).toFixed(1);
   const gasto_calorico = Number((tmb * (fatoresGastoCalorico[nivel_atividade] || 0)).toFixed(2));
   const consumo_diario = (gasto_calorico + (ajustesConsumoDiario[objetivo] ?? 0)).toFixed(2);

   return {
      tmb: tmb,
      gasto_calorico: gasto_calorico,
      consumo_diario: consumo_diario,
      proteina:
         fatoresProteina[objetivo] !== undefined ? ((gasto_calorico * fatoresProteina[objetivo]) / 4).toFixed(2) : "",
      carboidrato:
         fatoresGarboidrato[objetivo] !== undefined
            ? ((consumo_diario * fatoresGarboidrato[objetivo]) / 4).toFixed(2)
            : "",
      gordura:
         fatoresGordura[objetivo] !== undefined ? ((consumo_diario * fatoresGordura[objetivo]) / 9).toFixed(2) : "",
      agua: avaliacao.peso * 0.033 + (ajustesAgua[nivel_atividade] || 0),
   };
}

export function capitalizeFirstLetter(str) {
   if (!str) return ""; // Retorna string vazia se a entrada for vazia
   return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export const formatarData = (data) => {
   if (!data) return "";

   if (typeof data === "string") {
      data = data.replace(" ", "T");
   }

   const date = new Date(data);

   //Validação de segurança
   if (isNaN(date.getTime())) return "";

   return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "UTC",
   });
};

export const formatarHora = (data) => {
   if (!data) return "";

   // Garante compatibilidade com strings "YYYY-MM-DD HH:mm:ss"
   if (typeof data === "string") {
      data = data.replace(" ", "T");
   }

   const date = new Date(data);

   // Verifica se é uma data/hora válida
   if (isNaN(date.getTime())) return "";

   // Retorna apenas a hora formatada (ex: 14:30)
   return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
      // second: "2-digit" // Descomente esta linha se precisar dos segundos (14:30:45)
   });
};

export const formatarSegundos = (segundos) => {
   // Tratamento para valores nulos ou inválidos
   if (!segundos) return "00:00";

   // Garante que é número
   const totalSeconds = Number(segundos);

   // Extrai as partes
   const hours = Math.floor(totalSeconds / 3600);
   const minutes = Math.floor((totalSeconds % 3600) / 60);
   const seconds = Math.floor(totalSeconds % 60);

   // Função auxiliar para colocar o zero à esquerda (ex: 5 vira 05)
   const pad = (num) => num.toString().padStart(2, "0");

   // Lógica de exibição:
   // Se tiver hora, retorna HH:mm:ss. Se não, retorna mm:ss
   if (hours > 0) {
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
   }

   return `${pad(minutes)}:${pad(seconds)}`;
};

export function formatDateToLocalInput(date) {
   const pad = (n) => n.toString().padStart(2, "0");
   const year = date.getFullYear();
   const month = pad(date.getMonth() + 1);
   const day = pad(date.getDate());
   const hours = pad(date.getHours());
   const minutes = pad(date.getMinutes());
   return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export const adicionarMesData = (data, mesesAdicionais = 0) => {
   if (!data) return "";

   let date;

   if (typeof data === "string") {
      // Caso seja uma string no formato YYYY-MM-DD
      const [year, month, day] = data.split("-");
      date = new Date(year, month - 1, day);
   } else if (data instanceof Date) {
      // Caso já seja um objeto Date
      date = new Date(data);
   } else if (typeof data === "number") {
      // Caso seja um timestamp
      date = new Date(data);
   } else {
      return "";
   }

   // Adiciona os meses, se houver
   if (mesesAdicionais !== 0) {
      date.setMonth(date.getMonth() + mesesAdicionais);
   }

   return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
   });
};

export const formatarMoeda = (valor) => {
   return typeof valor == "number"
      ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor)
      : "-";
};

export const getFieldJSON = (json, field) => {
   if (!json) return null;

   try {
      const formattedJSON = JSON.parse(json);
      return formattedJSON?.[field] ?? null;
   } catch (error) {
      console.error("Erro ao fazer parse do JSON:", error);
      return null;
   }
};

export const formatarCPF = (cpf) => {
   if (!cpf) return "-";
   cpf = cpf.replace(/\D/g, ""); // Remove tudo que não for dígito
   if (cpf.length !== 11) return cpf; // Se não tiver 11 dígitos, retorna como está
   return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

export const formatarCNPJ = (cnpj) => {
   if (!cnpj) return "-";
   cnpj = cnpj.replace(/\D/g, ""); // Remove tudo que não for dígito
   if (cnpj.length !== 14) return cnpj; // Se não tiver 14 dígitos, retorna como está
   return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
};

export const formatarCEP = (cep) => {
   if (!cep) return "-";
   const digits = cep.replace(/\D/g, ""); // Remove tudo que não for dígito
   if (digits.length !== 8) return digits; // CEP tem sempre 8 dígitos
   return digits.replace(/^(\d{5})(\d{3})$/, "$1-$2");
};

export const camposFiltrosExercicios = {
   grupoPrincipal: ["cod_grupo_exercicio_1", "cod_grupo_exercicio_2", "cod_grupo_exercicio_3"],
   grupoSecundario: [
      "cod_grupo_exercicio_4",
      "cod_grupo_exercicio_5",
      "cod_grupo_exercicio_6",
      "cod_grupo_exercicio_7",
   ],
   equipamento: ["cod_equipamento_1", "cod_equipamento_2", "cod_equipamento_3"],
   articulacao: ["cod_articulacao_1", "cod_articulacao_2", "cod_articulacao_3", "cod_articulacao_4"],
   tipoExercicio: ["cod_tipo_exercicio"],
   exercicioResistencia: ["cod_exercicio_resistencia"],
   indicacao: ["cod_indicacao"],
   padraoMovimento: ["cod_padrao_movimento"],
};

export function filtrarExerciciosFunc(exerciciosFiltrados, filtrosAtuais) {
   //filtrosAtuais precisa bater com camposFiltrosExercicios

   Object.keys(camposFiltrosExercicios).forEach((filtroKey) => {
      const filtro = camposFiltrosExercicios[filtroKey];

      exerciciosFiltrados = exerciciosFiltrados?.filter((exercicio) => {
         var valido = false;

         if (!filtrosAtuais[filtroKey] || filtrosAtuais[filtroKey] == 0) return true;

         for (const campo of filtro) {
            if (exercicio[campo] == filtrosAtuais[filtroKey]) valido = true;
         }

         return valido;
      }, []);
   });

   return exerciciosFiltrados;
}

export const arrayBorders = [
   "border-green-500",
   "border-blue-500",
   "border-red-500",
   "border-yellow-400",
   "border-indigo-600",
   "border-pink-500",
];

export const arrayBackgrounds = [
   "bg-green-50",
   "bg-blue-50",
   "bg-red-50",
   "bg-yellow-50",
   "bg-indigo-50",
   "bg-purple-50",
   "bg-pink-50",
   "bg-gray-100",
   "bg-slate-50",
   "bg-emerald-50",
];

export function getSexo(s) {
   if (!s) return "Sem sexo informado";
   return s === "M" ? "Masculino" : "Feminino";
}

export const getYouTubeEmbedUrl = (url) => {
   if (!url) return "";
   const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
   const match = url.match(regex);
   return match ? `https://www.youtube.com/embed/${match[1]}` : "";
};

export function calcularIdade(dataNascimento) {
   if (!dataNascimento) return "-";
   const hoje = new Date();
   const nascimento = new Date(dataNascimento);

   let idade = hoje.getFullYear() - nascimento.getFullYear();

   // Ajusta a idade se ainda não tiver feito aniversário neste ano
   const mesAtual = hoje.getMonth();
   const diaAtual = hoje.getDate();
   const mesNascimento = nascimento.getMonth();
   const diaNascimento = nascimento.getDate();

   if (mesAtual < mesNascimento || (mesAtual === mesNascimento && diaAtual < diaNascimento)) {
      idade--;
   }

   return idade;
}

export function limpaForm(formData) {
   const transformedData = {};
   for (const key in formData) {
      if (formData[key] === "") {
         transformedData[key] = null;
      } else {
         transformedData[key] = formData[key];
      }
   }
   return transformedData;
}

export function dividirParcelas(qtdParcelas, valorTotal) {
   const totalCentavos = Math.round(valorTotal * 100);
   const valorBase = Math.floor(totalCentavos / qtdParcelas); // valor mínimo por parcela em centavos
   const resto = totalCentavos % qtdParcelas; // quanto sobra pra distribuir

   const parcelas = [];

   for (let i = 0; i < qtdParcelas; i++) {
      // As primeiras "resto" parcelas recebem 1 centavo a mais
      const valorParcela = i < resto ? valorBase + 1 : valorBase;
      parcelas.push(valorParcela / 100); // volta pra reais
   }

   return parcelas;
}

export function calcularMedianaOuRepetido(num1, num2, num3) {
   const numeros = [num1, num2, num3];

   // Verifica se há números repetidos
   if (numeros.some((num, index) => numeros.indexOf(num) !== index)) {
      // Se houver, retorna o primeiro número repetido encontrado
      return numeros.find((num, index) => numeros.indexOf(num) !== index);
   }

   // Se não houver repetidos, calcula a mediana
   const numerosOrdenados = numeros.sort((a, b) => a - b);
   return numerosOrdenados[1];
}

export function dataURLToBlob(dataURL) {
   const parts = dataURL.split(",");
   const mime = parts[0].match(/:(.*?);/)[1];
   const binary = atob(parts[1]);
   const array = [];
   for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
   }
   return new Blob([new Uint8Array(array)], { type: mime });
}

export function calcularIdadeDtAvaliacao(dataNascimento, dataAvaliacao) {
   if (!dataNascimento) return "-";
   const hoje = new Date(dataAvaliacao);
   const nascimento = new Date(dataNascimento);

   let idade = hoje.getFullYear() - nascimento.getFullYear();

   // Ajusta a idade se ainda não tiver feito aniversário neste ano
   const mesAtual = hoje.getMonth();
   const diaAtual = hoje.getDate();
   const mesNascimento = nascimento.getMonth();
   const diaNascimento = nascimento.getDate();

   if (mesAtual < mesNascimento || (mesAtual === mesNascimento && diaAtual < diaNascimento)) {
      idade--;
   }

   return idade;
}

export function getIMC(avaliacao) {
   return (avaliacao.peso / (avaliacao.altura * avaliacao.altura)).toFixed(1);
}

export function verificaCamposProtocolo(avaliacao, cod_protocolo) {
   if (!protocolosCampos[cod_protocolo]) return;

   var result = true;
   const campos = protocolosCampos[cod_protocolo];
   for (const campo of campos) {
      if (!result) continue;
      if (!avaliacao[campo]) result = false;
   }

   return result;
}

export function getReferenciaIMC(aluno, avaliacao) {
   const idade = calcularIdadeDtAvaliacao(aluno.data_nascimento_aluno, avaliacao.data_avaliacao);
   const imc = getIMC(avaliacao);
   var result;
   if (idade < 60) {
      //Adulto
      if (imc >= 40) {
         result = "Obeso 7";
      } else if (imc >= 35) {
         result = "Obeso 6";
      } else if (imc >= 30) {
         result = "Obeso 5";
      } else if (imc >= 28.3) {
         result = "Sobrepeso 4";
      } else if (imc >= 26.6) {
         result = "Sobrepeso 3";
      } else if (imc >= 25) {
         result = "Sobrepeso 2";
      } else if (imc >= 22.8) {
         result = "Normal 1";
      } else if (imc >= 20.6) {
         result = "Normal 0";
      } else if (imc >= 18.5) {
         result = "Normal -1";
      } else if (imc >= 17) {
         result = "Baixo peso -2";
      } else if (imc >= 16) {
         result = "Baixo peso -3";
      } else if (imc >= 7) {
         result = "Baixo peso -4";
      }
   } else {
      //Idoso
      if (imc >= 30.1) {
         result = "Sobrepeso 4";
      } else if (imc >= 28.6) {
         result = "Sobrepeso 3";
      } else if (imc >= 27.1) {
         result = "Sobrepeso 2";
      } else if (imc >= 25.1) {
         result = "Normal 1";
      } else if (imc >= 23.5) {
         result = "Normal 0";
      } else if (imc >= 22) {
         result = "Normal -1";
      } else if (imc >= 20) {
         result = "Baixo peso -2";
      } else if (imc >= 18.1) {
         result = "Baixo peso -3";
      } else if (imc >= 7) {
         result = "Baixo peso -4";
      }
   }
   return result;
}

export const searchCEP = async (CEP) => {
   const flatCEP = CEP?.replace(/\D/g, "") ?? "";

   var response = null;

   if (flatCEP.length === 8) {
      try {
         const resp = await fetch(`https://viacep.com.br/ws/${flatCEP}/json/`);
         if (!resp.ok) throw new Error("Erro CEP");
         const data = await resp.json();
         if (!data.erro) {
            response = {
               address: data.logradouro,
               neighbord: data.bairro,
               city: data.localidade,
               state: String(data.uf).toUpperCase(),
            };
         }
      } catch (error) {
         console.error("Erro busca CEP:", error);
      }
   }

   return response;
};
