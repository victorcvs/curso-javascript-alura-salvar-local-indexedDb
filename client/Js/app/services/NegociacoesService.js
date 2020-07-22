'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NegociacoesService = function () {
    function NegociacoesService() {
        _classCallCheck(this, NegociacoesService);

        this._http = new HttpService();
    }

    _createClass(NegociacoesService, [{
        key: 'cadastra',
        value: function cadastra(negociacao) {
            return ConnectionFactory //return pra devolver a promisse
            .getConnection() //cria e retorna connection
            .then(function (connection) {
                return new NegociacaoDao(connection);
            }) // cria e retorna dao
            .then(function (dao) {
                return dao.adiciona(negociacao);
            }) // executa 'adciona'
            .then(function () {
                return 'Negociação incluída com sucesso.';
            }) // devolve mensagem de sucesso
            .catch(function (erro) {
                console.log(erro);
                throw new Error('Erro na inclusão da negociação');
            });
        }
    }, {
        key: 'lista',
        value: function lista() {
            return ConnectionFactory.getConnection().then(function (connection) {
                return new NegociacaoDao(connection);
            }).then(function (dao) {
                return dao.listaTodos();
            }) //lista e já retorna
            .catch(function (erro) {
                console.log(erro);
                throw new Error('Erro na listagem das negociações');
            });
        }
    }, {
        key: 'apaga',
        value: function apaga() {
            return ConnectionFactory.getConnection().then(function (connection) {
                return new NegociacaoDao(connection);
            }).then(function (dao) {
                return dao.apagaTodos();
            })
            //  .then(() => 'Negociação apagadas com sucesso.')     // repassa mensagem vinda do dao
            .catch(function (erro) {
                console.log(erro);
                throw new Error('Erro na exclusão das negociações');
            });
        }
    }, {
        key: 'importa',
        value: function importa(listaAtual) {
            return this.obterNegociacoes()
            // É preciso filtrar as negociações que já estão na lista. Inclui somente se não existir
            .then(function (negociacoes) {
                return negociacoes.filter(function (negociacao) {
                    return (// filtra a lista conforme uma condição
                        !listaAtual.some(function (negociacaoExistente) {
                            return (// 'some' verifica se contém algum (se existir aqui o ! garante o retun false)
                                negociacao.isEqual(negociacaoExistente)
                            );
                        })
                    );
                });
            }) // retorna a lista de negociacoes importadas
            .catch(function (erro) {
                console.log(erro);
                throw new Error('Erro na importação das negociações');
            });
        }
    }, {
        key: 'obterNegociacoesDaSemana',
        value: function obterNegociacoesDaSemana() {

            return this._http.get('negociacoes/semana').then(function (negociacoes) {
                console.log(negociacoes);
                return negociacoes.map(function (objeto) {
                    return new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor);
                });
            }).catch(function (erro) {
                console.log(erro);
                throw new Error('Não foi possível obter as negociações da semana');
            });
        }
    }, {
        key: 'obterNegociacoesDaSemanaAnterior',
        value: function obterNegociacoesDaSemanaAnterior() {

            return this._http.get('negociacoes/anterior').then(function (negociacoes) {
                console.log(negociacoes);
                return negociacoes.map(function (objeto) {
                    return new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor);
                });
            }).catch(function (erro) {
                console.log(erro);
                throw new Error('Não foi possível obter as negociações da semana anterior');
            });
        }
    }, {
        key: 'obterNegociacoesDaSemanaRetrasada',
        value: function obterNegociacoesDaSemanaRetrasada() {

            return this._http.get('negociacoes/retrasada').then(function (negociacoes) {
                console.log(negociacoes);
                return negociacoes.map(function (objeto) {
                    return new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor);
                });
            }).catch(function (erro) {
                console.log(erro);
                throw new Error('Não foi possível obter as negociações da semana retrasada');
            });
        }
    }, {
        key: 'obterNegociacoes',
        value: function obterNegociacoes() {

            return Promise.all([this.obterNegociacoesDaSemana(), this.obterNegociacoesDaSemanaAnterior(), this.obterNegociacoesDaSemanaRetrasada()]).then(function (periodos) {

                var negociacoes = periodos.reduce(function (dados, periodo) {
                    return dados.concat(periodo);
                }, []).map(function (dado) {
                    return new Negociacao(new Date(dado.data), dado.quantidade, dado.valor);
                });

                return negociacoes;
            }).catch(function (erro) {
                throw new Error(erro);
            });
        }
    }]);

    return NegociacoesService;
}();
//# sourceMappingURL=NegociacoesService.js.map