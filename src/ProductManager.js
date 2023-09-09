const fs = require('fs');

class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];
        this.nextProductId = 1;
        this.loadProducts();
    }

    loadProducts() {
        try {
            const data = fs.readFileSync(this.path, 'utf-8');
            this.products = JSON.parse(data);
            if (this.products.length > 0) {
                const lastProduct = this.products[this.products.length - 1];
                this.nextProductId = lastProduct.id + 1;
            }
        } catch (error) {
            this.products = [];
        }
    }

    saveProducts() {
        fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log("Todos los campos son obligatorios.");
            return;
        }

        if (this.products.some(product => product.code === code)) {
            console.log("Ya existe un producto con este código.");
            return;
        }

        const product = {
            id: this.nextProductId++,
            title,
            description, 
            price,
            thumbnail,
            code,
            stock
        };

        this.products.push(product);
        this.saveProducts();
        console.log("Producto agregado:", product);
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(product => product.id === id);
        if (product) {
            return product;
        } else {
            console.log("Producto no encontrado.");
        }
    }

    updateProduct(id, updatedFields) {
        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex !== -1) {
            this.products[productIndex] = { ...this.products[productIndex], ...updatedFields };
            this.saveProducts();
            console.log("Producto actualizado:", this.products[productIndex]);
        } else {
            console.log("Producto no encontrado.");
        }
    }

    deleteProduct(id) {
        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex !== -1) {
            const deletedProduct = this.products.splice(productIndex, 1)[0];
            this.saveProducts();
            console.log("Producto eliminado:", deletedProduct);
        } else {
            console.log("Producto no encontrado.");
        }
    }
}

async function test() {
    const manager = new ProductManager('src/products.json');

    manager.addProduct("Ryzen 5 5600X", "CPU AMD Ryzen 5 5600X", 310.99, "imagen1.jpg", "R53600X", 100);
    manager.addProduct("Ryzen 7 7700X", "CPU AMD Ryzen 7 7700X", 515.99, "imagen2.jpg", "R7770X", 50);

    const products = manager.getProducts();
    console.log("Lista de productos:", products);

    const product1 = manager.getProductById(1);
    console.log("Producto 1:", product1);

    manager.updateProduct(1, { price: 55, stock: 8 });

    manager.deleteProduct(2);

    console.log("Lista de productos actualizada:", manager.getProducts());
}

test();
