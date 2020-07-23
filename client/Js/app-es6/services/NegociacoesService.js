import {HttpService} from "./HttpService.js";
import {NegociacaoDao} from "../dao/NegociacaoDao.js";
import {Negociacao} from "../models/Negociacao.js";
import {ConnectionFactory} from "./ConnectionFactory.js"

export class NegociacoesService {
    constructor() {
        this._http = new HttpService();
    }

    cadastra(negociacao) {
        return ConnectionFactory                                    //return pra devolver a promisse
                .getConnection()                                    //cria e retorna connection
                .then(connection => new NegociacaoDao(connection))  // cria e retorna dao
                .then(dao => dao.adiciona(negociacao))              // executa 'adciona'
                .then(() => 'Negociação incluída com sucesso.')     // devolve mensagem de sucesso
                .catch(erro => {
                    console.log(erro)
                    throw new Error('Erro na inclusão da negociação')});
    }

    lista() {
        return ConnectionFactory
                .getConnection()
                .then(connection => new NegociacaoDao(connection))
                .then(dao => dao.listaTodos())   //lista e já retorna
                .catch(erro => {
                    console.log(erro)
                    throw new Error('Erro na listagem das negociações')});
    }

    apaga() {
        return  ConnectionFactory
                .getConnection()
                .then(connection => new NegociacaoDao(connection))
                .then(dao => dao.apagaTodos())
            //  .then(() => 'Negociação apagadas com sucesso.')     // repassa mensagem vinda do dao
                .catch(erro => {
                         console.log(erro)
                        throw new Error('Erro na exclusão das negociações')});
    }

    importa(listaAtual) {
        return this.obterNegociacoes()
        // É preciso filtrar as negociações que já estão na lista. Inclui somente se não existir
            .then(negociacoes => 
                    negociacoes.filter(negociacao =>            // filtra a lista conforme uma condição
                        !listaAtual.some(negociacaoExistente => // 'some' verifica se contém algum (se existir aqui o ! garante o retun false)
                            negociacao.isEqual(negociacaoExistente)))
            )   // retorna a lista de negociacoes importadas
            .catch(erro =>{
                console.log(erro);
                throw new Error('Erro na importação das negociações');
            } )
    }

    obterNegociacoesDaSemana() {
               
        return this._http
            .get('negociacoes/semana')
            .then(negociacoes => {
                console.log(negociacoes);
                return negociacoes.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor));
            })
            .catch(erro => {
                console.log(erro);
                throw new Error('Não foi possível obter as negociações da semana');
            });  
    }
    
    obterNegociacoesDaSemanaAnterior() {
               
        return this._http
            .get('negociacoes/anterior')
            .then(negociacoes => {
                console.log(negociacoes);
                return negociacoes.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor));
            })
            .catch(erro => {
                console.log(erro);
                throw new Error('Não foi possível obter as negociações da semana anterior');
            });   
    }
    
    obterNegociacoesDaSemanaRetrasada() {
               
        return this._http
            .get('negociacoes/retrasada')
            .then(negociacoes => {
                console.log(negociacoes);
                return negociacoes.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor));
            })
            .catch(erro => {
                console.log(erro);
                throw new Error('Não foi possível obter as negociações da semana retrasada');
            });  
        
    }
    
    obterNegociacoes() {
        
        return Promise.all([
            this.obterNegociacoesDaSemana(),
            this.obterNegociacoesDaSemanaAnterior(),
            this.obterNegociacoesDaSemanaRetrasada()
        ]).then(periodos => {

            let negociacoes = periodos
                .reduce((dados, periodo) => dados.concat(periodo), [])
                .map(dado => new Negociacao(new Date(dado.data), dado.quantidade, dado.valor ));

            return negociacoes;
        }).catch(erro => {
            throw new Error(erro);
        });
	}     
}