export function ordenaAvalicaoData(avaliacoes) {
    return avaliacoes.sort((a, b) => new Date(a.data_avaliacao) - new Date(b.data_avaliacao))
}

export const getNestedError = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc?.[part], obj);
};

export function preventForm(e) { if (e?.key == 'Enter') e.preventDefault() };

export function getAvaliacaoNutricional(aluno, avaliacao, objetivo, nivel_atividade) {
    const massamagra = calculaKGMassaMagra(aluno, avaliacao);
    
    const fatoresGastoCalorico = { "Sedentário": 1.2, "Levemente ativo": 1.375, "Moderadamente ativo": 1.55, "Muito ativo": 1.725, "Extremamente ativo": 1.9 };
    const fatoresProteina = { "Emagrecimento": 0.35, "Hipertrofia": 0.3, "Manutenção": 0.25, "Performance": 0.2, "Definição Muscular": 0.35 };
    const fatoresGarboidrato = { "Emagrecimento": 0.35, "Hipertrofia": 0.55, "Manutenção": 0.5, "Performance": 0.6, "Definição Muscular": 0.45 };
    const fatoresGordura = { "Emagrecimento": 0.3, "Hipertrofia": 0.2, "Manutenção": 0.25, "Performance": 0.2, "Definição Muscular": 0.25 };
    const ajustesConsumoDiario = { "Emagrecimento": -500, "Hipertrofia": 500, "Manutenção": 0, "Performance": 300, "Definição Muscular": -200 };
    const ajustesAgua = { "Moderadamente ativo": 0.5, "Muito ativo": 1, "Extremamente ativo": 1.5 };

    const tmb = (370 + (21.6 * massamagra)).toFixed(1);
    const gasto_calorico = Number((tmb * (fatoresGastoCalorico[nivel_atividade] || 0)).toFixed(2));
    const consumo_diario = (gasto_calorico + (ajustesConsumoDiario[objetivo] ?? 0)).toFixed(2);

    return {
        tmb: tmb,
        gasto_calorico: gasto_calorico,
        consumo_diario: consumo_diario,
        proteina: fatoresProteina[objetivo] !== undefined ? ((gasto_calorico * fatoresProteina[objetivo]) / 4).toFixed(2) : "",
        carboidrato: fatoresGarboidrato[objetivo] !== undefined ? ((consumo_diario * fatoresGarboidrato[objetivo]) / 4).toFixed(2) : "",
        gordura: fatoresGordura[objetivo] !== undefined ? ((consumo_diario * fatoresGordura[objetivo]) / 9).toFixed(2) : "",
        agua: avaliacao.peso * 0.033 + (ajustesAgua[nivel_atividade] || 0),
    }
}

export function capitalizeFirstLetter(str) {
    if (!str) return ''; // Retorna string vazia se a entrada for vazia
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export const segundosParaTempo = (tempo) => {
    if (typeof tempo !== 'number' || tempo < 0 || !tempo) {
        return "00:00:00";
    }
    
    const horas = Math.floor(tempo / 3600);
    const minutos = Math.floor((tempo % 3600) / 60);
    const segundos = tempo % 60;
    
    const formatar = (num) => String(num).padStart(2, '0');
    
    return `${formatar(horas)}:${formatar(minutos)}:${formatar(segundos)}`;
}

export const formatarData = (data) => {
    if (!data) return '';
  
    let date;
  
    if (typeof data === 'string') {
        // Caso seja uma string no formato YYYY-MM-DD
        const [year, month, day] = data.split('-');
        date = new Date(year, month - 1, day);
    } else if (data instanceof Date) {
        // Caso já seja um objeto Date
        date = data;
    } else if (typeof data === 'number') {
        // Caso seja um timestamp
        date = new Date(data);
    } else {
        return '';
    }
  
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
};

export const adicionarMesData = (data, mesesAdicionais = 0) => {
    if (!data) return '';

    let date;

    if (typeof data === 'string') {
        // Caso seja uma string no formato YYYY-MM-DD
        const [year, month, day] = data.split('-');
        date = new Date(year, month - 1, day);
    } else if (data instanceof Date) {
        // Caso já seja um objeto Date
        date = new Date(data);
    } else if (typeof data === 'number') {
        // Caso seja um timestamp
        date = new Date(data);
    } else {
        return '';
    }

    // Adiciona os meses, se houver
    if (mesesAdicionais !== 0) {
        date.setMonth(date.getMonth() + mesesAdicionais);
    }

    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
};

export const formatarMoeda = (valor) => {
    return (typeof valor == 'number') ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor) : '-';
}

