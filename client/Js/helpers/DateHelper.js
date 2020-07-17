class DateHelper {

    // não deve definir o constructor se não tem propriedades
    constructor() {
        throw new Error('DateHelper não pode ser instanciado.');
    }

    static textoParaData(texto){    // método estático

        if (!/^\d{4}-\d{2}-\d{2}$/.test(texto)) {  // Regex validação de máscara numérica
                                                 // O ˆ indica "começando com " e o $ "terminando com". 
            throw new Error('Data deve estar no formato AAAA-MM-DD');
        }

        return new Date(
            ...texto           // spread operator -> permite passar array como parâmetro casando os indices
            .split('-')        // separa a data em array usando o '-' como separador
            .map((item , indice) => item - indice % 2)); // formata o array com função que subtrai 1 dos elementos ìmpares (mod 2)
    }

     static dataParaTexto(data) {
        return `${data.getDate()}/${data.getMonth() + 1}/${data.getFullYear()}`;
    }
}