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
    var result = true;
    const campos = protocolosCampos[cod_protocolo];
    for (const campo of campos) {
        if (!result) continue;
        if (!avaliacao[campo]) result = false;       
    }

    return result;
}





























// =========================================================================

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
    // return Math.ceil((kgMusculo / avaliacao.peso) * 1000) / 10;
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
        return ((10.927073 + primeiroTermo) - segundoTermo + terceiroTermo).toFixed(1);
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
    const idade = calcularIdadeDtAvaliacao(aluno.data_nascimento_aluno, avaliacao.data_avaliacao);

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