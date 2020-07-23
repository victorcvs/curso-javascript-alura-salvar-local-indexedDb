'use strict';

System.register(['./controllers/NegociacaoController.js', './polyfill/fetch.js'], function (_export, _context) {
  "use strict";

  var currentInstance, negociacaoController;
  return {
    setters: [function (_controllersNegociacaoControllerJs) {
      currentInstance = _controllersNegociacaoControllerJs.currentInstance;
    }, function (_polyfillFetchJs) {}],
    execute: function () {
      negociacaoController = currentInstance();


      document.querySelector('.form').onsubmit = negociacaoController.adiciona.bind(negociacaoController);
      document.querySelector('#botaoImportar').onclick = negociacaoController.importaNegociacoes.bind(negociacaoController);
      document.querySelector('#botaoApagar').onclick = negociacaoController.apaga.bind(negociacaoController);
    }
  };
});
//# sourceMappingURL=boot.js.map