const { Router } = require("express");
const CartManager = require("../managers/CartManager");
const ProductManager = require("../managers/ProductManager");

const cartManager = new CartManager();
const productManager = new ProductManager();
const cartsRouter = Router();

// Get all products that belong to certain cart by ID (params)
cartsRouter.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const carts = await cartManager.readCarts();
    const cart = carts.find((cart) => parseInt(cart.id) === parseInt(cid));
    if (cart) {
      res.status(200).json(cart.products);
    } else {
      res.status(404).send(`Cart with id ${cid} Not Found`);
    }
  } catch (err) {
    console.error(`Error while getting cart with id ${cid}`, err);
    res.status(500).send("Internal Server Error");
  }
});

// Add a new cart
cartsRouter.post("/", async (req, res) => {
  try {
    const carts = await cartManager.readCarts();

    const newCart = {
      id: carts.length + 1,
      products: [],
    };

    carts.push(newCart);
    await cartManager.writeCarts(carts);

    res.status(201).json(newCart);
  } catch (err) {
    console.error(`Error while processing cart.`, err);
    res.status(500).send("Internal Server Error");
  }
});

cartsRouter.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { pid } = req.params;

    const carts = await cartManager.readCarts();
    const cart = carts.find((cart) => parseInt(cart.id) === parseInt(cid));

    if (!cart) {
      return res.status(404).send(`Cart with id ${cid} Not Found`);
    }

    const products = await productManager.readProducts();
    const product = products.find(
      (product) => parseInt(product.id) === parseInt(pid),
    );

    if (!product) {
      return res.status(404).send(`Product with id ${pid} Not Found`);
    }

    const productCart = cart.products.find(
      (prod) => parseInt(prod.product) === parseInt(pid),
    );

    if (!productCart) {
      const newProductCart = {
        product: parseInt(pid),
        quantity: 1,
      };

      cart.products.push(newProductCart);
      await cartManager.writeCarts(carts);
      return res.status(201).json(cart);
    }

    productCart.quantity++;
    await cartManager.writeCarts(carts);
    return res.status(201).json(cart);
  } catch (err) {
    console.error(`Error while processing cart.`, err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = cartsRouter;
