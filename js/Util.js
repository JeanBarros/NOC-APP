function toDecimal(numero, casasDecimais) {
    if (numero == null)
        return numero;

    if (numero.toString().indexOf(",") > 0) {
        numero = numero.toString().replace(/\./g, '');
        numero = numero.toString().replace(/\,/g, '.');
    }

    var num = parseFloat(numero);
    if (casasDecimais == null)
        return num.toFixed(2);

    return num.toFixed(casasDecimais);
}

function AlertUi(title, message, funcao) {
    if (!(/<\/?[a-z]{1,3} ?\/?>/.test(message))) // Probably not HTML (edit this line as you wish)
        //message = message.replace(/\n/g, '<br/>'); // Replace \n with <br/>
        message = message.replace(/\\r?\\n/g, '<br/>'); // Replace \n with <br/>
    title = title == '' ? 'Success!' : title;
    $("<div title='" + title + "'>" + message + "</div>").dialog({
        modal: true,
        buttons: {
            "OK": function () {
                $(this).dialog("close");
            }
        },
        close: function () {
            if (funcao)
                funcao();

        }
    }); // Show the popup
}

function FecharJanelaComMensagem(titulo, mensagem) {
    //alert(mensagem);
    //window.opener = 'X';
    //window.open('', '_parent', '');
    //window.close();
    AlertUi(titulo, mensagem, FecharJanela);
}

function FecharJanela() {
    window.opener = 'X';
    window.open('', '_parent', '');
    window.close();
}

function isDataMaiorQue(dataComparacao, dataRef) {
    if (!/Invalid|NaN/.test(new Date(dataComparacao))) {
        return new Date(dataComparacao) > new Date(dataRef);
    }
}

function isDataMaiorIgualQue(dataComparacao, dataRef) {
    if (!/Invalid|NaN/.test(new Date(dataComparacao))) {
        return new Date(dataComparacao) >= new Date(dataRef);
    }
}

function isDataMenorQue(dataComparacao, dataRef) {
    if (!/Invalid|NaN/.test(new Date(dataComparacao))) {
        return new Date(dataComparacao) < new Date(dataRef);
    }
}

function isDataMenorIgualQue(dataComparacao, dataRef) {
    if (!/Invalid|NaN/.test(new Date(dataComparacao))) {
        return new Date(dataComparacao) <= new Date(dataRef);
    }
}

function verifica_cpf_cnpj(valor) {

    valor = valor.toString();
    valor = valor.replace(/[^0-9]/g, '');

    if (valor.length === 11) {
        return 'CPF';
    }
    else if (valor.length === 14) {
        return 'CNPJ';
    }
    else {
        return false;
    }
}

function calc_digitos_posicoes(digitos, posicoes, soma_digitos) {

    posicoes = posicoes == undefined ? 10 : posicoes;
    soma_digitos = soma_digitos == undefined ? 0 : soma_digitos;

    digitos = digitos.toString();

    for (var i = 0; i < digitos.length; i++) {
        // Preenche a soma com o d�gito vezes a posi��o
        soma_digitos = soma_digitos + (digitos[i] * posicoes);

        // Subtrai 1 da posi��o
        posicoes--;

        // Parte espec�fica para CNPJ
        // Ex.: 5-4-3-2-9-8-7-6-5-4-3-2
        if (posicoes < 2) {
            // Retorno a posi��o para 9
            posicoes = 9;
        }
    }

    // Captura o resto da divis�o entre soma_digitos dividido por 11
    // Ex.: 196 % 11 = 9
    soma_digitos = soma_digitos % 11;

    // Verifica se soma_digitos � menor que 2
    if (soma_digitos < 2) {
        // soma_digitos agora ser� zero
        soma_digitos = 0;
    } else {
        // Se for maior que 2, o resultado � 11 menos soma_digitos
        // Ex.: 11 - 9 = 2
        // Nosso d�gito procurado � 2
        soma_digitos = 11 - soma_digitos;
    }

    // Concatena mais um d�gito aos primeiro nove d�gitos
    // Ex.: 025462884 + 2 = 0254628842
    var cpf = digitos + soma_digitos;

    // Retorna
    return cpf;

} // calc_digitos_posicoes


