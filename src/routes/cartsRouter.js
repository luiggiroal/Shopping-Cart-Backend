const { Router } = require("express");
const CartManager = require("../managers/CartManager");
const ProductManager = require("../managers/ProductManager");

const cartManager = new CartManager();
const productManager = new ProductManager();
const cartsRouter = Router();

// Get all carts in a table
// cartsRouter.get("/", async (req, res) => {
//   try {
//     const carts = await cartManager.readCarts();
//     let html = `
//         <!DOCTYPE html>
//         <html lang="es">
//         <head>
//           <meta charset="UTF-8">
//           <title>Lista de Productos</title>
//           <style>
//             body {
//                 font-family: Arial, sans-serif;
//                 background-color: #f5f5f5;
//                 margin: 0;
//                 padding: 20px;
//                 display: flex;
//                 flex-direction: column;
//                 align-items: center;
//             }
//
//             h1 {
//                 color: #00796b;
//             }
//
//             /* Add a container for horizontal scrolling */
//             .table-container {
//                 overflow-x: auto; /* Enable horizontal scrolling */
//                 width: 100%; /* Make container take full width up to max-width */
//                 max-width: 800px; /* Match your desired table max-width */
//                 margin-top: 20px; /* Keep the top margin */
//                 box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Move shadow to container */
//                 background-color: white; /* Move background to container if table is transparent */
//             }
//
//
//             table {
//                 border-collapse: collapse;
//                 /* Remove width and max-width from table, they are now managed by the container */
//                 /* width: 80%; */
//                 /* max-width: 800px; */
//
//                 /* Important: Use fixed layout for better column width control */
//                 table-layout: fixed;
//                 width: 100%; /* Table takes 100% of the container's width */
//                 min-width: 700px; /* Optional: Set a minimum width for the table content to ensure scrolling appears if needed */
//
//             }
//
//             th,
//             td {
//                 padding: 12px 20px;
//                 border: 1px solid #ddd;
//                 text-align: center;
//                 vertical-align: top; /* Align cell content to the top */
//                 /* Allow text to wrap within cells */
//                 word-wrap: break-word; /* Older property, still useful */
//                 overflow-wrap: break-word; /* Standard property */
//                 /* white-space: normal; */ /* This is the default, explicitly set if needed */
//             }
//
//             th {
//                 background-color: #00796b;
//                 color: white;
//             }
//
//             tr:nth-child(even) {
//                 background-color: #f2f2f2;
//             }
//
//             /* --- Set specific widths for columns --- */
//             /* Adjust these values based on how much space each column needs */
//
//             /* ID */
//             th:nth-child(1),
//             td:nth-child(1) {
//                 width: 50px;
//                 min-width: 50px; /* Ensure a minimum width */
//             }
//
//             /* Título */
//             th:nth-child(2),
//             td:nth-child(2) {
//                 width: 15%; /* Use percentage or pixel */
//                 min-width: 100px;
//             }
//
//             /* Descripción */
//             th:nth-child(3),
//             td:nth-child(3) {
//                 width: 30%;
//                 min-width: 200px;
//             }
//
//             /* Código */
//             th:nth-child(4),
//             td:nth-child(4) {
//                 width: 80px;
//                 min-width: 80px;
//             }
//
//             /* Precio */
//             th:nth-child(5),
//             td:nth-child(5) {
//                 width: 80px;
//                 min-width: 80px;
//             }
//
//             /* Status */
//             th:nth-child(6),
//             td:nth-child(6) {
//                 width: 60px;
//                 min-width: 60px;
//             }
//
//             /* Stock */
//             th:nth-child(7),
//             td:nth-child(7) {
//                 width: 60px;
//                 min-width: 60px;
//             }
//
//             /* Categoría */
//             th:nth-child(8),
//             td:nth-child(8) {
//                 width: 10%;
//                 min-width: 80px;
//             }
//
//             /* Thumbnails */
//             th:nth-child(9),
//             td:nth-child(9) {
//                 width: 20%;
//                 min-width: 150px;
//                 /* You might need more width here depending on actual content */
//             }
//           </style>
//         </head>
//         <body>
//           <h1>Lista de Productos</h1>
//           <table>
//             <thead>
//               <tr>
//                 <th>ID</th>
//                 <th>Título</th>
//                 <th>Descripción</th>
//                 <th>Código</th>
//                 <th>Precio</th>
//                 <th>Status</th>
//                 <th>Stock</th>
//                 <th>Categoría</th>
//                 <th>Thumbnails</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${carts
//                 .map(
//                   (product) => `
//                 <tr>
//                   <td>${product.id}</td>
//                   <td>${product.title}</td>
//                   <td>${product.description}</td>
//                   <td>${product.code}</td>
//                   <td>${product.price}</td>
//                   <td>${product.status}</td>
//                   <td>${product.stock}</td>
//                   <td>${product.category}</td>
//                   <td>${product.thumbnails}</td>
//                 </tr>
//               `,
//                 )
//                 .join("")}
//             </tbody>
//           </table>
//         </body>
//         </html>
//       `;
//
//     res.status(200).send(html);
//   } catch (err) {
//     console.error("Error while getting carts", err);
//     res.status(500).send("Internal server error");
//   }
// });

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

//
// // Update product by ID (params) and fields (body)
// cartsRouter.put("/:pid", async (req, res) => {
//   try {
//     const { pid } = req.params;
//     const {
//       title,
//       description,
//       code,
//       price,
//       status,
//       stock,
//       category,
//       thumbnails,
//     } = req.body;
//     const carts = await cartManager.readCarts();
//     const product = carts.find(
//       (product) => parseInt(product.id) === parseInt(pid),
//     );
//     if (product) {
//       product.title = title || product.title;
//       product.description = description || product.description;
//       product.code = code || product.code;
//       product.price = parseInt(price) || product.price;
//       product.status = status || product.status;
//       product.stock = parseInt(stock) || product.stock;
//       product.category = category || product.category;
//       product.thumbnails = thumbnails || product.thumbnails;
//       await cartManager.writeCarts(carts);
//
//       res.status(200).json(product);
//     } else {
//       res.status(404).send(`Product with id ${pid} not found`);
//     }
//   } catch (err) {
//     console.error(`Error while getting product with id ${id}`, err);
//     res.status(500).send("Internal Server Error");
//   }
// });
//
// // Eliminate product by ID (params)
// cartsRouter.delete("/:pid", async (req, res) => {
//   try {
//     const { pid } = req.params;
//     let carts = await cartManager.readCarts(); // Since 'carts' may be reassigned it is declared as variable.
//     const product = carts.find(
//       (product) => parseInt(product.id) === parseInt(pid),
//     );
//     if (product) {
//       carts = carts.filter((product) => parseInt(product.id) !== parseInt(pid));
//       await cartManager.writeCarts(carts);
//
//       res.status(200).send(`Product with id ${pid} deleted`);
//     } else {
//       res.status(404).send(`Product with id ${pid} not found`);
//     }
//   } catch (err) {
//     console.error(`Error while getting product with id ${pid}`, err);
//     res.status(500).send("Internal Server Error");
//   }
// });

module.exports = cartsRouter;
