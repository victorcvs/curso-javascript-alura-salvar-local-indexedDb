'use strict';

System.register(['../models/ListaNegociacoes.js', '../models/Mensagem.js', '../views/NegociacoesView.js', '../views/MensagemView.js', '../services/NegociacoesService.js', '../helpers/DateHelper.js', '../helpers/Bind.js', '../models/Negociacao.js'], function (_export, _context) {
    "use strict";

    var ListaNegociacoes, Mensagem, NegociacoesView, MensagemView, NegociacoesService, DateHelper, Bind, Negociacao, _createClass, NegociacaoController, negociacaoController;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [function (_modelsListaNegociacoesJs) {
            ListaNegociacoes = _modelsListaNegociacoesJs.ListaNegociacoes;
        }, function (_modelsMensagemJs) {
            Mensagem = _modelsMensagemJs.Mensagem;
        }, function (_viewsNegociacoesViewJs) {
            NegociacoesView = _viewsNegociacoesViewJs.NegociacoesView;
        }, function (_viewsMensagemViewJs) {
            MensagemView = _viewsMensagemViewJs.MensagemView;
        }, function (_servicesNegociacoesServiceJs) {
            NegociacoesService = _servicesNegociacoesServiceJs.NegociacoesService;
        }, function (_helpersDateHelperJs) {
            DateHelper = _helpersDateHelperJs.DateHelper;
        }, function (_helpersBindJs) {
            Bind = _helpersBindJs.Bind;
        }, function (_modelsNegociacaoJs) {
            Negociacao = _modelsNegociacaoJs.Negociacao;
        }],
        execute: function () {
            _createClass = function () {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;
                        if ("value" in descriptor) descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }

                return function (Constructor, protoProps, staticProps) {
                    if (protoProps) defineProperties(Constructor.prototype, protoProps);
                    if (staticProps) defineProperties(Constructor, staticProps);
                    return Constructor;
                };
            }();

            NegociacaoController = function () {
                function NegociacaoController() {
                    _classCallCheck(this, NegociacaoController);

                    var $ = document.querySelector.bind(document);
                    this._inputQuantidade = $('#quantidade');
                    this._inputValor = $('#valor');
                    this._inputData = $('#data');

                    // Cria um proxy (bind) entre o model e a view através de uma classe auxiliadora 
                    this._listaNegociacoes = new Bind(new ListaNegociacoes(), // model
                    new NegociacoesView($('#negociacaoView')), // view
                    'adiciona', 'esvazia', 'ordena', 'inverteOrdem'); // props

                    this._mensagem = new Bind(new Mensagem(), new MensagemView($('#mensagemView')), 'texto');

                    this._service = new NegociacoesService();
                    this._ordemAtual = '';

                    this._init();
                }

                _createClass(NegociacaoController, [{
                    key: '_init',
                    value: function _init() {
                        var _this = this;

                        //Recupera a lista das negociações salvas no IndexedDb
                        // *** forma completa
                        // ConnectionFactory
                        //     .getConnection()
                        //     .then(connection => {
                        //         new NegociacaoDao(connection)
                        //         .listaTodos()
                        //         .then(negociacoes => {
                        //                 negociacoes.forEach(negociacao => {
                        //                     this._listaNegociacoes.adiciona(negociacao)
                        //                 });
                        //             });
                        //     });

                        // *** forma reduzida
                        // ConnectionFactory
                        //     .getConnection()
                        //     .then(connection => new NegociacaoDao(connection))   // Retorna NegociacaoDAO (arrow function sempre tem retorno)
                        //     .then(dao => dao.listaTodos())  // retorna array de negociacoes
                        //     .then(negociacoes => 
                        //         negociacoes.forEach(negociacao => this._listaNegociacoes.adiciona(negociacao))) 
                        //     .catch( erro => {
                        //         console.log(erro);
                        //         this._mensagem.texto = erro;
                        //     });   

                        // *** usando o service
                        this._service.lista().then(function (negociacoes) {
                            return negociacoes.forEach(function (negociacao) {
                                return _this._listaNegociacoes.adiciona(negociacao);
                            });
                        }).catch(function (erro) {
                            return _this._mensagem.texto = erro;
                        });

                        this.importaNegociacoes();
                        // Importa automaticamente as negociações a cada x tempo
                        // setInterval(() => {this.importaNegociacoes()} , 3000); // executa a cada x segundos
                    }
                }, {
                    key: 'adiciona',
                    value: function adiciona(event) {
                        var _this2 = this;

                        event.preventDefault();
                        var negociacao = this._criaNegociacao();

                        this._service.cadastra(negociacao).then(function (mensagem) {
                            _this2._listaNegociacoes.adiciona(negociacao);
                            _this2._mensagem.texto = mensagem;
                            _this2._limpaFormulario();
                        }).catch(function (erro) {
                            return _this2._mensagem.texto = erro;
                        });
                    }
                }, {
                    key: 'apaga',
                    value: function apaga() {
                        var _this3 = this;

                        this._service.apaga().then(function (mensagem) {
                            _this3._listaNegociacoes.esvazia();
                            _this3._mensagem.texto = mensagem;
                        }).catch(function (erro) {
                            return _this3._mensagem.texto = erro;
                        });
                    }
                }, {
                    key: 'importaNegociacoes',
                    value: function importaNegociacoes() {
                        var _this4 = this;

                        this._service.importa(this._listaNegociacoes.negociacoes).then(function (negociacoes) {
                            return negociacoes.forEach(function (negociacao) {
                                _this4._listaNegociacoes.adiciona(negociacao);
                                _this4._mensagem.texto = 'Negociações importadas com sucesso';
                            });
                        }).catch(function (erro) {
                            return _this4._mensagem.texto = erro;
                        });
                    }
                }, {
                    key: '_criaNegociacao',
                    value: function _criaNegociacao() {
                        return new Negociacao(DateHelper.textoParaData(this._inputData.value), parseInt(this._inputQuantidade.value), parseFloat(this._inputValor.value));
                    }
                }, {
                    key: '_limpaFormulario',
                    value: function _limpaFormulario() {
                        this._inputData.value = '';
                        this._inputQuantidade.value = 1;
                        this._inputValor.value = 0.0;

                        this._inputData.focus();
                    }
                }, {
                    key: 'ordena',
                    value: function ordena(coluna) {

                        if (this._ordemAtual == coluna) {
                            this._listaNegociacoes.inverteOrdem();
                        } else {
                            this._listaNegociacoes.ordena(function (p, s) {
                                return p[coluna] - s[coluna];
                            });
                        }
                        this._ordemAtual = coluna;
                    }
                }]);

                return NegociacaoController;
            }();

            negociacaoController = new NegociacaoController();
            function currentInstance() {

                return negociacaoController;
            }

            _export('currentInstance', currentInstance);
        }
    };
});
//# sourceMappingURL=NegociacaoController.js.map