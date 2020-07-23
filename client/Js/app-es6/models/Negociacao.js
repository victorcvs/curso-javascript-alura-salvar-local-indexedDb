export class Negociacao {
    constructor(data, quantidade, valor) {
        this._data = new Date(data.getTime());  // programação defensiva  
        this._quantidade = quantidade;          // _ --> convenção de que a propriedade é privada
        this._valor = valor;

        Object.freeze(this);
    }

    get volume() {
        return this._quantidade * this._valor
    }

    get data() {
        return new Date(this._data.getTime());    // programação defensiva
    }

    get quantidade() {
        return this._quantidade;
    }

    get valor() {
        return this._valor;
    }

    isEqual(outraNegociacao) {
        return JSON.stringify(this) == JSON.stringify(outraNegociacao); //transforma em JSON pra comparar objetos
    }
}