export const formatarCPF = (cpf) => {
    if (!cpf) return '-';
    cpf = cpf.replace(/\D/g, ''); // Remove tudo que não for dígito
    if (cpf.length !== 11) return cpf; // Se não tiver 11 dígitos, retorna como está
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

export const formatarCNPJ = (cnpj) => {
    if (!cnpj) return '-';
    cnpj = cnpj.replace(/\D/g, ''); // Remove tudo que não for dígito
    if (cnpj.length !== 14) return cnpj; // Se não tiver 14 dígitos, retorna como está
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

export const camposFiltrosExercicios = {
    grupoPrincipal: ['cod_grupo_exercicio_1', 'cod_grupo_exercicio_2', 'cod_grupo_exercicio_3'],
    grupoSecundario: ['cod_grupo_exercicio_4', 'cod_grupo_exercicio_5', 'cod_grupo_exercicio_6', 'cod_grupo_exercicio_7'],
    equipamento: ['cod_equipamento_1', 'cod_equipamento_2', 'cod_equipamento_3'],
    articulacao: ['cod_articulacao_1', 'cod_articulacao_2', 'cod_articulacao_3', 'cod_articulacao_4'],
    tipoExercicio: ['cod_tipo_exercicio'],
    exercicioResistencia: ['cod_exercicio_resistencia'],
    indicacao: ['cod_indicacao'],
    padraoMovimento: ['cod_padrao_movimento'],
}

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

export const arrayBorders = ['border-success', 'border-info', 'border-danger', 'border-primary', 'border-secondary'];

export const protocolosCampos = {
    1: [],
    2: ["subescapular", "triciptal", "peitoral", "axilar_media", "supra_iliaca", "coxa", "supra_iliaca", "abdominal", "coxa"],
    3: ["supra_iliaca", "peitoral", "coxa"],
    4: ["peitoral", "axilar_media", "triciptal", "subescapular", "abdominal", "supra_iliaca", "coxa"],
    5: ["triciptal", "coxa", "panturrilha"],
};

export function getSexo(s) {
    if (!s) return 'Sem sexo informado';
    return s === 'M' ? 'Masculino' : 'Feminino';
}

export const getYouTubeEmbedUrl = (url) => {
    if (!url) return('');
    const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? `https://www.youtube.com/embed/${match[1]}` : "";
};

export function calcularIdade(dataNascimento) {
    if (!dataNascimento) return '-';
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

// export const dataURLToBlob = (dataURL) => {
//     const [header, base64] = dataURL.split(',');
//     const mime = header.match(/:(.*?);/)[1];
//     const binary = atob(base64);
//     const array = new Uint8Array(binary.length);
//     for (let i = 0; i < binary.length; i++) {
//         array[i] = binary.charCodeAt(i);
//     }
//     return new Blob([array], { type: mime });
// };

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
    const parts = dataURL.split(',');
    const mime = parts[0].match(/:(.*?);/)[1];
    const binary = atob(parts[1]);
    const array = [];
    for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: mime });
}

