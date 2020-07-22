"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ProxyFactory = function () {
    function ProxyFactory() {
        _classCallCheck(this, ProxyFactory);
    }

    _createClass(ProxyFactory, null, [{
        key: "create",
        value: function create(objeto, props, acao) {

            return new Proxy(objeto, {
                get: function get(target, prop, receiver) {
                    // Se no object target existe a prop do array e ela for do tipo "function"
                    if (props.includes(prop) && ProxyFactory._ehFuncao(target[prop])) {
                        console.log("Interceptando m\xE9todo " + prop);
                        return function () {
                            //não pode ser arrow Function, precisa do contexto dinâmico
                            // Executa os códigos extras se a função foi interceptada

                            //Executa a função prop que foi interceptada 
                            var retorno = Reflect.apply(target[prop], target, arguments); // executa a função original com os parâmetros (arguments)
                            acao(target); // executa a função com o target(model) como parâmetro
                            return retorno;
                        };
                    }

                    return Reflect.get(target, prop, receiver); // executa o que não atendeu ao IF 
                },
                set: function set(target, prop, value, receiver) {
                    console.log("Interceptando set do " + prop);
                    var retorno = Reflect.set(target, prop, value, receiver);

                    if (props.includes(prop)) {
                        acao(target);
                    }
                    return retorno;
                }
            });
        }
    }, {
        key: "_ehFuncao",
        value: function _ehFuncao(f) {
            return (typeof f === "undefined" ? "undefined" : _typeof(f)) == (typeof Function === "undefined" ? "undefined" : _typeof(Function));
        }
    }]);

    return ProxyFactory;
}();
//# sourceMappingURL=ProxyFactory.js.map