model = require('mongoose').model('produtos');

module.exports = (app) => {
    app.all('*', (req, res, next) => {
        console.log(`Receiving ${req.method} request on route ${req.originalUrl}`);
        next();
    });

    // Recuperação de todos os produtos
    app.get('/', (req, res, next) => {
        model.find().then(response => {
            if (response.length === 0)
                res.status(500).send({ message: "Não existem produtos cadastrados" });
            else
                res.status(200).send({ data: response });
        }).catch(err => {
            res.status(500).send({ message: err });
        })
    })

    // Recuperação de produto por sku
    app.get('/:sku', (req, res, next) => {
        model.findOne({ sku: req.params.sku }).lean().then(response => {
            if (!response)
                res.status(200).send("SKU não encontrado");
            else {
                response.inventory.quantity = response.inventory.warehouses.reduce((a, i) => a + i.quantity, 0)
                response.isMarketable = (response.inventory.quantity > 0) ? true : false

                res.status(200).send({ data: response });
            }
        }).catch(err => {
            res.status(500).send({ message: err });
        })
    })

    // Criação de produto onde o payload será o json informado acima (exceto as propriedades isMarketable e inventory.quantity)
    app.post('/', (req, res, next) => {
        model.find({ sku: req.body.sku }).then(response => {
            if (response.length !== 0) {
                res.status(500).send({ message: "SKU já cadastrado" });
            } else
                model.create(req.body).then(response => {
                    res.status(201).send({ message: "Produto Cadastrado", data: response });
                })
        }).catch(err => {
            res.status(500).send({ message: err });
        })
    });

    // Edição de produto por sku
    app.put('/:sku', (req, res, next) => {
        model.findOne({ sku: req.body.sku }).then(response => {
            if (response != null)
                model.updateOne({ sku: req.params.sku }, req.body).then(response => {
                    res.status(200).send({ message: "Produto Atualizado", data: response });
                })
            else
                res.status(500).send({ message: "Produto não existe" });
        }).catch(err => {
            res.status(500).send({ message: err });
        })
    });

    // Deleção de produto por sku
    app.delete('/:sku', (req, res, next) => {
        model.findOne({ sku: req.body.sku }).then(response => {
            if (response.length !== 0)
                model.deleteOne({ sku: req.params.sku }).then(response => {
                    res.status(200).send({ message: "Produto deletado" });
                })
            else
                res.status(200).send({ message: "Produto não encontrado" });
        }).catch(err => {
            res.status(500).send({ message: err });
        })
    });

    app.all('*', () => {
        res.status(404).send({ message: "Rota inválida" });
    });
}