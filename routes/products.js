const express = require('express');
const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/products.json');

const readProductsFile = () => {
    const data = fs.readFileSync(productsFilePath);
    return JSON.parse(data);
};

const writeProductsFile = (data) => {
    fs.writeFileSync(productsFilePath, JSON.stringify(data, null, 2));
};

module.exports = (io) => {
    const router = express.Router();

    router.get('/', (req, res) => {
        const products = readProductsFile();
        const limit = req.query.limit ? parseInt(req.query.limit) : products.length;
        res.json(products.slice(0, limit));
    });

    router.get('/:pid', (req, res) => {
        const products = readProductsFile();
        const product = products.find(p => p.id === req.params.pid);
        if (product) {
            res.json(product);
        } else {
            res.status(404).send('Product not found');
        }
    });

    router.post('/', (req, res) => {
        const products = readProductsFile();
        const newProduct = {
            id: (products.length + 1).toString(),
            ...req.body,
            status: true
        };
        products.push(newProduct);
        writeProductsFile(products);
        io.emit('updateProducts', products);
        res.status(201).json(newProduct);
    });

    router.put('/:pid', (req, res) => {
        const products = readProductsFile();
        const index = products.findIndex(p => p.id === req.params.pid);
        if (index !== -1) {
            const updatedProduct = {
                ...products[index],
                ...req.body,
                id: products[index].id // No actualizar el id
            };
            products[index] = updatedProduct;
            writeProductsFile(products);
            io.emit('updateProducts', products);
            res.json(updatedProduct);
        } else {
            res.status(404).send('Product not found');
        }
    });

    router.delete('/:pid', (req, res) => {
        let products = readProductsFile();
        const index = products.findIndex(p => p.id === req.params.pid);
        if (index !== -1) {
            products = products.filter(p => p.id !== req.params.pid);
            writeProductsFile(products);
            io.emit('updateProducts', products);
            res.send('Product deleted');
        } else {
            res.status(404).send('Product not found');
        }
    });

    return router;
};
