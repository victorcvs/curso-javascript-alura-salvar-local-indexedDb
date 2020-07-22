'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ConnectionFactory = function () {
    //Module pattern - Transforma a classe em função anônima que retorna a classe instanciada
    var stores = ['negociacoes'];
    var version = 3;
    var dbName = 'aluraframe';
    var connection = null;
    var close = null;

    return function () {
        // return aqui serve pra devolver a classe instanciada
        function ConnectionFactory() {
            _classCallCheck(this, ConnectionFactory);

            throw new Error('Não é permitido instanciar ConnectionFactory');
        }

        _createClass(ConnectionFactory, null, [{
            key: 'getConnection',
            value: function getConnection() {
                return new Promise(function (resolve, reject) {
                    var openRequest = window.indexedDB.open(dbName, version);

                    openRequest.onupgradeneeded = function (e) {
                        ConnectionFactory._createSores(e.target.result);
                    };

                    openRequest.onsuccess = function (e) {
                        if (!connection) {
                            connection = e.target.result;
                            close = connection.close.bind(connection);
                            connection.close = function () {
                                throw new Error("Não é permitido fechar a conexão");
                            };
                        }

                        resolve(connection);
                    };

                    openRequest.onerror = function (e) {
                        console.log(e.target.result.error);
                        reject(e.target.error.name);
                    };
                });
            }
        }, {
            key: '_createSores',
            value: function _createSores(connection) {
                stores.forEach(function (store) {
                    if (connection.objectStoreNames.contains(store)) {
                        connection.deleteObjectSore(store);
                    }

                    connection.createObjectStore(store, { autoIncrement: true });
                });
            }
        }, {
            key: 'closeConnection',
            value: function closeConnection() {
                if (connection) {
                    close();
                    // Reflect.apply(close, connection, []); --> outra forma de acionar sem precisar do bind
                    connection = null;
                }
            }
        }]);

        return ConnectionFactory;
    }();
}();
//# sourceMappingURL=ConnectionFactory.js.map