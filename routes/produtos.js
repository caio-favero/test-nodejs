model = require('mongoose').model('produtos');

module.exports = (app) => {
    app.all('*', (req, res, next) => {
        console.log(`Receiving ${req.method} request on route ${req.originalUrl}`);
        next();
    });

    // Recuperação de produto por sku
    app.get('/', (req, res, next) => {
        model.find().then(response => {
            if (response.length === 0)
                res.status(200).send({ message: "Não existem produtos cadastrados", data: response });
            else
                res.status(200).send({ data: response });
        })
    })

    app.get('/:sku', (req, res, next) => {
        model.find({ sku: req.params.sku }).then(response => {
            if (response.length === 0)
                res.status(200).send("SKU não encontrado");
            else
                res.status(200).send({ data: response });
        })
    })

    // Criação de produto onde o payload será o json informado acima (exceto as propriedades isMarketable e inventory.quantity)
    app.post('/', (req, res, next) => {
        model.find({ sku: req.body.sku }).then(response => {
            if (response.length !== 0)
                res.status(200).send("SKU já cadastrado");
            else
                model.create(req.body).then(response => {
                    res.status(201).send({ message: "Produto Cadastrado", data: response });
                }).catch(() => {
                    res.status(400).send("Ocorreu um erro");
                })
        })
    });

    // Edição de produto por sku
    app.put('/:sku', (req, res, next) => {
        model.find({ sku: req.body.sku }).then(response => {
            if (response.length !== 0)
                model.updateOne({ sku: req.params.sku }, req.body).then(response => {
                    res.status(200).send({ message: "Produto Atualizado", data: response });
                })
            else
                model.create(req.body).then(response => {
                    res.status(201).send({ message: "Produto cadastrado", data: response });
                }).catch(() => {
                    res.status(400).send("Ocorreu um erro");
                })
        })
    });

    // Deleção de produto por sku
    app.delete('/:sku', (req, res, next) => {
        model.find({ sku: req.body.sku }).then(response => {
            if (response.length === 0)
                model.deleteOne({ sku: req.params.sku }).then(response => {
                    res.status(200).send("Produto deletado", response);
                })
            else
                res.status(200).send("Produto não encontrado", response);
        })
    });

    app.all('*', (req, res, next) => {
        if (req.method == 'OPTIONS') next();
        else res.status(404).send('Rota inválida');
    });
}