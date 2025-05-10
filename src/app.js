const express = require("express");
const logger = require("morgan");
const productsRouter = require("./routes/productsRouter");
const cartsRouter = require("./routes/cartsRouter");

const app = express();
const PORT = 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger("dev"));
app.use("/api/products", productsRouter); // Mounting routers for products
app.use("/api/carts", cartsRouter); // Mounting routers for carts

// Getting initial page
app.get("/", (req, res) => {
  const html = `
  <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Mi Tienda</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #e0f7fa;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
          }
          h1 {
            font-size: 48px;
            color: #00796b;
            margin-bottom: 40px;
          }
          a {
            text-decoration: none;
          }
          button {
            padding: 15px 30px;
            font-size: 18px;
            color: white;
            background-color: #00796b;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s;
          }
          button:hover {
            background-color: #004d40;
          }
        </style>
      </head>
      <body>
        <h1>MI TIENDA</h1>
        <a href="/api/products">
          <button>Ver lista de productos</button>
        </a>
      </body>
      </html> 
  `;
  res.status(200).send(html);
});

// Route 'Not Found'
app.use((req, res) => {
  return res.status(404).send(
    `<div style='text-align: center; font-family: Arial;'>
            <h1>404 Not Found</h1>
            <p>The requested route doesn't exist</p>
     </div>`,
  );
});

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});