export function calcularIdadeDtAvaliacao(dataNascimento, dataAvaliacao) {
    if (!dataNascimento) return '-';
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





























// ========================================================================= METAS ABAIXO

export function getPesoIMCMeta(aluno, avaliacao, meta, imcPersonalizado) {
    const imc = meta !== 'Personalizado' ? getReferenciaIMCMetas(aluno, avaliacao, meta) : imcPersonalizado;
    const alturaCM = avaliacao.altura * 100;
    return (imc * ((alturaCM * alturaCM) / 10000)).toFixed(1);
}

export function getReferenciaIMCMetas(aluno, avaliacao, meta) {
    const idade = calcularIdadeDtAvaliacao(aluno.data_nascimento_aluno, avaliacao.data_avaliacao);
    var result;
    if (idade < 60) {
        if (meta == 'Saúde -1') result = 21.5;
        if (meta == 'Saúde 0') result = 21.7;
        if (meta == 'Saúde +1') result = 25.5;
        if (meta == 'Magro') result = 22;
        if (meta == 'Atlético') result = 25;
        if (meta == 'Musculoso') result = 27;
    } else {
        if (meta == 'Saúde -1') result = 24.5;
        if (meta == 'Saúde 0') result = 25;
        if (meta == 'Saúde +1') result = 25.8;
        if (meta == 'Magro') result = 23.5;
        if (meta == 'Atlético') result = 24.5;
        if (meta == 'Musculoso') result = 26.5;
    }
    return result;
}

export function getReferenciaPorcentagemGordura(aluno, avaliacao, meta, gorduraPersonalizado) {
    if (meta === 'Personalizado') return gorduraPersonalizado;
    const idade = calcularIdadeDtAvaliacao(aluno.data_nascimento_aluno, avaliacao.data_avaliacao);
    var result;
    if (aluno.sexo_aluno == 'M') {
        if (idade < 60) {
            if (meta == 'Saúde -1') result = 12.5;
            if (meta == 'Saúde 0') result = 14.5;
            if (meta == 'Saúde +1') result = 17.5;
            if (meta == 'Magro') result = 9.5;
            if (meta == 'Atlético') result = 12;
            if (meta == 'Musculoso') result = 14;
        } else {
            if (meta == 'Saúde -1') result = 17.5;
            if (meta == 'Saúde 0') result = 19.5;
            if (meta == 'Saúde +1') result = 22.5;
            if (meta == 'Magro') result = 12.5;
            if (meta == 'Atlético') result = 15.5;
            if (meta == 'Musculoso') result = 18;
        }
    } else {
        if (idade < 60) {
            if (meta == 'Saúde -1') result = 20.5;
            if (meta == 'Saúde 0') result = 22.5;
            if (meta == 'Saúde +1') result = 25.5;
            if (meta == 'Magro') result = 16;
            if (meta == 'Atlético') result = 19.5;
            if (meta == 'Musculoso') result = 22.5;
        } else {
            if (meta == 'Saúde -1') result = 25;
            if (meta == 'Saúde 0') result = 28;
            if (meta == 'Saúde +1') result = 30.5;
            if (meta == 'Magro') result = 19.5;
            if (meta == 'Atlético') result = 22.5;
            if (meta == 'Musculoso') result = 24.5;
        }
    }
    return result;
}


export function getReferenciaKGGordura(aluno, avaliacao, meta, gorduraPersonalizado) {
    const gordura = meta !== 'Personalizado' ? getReferenciaPorcentagemGordura(aluno, avaliacao, meta) : gorduraPersonalizado;
    return ((avaliacao.peso * gordura) / 100).toFixed(1);
}

export function getReferenciaIMC(aluno, avaliacao) {
    const idade = calcularIdadeDtAvaliacao(aluno.data_nascimento_aluno, avaliacao.data_avaliacao);
    const imc = getIMC(avaliacao);
    var result;
    if (idade < 60) {
        //Adulto
        if (imc >= 40) {
            result = 'Obeso 7';
        } else if (imc >= 35) {
            result = 'Obeso 6';
        } else if (imc >= 30) {
            result = 'Obeso 5';
        } else if (imc >= 28.3) {
            result = 'Sobrepeso 4';
        } else if (imc >= 26.6) {
            result = 'Sobrepeso 3';
        } else if (imc >= 25) {
            result = 'Sobrepeso 2';
        } else if (imc >= 22.8) {
            result = 'Normal 1';
        } else if (imc >= 20.6) {
            result = 'Normal 0';
        } else if (imc >= 18.5) {
            result = 'Normal -1';
        } else if (imc >= 17) {
            result = 'Baixo peso -2';
        } else if (imc >= 16) {
            result = 'Baixo peso -3';
        } else if (imc >= 7) {
            result = 'Baixo peso -4';
        }
    } else {
        //Idoso
        if (imc >= 30.1) {
            result = 'Sobrepeso 4';
        } else if (imc >= 28.6) {
            result = 'Sobrepeso 3';
        } else if (imc >= 27.1) {
            result = 'Sobrepeso 2';
        } else if (imc >= 25.1) {
            result = 'Normal 1';
        } else if (imc >= 23.5) {
            result = 'Normal 0';
        } else if (imc >= 22) {
            result = 'Normal -1';
        } else if (imc >= 20) {
            result = 'Baixo peso -2';
        } else if (imc >= 18.1) {
            result = 'Baixo peso -3';
        } else if (imc >= 7) {
            result = 'Baixo peso -4';
        }
    }
    return result;
};

export function calculaKGMCMMeta(aluno, avaliacao, meta, gorduraPersonalizado, imc) {
    const peso = getPesoIMCMeta(aluno, avaliacao, meta, imc);
    const gordura = getReferenciaKGGordura(aluno, avaliacao, meta, gorduraPersonalizado);
    return (peso - gordura).toFixed(1);
}

export function calculaPorcentagemMCMMeta(aluno, avaliacao, meta, imc) {
    const peso = getPesoIMCMeta(aluno, avaliacao, meta, imc);
    const mcm = calculaKGMCM(aluno, avaliacao);
    return ((mcm / peso) * 100).toFixed(1);
}

export function calculaKGMusculoMeta(aluno, avaliacao, meta, gorduraPersonalizado, imc) {
    if (!avaliacao) return;
    const mcm = calculaKGMCMMeta(aluno, avaliacao, meta, gorduraPersonalizado, imc);
    const osseo = calculaPorcentagemOsseo(avaliacao);
    const residual = calculaPorcentagemResidual(aluno, avaliacao);
    return (mcm - (
        (avaliacao.peso * (osseo / 100)) +
        (avaliacao.peso * (residual / 100))
    )).toFixed(1);
}

export function calculaPorcentagemMusculoMeta(aluno, avaliacao, meta, gorduraPersonalizado, imc) {
    const kgMusculo = calculaKGMusculoMeta(aluno, avaliacao, meta, gorduraPersonalizado, imc);
    return (((kgMusculo / avaliacao.peso) * 1000) / 10).toFixed(1);
}

export function calculaKGOsseoMeta(aluno, avaliacao, meta, imc) {
    const osseo = calculaPorcentagemOsseoMeta(aluno, avaliacao, meta, imc);
    const pesoMeta = getPesoIMCMeta(aluno, avaliacao, meta, imc);
    return ((osseo * pesoMeta) / 100).toFixed(1);
}

export function calculaPorcentagemOsseoMeta(aluno, avaliacao, meta, imc) {
    const osseo = calculaPorcentagemOsseo(avaliacao);
    const pesoMeta = getPesoIMCMeta(aluno, avaliacao, meta, imc);
    return ((osseo * avaliacao.peso) / pesoMeta).toFixed(1);
}

export function calculaKGResidualMeta(aluno, avaliacao, meta, gorduraPersonalizado, imc) {
    const residual = calculaPorcentagemResidual(aluno, avaliacao, meta, gorduraPersonalizado, imc);
    const pesoMeta = getPesoIMCMeta(aluno, avaliacao, meta, imc);

    return ((residual * pesoMeta) / 100).toFixed(1);
}

export function calculaPorcentagemResidualMeta(aluno, avaliacao, meta, gorduraPersonalizado, imc) {
    const gorduraMeta = getReferenciaPorcentagemGordura(aluno, avaliacao, meta, gorduraPersonalizado, imc);
    const musculoMeta = calculaPorcentagemMusculoMeta(aluno, avaliacao, meta, gorduraPersonalizado, imc);
    const osseoMeta = calculaPorcentagemOsseoMeta(aluno, avaliacao, meta, imc);

    return (Number(gorduraMeta) + Number(musculoMeta) + Number(osseoMeta)).toFixed(1);
}

// =========================================================== METAS ACIMA

export function getBasal(aluno, avaliacao) {
    return (370 + (21.6 * calculaKGMassaMagra(aluno, avaliacao))).toFixed(2);
}

export function getAreaMagraGorda(avaliacao) {
    if (!avaliacao) return;
    function round(result) {
        return Math.round(result * 10) / 10
    }

    //Braço
    const a_total_braco = Math.pow(avaliacao.braco_relaxado_direito, 2) / (4 * Math.PI);
    const p_braco = (avaliacao.braco_relaxado_direito && avaliacao.triciptal)
        ? avaliacao.braco_relaxado_direito - (Math.PI * (avaliacao.triciptal / 10)) : 0;
    const a_magra = (a_total_braco && avaliacao.triciptal)
        ? a_total_braco - (Math.pow((Math.PI * (avaliacao.triciptal / 10)), 2) / 4 * Math.PI) : 0;
    const a_gorda = (a_total_braco && a_magra)
        ? (a_total_braco - a_magra).toFixed(1) : 0;
    const per_a_magra_braco = (a_magra && a_total_braco) ? ((a_magra / a_total_braco) * 100).toFixed(0) : 0;
    const per_a_gorda_braco = (a_gorda && a_total_braco) ? ((a_gorda / a_total_braco) * 100).toFixed(0) : 0;

    //Coxa
    const a_total_coxa = Math.pow(avaliacao.coxa_direita, 2) / (4 * Math.PI);
    const p_coxa = (avaliacao.coxa_direita && avaliacao.coxa)
        ? avaliacao.coxa_direita - (Math.PI * (avaliacao.coxa / 10)) : 0;
    const a_magra_coxa = (a_total_coxa && avaliacao.coxa)
        ? a_total_coxa - (Math.pow((Math.PI * (avaliacao.coxa / 10)), 2) / 4 * Math.PI) : 0;
    const a_gorda_coxa = (a_total_coxa && a_magra_coxa)
        ? (a_total_coxa - a_magra_coxa).toFixed(1) : 0;
    const per_a_magra_coxa = (a_magra_coxa && a_total_coxa) ? ((a_magra_coxa / a_total_coxa) * 100).toFixed(0) : 0;
    const per_a_gorda_coxa = (a_gorda_coxa && a_total_coxa) ? ((a_gorda_coxa / a_total_coxa) * 100).toFixed(0) : 0;
    
    //Panturrilha
    const a_total_panturrilha = Math.pow(avaliacao.panturrilha_direita, 2) / (4 * Math.PI);
    const p_panturrilha = (avaliacao.panturrilha_direita && avaliacao.panturrilha)
        ? avaliacao.panturrilha_direita - (Math.PI * (avaliacao.panturrilha / 10)) : 0;
    const a_magra_panturrilha = (a_total_panturrilha && avaliacao.panturrilha)
        ? a_total_panturrilha - (Math.pow((Math.PI * (avaliacao.panturrilha / 10)), 2) / 4 * Math.PI): 0;
    const a_gorda_panturrilha = (a_total_panturrilha && avaliacao.panturrilha)
        ? (a_total_panturrilha - a_magra_panturrilha).toFixed(1) : 0;
    const per_a_magra_panturrilha = (a_magra_panturrilha && a_total_panturrilha) ? ((a_magra_panturrilha / a_total_panturrilha) * 100).toFixed(0) : 0;
    const per_a_gorda_panturrilha = (a_gorda_panturrilha && a_total_panturrilha) ? ((a_gorda_panturrilha / a_total_panturrilha) * 100).toFixed(0) : 0;

    const braco = [
        { nome: 'A. Total (cm²)', campo: 'a_total_braco', valor: round(a_total_braco).toFixed(2) },
        { nome: 'P. Braço (cm)', campo: 'p_braco', valor: round(p_braco).toFixed(2) },
        { nome: 'A. Magra (cm²)', campo: 'a_magra', valor: round(a_magra).toFixed(2) },
        { nome: 'A. Magra (%)', campo: 'a_magra', valor: per_a_magra_braco, prefix: '%' },
        { nome: 'A. Gorda (cm²)', campo: 'a_gorda', valor: a_gorda },
        { nome: 'A. Gorda (%)', campo: 'a_gorda', valor: per_a_gorda_braco, prefix: '%' },
    ]

    const coxa = [
        { nome: 'A. Total (cm²)', campo: 'a_total_coxa', valor: round(a_total_coxa).toFixed(2) },
        { nome: 'P. Coxa (cm)', campo: 'p_coxa', valor: round(p_coxa).toFixed(2) },
        { nome: 'A. Magra (cm²)', campo: 'a_magra_coxa', valor: round(a_magra_coxa).toFixed(2) },
        { nome: 'A. Magra (%)', campo: 'a_magra_coxa', valor: per_a_magra_coxa, prefix: '%' },
        { nome: 'A. Gorda (cm²)', campo: 'a_gorda_coxa', valor: a_gorda_coxa },
        { nome: 'A. Gorda (%)', campo: 'a_gorda', valor: per_a_gorda_coxa, prefix: '%' },
    ]

    const panturrilha = [
        { nome: 'A. Total (cm²)', campo: 'a_total_panturrilha', valor: round(a_total_panturrilha).toFixed(2) },
        { nome: 'P. Panturrilha (cm)', campo: 'p_panturrilha', valor: round(p_panturrilha).toFixed(2) },
        { nome: 'A. Magra (cm²)', campo: 'a_magra_panturrilha', valor: round(a_magra_panturrilha).toFixed(2) },
        { nome: 'A. Magra (%)', campo: 'a_magra_panturrilha', valor: per_a_magra_panturrilha, prefix: '%' },
        { nome: 'A. Gorda (cm²)', campo: 'a_gorda_panturrilha', valor: a_gorda_panturrilha },
        { nome: 'A. Gorda (%)', campo: 'a_gorda', valor: per_a_gorda_panturrilha, prefix: '%' },
    ]

    return { braco, coxa, panturrilha };
}

export function calculaKGMusculo(aluno, avaliacao) {
    const idade = calcularIdadeDtAvaliacao(aluno.data_nascimento_aluno, avaliacao.data_avaliacao);
    function round(result) {
        return (Math.round(result * 10) / 10).toFixed(2)
    }

    const p_braco = round(avaliacao.braco_relaxado_direito - (Math.PI * (avaliacao.triciptal / 10)));
    const p_coxa = round(avaliacao.coxa_direita - (Math.PI * (avaliacao.coxa / 10)));
    const p_panturrilha = round(avaliacao.panturrilha_direita - (Math.PI * (avaliacao.panturrilha / 10)));

    const result = ((avaliacao.altura * 100) / 100) * ((0.00744 * Math.pow(p_braco, 2)) + (0.00088 * Math.pow(p_coxa, 2)) + (0.00441 * Math.pow(p_panturrilha, 2)))
        + (2.4 * (aluno.sexo_aluno === "M" ? 1 : 0))
        - (0.048 * idade)
        + (aluno.etnia_aluno === "Negro" ? 1.1 : (aluno.etnia_aluno === "Caucasiano" ? 0 : (aluno.etnia_aluno === "Asiático" ? -2 : 0)))
        + 7.8
    ;

    return result.toFixed(1);
}

export function calculaPorcentagemMusculo(aluno, avaliacao) {
    const kgMusculo = calculaKGMusculo(aluno, avaliacao);
    return (((kgMusculo / avaliacao.peso) * 1000) / 10).toFixed(1);
}

export function calculaKGOsseo(avaliacao) {
    return (3.02 * (Math.pow((((avaliacao.altura * 100) / 100) ** 2) * (avaliacao.biestiloide_punho / 100) * (avaliacao.biepicondilo_femoral / 100) * 400, 0.712))).toFixed(1);
}

export function calculaPorcentagemOsseo(avaliacao) {
    const kgOsseo = calculaKGOsseo(avaliacao);
    return ((kgOsseo / avaliacao.peso) * 1000 / 10).toFixed(1);
}

export function calculaKGGordura(aluno, avaliacao) {
    const porcentagemGordura = calculaPorcentagemGordura(aluno, avaliacao);
    return ((avaliacao.peso * porcentagemGordura) / 100).toFixed(1);
}

export function calculaKGResidual(aluno, avaliacao) {
    const gordura = calculaKGGordura(aluno, avaliacao);
    const musculo = calculaKGMusculo(aluno, avaliacao);
    const osseo = calculaKGOsseo(avaliacao);

    const residual = avaliacao.peso - gordura - musculo - osseo;
    return Math.floor(residual * 10) / 10;
}

export function calculaPorcentagemResidual(aluno, avaliacao) {
    const residual = calculaKGResidual(aluno, avaliacao);
    const porcentagem = (residual / avaliacao.peso) * 100;
    return (porcentagem * 10 / 10).toFixed(1);
}

export function calculaKGMCM(aluno, avaliacao) {
    const gordura = calculaKGGordura(aluno, avaliacao);
    return (avaliacao.peso - gordura).toFixed(1);
}

export function calculaPorcentagemMCM(aluno, avaliacao) {
    const mcm = calculaKGMCM(aluno, avaliacao);
    return ((mcm / avaliacao.peso) * 100).toFixed(1);
}

export function calculaIliaco(avaliacao) {
    return (Number(avaliacao.abdomen) + Number(avaliacao.quadril)) / 2
}

export function calculaKGMassaMagra(aluno, avaliacao) {
    const Gordura = calculaKGGordura(aluno, avaliacao);
    return (avaliacao.peso - Gordura).toFixed(1);
}

export function calculaPorcentagemMassaMagra(aluno, avaliacao) {
    const MassaMagra = calculaKGMassaMagra(aluno, avaliacao);
    return ((MassaMagra / avaliacao.peso) * 100).toFixed(1);
}

// =================================== CALCULOS PROTOCOLO ===================================================

export function calculaPorcentagemGordura(aluno, avaliacao) {
    //18 a 55 anos - Jackson, Pollock e Ward - (1980)
    if (avaliacao.cod_protocolo === 2) {
        return (((495 / calculaDensidade(aluno, avaliacao)) - 450)).toFixed(1);
    }
    //50 a 75 anos - Rech, Santos e Silva - (2006)
    if (avaliacao.cod_protocolo === 3) {
        const idade = calcularIdadeDtAvaliacao(aluno.data_nascimento_aluno, avaliacao.data_avaliacao);
        const soma = 
            Number(avaliacao.supra_iliaca) +
            Number(avaliacao.peitoral) +
            Number(avaliacao.coxa)
        ;
        const primeiroTermo = 0.368352 * soma;
        const segundoTermo = (0.001153 * soma) ** 2;
        const terceiroTermo = 0.1531198 * idade;
        return (10.927073 + primeiroTermo - segundoTermo - terceiroTermo).toFixed(1);
    }
    //18 a 61 anos - Jackson e Pollock - (1978)
    if (avaliacao.cod_protocolo === 4) {
        return (((495 / calculaDensidade(aluno, avaliacao)) - 450)).toFixed(1);
    }
    //60 a 81 anos - Tran e Weltman - (1988)
    if (avaliacao.cod_protocolo === 5) {
        // calculaIliaco
        const resultado = (
            -47.371817 +
            (0.57914807 * Number(avaliacao.abdomen)) +
            (0.25189114 * Number(avaliacao.quadril)) +
            (0.21366088 * Number(calculaIliaco(avaliacao))) -
            (0.35595404 * Number(avaliacao.peso))
        );
    
        return resultado.toFixed(1);
    }
    //7 a 17 anos - Dezenberg, Weststrate, Seidell - (1991)
    const imc = getIMC(avaliacao);
    const idade = calcularIdadeDtAvaliacao(aluno.data_nascimento_aluno, avaliacao.data_avaliacao);
    const fator = aluno.sexo_aluno === "M" ? 1 : 2;
    const primeiroTermo = 1.5 * imc;
    const segundoTermo = 0.70 * idade;
    const terceiroTermo = 3.6 * fator;
    return (primeiroTermo - segundoTermo - terceiroTermo + 1.4).toFixed(1);
}

export function calculaDensidade(aluno, avaliacao) {    
    const idade = calcularIdadeDtAvaliacao(aluno?.data_nascimento_aluno, avaliacao.data_avaliacao);

    var densidade = 0;

    //18 a 55 anos - Jackson, Pollock e Ward - (1980)
    if (avaliacao.cod_protocolo === 2) {
        const somaCampos = 
            Number(avaliacao.subescapular) +
            Number(avaliacao.triciptal) +
            Number(avaliacao.peitoral) +
            Number(avaliacao.axilar_media) +
            Number(avaliacao.supra_iliaca) +
            Number(avaliacao.abdominal) +
            Number(avaliacao.coxa)
        ;
    
        densidade = 
            1.097 -
            0.00046971 * somaCampos +
            0.00000056 * (somaCampos ** 2) -
            0.00012828 * Number(idade)
        ;
    }
    //18 a 61 anos - Jackson e Pollock - (1978)
    if (avaliacao.cod_protocolo === 4) {
        const soma = 
            Number(avaliacao.abdominal) +
            Number(avaliacao.triciptal) +
            Number(avaliacao.supra_iliaca) +
            Number(avaliacao.axilar_media) +
            Number(avaliacao.subescapular) +
            Number(avaliacao.coxa) +
            Number(avaliacao.panturrilha)
        ;

        densidade =
            1.112 -
            0.00043499 * soma +
            0.00000055 * (soma ** 2) -
            0.00028826 * Number(idade)
        ;
    }

    return densidade.toFixed(3);
}