import {ListaNegociacoes} from '../models/ListaNegociacoes.js';
import {Mensagem} from '../models/Mensagem.js';
import {NegociacoesView} from '../views/NegociacoesView.js';
import {MensagemView} from '../views/MensagemView.js';
import {NegociacoesService} from '../services/NegociacoesService.js';
import {DateHelper} from '../helpers/DateHelper.js';
import {Bind} from '../helpers/Bind.js';
import {Negociacao} from '../models/Negociacao.js';

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
        
        this._service = new NegociacoesService();
        this._ordemAtual = '';
        
        this._init();
        
    }
    
    _init() {
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
        this._service
            .lista()
            .then(negociacoes => 
                negociacoes.forEach(negociacao => this._listaNegociacoes.adiciona(negociacao))) 
            .catch(erro => this._mensagem.texto = erro);      
            
        this.importaNegociacoes()    
        // Importa automaticamente as negociações a cada x tempo
        // setInterval(() => {this.importaNegociacoes()} , 3000); // executa a cada x segundos
        
    }
    adiciona(event) {

        event.preventDefault();
        let negociacao = this._criaNegociacao();
        
        this._service
            .cadastra(negociacao)
            .then(mensagem => {
                    this._listaNegociacoes.adiciona(negociacao);
                    this._mensagem.texto = mensagem; 
                    this._limpaFormulario()})
            .catch(erro => this._mensagem.texto = erro);        
    }
    
    apaga() {
        this._service
        .apaga()
        .then(mensagem => {
            this._listaNegociacoes.esvazia();
            this._mensagem.texto = mensagem;
            })
        .catch(erro => this._mensagem.texto = erro);  
    }

    importaNegociacoes() {
        this._service
            .importa(this._listaNegociacoes.negociacoes)
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

let negociacaoController = new NegociacaoController();

export function currentInstance() {

    return negociacaoController;

}