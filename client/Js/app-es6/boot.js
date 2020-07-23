import {currentInstance} from './controllers/NegociacaoController.js';
import {} from './polyfill/fetch.js';

let negociacaoController = currentInstance();

document.querySelector('.form').onsubmit = negociacaoController.adiciona.bind(negociacaoController);
document.querySelector('#botaoImportar').onclick = negociacaoController.importaNegociacoes.bind(negociacaoController);
document.querySelector('#botaoApagar').onclick = negociacaoController.apaga.bind(negociacaoController);