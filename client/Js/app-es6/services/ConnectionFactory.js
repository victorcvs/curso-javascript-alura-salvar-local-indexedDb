const stores = ['negociacoes'];
const version = 3;
const dbName = 'aluraframe';
let connection = null;
let close = null;
    
export class ConnectionFactory {  
    constructor() {
        throw new Error('Não é permitido instanciar ConnectionFactory');
    }

    static getConnection() {
        return new Promise((resolve, reject) => {
            let openRequest = window.indexedDB.open(dbName, version);

            openRequest.onupgradeneeded = e => {
                ConnectionFactory._createSores(e.target.result);
                
            };
            
            openRequest.onsuccess = e => {
                if(!connection) {
                    connection = e.target.result;
                    close = connection.close.bind(connection);
                    connection.close = function () {   
                        throw new Error("Não é permitido fechar a conexão");
                    }
                }

                resolve(connection);
                
            };
            
            openRequest.onerror = e => {
                console.log(e.target.result.error);
                reject(e.target.error.name);
                
            };
            
        });
    }
    
    static _createSores(connection) {
        stores.forEach(store => {
            if (connection.objectStoreNames.contains(store)) {
                connection.deleteObjectSore(store);
            }
    
            connection.createObjectStore(store, {autoIncrement:true});
        })

    }

    static closeConnection() {
        if (connection) {
            close();
            // Reflect.apply(close, connection, []); --> outra forma de acionar sem precisar do bind
            connection = null;
        }
    }
}

