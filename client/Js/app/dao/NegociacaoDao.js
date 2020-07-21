class NegociacaoDao {
    constructor(connection) {
        this._connection = connection;
        this._store = 'negociacoes';
    }

    adiciona(negociacao) {
        return new Promise((resolve,reject) => {

            let request = this._connection
                         .transaction([this._store],'readwrite')
                         .objectStore(this._store)
                         .add(negociacao);
            
            request.onsuccess = e => {
                console.log('Negociacao incluída com sucesso');
                resolve();
            }

            request.onerror = e => {
                console.log(e.target.error);
                reject('Erro na inclusão da negociação')
            }

        });
    }

    listaTodos() {
        return new Promise ((resolve,reject) => {

            let cursor = this._connection
                        .transaction([this._store],'readwrite')
                        .objectStore(this._store)
                        .openCursor();


            let negociacoes = [];
            cursor.onsuccess = e => {
                let atual = e.target.result;   // ponteiro

                if (atual) {
                    let dado = atual.value;   
                    negociacoes.push(new Negociacao(dado._data, dado._quantidade, dado._valor));
                    atual.continue();  // lê o proximo 
                } else {
                    console.log('Negociacões listadas com sucesso');
                    resolve(negociacoes);
                }

            };

            cursor.onerror = e => {
                console.log(e.target.error);
                reject('Erro na listagem das negociações')
            };
        })
    }  
    
    apagaTodos() {
        return new Promise((resolve,reject) => {
            let request = this._connection
                        .transaction([this._store],'readwrite')
                        .objectStore(this._store)
                        .clear();

            request.onsuccess = e => resolve('Negociações apagadas com sucesso');

            request.onerror = e => {
                console.log(e.target.error);
                reject('Erro na exclusão das negociações');
            }
        })
    }
}