const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/products.json');

const readProductsFile = () => {
    const data = fs.readFileSync(productsFilePath);
    return JSON.parse(data);
};

// Ruta para la vista de productos
router.get('/products', (req, res) => {
    const products = readProductsFile();
    res.render('index', { products });
});

// Ruta para la vista de productos en tiempo real
router.get('/realtimeproducts', (req, res) => {
    const products = readProductsFile();
    res.render('realTimeProducts', { products });
});

// Ruta raíz
router.get('/', (req, res) => {
    res.redirect('/products');
});

module.exports = router;