function valida_cpf(valor) {

    // Garante que o valor � uma string
    valor = valor.toString();

    // Remove caracteres inv�lidos do valor
    valor = valor.replace(/[^0-9]/g, '');

    if (valor == "00000000000" || valor == "11111111111" || valor == "22222222222" || valor == "33333333333" ||
        valor == "44444444444" || valor == "55555555555" || valor == "66666666666" || valor == "77777777777" ||
        valor == "88888888888" || valor == "99999999999")
        return false;

    // Captura os 9 primeiros d�gitos do CPF
    // Ex.: 02546288423 = 025462884
    var digitos = valor.substr(0, 9);

    // Faz o c�lculo dos 9 primeiros d�gitos do CPF para obter o primeiro d�gito
    var novo_cpf = calc_digitos_posicoes(digitos);

    // Faz o c�lculo dos 10 d�gitos do CPF para obter o �ltimo d�gito
    var novo_cpf = calc_digitos_posicoes(novo_cpf, 11);

    // Verifica se o novo CPF gerado � id�ntico ao CPF enviado
    if (novo_cpf === valor) {
        // CPF v�lido
        return true;
    } else {
        // CPF inv�lido
        return false;
    }

} // valida_cpf

function valida_cnpj(valor) {

    // Garante que o valor � uma string
    valor = valor.toString();

    // Remove caracteres inv�lidos do valor
    valor = valor.replace(/[^0-9]/g, '');

    if (valor == "00000000000000" || valor == "11111111111111" || valor == "22222222222222" || valor == "33333333333333" ||
        valor == "44444444444444" || valor == "55555555555555" || valor == "66666666666666" || valor == "77777777777777" ||
        valor == "88888888888888" || valor == "99999999999999")
        return false;

    // O valor original
    var cnpj_original = valor;

    // Captura os primeiros 12 n�meros do CNPJ
    var primeiros_numeros_cnpj = valor.substr(0, 12);

    // Faz o primeiro c�lculo
    var primeiro_calculo = calc_digitos_posicoes(primeiros_numeros_cnpj, 5);

    // O segundo c�lculo � a mesma coisa do primeiro, por�m, come�a na posi��o 6
    var segundo_calculo = calc_digitos_posicoes(primeiro_calculo, 6);

    // Concatena o segundo d�gito ao CNPJ
    var cnpj = segundo_calculo;

    // Verifica se o CNPJ gerado � id�ntico ao enviado
    if (cnpj === cnpj_original) {
        return true;
    }

    // Retorna falso por padr�o
    return false;

} // valida_cnpj

function valida_cpf_cnpj(valor) {

    // Verifica se � CPF ou CNPJ
    var valida = verifica_cpf_cnpj(valor);

    // Garante que o valor � uma string
    valor = valor.toString();

    // Remove caracteres inv�lidos do valor
    valor = valor.replace(/[^0-9]/g, '');

    // Valida CPF
    if (valida === 'CPF') {
        // Retorna true para cpf v�lido
        return valida_cpf(valor);
    }

        // Valida CNPJ
    else if (valida === 'CNPJ') {
        // Retorna true para CNPJ v�lido
        return valida_cnpj(valor);
    }

        // N�o retorna nada
    else {
        return false;
    }

} // valida_cpf_cnpj

function formata_cpf_cnpj(valor) {

    // O valor formatado
    var formatado = false;

    // Verifica se � CPF ou CNPJ
    var valida = verifica_cpf_cnpj(valor);

    // Garante que o valor � uma string
    valor = valor.toString();

    // Remove caracteres inv�lidos do valor
    valor = valor.replace(/[^0-9]/g, '');


    // Valida CPF
    if (valida === 'CPF') {

        // Verifica se o CPF � v�lido
        if (valida_cpf(valor)) {

            // Formata o CPF ###.###.###-##
            formatado = valor.substr(0, 3) + '.';
            formatado += valor.substr(3, 3) + '.';
            formatado += valor.substr(6, 3) + '-';
            formatado += valor.substr(9, 2) + '';

        }

    }

        // Valida CNPJ
    else if (valida === 'CNPJ') {

        // Verifica se o CNPJ � v�lido
        if (valida_cnpj(valor)) {

            // Formata o CNPJ ##.###.###/####-##
            formatado = valor.substr(0, 2) + '.';
            formatado += valor.substr(2, 3) + '.';
            formatado += valor.substr(5, 3) + '/';
            formatado += valor.substr(8, 4) + '-';
            formatado += valor.substr(12, 14) + '';

        }

    }

    // Retorna o valor 
    return formatado;

} // formata_cpf_cnpj