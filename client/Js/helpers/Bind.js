class Bind {

    constructor(model, view, ...props) {   // rest operator -> transforma os ultimos parâmetros em array
        let proxy = ProxyFactory.create(
            model, 
            props, 
            model => view.update(model));

        view.update(model);

        return proxy;
    }
}