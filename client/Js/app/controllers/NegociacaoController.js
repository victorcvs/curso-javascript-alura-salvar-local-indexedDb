class NegociacaoController {
    constructor() {
        let $ = document.querySelector.bind(document);
        this._inputQuantidade = $('#quantidade');
        this._inputValor = $('#valor');
        this._inputData = $('#data');
        
        // Cria um proxy (bind) entre o model e a view através de uma classe auxiliadora 
        this._listaNegociacoes = new Bind( new ListaNegociacoes(),                        // model
                                           new NegociacoesView($('#negociacaoView')),     // view
                                           'adiciona','esvazia', 'ordena','inverteOrdem'); // props

        this._mensagem = new Bind(new Mensagem(),
                                  new MensagemView( $('#mensagemView')), 
                                 'texto');
        
        this._ordemAtual = ''       
        
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
        ConnectionFactory
            .getConnection()
            .then(connection => new NegociacaoDao(connection))   // Retorna NegociacaoDAO (arrow function sempre tem retorno)
            .then(dao => dao.listaTodos())  // retorna array de negociacoes
            .then(negociacoes => 
                negociacoes.forEach(negociacao => this._listaNegociacoes.adiciona(negociacao))) 
            .catch( erro => {
                console.log(erro);
                this._mensagem.texto = erro;
            })    
    }
    
    adiciona(event) {

        event.preventDefault();

        ConnectionFactory       // Salva as negociações no IndexedDb
            .getConnection()
            .then( connection => {
                let negociacao = this._criaNegociacao();

                new NegociacaoDao(connection)
                    .adiciona(negociacao)
                    .then( () => {
                        this._listaNegociacoes.adiciona(negociacao);
                        this._mensagem.texto = 'Negociação incluída com sucesso.'; 
                        this._limpaFormulario();
                    })
            })
            .catch( erro => this._mensagem.texto = erro)

        // try {
        //     this._listaNegociacoes.adiciona(this._criaNegociacao());
        //     this._mensagem.texto = 'Negociação incluída com sucesso.'; 
        //     this._limpaFormulario();   
        // } catch(erro) {
        //     this._mensagem.texto = erro;
        // }
    }
    
    apaga() {
        ConnectionFactory
            .getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.apagaTodos())
            .then(mensagem => {
                this._listaNegociacoes.esvazia();
                this._mensagem.texto = mensagem;
                })
            .catch(erro => this._mensagem.texto = erro)    
    }

    importaNegociacoes() {

        let service = new NegociacoesService();
        service
            .obterNegociacoes()
            .then(negociacoes => negociacoes.forEach(negociacao => {
                this._listaNegociacoes.adiciona(negociacao);
                this._mensagem.texto = 'Negociações importadas com sucesso'   
            }))
            .catch(erro => this._mensagem.texto = erro);                              
    }
       

    _criaNegociacao () {
        return new Negociacao (
            DateHelper.textoParaData(this._inputData.value),   
           parseInt(this._inputQuantidade.value), 
           parseFloat(this._inputValor.value));
    }

    _limpaFormulario () {
        this._inputData.value = '';
        this._inputQuantidade.value = 1;
        this._inputValor.value = 0.0;

        this._inputData.focus();
    }

    ordena(coluna) {
        
        if(this._ordemAtual == coluna) {
            this._listaNegociacoes.inverteOrdem(); 
        } else {
            this._listaNegociacoes.ordena((p, s) => p[coluna] - s[coluna]);    
        }
        this._ordemAtual = coluna;    
    }
}