class ProxyFactory {
    static create (objeto, props, acao) {

        return new Proxy(objeto, {
            get(target, prop, receiver) {
                // Se no object target existe a prop do array e ela for do tipo "function"
                if (props.includes(prop) && ProxyFactory._ehFuncao(target[prop])) { 
                   console.log(`Interceptando método ${prop}`);
                   return function (){    //não pode ser arrow Function, precisa do contexto dinâmico
                       // Executa os códigos extras se a função foi interceptada
                       
                       //Executa a função prop que foi interceptada 
                       let retorno = Reflect.apply(target[prop], target, arguments); // executa a função original com os parâmetros (arguments)
                       acao(target);  // executa a função com o target(model) como parâmetro
                       return retorno;
                    }
                } 
                 
                return Reflect.get(target, prop, receiver); // executa o que não atendeu ao IF 
            },

            set(target, prop, value, receiver) {
                console.log(`Interceptando set do ${prop}`);
                let retorno = Reflect.set(target, prop, value, receiver);

                if (props.includes(prop)) {
                    acao(target); 
                }
                return retorno;
            }
        });

    }
    static _ehFuncao(f) {
        return typeof(f)  == typeof(Function);
    }
}