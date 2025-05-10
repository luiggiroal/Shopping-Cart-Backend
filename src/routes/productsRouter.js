const { Router } = require("express");
const ProductManager = require("../managers/ProductManager");

const productManager = new ProductManager();
const productsRouter = Router();

// Get all products in a table
productsRouter.get("/", async (req, res) => {
  try {
    const products = await productManager.readProducts();
    let html = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <title>Lista de Productos</title>
          <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f5f5f5;
                margin: 0;
                padding: 20px;
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            h1 {
                color: #00796b;
            }

            /* Add a container for horizontal scrolling */
            .table-container {
                overflow-x: auto; /* Enable horizontal scrolling */
                width: 100%; /* Make container take full width up to max-width */
                max-width: 800px; /* Match your desired table max-width */
                margin-top: 20px; /* Keep the top margin */
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Move shadow to container */
                background-color: white; /* Move background to container if table is transparent */
            }


            table {
                border-collapse: collapse;
                /* Remove width and max-width from table, they are now managed by the container */
                /* width: 80%; */
                /* max-width: 800px; */

                /* Important: Use fixed layout for better column width control */
                table-layout: fixed;
                width: 100%; /* Table takes 100% of the container's width */
                min-width: 700px; /* Optional: Set a minimum width for the table content to ensure scrolling appears if needed */

            }

            th,
            td {
                padding: 12px 20px;
                border: 1px solid #ddd;
                text-align: center;
                vertical-align: top; /* Align cell content to the top */
                /* Allow text to wrap within cells */
                word-wrap: break-word; /* Older property, still useful */
                overflow-wrap: break-word; /* Standard property */
                /* white-space: normal; */ /* This is the default, explicitly set if needed */
            }

            th {
                background-color: #00796b;
                color: white;
            }

            tr:nth-child(even) {
                background-color: #f2f2f2;
            }

            /* --- Set specific widths for columns --- */
            /* Adjust these values based on how much space each column needs */

            /* ID */
            th:nth-child(1),
            td:nth-child(1) {
                width: 50px;
                min-width: 50px; /* Ensure a minimum width */
            }

            /* Título */
            th:nth-child(2),
            td:nth-child(2) {
                width: 15%; /* Use percentage or pixel */
                min-width: 100px;
            }

            /* Descripción */
            th:nth-child(3),
            td:nth-child(3) {
                width: 30%;
                min-width: 200px;
            }

            /* Código */
            th:nth-child(4),
            td:nth-child(4) {
                width: 80px;
                min-width: 80px;
            }

            /* Precio */
            th:nth-child(5),
            td:nth-child(5) {
                width: 80px;
                min-width: 80px;
            }

            /* Status */
            th:nth-child(6),
            td:nth-child(6) {
                width: 60px;
                min-width: 60px;
            }

            /* Stock */
            th:nth-child(7),
            td:nth-child(7) {
                width: 60px;
                min-width: 60px;
            }

            /* Categoría */
            th:nth-child(8),
            td:nth-child(8) {
                width: 10%;
                min-width: 80px;
            }

            /* Thumbnails */
            th:nth-child(9),
            td:nth-child(9) {
                width: 20%;
                min-width: 150px;
                /* You might need more width here depending on actual content */
            }
          </style>
        </head>
        <body>
          <h1>Lista de Productos</h1>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Descripción</th>
                <th>Código</th>
                <th>Precio</th>
                <th>Status</th>
                <th>Stock</th>
                <th>Categoría</th>
                <th>Thumbnails</th>
              </tr>
            </thead>
            <tbody>
              ${products
                .map(
                  (product) => `
                <tr>
                  <td>${product.id}</td>
                  <td>${product.title}</td>
                  <td>${product.description}</td>
                  <td>${product.code}</td>
                  <td>${product.price}</td>
                  <td>${product.status}</td>
                  <td>${product.stock}</td>
                  <td>${product.category}</td>
                  <td>${product.thumbnails}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        </body>
        </html>
      `;

    res.status(200).send(html);
  } catch (err) {
    console.error("Error while getting products", err);
    res.status(500).send("Internal server error");
  }
});

// Get product by ID (params)
productsRouter.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const products = await productManager.readProducts();
    const product = products.find(
      (product) => parseInt(product.id) === parseInt(pid),
    );
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).send(`Product with id ${pid} Not Found`);
    }
  } catch (err) {
    console.error(`Error while getting product with id ${pid}`, err);
    res.status(500).send("Internal Server Error");
  }
});

// Add a new product
productsRouter.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    } = req.body;

    if (
      !title ||
      !description ||
      !code ||
      !price ||
      !status ||
      !stock ||
      !category ||
      !thumbnails
    ) {
      return res
        .status(400)
        .send(`Falta de datos: Todos los campos del producto son requeridos.`);
    }

    const products = await productManager.readProducts();

    const newProduct = {
      id: products.length + 1,
      title,
      description,
      code,
      price: parseInt(price),
      status,
      stock: parseInt(stock),
      category,
      thumbnails,
    };

    products.push(newProduct);
    await productManager.writeProducts(products);

    res.status(201).json(newProduct);
  } catch (err) {
    console.error(`Error while processing product.`, err);
    res.status(500).send("Internal Server Error");
  }
});

// Update product by ID (params) and fields (body)
productsRouter.put("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    } = req.body;
    const products = await productManager.readProducts();
    const product = products.find(
      (product) => parseInt(product.id) === parseInt(pid),
    );
    if (product) {
      product.title = title || product.title;
      product.description = description || product.description;
      product.code = code || product.code;
      product.price = parseInt(price) || product.price;
      product.status = status || product.status;
      product.stock = parseInt(stock) || product.stock;
      product.category = category || product.category;
      product.thumbnails = thumbnails || product.thumbnails;
      await productManager.writeProducts(products);

      res.status(200).json(product);
    } else {
      res.status(404).send(`Product with id ${pid} not found`);
    }
  } catch (err) {
    console.error(`Error while getting product with id ${id}`, err);
    res.status(500).send("Internal Server Error");
  }
});

// Eliminate product by ID (params)
productsRouter.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    let products = await productManager.readProducts(); // Since 'products' may be reassigned it is declared as variable.
    const product = products.find(
      (product) => parseInt(product.id) === parseInt(pid),
    );
    if (product) {
      products = products.filter(
        (product) => parseInt(product.id) !== parseInt(pid),
      );
      await productManager.writeProducts(products);

      res.status(200).send(`Product with id ${pid} deleted`);
    } else {
      res.status(404).send(`Product with id ${pid} not found`);
    }
  } catch (err) {
    console.error(`Error while getting product with id ${pid}`, err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = productsRouter;
